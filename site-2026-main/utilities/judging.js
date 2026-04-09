/**
 * Helpers for judging groups, check-in document IDs, and PIN hashing.
 * PINs are stored as SHA-256 hex of `${groupId}:${pin}` (verify client-side after reading group doc).
 *
 * Schedule rows live in `judgingStops` (see judgingStops.js). Check-ins: `judgeCheckins/{g_<groupId>}`
 * with `visitedStopOrders` (per-slot check-ins) and `lastStopOrder` (most recent tap, for compatibility).
 */

export function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

export function normalizeGroupId(groupId) {
  return (groupId || "").trim();
}

/** Identity segment for judgeCheckins document id: email, or g_<groupId> */
export function checkinIdentityKeyFromEmail(email) {
  return normalizeEmail(email);
}

export function checkinIdentityKeyFromGroup(groupId) {
  const g = normalizeGroupId(groupId);
  return g ? `g_${g}` : "";
}

/**
 * One Firestore document per judging group session (Fieldstone: lastStopOrder).
 * Same value as checkinIdentityKeyFromGroup when using group PIN login.
 */
export function judgeSessionCheckinDocId(groupId) {
  return checkinIdentityKeyFromGroup(groupId);
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
 * Slot numbers (`stopOrder`) this group has checked in. Uses `visitedStopOrders` when present;
 * otherwise infers consecutive 1…lastStopOrder from legacy check-in docs.
 */
export function visitedStopOrderSetFromCheckin(checkin) {
  /** @type {Set<number>} */
  const s = new Set();
  if (!checkin || typeof checkin !== "object") return s;
  const raw = checkin.visitedStopOrders;
  if (Array.isArray(raw)) {
    for (const x of raw) {
      const n = typeof x === "number" ? x : Number(x);
      if (Number.isFinite(n) && n >= 1) s.add(n);
    }
  }
  if (s.size === 0) {
    const lo = checkin.lastStopOrder;
    if (typeof lo === "number" && lo >= 1) {
      for (let i = 1; i <= lo; i++) s.add(i);
    }
  }
  return s;
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

/** Resolve Firestore check-in identity key from a judging stop / assignment doc. */
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
