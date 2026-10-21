// Decorative road sign used above a section heading ("MILE 01 · AWARDS").
// Hidden from screen readers; the section's own <h2> stays the real title.

const TONES = {
  navy: { plate: "bg-da-navy", inner: "border-white text-white" },
  white: { plate: "bg-white", inner: "border-da-navy text-da-navy" },
  orange: { plate: "bg-da-orange", inner: "border-da-navy text-da-navy" },
};

export default function MileSign({ children, tone = "navy", className = "" }) {
  const t = TONES[tone];
  return (
    <div aria-hidden="true" className={`inline-flex flex-col items-start ${className}`}>
      <div className={`rounded-lg p-1 ${t.plate}`}>
        <div className={`rounded-[5px] border-2 px-3.5 py-1.5 font-display text-lg uppercase tracking-[0.06em] ${t.inner}`}>
          {children}
        </div>
      </div>
      <div className="ml-6 h-[18px] w-1.5 bg-da-slate" />
    </div>
  );
}
