import { Fragment } from "react";
import Content from "@/content";

const futureDates = [
  { year: 2026, month: "April", days: "10–11" },
  { year: 2027, month: "April", days: "2–3" },
  { year: 2028, month: "April", days: "7–8" },
  { year: 2029, month: "April", days: "13–14" },
  { year: 2030, month: "April", days: "5–6" },
];

export default function FutureDates() {
  const upcomingYear = 2026;

  return (
    <Fragment>
      <Content className="pt-16 pb-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mt-6">
            Future Dates
          </h1>
          <p className="text-lg text-gray-500 mt-4 max-w-xl mx-auto">
            Mark your calendars for the years ahead.
          </p>
          <div className="w-16 h-1 bg-black mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Date Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {futureDates.map((item) => {
            const isUpcoming = item.year === upcomingYear;

            return (
              <div
                key={item.year}
                className={`
                  rounded-3xl p-8 text-center transition-all duration-300
                  ${
                    isUpcoming
                      ? "bg-theme-dark-purple text-white shadow-2xl scale-105"
                      : "bg-theme-yellow text-white hover:-translate-y-2 hover:shadow-2xl"
                  }
                `}
              >
                <h2 className="text-3xl font-bold">{item.year}</h2>

                <div className="mt-5">
                  <span
                    className={`text-sm uppercase tracking-widest ${
                      isUpcoming ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    {item.month}
                  </span>

                  <div className="text-2xl font-semibold mt-1">
                    {item.days}
                  </div>
                </div>

                {isUpcoming && (
                  <div className="mt-2 text-sm uppercase tracking-wide text-gray-300">
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