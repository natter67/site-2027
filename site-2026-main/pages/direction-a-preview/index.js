import Head from "next/head";
import MileSign from "@/mile-sign";
import RoadDivider from "@/road-divider";

// Dev-only style guide for the Direction A redesign: run `npm run dev` and open /direction-a-preview.
// Returns 404 in production builds, so it never appears on the live site.
export async function getStaticProps() {
  if (process.env.NODE_ENV === "production") return { notFound: true };
  return { props: {} };
}

const COLORS = [
  { name: "navy", hex: "#13294B", use: "Text, borders, dark sections" },
  { name: "orange", hex: "#FF5F05", use: "Buttons, accents (not small text on light)" },
  { name: "orange-light", hex: "#FF8A4C", use: "Orange text on navy" },
  { name: "orange-text", hex: "#B23A00", use: "Small orange text on light" },
  { name: "peach", hex: "#FFC7A6", use: "Soft card fill" },
  { name: "road", hex: "#3B4558", use: "Road bands" },
  { name: "slate", hex: "#8A94A8", use: "Posts, borders on navy (not text on light)" },
  { name: "ground", hex: "#ECECEC", use: "Page background with halftone dots" },
];

export default function DirectionAPreview() {
  return (
    <>
      <Head>
        <title>Direction A preview</title>
      </Head>
      <div className="da-ground mt-24 lg:mt-20 font-body text-da-navy">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="font-label text-sm font-bold uppercase tracking-[0.1em] text-da-orange-text">
            Dev only · 404 in production · Phase 1 building blocks
          </p>
          <h1 className="mt-2 font-display text-5xl uppercase leading-[0.95] sm:text-7xl">Direction A preview</h1>

          <h2 className="mt-12 font-display text-3xl uppercase">Colors</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COLORS.map((c) => (
              <div key={c.name} className="da-card overflow-hidden">
                <div className="h-20 border-b-2 border-da-navy" style={{ background: `var(--da-${c.name})` }} />
                <div className="p-4">
                  <p className="font-label text-sm font-bold uppercase">da-{c.name}</p>
                  <p className="font-label text-sm">{c.hex}</p>
                  <p className="mt-1 text-sm">{c.use}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="mt-12 font-display text-3xl uppercase">Type</h2>
          <div className="da-card mt-4 space-y-4 p-6">
            <p className="font-display text-5xl uppercase leading-[0.95] sm:text-6xl">
              Display · <span className="text-da-orange" style={{ WebkitTextStroke: "2px var(--da-navy)" }}>Anton</span>
            </p>
            <p className="text-lg leading-relaxed">Body · Archivo. The quick brown fox jumps over the lazy dog. 0123456789</p>
            <p className="font-label text-sm font-bold uppercase tracking-[0.1em]">Label · JetBrains Mono · F = ma</p>
          </div>

          <h2 className="mt-12 font-display text-3xl uppercase">Buttons</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            <button type="button" className="da-pill da-pill--primary">Primary pill</button>
            <button type="button" className="da-pill da-pill--secondary">Secondary pill</button>
            <button type="button" className="da-pill da-pill--navy">Navy pill</button>
          </div>

          <h2 className="mt-12 font-display text-3xl uppercase">Cards</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="da-card p-6">
              <p className="font-label text-xs font-bold uppercase text-da-orange-text">da-card</p>
              <p className="mt-2 font-display text-2xl uppercase">Static card</p>
              <p className="mt-2">White fill, 2px navy border, 18px radius.</p>
            </div>
            <div className="da-card da-card--lift p-6">
              <p className="font-label text-xs font-bold uppercase text-da-orange-text">da-card da-card--lift</p>
              <p className="mt-2 font-display text-2xl uppercase">Hover me</p>
              <p className="mt-2">Lifts with an orange offset shadow.</p>
            </div>
          </div>

          <h2 className="mt-12 font-display text-3xl uppercase">Mile signs</h2>
          <div className="mt-4 flex flex-wrap items-start gap-8">
            <MileSign>MILE 01 · AWARDS</MileSign>
            <MileSign tone="orange">MILE 10 · DESTINATION</MileSign>
            <div className="rounded-2xl bg-da-navy p-6">
              <MileSign tone="white">MILE 03 · KEYNOTES</MileSign>
            </div>
          </div>
        </div>

        <RoadDivider />
        <div className="h-8" />
        <RoadDivider car="orange" />
        <div className="h-12" />
      </div>
    </>
  );
}
