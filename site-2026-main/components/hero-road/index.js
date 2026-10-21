import { useState } from "react";

// The road under the home hero: a white "2027" car drives the winding road while signposts pop as it passes.
// Purely visual (no data). Styles and animation: "HeroRoad" in styles/direction-a.css; with reduced motion
// the car is parked and the "Hit the gas" button is hidden.

// Must match offset-path on .da-drive__car in styles/direction-a.css
const ROAD = "M -140 160 C 200 160, 330 70, 620 95 S 1020 215, 1280 150 S 1480 80, 1620 90";

// Draft labels (confirm with team). delay = -(1 - position along road) x 11s, so each pops as the car arrives.
const SIGNS = [
  { x: 330, y: 8, width: 104, post: 64, label: "Exhibits", tone: "white", delay: "-8.1s" },
  { x: 700, y: 4, width: 92, post: 70, label: "Shows", tone: "orange", delay: "-5.7s" },
  { x: 1020, y: 40, width: 108, post: 80, label: "Startups", tone: "white", delay: "-3.6s" },
  { x: 1330, y: 0, width: 116, post: 62, label: "Keynotes", tone: "navy", delay: "-1.7s" },
];

const SIGN_TONES = {
  white: { plate: "fill-white", text: "fill-da-navy" },
  orange: { plate: "fill-da-orange", text: "fill-da-navy" },
  navy: { plate: "fill-da-navy", text: "fill-white" },
};

function Wheel({ x }) {
  return (
    <g className="da-drive__wheel">
      <circle className="fill-da-navy" cx={x} cy="-12" r="13" />
      <circle className="fill-da-slate" cx={x} cy="-12" r="6" />
      <line className="stroke-da-ground" x1={x} y1="-22" x2={x} y2="-2" strokeWidth="2" />
    </g>
  );
}

export default function HeroRoad() {
  const [fast, setFast] = useState(false);

  return (
    <div>
      <div className="da-drive__gas mx-auto mt-6 flex max-w-7xl justify-start px-4 sm:px-6">
        <button
          type="button"
          aria-pressed={fast}
          onClick={() => setFast(!fast)}
          className={`rounded-full border-2 border-dashed border-da-navy px-4 py-2 font-body text-sm font-bold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-da-orange ${fast ? "bg-da-navy text-white" : "text-da-navy"}`}
        >
          Hit the gas
        </button>
      </div>

      <svg
        className="da-drive"
        viewBox="0 0 1440 240"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="A white car with a 2027 license plate drives along a winding road past signposts for exhibits, shows, startups and keynotes"
      >
        <path d={ROAD} fill="none" className="stroke-da-navy" strokeWidth="84" strokeLinecap="round" />
        <path d={ROAD} fill="none" className="stroke-da-road" strokeWidth="72" />
        <path d={ROAD} fill="none" className="da-drive__lane stroke-da-orange" strokeWidth="5" strokeDasharray="30 20" />

        {SIGNS.map((s) => (
          <g key={s.label} transform={`translate(${s.x} ${s.y})`}>
            <g className="da-drive__sign" style={{ animationDelay: s.delay }}>
              <line className="stroke-da-navy" x1="0" y1="40" x2="0" y2={s.post} strokeWidth="3" />
              <rect className={`${SIGN_TONES[s.tone].plate} stroke-da-navy`} x={-s.width / 2} y="0" width={s.width} height="40" rx="20" strokeWidth="3" />
              <text className={`font-display uppercase ${SIGN_TONES[s.tone].text}`} x="0" y="26" textAnchor="middle" fontSize="18">
                {s.label}
              </text>
            </g>
          </g>
        ))}

        <g className="da-drive__car" style={fast ? { animationDuration: "3.14s" } : undefined}>
          <g className="da-drive__trail">
            <text className="font-label fill-da-orange" x="-80" y="-30" fontSize="16" fontWeight="700">π</text>
          </g>
          <g className="da-drive__trail" style={{ animationDelay: "0.4s" }}>
            <text className="font-label fill-da-navy" x="-82" y="-16" fontSize="14" fontWeight="700">Σ</text>
          </g>
          <g className="da-drive__trail" style={{ animationDelay: "0.8s" }}>
            <circle className="fill-da-orange" cx="-80" cy="-24" r="4" />
          </g>
          <g className="da-drive__trail" style={{ animationDelay: "1.2s" }}>
            <text className="font-label fill-da-navy" x="-82" y="-36" fontSize="14" fontWeight="700">Δ</text>
          </g>

          <g className="da-drive__chassis">
            <polygon points="78,-30 150,-48 150,-6" fill="#FFE7A8" opacity=".35" />
            <path
              className="fill-white stroke-da-navy"
              strokeWidth="3"
              strokeLinejoin="round"
              d="M-75 -14 L-74 -30 C-72 -38 -60 -42 -45 -44 L-25 -46 C-12 -60 10 -64 28 -60 C42 -56 52 -48 60 -44 C70 -42 76 -36 78 -26 L78 -14 Z"
            />
            <path className="fill-da-navy" d="M-18 -47 C-8 -57 10 -59 24 -56 C34 -53 42 -49 48 -46 L-18 -46 Z" />
            <line className="stroke-da-orange" x1="-70" y1="-26" x2="74" y2="-26" strokeWidth="3" />
            <rect className="fill-da-orange" x="-78" y="-36" width="7" height="7" rx="2" />
            <rect className="stroke-da-navy" x="72" y="-33" width="7" height="5" rx="2" fill="#FFE7A8" strokeWidth="1.5" />
            <rect className="fill-white stroke-da-navy" x="-14" y="-24" width="30" height="10" rx="2" strokeWidth="1.5" />
            <text className="font-label fill-da-navy" x="1" y="-16" textAnchor="middle" fontSize="8" fontWeight="700">2027</text>
          </g>
          <Wheel x={-46} />
          <Wheel x={48} />
        </g>
      </svg>
    </div>
  );
}
