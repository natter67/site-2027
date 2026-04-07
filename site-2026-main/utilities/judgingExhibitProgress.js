import { firestore, doc, getDoc, getDocs, collection } from "utilities/firebase";
import { query, where } from "firebase/firestore";
import { AWARDS, awardLabelById } from "@utilities/awards";
import {
  normalizeGroupId,
  normalizeEmail,
  judgeCheckinDocId,
  checkinIdentityKeyFromGroup,
  coerceAssignmentStopOrder,
  scheduleTimeSortKey,
  exhibitIdFromAssignmentDoc,
} from "@utilities/judging";
import { fetchStrapiExhibitById } from "@utilities/strapiExhibits";

const AWARD_BADGE_HEX = ["#1e88e5", "#43a047", "#8e24aa"];

export async function readCheckinForAward({ awardId, identityKey }) {
  const id = judgeCheckinDocId(awardId, identityKey);
  const ref = doc(firestore, "judgeCheckins", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function fetchRouteForAssignment(awardId, assignment) {
  const gid = normalizeGroupId(assignment?.judgingGroupId);
  const email = normalizeEmail(assignment?.judgeEmail);
  const coll = collection(firestore, "awardAssignments", awardId, "exhibits");
  const q = gid
    ? query(coll, where("judgingGroupId", "==", gid))
    : email
      ? query(coll, where("judgeEmail", "==", email))
      : null;
  if (!q) return [];
  const snap = await getDocs(q);
  const rows = snap.docs.map((d) => {
    const data = d.data() || {};
    const exhibitId = exhibitIdFromAssignmentDoc(d.id, data);
    return {
      ...data,
      exhibitId,
    };
  });
  rows.sort((a, b) => {
    const ao = coerceAssignmentStopOrder(a) ?? 9999;
    const bo = coerceAssignmentStopOrder(b) ?? 9999;
    return ao - bo;
  });
  return rows;
}

/** Award assignments that include this exhibit (Strapi exhibit doc id). May be multiple rows per award (different judging groups). */
export async function loadAssignmentsForExhibit(exhibitId) {
  const id = String(exhibitId ?? "").trim();
  if (!id) return { assignmentsForExhibit: [] };

  /** @type {{ awardId: string, assignment: Record<string, unknown> & { id: string } }[]} */
  const assignmentsForExhibit = [];

  for (const a of AWARDS) {
    const coll = collection(firestore, "awardAssignments", a.id, "exhibits");
    const q = query(coll, where("exhibitId", "==", id));
    const snap = await getDocs(q);
    const seen = new Set();
    for (const d of snap.docs) {
      seen.add(d.id);
      assignmentsForExhibit.push({
        awardId: a.id,
        assignment: { id: d.id, ...d.data() },
      });
    }
    const legacyRef = doc(firestore, "awardAssignments", a.id, "exhibits", id);
    const legacy = await getDoc(legacyRef);
    if (legacy.exists() && !seen.has(legacy.id)) {
      assignmentsForExhibit.push({
        awardId: a.id,
        assignment: { id: legacy.id, ...legacy.data() },
      });
    }
  }

  return { assignmentsForExhibit };
}

/**
 * Timeline for ExhibitorBusSchedule: one row per **(judging group × visit × this exhibit)**.
 * Visits from different groups must not share the same slot key (visit #1 in group 3 ≠ visit #1 in group 1).
 */
export async function buildExhibitorBusRows({ exhibitId, assignmentsForExhibit }) {
  const id = String(exhibitId ?? "").trim();
  if (!id || !assignmentsForExhibit?.length) return [];

  const awardIds = [...new Set(assignmentsForExhibit.map((x) => x.awardId))];

  /** @type {Map<string, { exhibitId: string, stopOrder: number, judgingGroupId: string, scheduledTime: string, awards: Set<string> }>} */
  const slotByKey = new Map();
  /** @type {Map<string, Array<Record<string, unknown>>>} */
  const routeCache = new Map();

  async function getRouteForAwardAndGroup(awardId, assignment) {
    const g = normalizeGroupId(assignment?.judgingGroupId);
    const ck = `${awardId}\0${g}`;
    if (routeCache.has(ck)) return routeCache.get(ck);
    const routeAll = await fetchRouteForAssignment(awardId, assignment);
    routeCache.set(ck, routeAll);
    return routeAll;
  }

  for (const { awardId, assignment } of assignmentsForExhibit) {
    if (!assignment) continue;
    const routeAll = await getRouteForAwardAndGroup(awardId, assignment);
    const fallbackGid = normalizeGroupId(assignment.judgingGroupId);
    for (const row of routeAll) {
      const ord = coerceAssignmentStopOrder(row) ?? 0;
      if (ord < 1) continue;
      const eid = String(row.exhibitId ?? "").trim();
      if (!eid) continue;
      const gid = normalizeGroupId(row.judgingGroupId) || fallbackGid;
      if (!gid) continue;
      const st =
        typeof row.scheduledTime === "string" && row.scheduledTime.trim()
          ? row.scheduledTime.trim()
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
      /** @type {{ exhibitId: string, stopOrder: number, judgingGroupId: string, scheduledTime: string, awards: Set<string> }} */
      const slot = slotByKey.get(slotKey);
      slot.awards.add(awardId);
      if (st && slot.scheduledTime === "—") slot.scheduledTime = st;
    }
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

  const timeline = [];
  for (const slot of viewerSlots) {
    const ord = slot.stopOrder;
    const eid = slot.exhibitId;
    const slotGid = slot.judgingGroupId;
    const meta = await exhibitMeta(eid);
    const timeStr = slot.scheduledTime || "—";

    const awardsForThisVisit = [];
    for (const { awardId: aid, assignment: asg } of assignmentsForExhibit) {
      const routeAll = await getRouteForAwardAndGroup(aid, asg);
      const match = routeAll.some((r) => {
        const o = coerceAssignmentStopOrder(r) ?? 0;
        const reid = String(r.exhibitId ?? "").trim();
        const rgid = normalizeGroupId(r.judgingGroupId);
        return o === ord && reid === id && rgid === slotGid;
      });
      if (match) awardsForThisVisit.push(aid);
    }

    let lastOrderForSlot = 0;
    const identityKey = checkinIdentityKeyFromGroup(slotGid);
    if (identityKey) {
      for (const aid of awardsForThisVisit) {
        const checkin = await readCheckinForAward({ awardId: aid, identityKey });
        const lo = coerceAssignmentStopOrder(checkin) ?? 0;
        lastOrderForSlot = Math.max(lastOrderForSlot, lo);
      }
    }

    let status = "future";
    const lo = lastOrderForSlot;
    if (lo <= 0) {
      if (ord === 1) status = "next";
    } else {
      if (ord < lo) status = "past";
      else if (ord === lo) status = "here";
      else if (ord === lo + 1) status = "next";
      else status = "future";
    }

    const routeBadges = awardsForThisVisit
      .sort((a, b) => AWARDS.findIndex((x) => x.id === a) - AWARDS.findIndex((x) => x.id === b))
      .map((aid) => {
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
