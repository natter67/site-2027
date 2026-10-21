import Content from "@/content";
import { MOMS_WEEKEND } from "@utilities/momsWeekend";

// Web version of public/EOHxmoms.pdf (text in utilities/momsWeekend.js). The PDF stays downloadable.
export default function MomsWeekendPage() {
  return (
    <Content title="EOH x Mom's Weekend">
      <p>
        <a href="/EOHxmoms.pdf" className="da-pill da-pill--primary">
          Download the Mom's Weekend guide (PDF)
        </a>
      </p>
      <div className="mx-auto mb-8 w-full max-w-3xl text-left text-lg leading-relaxed">
        <p className="mt-8">{MOMS_WEEKEND.intro}</p>
        <h2 className="mb-2 mt-10 font-display text-3xl uppercase leading-none">Featured events for everyone</h2>
        <ul className="m-0 list-none p-0">
          {MOMS_WEEKEND.events.map((e) => (
            <li key={e.name} className="mt-6 border-t border-[rgba(19,41,75,0.2)] pt-4">
              <h3 className="text-xl font-bold">{e.name}</h3>
              <p className="mt-1 font-label text-sm font-bold text-da-orange-text">{e.when}</p>
              <p className="mt-1">{e.description}</p>
            </li>
          ))}
        </ul>
        {/* DRAFT copy */}
        <p className="mt-10">
          Events for moms with younger students are listed in the{" "}
          <a href="/EOHxmoms.pdf" className="font-semibold underline decoration-da-orange decoration-2 underline-offset-4">
            PDF
          </a>
          .
        </p>
      </div>
    </Content>
  );
}
