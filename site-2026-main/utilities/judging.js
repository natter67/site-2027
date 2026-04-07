/**
 * Helpers for judging groups, check-in document IDs, and PIN hashing.
 * PINs are stored as SHA-256 hex of `${groupId}:${pin}` (verify client-side after reading group doc).
 */

export function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

export function normalizeGroupId(groupId) {
  return (groupId || "").trim();
}

/**
 * Separator for composite Firestore doc ids under awardAssignments/{award}/exhibits/{id}.
 * Same exhibit may appear on the same award for multiple judging groups (one doc per group).
 */
export const ASSIGNMENT_EXHIBIT_DOC_SEP = "__g__";

/** Firestore document id for an assignment row (judgingGroupId + exhibitId). */
export function awardAssignmentExhibitDocId(judgingGroupId, exhibitId) {
  const g = normalizeGroupId(judgingGroupId);
  const e = String(exhibitId ?? "").trim();
  if (!g || !e) return e;
  return `${g}${ASSIGNMENT_EXHIBIT_DOC_SEP}${e}`;
}

/** Real exhibit id from assignment doc id + stored fields (legacy docs use exhibit id alone as doc id). */
export function exhibitIdFromAssignmentDoc(docId, data) {
  const fromField = String(data?.exhibitId ?? "").trim();
  if (fromField) return fromField;
  const id = String(docId ?? "");
  const sep = ASSIGNMENT_EXHIBIT_DOC_SEP;
  const i = id.indexOf(sep);
  if (i >= 0) return id.slice(i + sep.length);
  return id;
}

/** Identity segment used inside judgeCheckins doc id: email, or g_<groupId> */
export function checkinIdentityKeyFromEmail(email) {
  return normalizeEmail(email);
}

export function checkinIdentityKeyFromGroup(groupId) {
  const g = normalizeGroupId(groupId);
  return g ? `g_${g}` : "";
}

export function judgeCheckinDocId(awardId, identityKey) {
  const a = (awardId || "").trim();
  const k = (identityKey || "").trim();
  return `${a}__${k}`;
}

export async function sha256Hex(text) {
  const input = String(text ?? "");
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    return "";
  }
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Stored on judgingGroups as pinSha256 */
export async function pinSha256ForGroup(groupId, pin) {
  const g = normalizeGroupId(groupId);
  const p = String(pin ?? "").trim();
  if (!g || !p) return "";
  return sha256Hex(`${g}:${p}`);
}

export async function verifyGroupPin({ groupId, pin, pinSha256 }) {
  const g = normalizeGroupId(groupId);
  if (!g) return false;
  const expected = (pinSha256 || "").trim().toLowerCase();
  if (!expected) return false;
  const got = await pinSha256ForGroup(g, pin);
  return got && got.toLowerCase() === expected.toLowerCase();
}

/** Normalize stop order from Firestore assignment fields (number, numeric string, or legacy stopIndex). */
export function coerceAssignmentStopOrder(row) {
  if (!row || typeof row !== "object") return null;
  const raw = row.stopOrder;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw >= 1 ? raw : null;
  }
  if (typeof raw === "string" && raw.trim()) {
    const n = Number(raw.trim());
    if (Number.isFinite(n) && n >= 1) return n;
  }
  const si = row.stopIndex;
  if (typeof si === "number" && Number.isFinite(si)) {
    return si + 1;
  }
  return null;
}

/**
 * Minutes from midnight [0, 1439] for sorting; `null` = no usable time (judges list those stops last).
 * Handles values like "10:40 AM", "10:40AM", "14:30".
 */
export function scheduleTimeSortKey(scheduledTimeRaw) {
  if (scheduledTimeRaw == null) return null;
  const s = String(scheduledTimeRaw).trim();
  if (!s || s === "—") return null;

  const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (m) {
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const ap = m[4]?.toLowerCase();
    if (ap === "pm" && h < 12) h += 12;
    if (ap === "am" && h === 12) h = 0;
    if (h >= 0 && h <= 23 && min >= 0 && min < 60) return h * 60 + min;
  }

  const d = Date.parse(`2000-01-01 ${s}`);
  if (!Number.isNaN(d)) {
    const dt = new Date(d);
    return dt.getHours() * 60 + dt.getMinutes();
  }

  return null;
}

/** Resolve Firestore check-in identity key from an assignment doc. */
export function checkinIdentityKeyFromAssignment(assignment) {
  if (!assignment) return "";
  const gid = normalizeGroupId(assignment.judgingGroupId);
  if (gid) return checkinIdentityKeyFromGroup(gid);
  return checkinIdentityKeyFromEmail(assignment.judgeEmail);
}

const SESSION_KEY = "eoh_judging_group_v1";

export function readJudgingGroupSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (!o?.groupId) return null;
    return { groupId: normalizeGroupId(o.groupId), verifiedAt: o.verifiedAt || 0 };
  } catch {
    return null;
  }
}

export function writeJudgingGroupSession(groupId) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ groupId: normalizeGroupId(groupId), verifiedAt: Date.now() })
  );
}

export function clearJudgingGroupSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}
