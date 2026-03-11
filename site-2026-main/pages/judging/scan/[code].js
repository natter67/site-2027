import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  auth,
  provider,
  firestore,
  signInWithPopup,
  signOut,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "utilities/firebase";
import { AWARDS, awardColorById, awardLabelById } from "@utilities/awards";

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

function checkinDocId(awardId, judgeEmail) {
  return `${awardId}__${judgeEmail}`;
}

function ratingDocId({ awardId, exhibitId, judgeEmail }) {
  return `${awardId}__${exhibitId}__${judgeEmail}`;
}

async function readAssignment({ awardId, exhibitId }) {
  const ref = doc(firestore, "awardAssignments", awardId, "exhibits", exhibitId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

async function readCheckin({ awardId, judgeEmail }) {
  const ref = doc(firestore, "judgeCheckins", checkinDocId(awardId, judgeEmail));
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

function StopsCard({ title, subtitle, children }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold truncate">{title}</p>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function JudgingScan() {
  const router = useRouter();
  const { code } = router.query;

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "judge" | "exhibitor"

  const [loading, setLoading] = useState(true);
  const [qr, setQr] = useState(null);
  const [exhibit, setExhibit] = useState(null);
  const [error, setError] = useState("");

  const [awardIds, setAwardIds] = useState([]);
  const [assignmentByAward, setAssignmentByAward] = useState(new Map());

  // Judge UI
  const [judgeAllowed, setJudgeAllowed] = useState(false);
  const [judgeAwardId, setJudgeAwardId] = useState("");
  const [judgeStatus, setJudgeStatus] = useState({ state: "idle", message: "" });
  const [ratingValue, setRatingValue] = useState("");
  const [ratingStatus, setRatingStatus] = useState({ state: "idle", message: "" });

  // Exhibitor UI
  const [stops, setStops] = useState([]); // [{awardId, label, stopsUntil, statusText}]
  const [stopsLoading, setStopsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u || null));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!code || typeof code !== "string") return;
      setLoading(true);
      setError("");
      try {
        const qrRef = doc(firestore, "judgingQrCodes", code);
        const qrSnap = await getDoc(qrRef);
        if (!qrSnap.exists()) {
          setError("Invalid or expired QR code.");
          setQr(null);
          setExhibit(null);
          setAwardIds([]);
          setAssignmentByAward(new Map());
          return;
        }
        const qrData = qrSnap.data();
        if (qrData.active === false) {
          setError("This judging QR code is inactive.");
          setQr(null);
          setExhibit(null);
          setAwardIds([]);
          setAssignmentByAward(new Map());
          return;
        }

        const exhibitId = qrData.exhibitId;
        if (!exhibitId) {
          setError("QR code is missing an exhibitId.");
          setQr(null);
          setExhibit(null);
          setAwardIds([]);
          setAssignmentByAward(new Map());
          return;
        }

        setQr({ id: qrSnap.id, ...qrData });

        const exRef = doc(firestore, "exhibits2026", exhibitId);
        const exSnap = await getDoc(exRef);
        const exData = exSnap.exists() ? exSnap.data() : null;
        setExhibit(exData ? { docId: exSnap.id, ...exData } : { docId: exhibitId });

        // Awards for this exhibit are derived from the schedule (awardAssignments),
        // not from the QR code itself.
        const assignments = await Promise.all(
          AWARDS.map(async (a) => {
            const assignment = await readAssignment({ awardId: a.id, exhibitId });
            return { awardId: a.id, assignment };
          })
        );
        const applicable = assignments
          .filter((x) => !!x.assignment)
          .map((x) => x.awardId);
        setAwardIds(applicable);
        setAssignmentByAward(
          new Map(assignments.filter((x) => !!x.assignment).map((x) => [x.awardId, x.assignment]))
        );
      } catch (e) {
        console.error(e);
        setError("Failed to load judging info.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [code]);

  useEffect(() => {
    const run = async () => {
      if (!user?.email) {
        setJudgeAllowed(false);
        return;
      }
      const email = normalizeEmail(user.email);
      try {
        const snap = await getDoc(doc(firestore, "judgesAllowlist", email));
        setJudgeAllowed(snap.exists() && snap.data()?.active !== false);
      } catch (e) {
        console.error(e);
        setJudgeAllowed(false);
      }
    };
    run();
  }, [user?.email]);

  const exhibitTitle = useMemo(() => {
    return exhibit?.exhibitName || exhibit?.title || exhibit?.name || `Exhibit ${exhibit?.docId || ""}`;
  }, [exhibit]);

  const judgeApplicableAwardIds = useMemo(() => {
    const email = normalizeEmail(user?.email);
    if (!email || !judgeAllowed) return [];
    const ids = awardIds.filter((awardId) => {
      const a = assignmentByAward.get(awardId);
      if (!a) return false;
      const assigned = normalizeEmail(a.judgeEmail);
      return assigned ? assigned === email : true;
    });
    return ids;
  }, [awardIds, assignmentByAward, judgeAllowed, user?.email]);

  const handleJudgeSignIn = async () => {
    await signInWithPopup(auth, provider);
  };

  const handleJudgeSignOut = async () => {
    await signOut(auth);
  };

  const handleJudgeCheckin = async () => {
    if (!qr?.exhibitId) return;
    if (!user?.email) {
      alert("Please sign in first.");
      return;
    }
    const email = normalizeEmail(user.email);
    if (!judgeAllowed) {
      alert("You are not allowlisted as a judge.");
      return;
    }
    if (!judgeAwardId) {
      alert("Select an award first.");
      return;
    }
    if (!awardIds.includes(judgeAwardId)) {
      alert("That award is not configured for this exhibit.");
      return;
    }

    setJudgeStatus({ state: "working", message: "" });
    try {
      const assignment =
        assignmentByAward.get(judgeAwardId) ||
        (await readAssignment({ awardId: judgeAwardId, exhibitId: qr.exhibitId }));
      if (!assignment) {
        alert("No assignment found for this exhibit + award.");
        setJudgeStatus({ state: "idle", message: "" });
        return;
      }
      if (assignment.judgeEmail && normalizeEmail(assignment.judgeEmail) !== email) {
        alert("This exhibit is assigned to a different judge for that award.");
        setJudgeStatus({ state: "idle", message: "" });
        return;
      }
      const stopOrder =
        typeof assignment.stopOrder === "number"
          ? assignment.stopOrder
          : typeof assignment.stopIndex === "number"
            ? assignment.stopIndex + 1
            : null;
      if (typeof stopOrder !== "number" || stopOrder < 1) {
        alert("Assignment is missing a valid stop number.");
        setJudgeStatus({ state: "idle", message: "" });
        return;
      }

      await setDoc(
        doc(firestore, "judgeCheckins", checkinDocId(judgeAwardId, email)),
        {
          awardId: judgeAwardId,
          judgeEmail: email,
          exhibitId: qr.exhibitId,
          stopOrder,
          checkedInAt: serverTimestamp(),
        },
        { merge: true }
      );

      setJudgeStatus({ state: "done", message: "Checked in." });
    } catch (e) {
      console.error(e);
      setJudgeStatus({ state: "error", message: "Check-in failed." });
    }
  };

  const handleSubmitRating = async () => {
    if (!qr?.exhibitId) return;
    if (!user?.email) {
      alert("Please sign in first.");
      return;
    }
    const email = normalizeEmail(user.email);
    if (!judgeAllowed) {
      alert("You are not allowlisted as a judge.");
      return;
    }
    if (!judgeAwardId) {
      alert("Select an award first.");
      return;
    }
    if (!awardIds.includes(judgeAwardId)) {
      alert("That award is not configured for this exhibit.");
      return;
    }
    const ratingNum = Number(ratingValue);
    if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      alert("Rating must be 1–5.");
      return;
    }

    setRatingStatus({ state: "working", message: "" });
    try {
      const assignment =
        assignmentByAward.get(judgeAwardId) ||
        (await readAssignment({ awardId: judgeAwardId, exhibitId: qr.exhibitId }));
      if (!assignment) {
        alert("No assignment found for this exhibit + award.");
        setRatingStatus({ state: "idle", message: "" });
        return;
      }
      if (assignment.judgeEmail && normalizeEmail(assignment.judgeEmail) !== email) {
        alert("This exhibit is assigned to a different judge for that award.");
        setRatingStatus({ state: "idle", message: "" });
        return;
      }

      await setDoc(
        doc(firestore, "judgeRatings", ratingDocId({ awardId: judgeAwardId, exhibitId: qr.exhibitId, judgeEmail: email })),
        {
          awardId: judgeAwardId,
          awardLabel: awardLabelById(judgeAwardId),
          exhibitId: qr.exhibitId,
          judgeEmail: email,
          rating: ratingNum,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setRatingStatus({ state: "done", message: "Rating saved." });
    } catch (e) {
      console.error(e);
      setRatingStatus({ state: "error", message: "Failed to save rating." });
    }
  };

  const loadStopsUntil = async () => {
    if (!qr?.exhibitId) return;
    if (!Array.isArray(awardIds) || awardIds.length === 0) {
      setStops([]);
      return;
    }
    setStopsLoading(true);
    try {
      const exhibitId = qr.exhibitId;
      const uniqueAwards = Array.from(new Set(awardIds.map((a) => String(a).trim()).filter(Boolean)));

      const assignments = await Promise.all(
        uniqueAwards.map(async (awardId) => {
          const cached = assignmentByAward.get(awardId);
          const assignment = cached || (await readAssignment({ awardId, exhibitId }));
          return { awardId, assignment };
        })
      );
      const assignmentMap = new Map(assignments.map((x) => [x.awardId, x.assignment]));

      const checkins = await Promise.all(
        assignments.map(async ({ awardId, assignment }) => {
          const judgeEmail = normalizeEmail(assignment?.judgeEmail);
          const stopOrder =
            typeof assignment?.stopOrder === "number"
              ? assignment.stopOrder
              : typeof assignment?.stopIndex === "number"
                ? assignment.stopIndex + 1
                : null;
          if (!assignment || !judgeEmail || typeof stopOrder !== "number") {
            return { awardId, checkin: null };
          }
          const checkin = await readCheckin({ awardId, judgeEmail });
          return { awardId, checkin };
        })
      );

      const checkinByAward = new Map(checkins.map((x) => [x.awardId, x.checkin]));

      const rows = uniqueAwards.map((awardId) => {
        const assignment = assignmentMap.get(awardId) || null;
        if (!assignment) {
          return {
            awardId,
            label: awardLabelById(awardId),
            statusText: "Not scheduled yet.",
            stopsUntil: null,
          };
        }
        const judgeEmail = normalizeEmail(assignment.judgeEmail);
        const targetOrder =
          typeof assignment.stopOrder === "number"
            ? assignment.stopOrder
            : typeof assignment.stopIndex === "number"
              ? assignment.stopIndex + 1
              : null;
        if (!judgeEmail || typeof targetOrder !== "number") {
          return {
            awardId,
            label: awardLabelById(awardId),
            statusText: "Not scheduled yet.",
            stopsUntil: null,
          };
        }

        const checkin = checkinByAward.get(awardId);
        const lastOrder = typeof checkin?.stopOrder === "number" ? checkin.stopOrder : 0;
        const diff = targetOrder - lastOrder;

        if (diff <= 0) {
          return {
            awardId,
            label: awardLabelById(awardId),
            statusText: "Judges have reached this stop (or are here).",
            stopsUntil: 0,
          };
        }
        if (diff === 1) {
          return {
            awardId,
            label: awardLabelById(awardId),
            statusText: "Next stop.",
            stopsUntil: 1,
          };
        }
        return {
          awardId,
          label: awardLabelById(awardId),
          statusText: `${diff} stops away.`,
          stopsUntil: diff,
        };
      });

      setStops(rows);
    } finally {
      setStopsLoading(false);
    }
  };

  useEffect(() => {
    if (role !== "exhibitor") return;
    loadStopsUntil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, qr?.exhibitId, awardIds.join("|")]);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center pt-28 pb-16 px-4">
      <div className="w-full max-w-xl">
        <div className="mb-5">
          <h1 className="text-2xl font-bold">Judging Check-in</h1>
          <p className="text-sm text-gray-600 mt-1">Private exhibit QR (not for the public).</p>
        </div>

        {loading ? (
          <div className="border rounded-lg p-5 bg-white shadow-sm">
            <p>Loading…</p>
          </div>
        ) : error ? (
          <div className="border rounded-lg p-5 bg-red-50 text-red-900 shadow-sm">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : (
          <>
            <StopsCard title={exhibitTitle} subtitle={exhibit?.location ? `Location: ${exhibit.location}` : null}>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setRole("judge")}
                    className={`px-4 py-2 rounded border ${
                      role === "judge" ? "bg-blue-600 text-white border-blue-600" : "bg-white"
                    }`}
                  >
                    I&apos;m a Judge
                  </button>
                  <button
                    onClick={() => setRole("exhibitor")}
                    className={`px-4 py-2 rounded border ${
                      role === "exhibitor"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white"
                    }`}
                  >
                    I&apos;m an Exhibitor
                  </button>
                </div>
                {Array.isArray(awardIds) && awardIds.length > 0 ? (
                  <p className="text-sm text-gray-600">
                    Awards: {awardIds.map((a) => awardLabelById(a)).join(", ")}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    No awards configured yet for this exhibit.
                  </p>
                )}
              </div>
            </StopsCard>

            {role === "judge" && (
              <div className="mt-5 flex flex-col gap-4">
                <StopsCard title="Judge" subtitle="Pick an award, then check in and submit a rating.">
                  {user ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-700 truncate">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Status: {judgeAllowed ? "Allowlisted" : "Not allowlisted"}
                        </p>
                      </div>
                      <button className="underline text-sm" onClick={handleJudgeSignOut}>
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleJudgeSignIn}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                      Sign in with Google
                    </button>
                  )}

                  <div className="mt-4">
                    <label className="text-sm font-semibold">
                      Award
                      <select
                        className="mt-1 w-full border rounded p-2"
                        value={judgeAwardId}
                        onChange={(e) => {
                          setJudgeAwardId(e.target.value);
                          setJudgeStatus({ state: "idle", message: "" });
                          setRatingStatus({ state: "idle", message: "" });
                        }}
                        disabled={!judgeApplicableAwardIds.length}
                      >
                        <option value="">Select…</option>
                        {judgeApplicableAwardIds.map((a) => {
                          const label = awardLabelById(a);
                          return (
                            <option key={a} value={a}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                    </label>
                    {user && judgeAllowed && judgeApplicableAwardIds.length === 0 && (
                      <p className="text-xs text-amber-700 mt-2">
                        You don’t appear to be scheduled for any award categories at this exhibit.
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleJudgeCheckin}
                      disabled={judgeStatus.state === "working"}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded"
                    >
                      {judgeStatus.state === "working" ? "Checking in…" : "Check in"}
                    </button>
                    {judgeStatus.state === "done" && (
                      <span className="text-sm text-green-700 flex items-center">
                        {judgeStatus.message}
                      </span>
                    )}
                    {judgeStatus.state === "error" && (
                      <span className="text-sm text-red-700 flex items-center">
                        {judgeStatus.message}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2">
                    <label className="text-sm font-semibold">
                      Rating (1–5)
                      <select
                        className="mt-1 w-full border rounded p-2"
                        value={ratingValue}
                        onChange={(e) => setRatingValue(e.target.value)}
                        disabled={!judgeAwardId}
                      >
                        <option value="">Select…</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={String(n)}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="flex gap-2 items-center">
                      <button
                        onClick={handleSubmitRating}
                        disabled={ratingStatus.state === "working"}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded"
                      >
                        {ratingStatus.state === "working" ? "Saving…" : "Submit rating"}
                      </button>
                      {ratingStatus.state === "done" && (
                        <span className="text-sm text-green-700 flex items-center">
                          {ratingStatus.message}
                        </span>
                      )}
                      {ratingStatus.state === "error" && (
                        <span className="text-sm text-red-700 flex items-center">
                          {ratingStatus.message}
                        </span>
                      )}
                    </div>
                  </div>
                </StopsCard>
              </div>
            )}

            {role === "exhibitor" && (
              <div className="mt-5 flex flex-col gap-4">
                <StopsCard
                  title="How many stops until judges get here?"
                  subtitle="This updates as judges check in at other exhibits."
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={loadStopsUntil}
                      className="px-3 py-2 border rounded bg-white hover:bg-gray-50"
                    >
                      Refresh
                    </button>
                    {stopsLoading && <span className="text-sm text-gray-600">Loading…</span>}
                  </div>
                </StopsCard>

                {stops.map((row) => (
                  <StopsCard
                    key={row.awardId}
                    title={
                      <span className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold ${awardColorById(row.awardId).badge}`}
                        >
                          {awardLabelById(row.awardId)}
                        </span>
                      </span>
                    }
                    subtitle={row.statusText}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

