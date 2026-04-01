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
  if (!expected) return true;
  const got = await pinSha256ForGroup(g, pin);
  return got && got.toLowerCase() === expected.toLowerCase();
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
