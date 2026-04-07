import { useEffect, useMemo, useRef, useState } from "react";
import { Bus, Hourglass } from "lucide-react";

/** Match reference MTD-style palette */
const BG = "#12100c";
const YELLOW = "#f7d000";
const YELLOW_DIM = "#c9a000";
const LINE = "#f7d000";
const LINE_DONE = "#22c55e";
const INACTIVE_CHIP_BG = "#3d3824";
const INACTIVE_CHIP_TEXT = "#f0d030";
const PILL_BG = "#2a2618";

const ROUTE_DOT_COLORS = [
  "#e53935",
  "#1e88e5",
  "#43a047",
  "#fb8c00",
  "#8e24aa",
  "#00acc1",
];

function MtdRouteCard({ block, onRefresh }) {
  const { timeline, label } = block;
  const rowRefs = useRef({});

  const activeChipIndex = useMemo(() => {
    const i = timeline.findIndex((s) => s.status === "here" || s.status === "next");
    return i >= 0 ? i : 0;
  }, [timeline]);

  const [selectedIdx, setSelectedIdx] = useState(activeChipIndex);
  const chipRefs = useRef({});

  useEffect(() => {
    setSelectedIdx(activeChipIndex);
  }, [activeChipIndex, timeline]);

  useEffect(() => {
    const el = chipRefs.current[selectedIdx];
    if (el?.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [selectedIdx, timeline.length]);

  const doneCount = useMemo(() => {
    return (
      timeline.filter((s) => s.status === "past").length + timeline.filter((s) => s.status === "here").length
    );
  }, [timeline]);

  const total = timeline.length || 1;
  const progressReadout = `${doneCount}/${total}`;
  const exhibitName = useMemo(() => {
    const t = timeline[0]?.title;
    return typeof t === "string" && t.trim() ? t.trim() : "";
  }, [timeline]);

  const exhibitLocation = useMemo(() => {
    const s = timeline[0]?.subtitle;
    return typeof s === "string" && s.trim() ? s.trim() : "";
  }, [timeline]);

  /** Spine fill + lone dot position track hourglass progress (each judging-group row counts). */
  const progressFraction = useMemo(() => {
    const n = timeline.length;
    if (n === 0) return 0;
    return Math.min(1, Math.max(0, doneCount / n));
  }, [timeline.length, doneCount]);
  const spineGreenPct = progressFraction * 100;
  const dotTopPct = progressFraction * 100;
  const dotBorderColor = doneCount >= timeline.length && timeline.length > 0 ? LINE_DONE : YELLOW;

  const scrollToRow = (idx) => {
    const el = rowRefs.current[idx];
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl border border-[#2f2a18]"
      style={{ backgroundColor: BG, color: "#fff" }}
    >
      {/* Horizontal strip — equal-width chips (time vs "Stop n" uses same cell) */}
      <div className="px-2 pb-2 pt-3">
        <div
          className={`flex gap-2 pb-3 pt-1 snap-x snap-mandatory overscroll-x-contain [-webkit-overflow-scrolling:touch] ${
            timeline.length <= 4 ? "w-full" : "overflow-x-auto"
          }`}
        >
          {timeline.map((stop, i) => {
            const active = i === selectedIdx;
            const isPast = stop.status === "past";
            const isHereChip = stop.status === "here";
            const chipDone = isPast || isHereChip;
            const timeStr = stop.time && stop.time !== "—" ? stop.time : `Stop ${i + 1}`;
            const chipKey =
              stop.judgingGroupId != null && stop.stopOrder != null
                ? `chip-${stop.judgingGroupId}-${stop.stopOrder}`
                : stop.stopOrder != null
                  ? `chip-${stop.stopOrder}`
                  : `chip-${i}`;
            return (
              <button
                key={chipKey}
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                type="button"
                onClick={() => {
                  setSelectedIdx(i);
                  scrollToRow(i);
                }}
                className={`snap-start touch-manipulation box-border flex h-[4.75rem] flex-col items-center justify-center rounded-2xl border-2 px-2 py-2 text-center active:scale-[0.98] transition-[opacity,transform,background-color,color,border-color] duration-200 ease-out ${
                  timeline.length <= 4
                    ? "min-w-0 flex-1 basis-0"
                    : "w-[7rem] shrink-0"
                } ${active ? "border-black/25 shadow-md" : "border-transparent"} ${
                  chipDone ? "opacity-80" : "opacity-100"
                }`}
                style={
                  active
                    ? { backgroundColor: YELLOW, color: "#111" }
                    : { backgroundColor: INACTIVE_CHIP_BG, color: INACTIVE_CHIP_TEXT }
                }
              >
                <span
                  className={`flex min-h-[2.25rem] w-full items-center justify-center break-words font-black tabular-nums leading-tight ${
                    active ? "text-[1.05rem] sm:text-[1.1rem]" : "text-[0.95rem] sm:text-[1rem]"
                  }`}
                >
                  {timeStr}
                </span>
                <span
                  className={`mt-1 font-black uppercase tracking-wide text-[9px] leading-none ${
                    active ? "text-black/90" : "opacity-85"
                  }`}
                >
                  {isPast ? "Visited" : isHereChip ? "Done" : "Scheduled"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {label?.trim() ? (
        <div className="px-4 pb-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#a09870]">{label}</p>
        </div>
      ) : (
        <div className="px-4 pb-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#a09870]">Your route</p>
        </div>
      )}

      <div className="px-3 sm:px-4 pb-3 text-center">
        {exhibitName ? (
          <p className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight break-words px-1">
            {exhibitName}
          </p>
        ) : null}
        {exhibitLocation ? (
          <p className="text-sm text-[#d4ccb0] mt-1.5 font-medium">{exhibitLocation}</p>
        ) : null}
      </div>

      <div className="px-3 pb-4 flex justify-center">
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold border border-[#3d3620]"
          style={{ backgroundColor: PILL_BG, color: YELLOW_DIM }}
        >
          <Hourglass className="h-3.5 w-3.5 shrink-0" />
          <span className="tabular-nums">{progressReadout}</span>
        </div>
      </div>

      {/* Vertical route — one spine + single dot that slides down with progress */}
      <div className="relative px-4 pb-6">
        <div
          className="pointer-events-none absolute left-[23px] top-4 z-0 w-1.5 rounded-full transition-[background] duration-700 ease-out"
          style={{
            bottom: "3.25rem",
            background: `linear-gradient(to bottom, ${LINE_DONE} 0%, ${LINE_DONE} ${spineGreenPct}%, ${LINE} ${spineGreenPct}%, ${LINE} 100%)`,
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-[23px] top-4 z-[2] w-1.5"
          style={{ bottom: "3.25rem" }}
          aria-hidden
        >
          <div
            className="absolute h-4 w-4 rounded-full border-[3px] bg-white shadow-md transition-[top] duration-700 ease-out"
            style={{
              top: `${dotTopPct}%`,
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderColor: dotBorderColor,
            }}
          />
        </div>

        <div className="relative z-[1] flex flex-col">
          {timeline.map((stop, i) => {
            const isHere = stop.status === "here";
            const isNext = stop.status === "next";
            const isPast = stop.status === "past";
            const spineDone = isPast || isHere;
            const badges = stop.routeBadges || [];

            return (
              <div
                key={
                  stop.judgingGroupId != null && stop.stopOrder != null
                    ? `row-${stop.judgingGroupId}-${stop.stopOrder}`
                    : stop.stopOrder != null
                      ? `row-${stop.stopOrder}`
                      : `row-${i}`
                }
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className="relative flex gap-0 min-h-[4.5rem] pl-0"
              >
                <div className="w-10 shrink-0" aria-hidden />

                <div className="flex-1 min-w-0 pr-1 pb-6 border-b border-white/5 last:border-0">
                  <div className="flex justify-between gap-3 items-start">
                    <div className="min-w-0 flex-1">
                      {stop.judgingGroupId ? (
                        <p className="text-[11px] font-bold text-[#c8c878] mb-2">
                          Judging group <span className="font-mono text-[#f7d000]">{stop.judgingGroupId}</span>
                        </p>
                      ) : null}

                      <div className="flex items-center gap-2 flex-wrap">
                        <Bus className="h-4 w-4 text-[#a09870] shrink-0" strokeWidth={2.5} />
                        {badges.map((b, bi) => {
                          const text = b.label ?? b.n ?? "";
                          if (!text) return null;
                          return (
                            <span
                              key={`${text}-${bi}`}
                              className="inline-flex max-w-[11rem] items-center justify-center rounded-full px-2 py-1 text-[10px] font-bold text-white text-center leading-snug shadow-sm border border-black/20"
                              style={{ backgroundColor: b.color || ROUTE_DOT_COLORS[bi % ROUTE_DOT_COLORS.length] }}
                            >
                              {text}
                            </span>
                          );
                        })}
                      </div>

                      {stop.etaNote ? (
                        <p className="text-[11px] font-semibold text-[#8a8660] mt-2">{stop.etaNote}</p>
                      ) : null}
                    </div>

                    <div className="shrink-0 text-right pt-0.5">
                      <p
                        className="text-base font-black tabular-nums transition-colors duration-500"
                        style={{
                          color: spineDone ? LINE_DONE : YELLOW,
                        }}
                      >
                        {stop.time && stop.time !== "—" ? stop.time : "—"}
                      </p>
                      {(isHere || isPast) && (
                        <p
                          className="text-[10px] font-black uppercase mt-1"
                          style={{ color: LINE_DONE }}
                        >
                          Done
                        </p>
                      )}
                      {isNext && !isHere && !isPast && (
                        <p className="text-[10px] font-black uppercase text-[#c8b860] mt-1">Next</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-3 sm:px-4 py-3.5 rounded-t-2xl"
        style={{ backgroundColor: YELLOW, color: "#111" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-black text-sm sm:text-base tracking-tight truncate">Judging Schedule</span>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="shrink-0 w-full sm:w-auto min-h-[44px] rounded-xl bg-black px-5 py-2.5 text-sm font-black text-[#f7d000] shadow-md active:scale-[0.98] touch-manipulation"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

/**
 * MTD-style bus schedule for exhibitors (single merged route).
 * `rows`: [{ label?, timeline }]
 * timeline: { stopOrder?, title, subtitle, time, status, isViewerStop?, routeBadges?: { label, color }[], etaNote? }
 */
export default function ExhibitorBusSchedule({ rows, loading, onRefresh }) {
  if (loading) {
    return (
      <div
        className="rounded-2xl p-8 text-center border border-[#2f2a18]"
        style={{ backgroundColor: BG, color: "#a09870" }}
      >
        <p className="text-sm font-bold">Loading route…</p>
      </div>
    );
  }

  if (!rows?.length) {
    return (
      <div
        className="rounded-2xl p-6 text-center border border-[#2f2a18]"
        style={{ backgroundColor: BG, color: "#a09870" }}
      >
        <p className="text-sm font-bold">No route data for this exhibit yet.</p>
      </div>
    );
  }

  const block = rows[0];
  return (
    <div className="w-full max-w-[min(430px,100%)] mx-auto min-w-0">
      <MtdRouteCard block={block} onRefresh={onRefresh || (() => {})} />
    </div>
  );
}
