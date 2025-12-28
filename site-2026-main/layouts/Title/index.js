import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function HomeVideo() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
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
<div className="relative flex flex-col-reverse md:flex-row min-h-screen items-center justify-between px-6 md:px-20 overflow-hidden text-white bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300">
      {/* === Animated Lava Gradient Triangle === */}
      <div className="absolute inset-0">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Main animated lava gradient */}
            <linearGradient id="leftGradient" x1="0%" y1="0%" x2="120%" y2="100%">
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

            {/* Soft glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Triangular curved shape shifted left */}
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

          {/* Smooth flowing glowing border */}
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

      {/* Scattered Elements */}
      {/* {windowWidth > 0 && (<div className="scattered-elements">
        {filteredElements.map((element, index) => (
          <img
            key={index}
            src={element.src}
            alt={`Decorative Element ${index + 1}`}
            style={{
              width: element.size,
              height: "auto",
              position: "absolute",
              top: element.top,
              left: element.left,
              transform: element.transform || "translate(-50%, -50%)",
              animation: element.animation,
              zIndex: 1,
              filter: "drop-shadow(0 8px 16px rgba(255, 192, 203, 0.4))",
            }}
          />
        ))}
      </div>)} */}

      <img
        src="/assets/logo/EOHlogo2026.svg"
        className="z-10 w-3/4 md:w-2/5 mb-6 md:mb-0"
        alt="EOH Logo"
      />
    {/* Centered Title Area */}
      <header
        className="relative text-center z-0 px-4 md:px-0 w-full md:w-1/2 mt-20 md:mt-0"
        style={{ padding: "2rem 1rem" }}
      >

        <h1
          className="title"
          style={{
            fontFamily: "'Norwester', sans-serif",
            fontSize: windowWidth < 768 ? "3rem" : "3rem",
            fontWeight: "800",
            color: "#333",
            marginBottom: "1rem",
          }}
        >
          Engineering Open House
        </h1>
        <p
          className="subtitle"
          style={{
            fontSize: windowWidth < 768 ? "1rem" : "1.25rem",
            color: "#666",
            fontWeight: "500",
            marginBottom: "1rem",
          }}
        >
          at the <strong>University of Illinois Urbana-Champaign</strong> brings
        </p>
        <h2
          className="highlight"
          style={{
            fontFamily: "'Iron Forge', san-serif",
            fontSize: windowWidth < 768 ? "3rem" : "6rem",
            // fontWeight: "700",
            lineHeight: "100%",
            color: "#452566",
            marginBottom: "1rem",
          }}
        >
          Forging the Future
        </h2>
        <p
          className="date"
          style={{
            fontSize: windowWidth < 768 ? "1rem" : "1.25rem",
            color: "#333",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          April 10th & April 11th, 2026
        </p>
      </header>


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