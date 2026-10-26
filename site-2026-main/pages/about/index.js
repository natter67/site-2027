import Content from "@/content";
import LinkCards from "@/link-cards";
import { PRIMARY_NAV, sectionLinks } from "@utilities/navigation";
import { FUTURE_DATES, UPCOMING_YEAR } from "@utilities/futureDates";

// Landing page: every page in this menu section (edit the list in utilities/navigation.js), then future
// dates (was /future-dates, which redirects to #future-dates here).
const section = PRIMARY_NAV.find((s) => s.key === "about");

export default function AboutPage() {
  return (
    <Content title="About EOH" related={false} wide>
      <section aria-label="About Us pages" className="mx-auto mb-12 w-full max-w-6xl">
        <LinkCards links={sectionLinks(section)} />
      </section>
      <section id="future-dates" aria-labelledby="future-dates-heading" className="mx-auto mb-12 w-full max-w-6xl scroll-mt-24 lg:scroll-mt-32">
        <h2 id="future-dates-heading" className="mb-5 font-display text-2xl uppercase text-da-navy md:text-3xl">Future dates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FUTURE_DATES.map((item) => {
            const isUpcoming = item.year === UPCOMING_YEAR;

            return (
              <div
                key={item.year}
                className={`
                  rounded-3xl p-8 text-center
                  ${
                    isUpcoming
                      ? "bg-da-navy text-white scale-105 shadow-[6px_6px_0_var(--da-orange)]"
                      : "da-card da-card--lift"
                  }
                `}
              >
                <h3 className="font-display text-4xl">{item.year}</h3>

                <div className="mt-5">
                  <span
                    className={`text-sm uppercase tracking-widest ${
                      isUpcoming ? "text-da-peach" : "text-da-orange-text"
                    }`}
                  >
                    {item.month}
                  </span>

                  <div className="text-2xl font-semibold mt-1">
                    {item.days}
                  </div>
                </div>

                {isUpcoming && (
                  <div className="mt-2 text-sm uppercase tracking-wide text-da-peach">
                    Next Event
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </Content>
  );
}
