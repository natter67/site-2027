import React, { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "utilities/firebase";
import { onSnapshot } from "firebase/firestore";
import { awardLabelById, awardRubricUrlById } from "@utilities/awards";
import {
  normalizeGroupId,
  readJudgingGroupSession,
  checkinIdentityKeyFromGroup,
  coerceAssignmentStopOrder,
  scheduleTimeSortKey,
  visitedStopOrderSetFromCheckin,
} from "@utilities/judging";
import { fetchJudgingStopsForGroup } from "@utilities/judgingStops";
import { fetchStrapiExhibitById } from "@utilities/strapiExhibits";

/**
 * One flat list for the group: visits merged across awards, sorted by scheduled time (no time → end),
 * then visit order. Same visit (stopOrder + exhibit) is one row with multiple `awardIds`.
 */
async function loadJudgeMergedSchedule(groupId) {
  const gid = normalizeGroupId(groupId);
  /** @type {Map<string, { exhibitId: string, stopOrder: number, scheduledTime: string, awardIds: Set<string> }>} */
  const byKey = new Map();

  const rows = await fetchJudgingStopsForGroup(gid);
  for (const data of rows) {
    const exhibitId = String(data.exhibitId ?? "").trim();
    const awardId = String(data.awardId ?? "").trim();
    if (!exhibitId || !awardId) continue;
    const row = { ...data, exhibitId, awardId };
    const o = coerceAssignmentStopOrder(row);
    if (o == null) continue;
    const key = `${o}\0${exhibitId}`;
    const st = typeof data.scheduledTime === "string" ? data.scheduledTime.trim() : "";
    if (!byKey.has(key)) {
      byKey.set(key, {
        exhibitId,
        stopOrder: o,
        scheduledTime: st,
        awardIds: new Set([awardId]),
      });
    } else {
      const cur = byKey.get(key);
      cur.awardIds.add(awardId);
      if (!cur.scheduledTime && st) cur.scheduledTime = st;
    }
  }

  const list = [...byKey.values()];
  list.sort((x, y) => {
    const kx = scheduleTimeSortKey(x.scheduledTime);
    const ky = scheduleTimeSortKey(y.scheduledTime);
    const xTimed = kx != null;
    const yTimed = ky != null;
    if (xTimed !== yTimed) return xTimed ? -1 : 1;
    if (xTimed && yTimed && kx !== ky) return kx - ky;
    return x.stopOrder - y.stopOrder;
  });

  return list;
}

export default function JudgingRunPage() {
  const router = useRouter();
  /** Avoid SSR/client tree mismatch: router.isReady and session differ on first paint vs server. */
  const [clientReady, setClientReady] = useState(false);
  const [session, setSession] = useState(null);
  const [mergedStops, setMergedStops] = useState([]);
  const [loading, setLoading] = useState(true);
  /** Visit slot numbers (`stopOrder`) already checked in for this group session. */
  const [visitedStopOrders, setVisitedStopOrders] = useState([]);
  const [exhibitTitles, setExhibitTitles] = useState(() => new Map());
  const [checkInWorking, setCheckInWorking] = useState(false);

  const syncSession = useCallback(() => {
    setSession(readJudgingGroupSession());
  }, []);

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("focus", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("focus", syncSession);
    };
  }, [syncSession]);

  const gid = normalizeGroupId(session?.groupId);

  useEffect(() => {
    if (!gid) {
      setMergedStops([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const stops = await loadJudgeMergedSchedule(gid);
        if (cancelled) return;
        setMergedStops(stops);

        const ids = new Set();
        for (const s of stops) ids.add(s.exhibitId);
        const titles = new Map();
        await Promise.all(
          [...ids].map(async (id) => {
            try {
              const ex = await fetchStrapiExhibitById(id);
              const t = ex?.exhibitName || ex?.name || id;
              titles.set(id, t);
            } catch {
              titles.set(id, id);
            }
          })
        );
        if (!cancelled) setExhibitTitles(titles);
      } catch (e) {
        console.error(e);
        if (!cancelled) setMergedStops([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [gid]);

  const identityKey = gid ? checkinIdentityKeyFromGroup(gid) : "";

  useEffect(() => {
    if (!gid || !identityKey) return;
    const ref = doc(firestore, "judgeCheckins", identityKey);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setVisitedStopOrders([]);
          return;
        }
        const data = snap.data();
        const v = visitedStopOrderSetFromCheckin(data);
        setVisitedStopOrders([...v].sort((a, b) => a - b));
      },
      (err) => console.error(err)
    );

    return () => unsub();
  }, [gid, identityKey]);

  const routeView = useMemo(() => {
    if (!mergedStops.length) return null;
    const visited = new Set(visitedStopOrders);
    const nextStop = mergedStops.find((s) => !visited.has(s.stopOrder)) || null;

    const rows = mergedStops.map((s) => {
      const o = s.stopOrder;
      const title = exhibitTitles.get(s.exhibitId) || s.exhibitId;
      const time = s.scheduledTime?.trim() || null;
      let status = "future";
      if (typeof o === "number") {
        if (visited.has(o)) status = "past";
        else if (
          nextStop &&
          s.exhibitId === nextStop.exhibitId &&
          o === nextStop.stopOrder
        ) {
          status = "current";
        }
      }
      return {
        ...s,
        order: o,
        title,
        time,
        status,
        awardIds: [...s.awardIds],
      };
    });

    return { nextStop, rows };
  }, [mergedStops, visitedStopOrders, exhibitTitles]);

  const handleCheckIn = async (stop) => {
    if (!gid || !stop) return;
    const o =
      typeof stop.stopOrder === "number"
        ? stop.stopOrder
        : typeof stop.order === "number"
          ? stop.order
          : null;
    if (o == null || o < 1) return;
    const key = checkinIdentityKeyFromGroup(gid);
    if (!key) return;

    const exhibitId = stop.exhibitId;

    setCheckInWorking(true);
    try {
      const ref = doc(firestore, "judgeCheckins", key);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, {
          visitedStopOrders: arrayUnion(o),
          lastStopOrder: o,
          judgingGroupId: gid,
          exhibitId,
          checkedInAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(ref, {
          visitedStopOrders: [o],
          lastStopOrder: o,
          judgingGroupId: gid,
          exhibitId,
          checkedInAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error(e);
      alert("Check-in failed. Try again.");
    } finally {
      setCheckInWorking(false);
    }
  };

  if (!clientReady || !router.isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <p className="text-gray-600 font-semibold">Loading…</p>
      </div>
    );
  }

  if (!gid) {
    return (
      <>
        <Head>
          <title>Judging · Route</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16 sm:py-20">
          <div className="w-full max-w-md min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg text-center">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Sign in first</h1>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              Open the judging link you were given (for example{" "}
              <code className="font-mono text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">
                /judging/1
              </code>
              ) and enter your group PIN.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Judging · Route</title>
      </Head>
      <div
        className="min-h-screen bg-gray-50 text-gray-900 px-3 sm:px-4 pt-24 sm:pt-28 pb-16"
        style={{ paddingBottom: "max(4rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="max-w-lg mx-auto w-full min-w-0">
          <header className="mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Group <span className="font-mono font-semibold text-amber-800">{gid}</span> route
            </h1>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              Click the check-in button to mark your visit. It is ok to visit stops out of order.
            </p>
          </header>

          {loading ? (
            <p className="text-gray-600">Loading schedule…</p>
          ) : !routeView || routeView.rows.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              No stops are scheduled for this group yet. Ask organizers to assign your route in admin,
              or confirm you used the correct group link.
            </div>
          ) : (
            <section className="rounded-2xl border border-[#2f2a18] bg-[#1a1812] overflow-hidden shadow-xl text-[#e8e0c8]">
              <div className="px-4 py-3 border-b border-[#2f2a18] bg-[#15130e]">
                <h2 className="font-bold text-[#f7d000]">Today&apos;s stops</h2>
                {routeView.nextStop ? null : (
                  <p className="text-xs text-green-400 mt-1">All stops checked in.</p>
                )}
              </div>
              <ol className="divide-y divide-[#2a2618]">
                {routeView.rows.map((row) => {
                  const isPast = row.status === "past";
                  const isCurrent = row.status === "current";
                  const isFuture = row.status === "future";

                  return (
                    <li
                      key={`${row.order}-${row.exhibitId}`}
                      className={`px-4 py-3 flex flex-col gap-2 ${
                        isFuture && !isCurrent ? "opacity-80" : ""
                      } ${isCurrent ? "bg-[#2a2618]/80" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono text-[#8a8660] flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
                            <span className="font-bold">Visit {row.order}</span>
                            {row.time ? (
                              <span className="tabular-nums font-semibold">({row.time})</span>
                            ) : (
                              <span className="italic font-normal">(No time set)</span>
                            )}
                          </p>
                          <p
                            className={`font-semibold break-words ${
                              isCurrent ? "text-[#f7d000]" : "text-[#e8e0c8]"
                            }`}
                          >
                            {row.title}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {row.awardIds.map((aid) => {
                              const rubric = awardRubricUrlById(aid);
                              return (
                                <span
                                  key={aid}
                                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-[#2a2618] text-[#c8b860] border border-[#3d3620]"
                                >
                                  <span>{awardLabelById(aid)}</span>
                                  {rubric ? (
                                    <a
                                      href={rubric}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-normal underline text-[#f7d000]"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Form
                                    </a>
                                  ) : null}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        {isPast ? (
                          <span className="text-[10px] uppercase tracking-wider text-green-500 shrink-0">
                            Done
                          </span>
                        ) : null}
                        {isCurrent ? (
                          <span className="text-[10px] uppercase tracking-wider text-[#f7d000] shrink-0">
                            Here
                          </span>
                        ) : null}
                      </div>
                      {!isPast ? (
                        <button
                          type="button"
                          disabled={checkInWorking}
                          onClick={() => handleCheckIn(row)}
                          className={`w-full min-h-[48px] rounded-lg py-3 text-sm font-bold disabled:opacity-50 touch-manipulation active:opacity-90 ${
                            isCurrent
                              ? "bg-[#f7d000] text-black"
                              : "bg-[#3d3620] text-[#e8e0c8] border border-[#5c5338]"
                          }`}
                        >
                          {checkInWorking ? "Saving…" : "Check in"}
                        </button>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          <div className="mt-10 flex flex-col gap-2 text-center text-xs text-gray-600">
            <Link
              href={`/judging/${encodeURIComponent(gid)}`}
              className="underline underline-offset-2 hover:text-gray-900 py-2 touch-manipulation"
            >
              Wrong group? Enter PIN again
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
