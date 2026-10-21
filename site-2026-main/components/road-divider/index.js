// Decorative road band between home sections, with a small car driving across.
// Styles and animation: .da-road in styles/direction-a.css (car parks when reduced motion is on).

const CAR_FILL = {
  white: "fill-white",
  orange: "fill-da-orange",
};

export default function RoadDivider({ car = "white" }) {
  return (
    <div className="da-road" aria-hidden="true">
      <div className="da-road__car">
        <svg viewBox="-80 -66 160 70" width="64" height="28">
          <path
            className={`${CAR_FILL[car]} stroke-da-navy`}
            strokeWidth="5"
            d="M-75 -14 L-74 -30 C-72 -38 -60 -42 -45 -44 L-25 -46 C-12 -60 10 -64 28 -60 C42 -56 52 -48 60 -44 C70 -42 76 -36 78 -26 L78 -14 Z"
          />
          <circle className="fill-da-navy" cx="-46" cy="-10" r="13" />
          <circle className="fill-da-navy" cx="48" cy="-10" r="13" />
        </svg>
      </div>
    </div>
  );
}
