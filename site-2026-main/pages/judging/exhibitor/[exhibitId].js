import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { firestore, doc } from "utilities/firebase";
import { onSnapshot } from "firebase/firestore";
import ExhibitorBusSchedule from "@/judging/ExhibitorBusSchedule";
import { normalizeGroupId, checkinIdentityKeyFromGroup } from "@utilities/judging";
import { loadAssignmentsForExhibit, buildExhibitorBusRows } from "@utilities/judgingExhibitProgress";
import { fetchStrapiExhibitById } from "@utilities/strapiExhibits";

export default function JudgingExhibitorProgressPage() {
  const router = useRouter();
  const raw = router.query.exhibitId;
  const exhibitId = typeof raw === "string" ? raw.trim() : "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exhibit, setExhibit] = useState(null);
  const [assignmentsForExhibit, setAssignmentsForExhibit] = useState([]);

  const [busRows, setBusRows] = useState([]);
  const [busLoading, setBusLoading] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (!exhibitId) return;

    let cancelled = false;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const strapiEx = await fetchStrapiExhibitById(exhibitId);
        if (cancelled) return;
        setExhibit(
          strapiEx ? { docId: strapiEx.docId || exhibitId, ...strapiEx } : { docId: exhibitId }
        );

        const { assignmentsForExhibit: rows } = await loadAssignmentsForExhibit(exhibitId);
        if (cancelled) return;
        setAssignmentsForExhibit(rows);

        if (!rows.length) {
          setError("No judging schedule includes this exhibit yet.");
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Could not load exhibit progress.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, exhibitId]);

  const refreshBus = useCallback(async () => {
    if (!exhibitId || !assignmentsForExhibit.length) {
      setBusRows([]);
      return;
    }
    setBusLoading(true);
    try {
      const rows = await buildExhibitorBusRows({
        exhibitId,
        assignmentsForExhibit,
      });
      setBusRows(rows);
    } finally {
      setBusLoading(false);
    }
  }, [exhibitId, assignmentsForExhibit]);

  useEffect(() => {
    if (!exhibitId || !assignmentsForExhibit.length) return;
    refreshBus();
  }, [exhibitId, assignmentsForExhibit, refreshBus]);

  const judgingGroupIdsForWatch = useMemo(() => {
    const s = new Set();
    for (const { assignment } of assignmentsForExhibit) {
      const g = normalizeGroupId(assignment?.judgingGroupId);
      if (g) s.add(g);
    }
    return [...s].sort();
  }, [assignmentsForExhibit]);

  useEffect(() => {
    if (!exhibitId || !assignmentsForExhibit.length) return;
    const unsubs = [];

    for (const g of judgingGroupIdsForWatch) {
      const key = checkinIdentityKeyFromGroup(g);
      if (!key) continue;
      const ref = doc(firestore, "judgeCheckins", key);
      unsubs.push(onSnapshot(ref, () => refreshBus()));
    }

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [exhibitId, judgingGroupIdsForWatch.join("|"), refreshBus]);

  const title = useMemo(() => {
    return (
      exhibit?.exhibitName || exhibit?.title || exhibit?.name || (exhibitId ? `Exhibit ${exhibitId}` : "Exhibit")
    );
  }, [exhibit, exhibitId]);

  return (
    <>
      <Head>
        <title>Judging progress · {title}</title>
      </Head>
      <div
        className="min-h-screen bg-gray-50 flex justify-center pt-24 sm:pt-28 px-3 sm:px-4"
        style={{ paddingBottom: "max(4rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="w-full max-w-xl min-w-0">
          <div className="mb-5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Judging progress</h1>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              Live route status for your exhibit. Bookmark this link—no sign-in required.
            </p>
          </div>

          {loading ? (
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <p>Loading…</p>
            </div>
          ) : error && !assignmentsForExhibit.length ? (
            <div className="border rounded-lg p-5 bg-amber-50 text-amber-950 shadow-sm">
              <p className="font-semibold">Schedule not found</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : (
            <ExhibitorBusSchedule rows={busRows} loading={busLoading} onRefresh={() => refreshBus()} />
          )}
        </div>
      </div>
    </>
  );
}
