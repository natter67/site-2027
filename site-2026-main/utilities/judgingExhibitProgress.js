import { firestore, doc, getDoc, getDocs, collection } from "utilities/firebase";
import { query, where } from "firebase/firestore";
import { AWARDS, awardLabelById } from "@utilities/awards";
import {
  normalizeGroupId,
  normalizeEmail,
  checkinIdentityKeyFromGroup,
  coerceAssignmentStopOrder,
  scheduleTimeSortKey,
  visitedStopOrderSetFromCheckin,
} from "@utilities/judging";
import { JUDGING_STOPS_COLLECTION } from "@utilities/judgingStops";
import { fetchStrapiExhibitById } from "@utilities/strapiExhibits";

const AWARD_BADGE_HEX = [
  "#1e88e5",
  "#43a047",
  "#8e24aa",
  "#fb8c00",
  "#7e57c2",
  "#00acc1",
  "#5c6bc0",
  "#d4a017",
  "#2e7d32",
  "#c62828",
];

/** Session check-in for a judging group (judgeCheckins/{g_<groupId>}). */
export async function readJudgeSessionCheckin(judgingGroupId) {
  const key = checkinIdentityKeyFromGroup(judgingGroupId);
  if (!key) return null;
  const ref = doc(firestore, "judgeCheckins", key);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function fetchRouteForAssignment(awardId, assignment) {
  const gid = normalizeGroupId(assignment?.judgingGroupId);
  const email = normalizeEmail(assignment?.judgeEmail);
  const coll = collection(firestore, JUDGING_STOPS_COLLECTION);

  if (gid) {
    const q = query(coll, where("judgingGroupId", "==", gid));
    const snap = await getDocs(q);
    const rows = snap.docs
      .map((d) => ({ ...d.data(), exhibitId: String(d.data()?.exhibitId ?? "").trim() }))
      .filter((r) => String(r.awardId) === String(awardId));
    rows.sort((a, b) => {
      const ao = coerceAssignmentStopOrder(a) ?? 9999;
      const bo = coerceAssignmentStopOrder(b) ?? 9999;
      return ao - bo;
    });
    return rows;
  }
  if (email) {
    const q = query(coll, where("judgeEmail", "==", email));
    const snap = await getDocs(q);
    const rows = snap.docs
      .map((d) => ({ ...d.data(), exhibitId: String(d.data()?.exhibitId ?? "").trim() }))
      .filter((r) => String(r.awardId) === String(awardId));
    rows.sort((a, b) => {
      const ao = coerceAssignmentStopOrder(a) ?? 9999;
      const bo = coerceAssignmentStopOrder(b) ?? 9999;
      return ao - bo;
    });
    return rows;
  }
  return [];
}

/** All judging stops that include this exhibit (Strapi exhibit id / booth #). One Firestore query. */
export async function loadAssignmentsForExhibit(exhibitId) {
  const id = String(exhibitId ?? "").trim();
  if (!id) return { assignmentsForExhibit: [] };

  const coll = collection(firestore, JUDGING_STOPS_COLLECTION);
  const q = query(coll, where("exhibitId", "==", id));
  const snap = await getDocs(q);

  /** @type {{ awardId: string, assignment: Record<string, unknown> & { id: string } }[]} */
  const assignmentsForExhibit = [];
  for (const d of snap.docs) {
    const data = d.data() || {};
    const aid = String(data.awardId ?? "").trim();
    if (!aid) continue;
    assignmentsForExhibit.push({
      awardId: aid,
      assignment: { id: d.id, ...data },
    });
  }

  return { assignmentsForExhibit };
}

/**
 * Timeline for ExhibitorBusSchedule: one row per **(judging group × visit × this exhibit)**.
 * Built only from assignments for this exhibit — no N× full-route reloads.
 */
export async function buildExhibitorBusRows({ exhibitId, assignmentsForExhibit }) {
  const id = String(exhibitId ?? "").trim();
  if (!id || !assignmentsForExhibit?.length) return [];

  /** @type {Map<string, { exhibitId: string, stopOrder: number, judgingGroupId: string, scheduledTime: string, awards: Set<string> }>} */
  const slotByKey = new Map();

  for (const { awardId, assignment } of assignmentsForExhibit) {
    if (!assignment) continue;
    const ord = coerceAssignmentStopOrder(assignment) ?? 0;
    if (ord < 1) continue;
    const eid = String(assignment.exhibitId ?? "").trim();
    if (!eid) continue;
    const gid = normalizeGroupId(assignment.judgingGroupId);
    if (!gid) continue;
    const st =
      typeof assignment.scheduledTime === "string" && assignment.scheduledTime.trim()
        ? assignment.scheduledTime.trim()
        : "";
    const slotKey = `${gid}\0${ord}\0${eid}`;
    if (!slotByKey.has(slotKey)) {
      slotByKey.set(slotKey, {
        exhibitId: eid,
        stopOrder: ord,
        judgingGroupId: gid,
        scheduledTime: st || "—",
        awards: new Set(),
      });
    }
    const slot = slotByKey.get(slotKey);
    slot.awards.add(awardId);
    if (st && slot.scheduledTime === "—") slot.scheduledTime = st;
  }

  const viewerSlots = [...slotByKey.values()]
    .filter((s) => String(s.exhibitId || "").trim() === id)
    .sort((a, b) => {
      const ka = scheduleTimeSortKey(a.scheduledTime);
      const kb = scheduleTimeSortKey(b.scheduledTime);
      const aT = ka != null;
      const bT = kb != null;
      if (aT !== bT) return aT ? -1 : 1;
      if (aT && bT && ka !== kb) return ka - kb;
      if (a.judgingGroupId !== b.judgingGroupId) return a.judgingGroupId.localeCompare(b.judgingGroupId);
      return a.stopOrder - b.stopOrder;
    });

  if (!viewerSlots.length) return [];

  const metaCache = new Map();
  async function exhibitMeta(eid) {
    if (metaCache.has(eid)) return metaCache.get(eid);
    const row = await fetchStrapiExhibitById(eid);
    const m = {
      title: row?.exhibitName || row?.name || eid,
      subtitle: row?.location ? String(row.location) : "",
    };
    metaCache.set(eid, m);
    return m;
  }

  const checkinByGid = new Map();
  async function visitedSetForGroup(g) {
    if (checkinByGid.has(g)) return checkinByGid.get(g);
    const checkin = await readJudgeSessionCheckin(g);
    const set = visitedStopOrderSetFromCheckin(checkin);
    checkinByGid.set(g, set);
    return set;
  }

  const slotOrdsByGid = new Map();
  for (const s of viewerSlots) {
    const g = s.judgingGroupId;
    if (!slotOrdsByGid.has(g)) slotOrdsByGid.set(g, []);
    slotOrdsByGid.get(g).push(s.stopOrder);
  }

  const timeline = [];
  for (const slot of viewerSlots) {
    const ord = slot.stopOrder;
    const eid = slot.exhibitId;
    const slotGid = slot.judgingGroupId;
    const meta = await exhibitMeta(eid);
    const timeStr = slot.scheduledTime || "—";

    const awardsForThisVisit = [...slot.awards].sort(
      (a, b) => AWARDS.findIndex((x) => x.id === a) - AWARDS.findIndex((x) => x.id === b)
    );

    const visited = await visitedSetForGroup(slotGid);
    const ordsThisExhibit = slotOrdsByGid.get(slotGid) || [];
    const unvisitedHere = ordsThisExhibit.filter((o) => !visited.has(o));

    let status = "future";
    if (visited.has(ord)) {
      status = "past";
    } else if (unvisitedHere.length && ord === Math.min(...unvisitedHere)) {
      status = "next";
    } else {
      status = "future";
    }

    const routeBadges = awardsForThisVisit.map((aid) => {
      const awardIdx = AWARDS.findIndex((x) => x.id === aid);
      return {
        label: awardLabelById(aid),
        color: AWARD_BADGE_HEX[awardIdx >= 0 ? awardIdx % AWARD_BADGE_HEX.length : 0],
      };
    });

    timeline.push({
      stopOrder: ord,
      judgingGroupId: slotGid,
      title: meta.title,
      subtitle: meta.subtitle,
      time: timeStr,
      status,
      isViewerStop: true,
      routeBadges,
    });
  }

  return [{ awardId: "__merged__", label: "", timeline }];
}
