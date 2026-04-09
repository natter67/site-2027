import {
  doc,
  firestore,
  increment,
  runTransaction,
  serverTimestamp,
} from "./firebaseApp";

/**
 * @typedef {{ ok: true } | { ok: false; reason: "invalid" | "duplicate" | "unauthenticated" }} ScanResult
 */

/**
 * @param {string | undefined} userId
 * @param {string} exhibitId
 * @returns {Promise<ScanResult>}
 */
export async function scanExhibitLocalWeb(userId, exhibitId) {
  if (!userId) {
    return { ok: false, reason: "unauthenticated" };
  }

  const normalized = String(exhibitId ?? "").trim();
  if (!/^\d+$/.test(normalized)) {
    return { ok: false, reason: "invalid" };
  }

  const exhibitKey = `E${normalized}`;
  const exhibitsDocRef = doc(firestore, "exhibits", exhibitKey);
  const exhibitScannedUsersRef = doc(
    firestore,
    "exhibits",
    exhibitKey,
    "scannedUser",
    userId
  );
  const userScannedExhibitsRef = doc(
    firestore,
    "users",
    userId,
    "scannedExhibits",
    exhibitKey
  );
  const usersDocRef = doc(firestore, "users", userId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const exhibitsDoc = await transaction.get(exhibitsDocRef);
      if (!exhibitsDoc.exists()) {
        throw new Error("invalid");
      }
      const scannedUsersDoc = await transaction.get(exhibitScannedUsersRef);
      if (scannedUsersDoc.exists()) {
        throw new Error("duplicate");
      }

      transaction.set(exhibitScannedUsersRef, {
        scannedAt: serverTimestamp(),
      });
      transaction.set(userScannedExhibitsRef, {
        scannedAt: serverTimestamp(),
      });

      transaction.update(exhibitsDocRef, {
        points: increment(10),
      });
      transaction.update(usersDocRef, {
        points: increment(10),
      });
    });
    return { ok: true };
  } catch (err) {
    if (err?.message === "duplicate") {
      return { ok: false, reason: "duplicate" };
    }
    if (err?.message === "invalid") {
      return { ok: false, reason: "invalid" };
    }
    return { ok: false, reason: "invalid" };
  }
}
