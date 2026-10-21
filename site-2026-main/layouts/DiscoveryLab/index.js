import { useState } from "react";
import { DISCOVERY_FIELDS } from "@utilities/discoveryFields";
import FieldIcon from "./FieldIcon";

// Discovery Lab field explorer (home page). Draft content lives in utilities/discoveryFields.js.
// Styles and animations: "DiscoveryLab" in styles/direction-a.css (all motion stops with reduced motion).

// Decorative formulas drifting in the background (draft)
const FORMULAS = [
  { text: "F = ma", className: "left-[4%] top-[3%] text-3xl" },
  { text: "E = mc²", className: "right-[6%] top-[8%] text-3xl", delay: "-2s" },
  { text: "∇ × E = −∂B/∂t", className: "left-[2%] top-[58%] text-2xl", delay: "-4s" },
  { text: "PV = nRT", className: "bottom-[3%] right-[4%] text-3xl", delay: "-1s" },
  { text: "|ψ⟩ = α|0⟩ + β|1⟩", className: "right-[30%] top-[40%] text-2xl", delay: "-3s" },
];

const LABEL = "font-label text-xs font-bold uppercase tracking-[0.1em] text-da-orange-light";

export default function DiscoveryLab() {
  const [current, setCurrent] = useState(DISCOVERY_FIELDS[0].key);
  const index = DISCOVERY_FIELDS.findIndex((f) => f.key === current);
  const field = DISCOVERY_FIELDS[index];
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="relative overflow-hidden text-left">
      <div aria-hidden="true">
        {FORMULAS.map((f) => (
          <span key={f.text} className={`da-lab-drift ${f.className}`} style={f.delay ? { animationDelay: f.delay } : undefined}>
            {f.text}
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-white/80">
          Eight fields of engineering and science. Each one asks a big question, and each one has exhibits waiting at EOH.
        </p>

        <div role="group" aria-label="Fields of engineering" className="mt-8 flex flex-wrap justify-center gap-2.5">
          {DISCOVERY_FIELDS.map((f) => {
            const on = f.key === current;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={on}
                aria-controls="discovery-lab-panel"
                onClick={() => setCurrent(f.key)}
                className={`rounded-full border-2 border-da-orange-light px-4 py-2.5 text-[15px] font-bold transition-transform hover:-translate-y-0.5 motion-reduce:transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white ${on ? "bg-da-orange text-da-navy" : "text-white"}`}
              >
                <span className="mr-1.5 font-display text-[17px] font-normal">{f.sym}</span>
                {f.name}
              </button>
            );
          })}
        </div>

        <div id="discovery-lab-panel" className="mt-8 grid grid-cols-1 items-stretch gap-7 md:grid-cols-2">
          <div className="relative flex min-h-[300px] items-center justify-center rounded-3xl border-2 border-white/20 bg-black/30">
            <span aria-hidden="true" className="absolute left-5 top-4 font-display text-6xl leading-none text-da-orange">{field.sym}</span>
            <span aria-hidden="true" className="absolute right-5 top-6 font-label text-sm text-white/60">
              {pad(index + 1)} / {pad(DISCOVERY_FIELDS.length)}
            </span>
            <FieldIcon field={field.key} />
          </div>

          <div aria-live="polite">
            <div key={field.key} className="da-lab-panel-in flex h-full flex-col justify-center gap-5">
              <h3 className="font-display text-4xl uppercase leading-none md:text-5xl">{field.name}</h3>
              <div>
                <p className={LABEL}>The big question</p>
                <p className="mt-1.5 text-2xl font-bold leading-snug">{field.question}</p>
              </div>
              <div>
                <p className={LABEL}>Did you know?</p>
                <p className="mt-1.5 text-lg leading-relaxed text-white/80">{field.fact}</p>
              </div>
              <div>
                <p className={LABEL}>Find it at EOH</p>
                <p className="mt-1.5 text-lg leading-relaxed text-white/80">{field.look}</p>
              </div>
              <a href="/vv?t=exhibits" className="da-pill da-pill--primary self-start">
                Browse exhibits in Visitor View
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
