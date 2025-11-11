import { useEffect, useState } from "react";

export default function HomeVideo() {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="relative flex flex-col md:flex-row min-h-screen items-center justify-center px-6 md:px-20 md:justify-between overflow-hidden text-white bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300"
      style={{ width: "100vw", maxWidth: "100%" }}
    >
      <div className="absolute inset-0">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="leftGradient"
              x1="0%"
              y1="0%"
              x2="120%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fbbf24">
                <animate
                  attributeName="stop-color"
                  values="#fbbf24;#f59e0b;#f97316;#fb923c;#fbbf24"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#f59e0b">
                <animate
                  attributeName="stop-color"
                  values="#f59e0b;#f97316;#fb923c;#f59e0b"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#f97316">
                <animate
                  attributeName="stop-color"
                  values="#f97316;#fb923c;#f59e0b;#f97316"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            id="lavaPath"
            d="M 0,0 L 0,100 L 50,100 Q 50,50 35,0 Z"
            fill="url(#leftGradient)"
          >
            <animate
              attributeName="d"
              values="
                M 0,0 L 0,100 L 50,100 Q 50,50 35,0 Z;
                M 0,0 L 0,100 L 52,100 Q 52,50 37,0 Z;
                M 0,0 L 0,100 L 50,100 Q 50,50 35,0 Z
              "
              dur="7s"
              repeatCount="indefinite"
            />
          </path>

          <path
            d="M 0,0 L 0,100 L 50,100 Q 50,50 35,0 Z"
            fill="none"
            stroke="url(#glowGradient)"
            strokeWidth="1.5"
            filter="url(#glow)"
            opacity="0.9"
          >
            <animate
              attributeName="stroke-width"
              values="1.2;1.6;1.2"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.9;0.7;0.9"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      <div className="relative z-10 w-full md:w-2/5 flex justify-center md:justify-start mb-6 md:mb-0">
        <img
          src="/assets/logo/EOHlogo2026.svg"
          className="w-3/4 md:w-full max-w-md"
          alt="EOH Logo"
        />
      </div>

      <header className="relative z-10 text-center w-full md:w-1/2">
        <h1
          className="mb-3 md:mb-4"
          style={{
            fontFamily: "'Norwester', sans-serif",
            fontSize: windowWidth < 768 ? "2rem" : "3rem",
            fontWeight: "800",
            color: "#333",
            lineHeight: "1.2",
          }}
        >
          Engineering Open House
        </h1>
        <p
          className="mb-3 md:mb-4"
          style={{
            fontSize: windowWidth < 768 ? "0.9rem" : "1.25rem",
            color: "#666",
            fontWeight: "500",
            lineHeight: "1.4",
          }}
        >
          at the <strong>University of Illinois Urbana-Champaign</strong> brings
        </p>
        <h2
          className="mb-3 md:mb-4"
          style={{
            fontFamily: "'Iron Forge', sans-serif",
            fontSize: windowWidth < 768 ? "2.5rem" : "6rem",
            lineHeight: "1",
            color: "#452566",
          }}
        >
          Forging the Future
        </h2>
        <p
          style={{
            fontSize: windowWidth < 768 ? "1rem" : "1.25rem",
            color: "#333",
            fontWeight: "600",
            lineHeight: "1.4",
          }}
        >
          April 10th & April 11th, 2026
        </p>
      </header>

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
            transform: translate(80vw, 0vh) rotate(320deg);
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

        @keyframes lavaFlowTriangle {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-lava-triangle {
          animation: lavaFlowTriangle 18s ease-in-out infinite;
        }

        @keyframes forge-glow {
          0%, 100% {
            text-shadow: 
              0 0 20px rgba(251, 191, 36, 0.6),
              0 0 40px rgba(245, 158, 11, 0.5),
              0 0 60px rgba(249, 115, 22, 0.4),
              0 0 80px rgba(251, 146, 60, 0.3);
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            text-shadow: 
              0 0 30px rgba(251, 191, 36, 0.9),
              0 0 60px rgba(245, 158, 11, 0.8),
              0 0 90px rgba(249, 115, 22, 0.7),
              0 0 120px rgba(251, 146, 60, 0.5),
              0 0 150px rgba(249, 115, 22, 0.3);
            transform: scale(1.05);
            filter: brightness(1.3);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes heat-wave {
          0%, 100% {
            filter: hue-rotate(0deg) brightness(1);
          }
          25% {
            filter: hue-rotate(10deg) brightness(1.2);
          }
          50% {
            filter: hue-rotate(-5deg) brightness(1.3);
          }
          75% {
            filter: hue-rotate(5deg) brightness(1.1);
          }
        }

        .forging-text {
          background: linear-gradient(
            110deg,
            #452566 0%,
            #7c3aed 15%,
            #fbbf24 30%,
            #f59e0b 40%,
            #fb923c 50%,
            #f59e0b 60%,
            #fbbf24 70%,
            #7c3aed 85%,
            #452566 100%
          );
          background-size: 300% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: 
            forge-glow 2.5s ease-in-out infinite,
            shimmer 3s linear infinite,
            heat-wave 4s ease-in-out infinite;
          position: relative;
        }
        
        .forging-text::before {
          content: 'Forging the Future';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(
            110deg,
            transparent 0%,
            rgba(251, 191, 36, 0.4) 45%,
            rgba(251, 191, 36, 0.8) 50%,
            rgba(251, 191, 36, 0.4) 55%,
            transparent 100%
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s linear infinite;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}
{
  /* Buttons */
}
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
