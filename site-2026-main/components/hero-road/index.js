// The road under the home hero: a white sports car, like the one in the official logo, drives the
// winding road from right to left (the logo's direction of travel). The road itself stays still.
// Purely visual (no data). Styles and animation: "HeroRoad" in styles/direction-a.css; with reduced
// motion the car is parked mid-road.

// Must match offset-path on .da-drive__car in styles/direction-a.css
const ROAD = "M -140 160 C 200 160, 330 70, 620 95 S 1020 215, 1280 150 S 1480 80, 1620 90";

// The car is drawn facing left (front at negative x) with its wheels on y = 0.
const BODY =
  "M -84 -10 C -87 -17 -85 -24 -77 -27 L -50 -33 C -36 -36 -22 -46 -2 -48 C 18 -50 34 -46 50 -38 " +
  "C 62 -33 76 -30 84 -26 C 88 -23 89 -16 86 -10 L 66 -10 A 14 14 0 0 0 38 -10 L -38 -10 A 14 14 0 0 0 -66 -10 Z";
const GLASS = "M -31 -35 C -21 -42 -9 -45 4 -45 C 18 -45 30 -42 41 -36 Z";

function Wheel({ x }) {
  return (
    <g transform={`translate(${x} -12)`}>
      <circle r="12.5" className="fill-da-navy" />
      <circle r="7.5" fill="#C9D2E6" />
      <g className="da-drive__wheel">
        {[0, 72, 144, 216, 288].map((angle) => (
          <line key={angle} x2="0" y2="-7" transform={`rotate(${angle})`} className="stroke-da-navy" strokeWidth="1.6" strokeLinecap="round" />
        ))}
      </g>
      <circle r="2" className="fill-da-navy" />
    </g>
  );
}

export default function HeroRoad() {
  return (
    <svg
      className="da-drive"
      viewBox="0 0 1440 240"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="A white car drives along a winding road"
    >
      {/* Asphalt with navy outer edges, thin white edge lines and an orange centre line, as in the logo */}
      <path d={ROAD} fill="none" className="stroke-da-navy" strokeWidth="78" strokeLinecap="round" />
      <path d={ROAD} fill="none" className="stroke-da-slate" strokeWidth="72" />
      <path d={ROAD} fill="none" className="stroke-white" strokeWidth="60" />
      <path d={ROAD} fill="none" className="stroke-da-slate" strokeWidth="56" />
      <path d={ROAD} fill="none" className="stroke-da-orange" strokeWidth="3" strokeDasharray="22 18" />

      <g className="da-drive__car">
        {/* In the far lane (a car heading left keeps to its right) */}
        <g transform="translate(0 -9)">
          <ellipse cx="0" cy="1" rx="78" ry="4" className="fill-da-navy" opacity="0.18" />
          <path d={BODY} className="fill-white stroke-da-navy" strokeWidth="2.5" strokeLinejoin="round" />
          <path d={GLASS} className="fill-da-navy" />
          <line x1="7" y1="-45.5" x2="7" y2="-35" className="stroke-white" strokeWidth="2" />
          <path d="M -60 -21 C -20 -23 30 -23 78 -21" fill="none" className="stroke-da-navy" strokeWidth="1" opacity="0.35" />
          <rect x="80" y="-27" width="7" height="4" rx="2" className="fill-da-orange" />
          <rect x="-85" y="-25" width="8" height="3" rx="1.5" fill="#FFE7A8" className="stroke-da-navy" strokeWidth="1" />
          <Wheel x={-52} />
          <Wheel x={52} />
        </g>
      </g>
    </svg>
  );
}
