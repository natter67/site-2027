import { useState } from "react";
import { DISCOVERY_FIELDS } from "@utilities/discoveryFields";

// Discovery Passport (home page): a front-end demo. Stamps live only in this page's memory;
// nothing is saved or connected to the EOH app yet. Draft copy (confirm with team before launch).
// Styles: "Passport" in styles/direction-a.css.

const BADGE_AT = 5;

export default function Passport() {
  const [stamps, setStamps] = useState({});
  const total = DISCOVERY_FIELDS.length;
  const count = DISCOVERY_FIELDS.filter((f) => stamps[f.key]).length;
  const toggle = (key) => setStamps((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 text-left sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <p className="max-w-xl flex-[1_1_420px] text-lg leading-relaxed">
          Every field you explore fills your tank. Tap the fields you’re curious about, and stamp five to unlock the{" "}
          <strong>Discovery Driver</strong> badge.
        </p>
        <div className="da-card flex-[1_1_320px] px-5 py-4">
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="font-label text-sm font-bold uppercase tracking-[0.1em]">Discovery fuel</span>
            <span className="font-display text-2xl">{count} / {total}</span>
          </div>
          <div
            role="progressbar"
            aria-label="Discovery fuel"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={count}
            className="relative h-[30px] overflow-hidden rounded-full border-[3px] border-da-navy bg-da-ground"
          >
            <div
              className={`da-passport-fuel h-full overflow-hidden bg-da-orange ${count ? "border-r-[3px] border-da-navy" : ""}`}
              style={{ width: `${(count / total) * 100}%` }}
            >
              <div className="da-passport-slosh" />
            </div>
          </div>
          <div aria-hidden="true" className="mt-1.5 flex justify-between font-label text-xs">
            <span>E</span>
            <span>½</span>
            <span>F</span>
          </div>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3.5">
        {DISCOVERY_FIELDS.map((f, i) => {
          const on = !!stamps[f.key];
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(f.key)}
              className={`flex min-h-[132px] flex-col items-start gap-1 rounded-2xl border-da-navy p-4 text-left text-da-navy transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-da-orange ${on ? `border-[3px] bg-da-orange ${i % 2 ? "rotate-3" : "-rotate-3"}` : "border-2 border-dashed bg-white"}`}
            >
              <span className="font-display text-4xl leading-none">{f.sym}</span>
              <span className="text-sm font-bold">{f.name}</span>
              <span className="mt-auto font-label text-xs">{on ? "Stamped ✓" : "Tap to stamp"}</span>
            </button>
          );
        })}
      </div>

      <div role="status" className="mt-5">
        {count >= BADGE_AT ? (
          <p className="rounded-2xl bg-da-navy px-5 py-4 text-white">
            <span className="font-display text-2xl uppercase text-da-orange-light">Discovery Driver unlocked!</span>{" "}
            <span className="text-base">You’ve stamped {count} fields of engineering.</span>
          </p>
        ) : (
          <p className="text-lg">
            <strong>{BADGE_AT - count} more</strong> to unlock the Discovery Driver badge.
          </p>
        )}
      </div>
    </div>
  );
}
