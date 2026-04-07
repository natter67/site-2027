import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { readJudgingGroupSession } from "@utilities/judging";

/** Legacy “ready” page: forwards to /judging/run when a session exists. */
export default function JudgingWelcomePage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const s = readJudgingGroupSession();
    if (s?.groupId) router.replace("/judging/run");
  }, [router, router.isReady]);

  const session = typeof window !== "undefined" ? readJudgingGroupSession() : null;
  const gid = session?.groupId || "";

  return (
    <>
      <Head>
        <title>Judging · Ready</title>
      </Head>
      <div
        className="min-h-screen bg-[#12100c] flex flex-col items-center justify-center px-3 sm:px-4 py-12 sm:py-16"
        style={{ paddingBottom: "max(3rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="w-full max-w-md min-w-0 rounded-2xl border border-[#2f2a18] bg-[#1a1812] p-5 sm:p-6 shadow-2xl text-center">
          <h1 className="text-xl font-black text-[#f7d000] tracking-tight">Judging</h1>
          {gid ? (
            <>
              <p className="text-sm text-[#d4ccb0] mt-3">Taking you to your route…</p>
              <Link
                href="/judging/run"
                className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#f7d000] px-6 py-3 text-sm font-black text-black touch-manipulation"
              >
                Open my route
              </Link>
            </>
          ) : (
            <p className="text-sm text-amber-200 mt-3">
              No active group on this device. Open your group link and enter your PIN first.
            </p>
          )}
          {gid ? (
            <Link
              href={`/judging/${encodeURIComponent(gid)}`}
              className="mt-6 block text-xs text-[#6a6348] underline"
            >
              Wrong group? Enter PIN again
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
}
