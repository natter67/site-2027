import { Fragment } from "react";
import Content from "@/content";

const futureDates = [
  { year: 2026, month: "April", days: "10–11" },
  { year: 2027, month: "April", days: "9–10" },
  { year: 2028, month: "April", days: "7–8" },
  { year: 2029, month: "April", days: "13–14" },
  { year: 2030, month: "April", days: "5–6" },
];

export default function FutureDates() {
  const upcomingYear = 2027;

  return (
    <Fragment>
      <Content title="Future Dates" summary="Mark your calendars for the years ahead.">
        {/* Date Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {futureDates.map((item) => {
            const isUpcoming = item.year === upcomingYear;

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
                <h2 className="font-display text-4xl">{item.year}</h2>

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
      </Content>
    </Fragment>
  );
}