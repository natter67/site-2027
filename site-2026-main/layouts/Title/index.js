import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import HeroRoad from "@/hero-road";

export default function HomeVideo() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [timeleft, setTimeLeft] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const town_hall_dates = [
    {label: "Town Hall 1", date: new Date("2026-10-15T00:00:00"), badge: "OCT 15"},
    {label: "Town Hall 2", date: new Date("2026-11-02T00:00:00"), badge: "NOV  2"},
    {label: "Town Hall 3", date: new Date("2026-11-17T00:00:00"), badge: "NOV 17"},

  ]

  useEffect(() =>{
    const getTimeLeft = (targetDate) => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0){
        return {days: 0, hours: 0, minutes: 0, seconds: 0, passed: true};
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      return {days, hours, minutes, seconds, passed: false};
    };
    const updateCountdowns = () => {
      setTimeLeft(town_hall_dates.map((th) => getTimeLeft(th.date)));
    };
    updateCountdowns();
    const intervalID = setInterval(updateCountdowns, 1000);
    return () => clearInterval(intervalID);
  }, []);

  // REPLACE with new graphics soon
  const elements = [
    {
      src: "/assets/gifs/satellite.gif",
      size: `${windowWidth / 1.8}px`,
      top: "95%",
      left: "85%",
      animation: "float infinite",
      zIndex: "0"
    },
    {
      src: "/assets/gifs/beaker.gif",
      size: `${windowWidth / 2}px`,
      top: "40%",
      left: "80%",
      animation: "float infinite",
      zIndex: "0",
    },
    {
      src: "/assets/gifs/breadboard animation.gif",
      size: `${windowWidth / 3}px`,
      top: "-25%",
      left: "10%",
      animation: "float 3s ease-in-out infinite",
    },
    {
      src: "/assets/gifs/compass.gif",
      size: `${windowWidth / 2}px`,
      top: "25%",
      left: "90%",
      animation: "float infinite",
      zIndex: "0",
    },
    {
      src: "/assets/gifs/compass needle.png",
      size: `${windowWidth / 3}px`,
      top: "25%",
      left: "100%",
      animation: "spin 3s linear infinite",
    },
    {
      src: "/assets/logo/magnifier.png",
      size: `${windowWidth / 8}px`,
      top: "81%",
      left: "30%",
      zIndex: 3,
      animation: "float 5s ease-in-out infinite",
    },
    {
      src: "/assets/logo/moon.png",
      size: `${windowWidth / 20}px`,
      top: "50%",
      left: "15%",
      animation: "float 5s ease-in-out infinite",
    },
    {
      src: "/assets/logo/newrocket.png",
      size: `${windowWidth / 5}px`,
      top: "50%",
      left: "0%",
      zIndex: 1,
      transform: "translate(-10%, -20%)",
      animation: "fly-across 4s linear forwards",
      zIndex: "0",
    },
    {
      src: "/assets/logo/windmill.png",
      size: `${windowWidth / 7}px`,
      top: "70%",
      left: "6%",
      zIndex: 3,
    },
    {
      src: "/assets/logo/world.png",
      size: `${windowWidth / 4.5}px`,
      top: "75%",
      left: "-10%",
      animation: "float 8s ease-in-out infinite",
      zIndex: 1,
    },
  ];

  // Filter elements based on screen size (only fan and beaker for small screens)
  const filteredElements = windowWidth < 768
    ? elements.filter((element) => element.src === "/assets/logo/newrocket.png" || element.src === "/assets/gifs/compass.gif" || element.src === "/assets/gifs/satellite.gif" || element.src === "/assets/logo/world.png")
    : elements;

  return (
    <div className="da-ground relative overflow-hidden font-body text-da-navy">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 pt-32 sm:px-6 md:flex-row md:gap-12">
        {/* Title area */}
        <header className="relative w-full md:w-1/2">
          <h1 className="font-display text-3xl uppercase leading-none sm:text-4xl">
            Engineering Open House
          </h1>
          <p className="mt-3 text-lg sm:text-xl">
            at the <strong>University of Illinois Urbana-Champaign</strong> brings
          </p>
          {/* Letters drop in one by one (.da-hero-drop); the aria-label keeps it one phrase for screen readers */}
          <h2
            aria-label="Driven by Discovery"
            className="mt-4 font-display text-[clamp(3.25rem,8vw,7rem)] uppercase leading-[0.92]"
          >
            <span aria-hidden="true" className="block">
              <span className="da-hero-drop">Driven</span>{" "}
              <span className="da-hero-drop" style={{ animationDelay: "0.12s" }}>by</span>
            </span>
            <span aria-hidden="true" className="da-hero-outline block whitespace-nowrap">
              {"Discovery".split("").map((letter, i) => (
                <span key={i} className="da-hero-drop" style={{ animationDelay: `${0.3 + i * 0.06}s` }}>
                  {letter}
                </span>
              ))}
            </span>
          </h2>
          <svg aria-hidden="true" viewBox="0 0 600 24" className="-mt-1 h-6 w-full max-w-[560px]">
            <path
              className="da-hero-underline stroke-da-orange"
              d="M4 14 C 120 4, 220 22, 330 12 S 520 6, 596 14"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
          <p className="mt-4 font-label text-sm font-bold uppercase tracking-[0.1em] sm:text-base">
            April 9th &amp; April 10th, 2027
          </p>
          <div className="relative mt-6 inline-block">
            <a
              href="https://forms.gle/7kQJ5RA95zQcVbNf8"
              target="_blank"
              rel="noopener noreferrer"
              className="pulse-cta da-pill da-pill--primary text-center text-base sm:text-lg"
            >
              EOH Exhibits Interest Form 2026-2027
            </a>
            <img
              src="/assets/ui/magnifying-glass-cursor.png"
              alt=""
              className="cursor-cta"
              style={{
                position: "absolute",
                top: "-2rem",
                right: "-2rem",
                width: "10rem",
                height: "10rem",
                filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))",
                pointerEvents: "none",
                zIndex: 2,
              }}
              aria-hidden="true"
            />
          </div>
        </header>

        {/* Official 2027 logo (unaltered; its white background sits on a white card) + countdown */}
        <div className="flex w-full flex-col items-center gap-6 md:w-1/2">
          <div className="da-card w-full max-w-xl overflow-hidden p-2 sm:p-3">
            <Image
              src="/assets/logo/eoh2027-official-logo.jpg"
              width={1582}
              height={1234}
              priority
              sizes="(min-width: 1280px) 576px, (min-width: 768px) 46vw, 92vw"
              alt="EOH 2027 logo: giant EOH letters and science icons above a white car with a 2027 license plate on a winding road, with the banner Driven by Discovery"
            />
          </div>

          <div className="da-card w-full max-w-xl p-5 text-center">
            <h2 className="font-display text-2xl uppercase">Exhibit Countdown</h2>
            <p className="mt-1 font-label text-xs font-bold uppercase tracking-[0.1em] text-da-orange-text">
              Town Hall Dates
            </p>
            {town_hall_dates.map((th, index) => {
              const t = timeleft[index];
              if (!t) return null;
              return (
                <p key={th.label} className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <span className="font-semibold">{th.label}:</span>
                  <span className="rounded-full bg-da-navy px-2.5 py-0.5 font-label text-xs font-bold text-white">
                    {th.badge}
                  </span>
                  {t.passed ? (
                    <span className="rounded-full border-2 border-da-navy px-3 py-0.5 font-label text-sm font-bold">
                      Happened!
                    </span>
                  ) : (
                    <span className="flex gap-1">
                      {[[t.days, "d"], [t.hours, "h"], [t.minutes, "m"], [t.seconds, "s"]].map(([value, unit]) => (
                        <span
                          key={unit}
                          className="inline-flex min-w-[2.75rem] items-baseline justify-center gap-0.5 rounded-md bg-da-navy px-1.5 py-1 font-label text-white"
                        >
                          <span className="text-base font-bold">{String(value).padStart(2, "0")}</span>
                          <span className="text-xs text-da-orange-light">{unit}</span>
                        </span>
                      ))}
                    </span>
                  )}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      <HeroRoad />

      {/* Inline Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

      

        @keyframes fly-across {
          0% {
            transform: translate(0%, 0%) rotate(0deg);
          }
          25% {
            transform: translate(25vw, -30vh) rotate(45deg);
          }
          50% {
            transform: translate(50vw, -50vh) rotate(90deg);
          }
          75% {
            transform: translate(75vw, -30vh) rotate(135deg);
          }
          100% {
            transform: translate(80vw, 0vh) rotate(320deg); /* Adjusted to fit within screen */
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-cta {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 95, 5, 0.6);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(255, 95, 5, 0);
          }
        }

        @keyframes cursor-cta {
          0% {
            opacity: 0;
            transform: translate(55vw, 45vh) scale(1);
          }
          15% {
            opacity: 1;
            transform: translate(55vw, 45vh) scale(1);
          }
          45% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          53% {
            transform: translate(0, 0) scale(0.85);
          }
          61% {
            transform: translate(0, 0) scale(1);
          }
          80% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          95%, 100% {
            opacity: 0;
            transform: translate(55vw, 45vh) scale(1);
          }
        }
        .cursor-cta {
          animation: cursor-cta 8s ease-in-out infinite;
        }
        .pulse-cta {
          animation: pulse-cta 1.8s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .pulse-cta {
            animation: none;
          }
          .cursor-cta {
            display: none;
          }
        }

        @keyframes lavaFlowTriangle {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-lava-triangle {
          animation: lavaFlowTriangle 18s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}


{/* Buttons */}
    //   <div className="flex justify-center gap-8 z-10 flex-wrap">
    //     <a
    //       target="_blank"
    //       href="/vv"
    //       className="flex justify-between items-center px-6 py-3 bg-theme-orange text-white text-lg font-semibold rounded-lg shadow-md transition-transform transform hover:scale-110 mb-1"
    //       style={{ minWidth: "200px" }}
    //     >
    //       Exhibits & Campus Map
    //       <Icon icon="icon-park-outline:right" className="ml-auto text-xl" />
    //     </a>

    //     <button
    //       onClick={() => setShowModal(true)} // 👈 open modal
    //       className="flex justify-between items-center px-6 py-3 bg-theme-orange text-white text-lg font-semibold rounded-lg shadow-md transition-transform transform hover:scale-110 mb-1"
    //       style={{ minWidth: "200px" }}
    //     >
    //       Parking Info
    //       <Icon icon="icon-park-outline:right" className="ml-auto text-xl" />
    //     </button>
    //   </div>

    //   {/* Modal */}
    //   {showModal && (
    //   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
    //     <div className="bg-white rounded-xl p-6 max-w-2xl shadow-lg relative w-full max-h-[90vh] overflow-y-auto">
    //       <button
    //         onClick={() => setShowModal(false)}
    //         className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl font-bold"
    //       >
    //         &times;
    //       </button>
    //       <h3 className="text-xl font-bold mb-4">Parking Information</h3>

    //       <p className="mb-2 font-semibold">On Friday, visitors can park in these lots:</p>
    //       <ul className="list-disc pl-6 mb-4">
    //         <li>
    //           <strong>Lot E-14</strong>: Near State Farm Center. Can be used for all-day parking on Friday April 4th. The shuttle will pick people up from E-14 and send them to the Bardeen Quad/other exhibits.
    //         </li>
    //         <li>
    //           <strong>Lot B-4</strong>: North campus, can also be used for all-day parking April 4th. There is no shuttle stop here, so attendees will have to walk to Bardeen Quad (closest stop would be B-22).
    //         </li>
    //       </ul>

    //       <p className="mb-2 font-semibold">On Saturday, visitors can park in:</p>
    //       <ul className="list-disc pl-6 space-y-1">
    //         <li><strong>Lot B-1</strong>: Springfield Avenue between Mathews and Goodwin</li>
    //         <li><strong>Lot B-17</strong>: Harvey Street between Clark and Main</li>
    //         <li><strong>Lot C-09</strong>: Chalmers and Sixth</li>
    //         <li><strong>Lot D-09</strong>: Illinois and Lincoln</li>
    //         <li><strong>Lot E-14</strong>: First Street and Kirby</li>
    //         <li><strong>Lot F-23</strong>: Lincoln Avenue and Florida</li>
    //         <li><strong>Lot F-28</strong>: Peabody and Dorner Drive</li>
    //         <li><strong>Lot B-4</strong>: University and Mathews</li>
    //         <li><strong>Lot F-29</strong>: Gregory and Dorner Drive</li>
    //       </ul>
    //     </div>
    //   </div>
    // )}