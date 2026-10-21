// Decorative scrolling band of topics and formulas under the home hero (hidden from screen readers;
// stops scrolling with reduced motion). Styles: "Ticker" in styles/direction-a.css.
// Draft list (confirm with team).

const ITEMS = [
  { text: "Robots" },
  { text: "F = ma", formula: true },
  { text: "Rockets" },
  { text: "E = mc²", formula: true },
  { text: "Tesla coils" },
  { text: "V = IR", formula: true },
  { text: "Quantum" },
  { text: "PV = nRT", formula: true },
  { text: "Bioengineering" },
  { text: "|ψ⟩", formula: true },
  { text: "Startups" },
  { text: "∇ · B = 0", formula: true },
  { text: "Robobrawl" },
  { text: "C₆H₆", formula: true },
];

export default function Ticker() {
  // The list is rendered twice so the loop scrolls without a gap.
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="da-ticker" aria-hidden="true">
      <div className="da-ticker__track">
        {row.map((item, i) => (
          <span key={i} className={item.formula ? "font-label text-2xl font-bold" : "font-display text-[28px] uppercase"}>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
