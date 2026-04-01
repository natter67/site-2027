import { useEffect, useMemo, useRef, useState } from "react";
import { Bus, Footprints, Hourglass, Star, Ticket, X } from "lucide-react";

/** Match reference MTD-style palette */
const BG = "#12100c";
const OLIVE_PANEL = "#2a2618";
const YELLOW = "#f7d000";
const YELLOW_DIM = "#c9a000";
const INACTIVE_CHIP_BG = "#3d3824";
const INACTIVE_CHIP_TEXT = "#f0d030";
const LINE = "#f7d000";
const PILL_BG = "#2a2618";

const ROUTE_DOT_COLORS = [
  "#e53935",
  "#1e88e5",
  "#43a047",
  "#fb8c00",
  "#8e24aa",
  "#00acc1",
];

function MtdRouteCard({ block, onRefresh, onClose }) {
  const { timeline, label, stats, groupShort } = block;
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
    let n = timeline.filter((s) => s.status === "past").length;
    if (timeline.some((s) => s.status === "here")) n += 1;
    return n;
  }, [timeline]);

  const total = timeline.length || 1;
  const progressPct = Math.min(100, Math.round((doneCount / total) * 100));
  const starReadout = `${doneCount}/${total}`;
  const ticketReadout = groupShort || "EOH";

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
      {/* Top bar: close */}
      <div className="flex justify-end px-3 pt-3 pb-1">
        <button
          type="button"
          onClick={onClose}
          className="h-10 w-10 rounded-full bg-[#d32f2f] text-white flex items-center justify-center shadow-md active:scale-95"
          aria-label="Close"
        >
          <X className="h-5 w-5 stroke-[3]" />
        </button>
      </div>

      {/* Horizontal “calendar” — scheduled arrival times */}
      <div className="px-2 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory">
          {timeline.map((stop, i) => {
            const active = i === selectedIdx;
            const timeStr = stop.time && stop.time !== "—" ? stop.time : `Stop ${i + 1}`;
            return (
              <button
                key={`chip-${i}`}
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                type="button"
                onClick={() => {
                  setSelectedIdx(i);
                  scrollToRow(i);
                }}
                className={`snap-start shrink-0 flex flex-col items-center justify-center rounded-2xl border-2 transition-transform active:scale-[0.98] ${
                  active
                    ? "border-black/20 min-w-[7.5rem] px-4 py-3"
                    : "border-transparent min-w-[5.5rem] px-3 py-2"
                }`}
                style={
                  active
                    ? { backgroundColor: YELLOW, color: "#111" }
                    : { backgroundColor: INACTIVE_CHIP_BG, color: INACTIVE_CHIP_TEXT }
                }
              >
                <span
                  className={`font-black tabular-nums leading-none ${
                    active ? "text-2xl sm:text-3xl" : "text-sm font-bold"
                  }`}
                >
                  {timeStr}
                </span>
                <span
                  className={`mt-1 font-black uppercase tracking-wide ${
                    active ? "text-[10px] text-black" : "text-[9px] opacity-80"
                  }`}
                >
                  Scheduled
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Award label */}
      <div className="px-4 pb-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#a09870]">{label}</p>
      </div>

      {/* Three stat pills (reference: star / hourglass / ticket) */}
      <div className="px-3 pb-4 flex gap-2 justify-center flex-wrap">
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold border border-[#3d3620]"
          style={{ backgroundColor: PILL_BG, color: YELLOW_DIM }}
        >
          <Star className="h-3.5 w-3.5 shrink-0 fill-current" />
          <span className="tabular-nums">{stats?.starLabel ?? starReadout}</span>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold border border-[#3d3620]"
          style={{ backgroundColor: PILL_BG, color: YELLOW_DIM }}
        >
          <Hourglass className="h-3.5 w-3.5 shrink-0" />
          <span className="tabular-nums">{stats?.hourglassLabel ?? `${progressPct}%`}</span>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold border border-[#3d3620]"
          style={{ backgroundColor: PILL_BG, color: YELLOW_DIM }}
        >
          <Ticket className="h-3.5 w-3.5 shrink-0" />
          <span className="tabular-nums">{stats?.ticketLabel ?? ticketReadout}</span>
        </div>
      </div>

      {/* Vertical route — thick yellow line, white nodes */}
      <div className="relative px-4 pb-6">
        <div
          className="absolute left-[23px] top-2 bottom-10 w-1.5 rounded-full z-0"
          style={{ backgroundColor: LINE }}
        />

        <div className="relative z-[1] flex flex-col">
          {timeline.map((stop, i) => {
            const isHere = stop.status === "here";
            const isNext = stop.status === "next";
            const badges = stop.routeBadges || [{ n: String(i + 1), color: ROUTE_DOT_COLORS[i % ROUTE_DOT_COLORS.length] }];

            return (
              <div
                key={`row-${i}`}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className="relative flex gap-0 min-h-[4.5rem] pl-0"
              >
                {/* White dot on spine */}
                <div className="w-[52px] shrink-0 flex justify-center pt-2">
                  <div
                    className="h-4 w-4 rounded-full bg-white border-[3px] z-10 shadow-sm"
                    style={{ borderColor: LINE }}
                  />
                </div>

                <div className="flex-1 min-w-0 pr-1 pb-6 border-b border-white/5 last:border-0">
                  <div className="flex justify-between gap-3 items-start">
                    <div className="min-w-0 flex-1">
                      {stop.isViewerStop && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#c8c878] mb-1">
                          <Footprints className="h-3.5 w-3.5 shrink-0" />
                          <span>Your exhibit</span>
                        </div>
                      )}
                      <h3
                        className={`text-[17px] leading-snug font-black tracking-tight ${
                          isHere ? "text-[#f7d000]" : "text-white"
                        }`}
                      >
                        {stop.title}
                      </h3>
                      {stop.subtitle ? (
                        <p className="text-xs font-semibold text-[#9a9478] mt-0.5">{stop.subtitle}</p>
                      ) : null}

                      {/* Bus icon + colored route circles (reference) */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Bus className="h-4 w-4 text-[#a09870] shrink-0" strokeWidth={2.5} />
                        {badges.map((b) => (
                          <span
                            key={b.n}
                            className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full px-1.5 text-xs font-black text-white shadow-sm border border-black/20"
                            style={{ backgroundColor: b.color }}
                          >
                            {b.n}
                          </span>
                        ))}
                      </div>

                      {stop.etaNote ? (
                        <p className="text-[11px] font-semibold text-[#8a8660] mt-2">{stop.etaNote}</p>
                      ) : null}
                    </div>

                    <div className="shrink-0 text-right pt-0.5">
                      <p className="text-base font-black tabular-nums" style={{ color: YELLOW }}>
                        {stop.time && stop.time !== "—" ? stop.time : "—"}
                      </p>
                      {isHere && (
                        <p className="text-[10px] font-black uppercase text-[#f7d000] mt-1">Here</p>
                      )}
                      {isNext && !isHere && (
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

      {/* Bottom yellow bar — logo + action */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-t-2xl"
        style={{ backgroundColor: YELLOW, color: "#111" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-black text-lg tracking-tighter shrink-0">EOH</span>
          <span className="text-[10px] font-bold uppercase opacity-70 truncate">Judging</span>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="shrink-0 rounded-xl bg-black px-5 py-2.5 text-sm font-black text-[#f7d000] shadow-md active:scale-[0.98]"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

/**
 * MTD-style bus schedule for exhibitors.
 * `rows`: [{ awardId, label, timeline, stats?, groupShort? }]
 * timeline entries: { title, subtitle, time, status, etaNote?, isViewerStop?, routeBadges?: [{n, color}] }
 */
export default function ExhibitorBusSchedule({ rows, loading, onRefresh, onClose }) {
  const handleClose = onClose || (() => {});

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

  return (
    <div className="flex flex-col gap-8 w-full max-w-[430px] mx-auto">
      {rows.map((block) => (
        <MtdRouteCard
          key={block.awardId}
          block={block}
          onRefresh={onRefresh || (() => {})}
          onClose={handleClose}
        />
      ))}
    </div>
  );
}
