import { Icon } from "@iconify/react";
import Countdown from "react-countdown";

export default function ExhibitApplication() {
  return (
    <div
      className="w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 py-12 md:py-20"
      style={{ maxWidth: "100%", boxSizing: "border-box" }}
    >
      <div className="relative bg-gradient-to-br from-white via-orange-50/30 to-purple-50/40 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(75,0,130,0.15)] p-8 md:p-14 text-[#333] w-full max-w-5xl leading-relaxed border border-white/60 mb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/10 to-purple-400/10 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-orange-400/10 rounded-full blur-3xl -z-0"></div>

        <div className="relative z-10 mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-orange-500 mb-6 leading-tight">
            Join Our Exhibits Town Hall
          </h2>
          <p className="text-base md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Learn about the application process, exhibitor expectations, and
            safety requirements. Each exhibit{" "}
            <span className="font-extrabold text-purple-900">
              must have at least one representative attend
            </span>{" "}
            an Exhibits Town Hall{" "}
            <span className="font-extrabold text-purple-900">
              before submitting
            </span>{" "}
            their application for EOH 2026.
          </p>
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-6 mb-10">
          <div className="group bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-6 md:p-8 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Icon
                  icon="mdi:calendar-clock"
                  className="text-3xl text-white"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-[#5a2a00]">
                Town Hall
              </h3>
            </div>
            <div className="text-base md:text-lg font-bold text-[#5a2a00] mb-2">
              Sunday, November 16, 2025
            </div>
            <div className="text-sm md:text-base text-gray-700 font-medium">
              6:00 PM – 7:00 PM
            </div>
            <div className="text-sm md:text-base text-gray-700 font-medium">
              DCL 1320
            </div>
          </div>

          <div className="group bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-6 md:p-8 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Icon
                  icon="mdi:clock-alert-outline"
                  className="text-3xl text-white"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-[#4b0082]">
                Deadline
              </h3>
            </div>
            <div className="text-base md:text-lg font-bold text-[#4b0082] mb-2">
              December 21 at 11:59 PM
            </div>
            <div className="text-sm md:text-base text-gray-700 font-medium">
              Town hall attendance required before applying
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSd0tk0y6-JgCthtNGlDVeQbjXIK_JgufToRxqqjHNT-GhFxyQ/viewform?pli=1"
            target="_blank"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#ff7b00] via-[#ff9500] to-[#ffb347] text-white font-black py-5 px-12 rounded-full shadow-[0_10px_30px_rgba(255,123,0,0.4)] hover:shadow-[0_15px_40px_rgba(255,123,0,0.6)] hover:scale-105 transition-all duration-300 text-base md:text-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative z-10">APPLY TO BE AN EXHIBITOR</span>
            <Icon
              icon="mdi:arrow-right"
              className="text-2xl relative z-10 group-hover:translate-x-1 transition-transform duration-300"
            />
          </a>
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <div className="">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.08),transparent_50%)]"></div>

          <div className="relative z-10">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-10 flex items-center justify-center gap-4">
              <span>Town Hall Countdown</span>
            </h3>

            <Countdown
              date={new Date("2025-11-16T18:00:00")}
              renderer={({ days, hours, minutes, seconds, completed }) => {
                if (completed) {
                  return (
                    <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-500 text-white px-10 sm:px-14 py-8 sm:py-10 rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.5)] inline-flex items-center gap-4 animate-pulse">
                      <Icon
                        icon="mdi:check-circle"
                        className="text-4xl md:text-5xl"
                      />
                      The town hall has started!
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full">
                    {[
                      {
                        value: days,
                        label: "Days",
                        icon: "mdi:calendar",
                        gradient: "from-purple-500 to-purple-800",
                      },
                      {
                        value: hours,
                        label: "Hours",
                        icon: "mdi:clock-outline",
                        gradient: "from-purple-500 to-purple-800",
                      },
                      {
                        value: minutes,
                        label: "Minutes",
                        icon: "mdi:timer-outline",
                        gradient: "from-purple-500 to-purple-800",
                      },
                      {
                        value: seconds,
                        label: "Seconds",
                        icon: "mdi:timer",
                        gradient: "from-purple-500 to-purple-800",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`group relative flex flex-col items-center bg-gradient-to-br ${item.gradient} text-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] p-5 sm:p-6 md:p-9 hover:scale-110 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-300 border border-white/20`}
                      >
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-2xl transition-all duration-300"></div>
                        <Icon
                          icon={item.icon}
                          className="text-2xl md:text-3xl mb-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300 relative z-10"
                        />
                        <span className="text-5xl sm:text-6xl md:text-7xl font-black mb-2 drop-shadow-lg relative z-10 tabular-nums">
                          {String(item.value).padStart(2, "0")}
                        </span>
                        <span className="text-xs sm:text-sm md:text-base uppercase font-black tracking-widest opacity-80 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
