import Landing from "@layouts/Landing";
import { EXHIBIT_INTEREST_FORM_URL, PRIMARY_NAV } from "@utilities/navigation";

// Get Involved landing page. The #exhibit block carries the exhibits interest form
// (it used to be the main button in the home page hero).
const section = PRIMARY_NAV.find((s) => s.key === "get-involved");

export default function GetInvolvedPage() {
  return (
    <Landing section={section} title="Get Involved">
      <section id="exhibit" aria-labelledby="exhibit-heading" className="da-card mx-auto mb-12 w-full max-w-3xl scroll-mt-24 p-6 text-left md:p-8 lg:scroll-mt-32">
        <h2 id="exhibit-heading" className="font-display text-3xl uppercase leading-none">Exhibit at EOH</h2>
        {/* DRAFT copy */}
        <p className="mt-3 text-lg">Show your project at EOH: start with the exhibits interest form.</p>
        <a href={EXHIBIT_INTEREST_FORM_URL} target="_blank" rel="noopener noreferrer" className="da-pill da-pill--primary mt-5">
          EOH Exhibits Interest Form 2026-2027 <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </section>
    </Landing>
  );
}
