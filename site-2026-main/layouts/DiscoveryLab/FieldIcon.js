// Animated icons for the Discovery Lab panel, one per field key (decorative; hidden from screen readers).
// Animations: "DiscoveryLab" in styles/direction-a.css.

const SVG = "h-56 w-56 md:h-64 md:w-64";

const TRACES = ["M70 85 L30 85 L30 50", "M70 115 L20 115", "M130 85 L170 85", "M130 115 L160 115 L160 160", "M85 70 L85 25", "M115 70 L115 40 L150 40", "M85 130 L85 175", "M115 130 L115 165 L60 165"];
const TRACE_DELAYS = ["0s", "-0.4s", "-0.8s", "-0.2s", "-0.6s", "-1s", "-0.3s", "-0.9s"];

const HEXES = [
  "100,78 119,89 119,111 100,122 81,111 81,89",
  "62,78 81,89 81,111 62,122 43,111 43,89",
  "138,78 157,89 157,111 138,122 119,111 119,89",
  "81,45 100,56 100,78 81,89 62,78 62,56",
  "119,45 138,56 138,78 119,89 100,78 100,56",
  "81,111 100,122 100,144 81,155 62,144 62,122",
  "119,111 138,122 138,144 119,155 100,144 100,122",
];
const ATOMS = [[100, 78, "0s"], [119, 111, "-0.6s"], [81, 89, "-1.2s"], [62, 122, "-0.3s"], [138, 56, "-1.6s"], [100, 144, "-0.9s"], [157, 89, "-1.9s"]];

const wave = (y) => `M-40 ${y} q10 -8 20 0` + " t20 0".repeat(13);

function Gear({ transform, arm, diag, ring, hub, spokeWidth, stroke, hubClass, reverse }) {
  return (
    <g transform={transform}>
      <g className={`da-lab-gear${reverse ? " da-lab-gear--reverse" : ""}`}>
        <g className={stroke} strokeWidth={spokeWidth}>
          <line x1="0" y1={-arm} x2="0" y2={arm} />
          <line x1={-arm} y1="0" x2={arm} y2="0" />
          <line x1={-diag} y1={-diag} x2={diag} y2={diag} />
          <line x1={-diag} y1={diag} x2={diag} y2={-diag} />
        </g>
        <circle r={ring} className={`fill-da-navy ${stroke}`} strokeWidth="2.5" />
        <circle r={hub} className={hubClass} />
      </g>
    </g>
  );
}

export default function FieldIcon({ field }) {
  switch (field) {
    case "aero":
      return (
        <svg aria-hidden="true" viewBox="0 0 200 200" className={SVG}>
          <ellipse cx="100" cy="100" rx="82" ry="82" fill="none" className="stroke-white/20" strokeWidth="2" strokeDasharray="6 8" />
          <g className="da-lab-orbit"><circle cx="182" cy="100" r="9" className="fill-da-orange-light" /></g>
          <g transform="translate(100 96) scale(2)">
            <g className="da-lab-rocket">
              <path className="da-lab-flame fill-da-orange" d="M-5 15 L0 32 L5 15 Z" />
              <path className="fill-white stroke-da-navy" strokeWidth="2" d="M0 -30 C11 -19 11 6 7 15 L-7 15 C-11 6 -11 -19 0 -30 Z" />
              <circle cx="0" cy="-8" r="4.5" className="fill-da-navy" />
              <path className="fill-da-orange" d="M-8 4 L-16 16 L-8 14 Z" />
              <path className="fill-da-orange" d="M8 4 L16 16 L8 14 Z" />
            </g>
          </g>
        </svg>
      );
    case "bio":
      return (
        <svg aria-hidden="true" viewBox="0 0 200 200" className={SVG}>
          <g transform="translate(10 100) scale(0.75)">
            <g className="stroke-white/30" strokeWidth="3">
              {[15, 45, 75, 105, 135, 165, 195, 225].map((x) => <line key={x} x1={x} y1="-14" x2={x} y2="14" />)}
            </g>
            <path className="da-lab-dna stroke-white" fill="none" strokeWidth="5" d="M0 0 C 20 -30, 40 30, 60 0 S 100 -30, 120 0 S 160 30, 180 0 S 220 -30, 240 0" />
            <path className="da-lab-dna stroke-da-orange-light" style={{ animationDirection: "reverse" }} fill="none" strokeWidth="5" d="M0 0 C 20 30, 40 -30, 60 0 S 100 30, 120 0 S 160 -30, 180 0 S 220 30, 240 0" />
          </g>
          <circle className="da-lab-spark fill-da-orange-light" cx="40" cy="40" r="8" />
          <circle className="da-lab-spark fill-white" cx="165" cy="160" r="6" style={{ animationDelay: "-1s" }} />
          <circle className="da-lab-spark fill-da-orange-light" cx="160" cy="45" r="5" style={{ animationDelay: "-0.5s" }} />
        </svg>
      );
    case "comp":
      return (
        <svg aria-hidden="true" viewBox="0 0 200 200" className={SVG}>
          <g fill="none" className="stroke-white/20" strokeWidth="3" strokeLinecap="round">
            {TRACES.map((d) => <path key={d} d={d} />)}
          </g>
          <g fill="none" className="stroke-da-orange-light" strokeWidth="3" strokeLinecap="round">
            {TRACES.map((d, i) => <path key={d} d={d} className="da-lab-trace" style={{ animationDelay: TRACE_DELAYS[i] }} />)}
          </g>
          <rect x="70" y="70" width="60" height="60" rx="6" className="fill-da-navy stroke-white" strokeWidth="3" />
          <rect className="da-lab-pulse fill-da-orange" x="86" y="86" width="28" height="28" rx="3" />
        </svg>
      );
    case "quant":
      return (
        <svg aria-hidden="true" viewBox="0 0 200 200" className={SVG}>
          <circle cx="100" cy="100" r="70" fill="none" className="stroke-white" strokeWidth="2.5" />
          <ellipse cx="100" cy="100" rx="70" ry="22" fill="none" className="stroke-white/50" strokeWidth="2" strokeDasharray="5 5" />
          <line x1="100" y1="30" x2="100" y2="170" className="stroke-white/30" strokeWidth="2" />
          <text x="100" y="20" textAnchor="middle" fontSize="15" className="font-label fill-white">|0⟩</text>
          <text x="100" y="192" textAnchor="middle" fontSize="15" className="font-label fill-white">|1⟩</text>
          <g className="da-lab-qubit">
            <line x1="100" y1="100" x2="146" y2="52" className="stroke-da-orange" strokeWidth="5" strokeLinecap="round" />
            <circle cx="146" cy="52" r="8" className="fill-da-orange" />
          </g>
          <circle cx="100" cy="100" r="5" className="fill-white" />
        </svg>
      );
    case "mat":
      return (
        <svg aria-hidden="true" viewBox="0 0 200 200" className={SVG}>
          <g transform="translate(100 100) scale(1.5) translate(-100 -100)">
            <g className="da-lab-spin-slow">
              <g fill="none" className="stroke-white" strokeWidth="2.5" strokeLinejoin="round">
                {HEXES.map((p) => <polygon key={p} points={p} />)}
              </g>
              {ATOMS.map(([cx, cy, delay]) => (
                <circle key={`${cx}-${cy}`} className="da-lab-spark fill-da-orange-light" cx={cx} cy={cy} r="4" style={{ animationDelay: delay }} />
              ))}
            </g>
          </g>
        </svg>
      );
    case "mech":
      return (
        <svg aria-hidden="true" viewBox="0 0 200 200" className={SVG}>
          <Gear transform="translate(82 112) scale(2.4)" arm={26} diag={18} ring={19} hub={6} spokeWidth={7} stroke="stroke-white" hubClass="fill-da-orange" />
          <Gear transform="translate(148 56) scale(1.9)" arm={16} diag={11} ring={11} hub={3} spokeWidth={5} stroke="stroke-da-orange-light" hubClass="fill-white" reverse />
        </svg>
      );
    case "civil":
      return (
        <svg aria-hidden="true" viewBox="0 0 200 200" className={SVG}>
          <defs>
            <clipPath id="da-lab-water"><rect x="0" y="140" width="200" height="60" /></clipPath>
          </defs>
          <g clipPath="url(#da-lab-water)">
            <g className="da-lab-waves">
              <path d={wave(160)} fill="none" className="stroke-white/40" strokeWidth="3" />
              <path d={wave(176)} fill="none" className="stroke-white/20" strokeWidth="3" />
            </g>
          </g>
          <rect x="52" y="50" width="8" height="98" className="fill-white" />
          <rect x="140" y="50" width="8" height="98" className="fill-white" />
          <path d="M14 120 L56 52 Q 100 118 144 52 L186 120" fill="none" className="stroke-da-orange-light" strokeWidth="3" />
          <g className="stroke-white/50" strokeWidth="2">
            {[[72, 72], [86, 84], [100, 88], [114, 84], [128, 72]].map(([x, y]) => <line key={x} x1={x} y1={y} x2={x} y2="120" />)}
          </g>
          <rect x="10" y="120" width="180" height="7" className="fill-white" />
          <g className="da-lab-deck-car"><rect x="16" y="110" width="22" height="10" rx="4" className="fill-da-orange" /></g>
        </svg>
      );
    case "plasma":
      return (
        <svg aria-hidden="true" viewBox="0 0 200 200" className={SVG}>
          <g transform="translate(100 100)">
            <g className="da-lab-atom">
              {[0, 60, 120].map((deg) => (
                <ellipse key={deg} cx="0" cy="0" rx="70" ry="24" fill="none" className="stroke-white" strokeWidth="2.5" transform={`rotate(${deg})`} />
              ))}
              <circle cx="70" cy="0" r="6" className="fill-da-orange-light" />
            </g>
            <circle className="da-lab-pulse fill-da-orange" cx="0" cy="0" r="16" />
          </g>
          <path className="da-lab-zap stroke-da-orange-light" d="M30 30 L60 62 L48 70 L78 90" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path className="da-lab-zap stroke-white" style={{ animationDelay: "-1.1s" }} d="M172 172 L140 140 L152 132 L122 112" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}
