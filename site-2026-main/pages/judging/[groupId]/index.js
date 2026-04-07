import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc, firestore } from "utilities/firebase";
import {
  normalizeGroupId,
  verifyGroupPin,
  writeJudgingGroupSession,
  clearJudgingGroupSession,
} from "@utilities/judging";

export default function JudgingGroupPinPage() {
  const router = useRouter();
  const { groupId: rawGroupId } = router.query;
  const groupId = normalizeGroupId(typeof rawGroupId === "string" ? rawGroupId : "");

  const [label, setLabel] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!router.isReady || !groupId) return;

    const run = async () => {
      setError("");
      try {
        const snap = await getDoc(doc(firestore, "judgingGroups", groupId));
        if (!snap.exists()) {
          setError("This judging group was not found. Check the link you were given.");
          setReady(true);
          return;
        }
        const d = snap.data() || {};
        setLabel((d.label || "").trim() || `Group ${groupId}`);
        setReady(true);
      } catch (e) {
        console.error(e);
        setError("Could not load judging group.");
        setReady(true);
      }
    };
    run();
  }, [router.isReady, groupId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!groupId) return;
    setBusy(true);
    setError("");
    try {
      const snap = await getDoc(doc(firestore, "judgingGroups", groupId));
      if (!snap.exists()) {
        setError("Group not found.");
        return;
      }
      const pinSha256 = snap.data()?.pinSha256 || "";
      const ok = await verifyGroupPin({ groupId, pin, pinSha256 });
      if (!ok) {
        setError("Incorrect PIN.");
        return;
      }
      writeJudgingGroupSession(groupId);
      router.push("/judging/run");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!router.isReady || !ready) {
    return (
      <div className="min-h-screen bg-[#12100c] flex items-center justify-center px-3 sm:px-4">
        <p className="text-[#c8b860] font-semibold">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Judging · {label || groupId}</title>
      </Head>
      <div
        className="min-h-screen bg-[#12100c] flex flex-col items-center justify-center px-3 sm:px-4 py-12 sm:py-16"
        style={{ paddingBottom: "max(3rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="w-full max-w-md min-w-0 rounded-2xl border border-[#2f2a18] bg-[#1a1812] p-5 sm:p-6 shadow-2xl">
          <h1 className="text-xl sm:text-2xl font-black text-[#f7d000] tracking-tight">EOH Judging</h1>
          <p className="text-sm text-[#a09870] mt-2 break-words">
            <span className="text-[#e8e0c8]">{label}</span>
            <span className="text-[#6a6348]"> · </span>
            <span className="font-mono text-[#e8e0c8]">{groupId}</span>
          </p>
          <p className="text-sm text-[#d4ccb0] mt-4">
            Enter the PIN you were given. You&apos;ll see your group&apos;s route and check in at each stop in
            order—no poster codes needed.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#8a8660]">
              PIN
              <input
                type="password"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="mt-2 w-full rounded-xl border border-[#3d3620] bg-[#12100c] px-4 py-3 text-lg text-white font-mono tracking-widest focus:border-[#f7d000] focus:outline-none"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </label>
            {error ? (
              <p className="text-sm text-red-400 font-semibold">{error}</p>
            ) : null}
            <button
              type="submit"
              disabled={busy || !pin.trim()}
              className="w-full min-h-[48px] rounded-xl bg-[#f7d000] py-3.5 text-sm font-black text-black shadow-lg disabled:opacity-50 active:opacity-90 touch-manipulation"
            >
              {busy ? "Checking…" : "Continue"}
            </button>
          </form>

          <button
            type="button"
            className="mt-6 text-xs text-[#6a6348] underline w-full text-center"
            onClick={() => {
              clearJudgingGroupSession();
              setPin("");
            }}
          >
            Clear saved session on this device
          </button>
        </div>
    </div>
    </>
  );
}
