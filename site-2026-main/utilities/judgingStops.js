/**
 * Flat judging schedule: one document per (judging group × award × exhibit).
 * Simpler queries than awardAssignments/{award}/exhibits/... and supports updateDoc for exhibit/time/order changes.
 */

import { collection, getDocs, firestore } from "utilities/firebase";
import { query, where } from "firebase/firestore";
import { normalizeGroupId } from "./judging";

export const JUDGING_STOPS_COLLECTION = "judgingStops";

function safeDocSegment(s) {
  return String(s ?? "")
    .trim()
    .replace(/[/\s]+/g, "_");
}

/** Deterministic id so upserts from admin / CSV stay stable without extra reads. */
export function judgingStopDocId(judgingGroupId, awardId, exhibitId) {
  return `${safeDocSegment(judgingGroupId)}__${safeDocSegment(awardId)}__${safeDocSegment(exhibitId)}`;
}

export async function fetchJudgingStopsForGroup(groupId) {
  const gid = normalizeGroupId(groupId);
  if (!gid) return [];
  const q = query(
    collection(firestore, JUDGING_STOPS_COLLECTION),
    where("judgingGroupId", "==", gid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() || {}), _docId: d.id }));
}
