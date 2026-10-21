import { Fragment } from "react";
import Content from "@/content";

import { FUTURE_DATES as futureDates, UPCOMING_YEAR } from "@utilities/futureDates";

export default function FutureDates() {
  const upcomingYear = UPCOMING_YEAR;

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