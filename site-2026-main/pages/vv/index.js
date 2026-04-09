import React from "react";
import Exhibits from "components/vv/exhibits.js";
import Map from "components/vv/map.js";
import SpecialEvents from "components/vv/special-events.js";
import CameraScan from "components/vv/camera.js";
import Leaderboard from "@layouts/Leaderboard/index.js";
import { Icon } from "@iconify/react";
import { useStringQueryParam } from "@utilities/useStringQueryParam";

export default function VisitorView() {
    const [currentView, setCurrentView] = useStringQueryParam("t", "exhibits");
    const pages = {
        exhibits: { title: "Exhibits", icon: "game-icons:barracks-tent", element: <Exhibits /> },
        "special-events": { title: "Special Events", icon: "mdi:robot-mower-outline", element: <SpecialEvents /> },
        camera: { title: "Camera", icon: "mdi:camera-outline", element: <CameraScan /> },
        map: { title: "Map", icon: "iconoir:map", element: <Map /> },
        leaderboard: { title: "Leaderboard", icon: "mdi:trophy-outline", element: <Leaderboard embedded /> },
    };
    const view = Object.prototype.hasOwnProperty.call(pages, currentView) ? currentView : "exhibits";

    return (
        <div className="mt-24 flex flex-col justify-between lg:mt-20">
            <div className="mb-24">{pages[view].element}</div>

            <div className="pointer-events-auto fixed bottom-0 z-40 flex h-20 w-full flex-row items-center justify-evenly bg-blue-300">
                {Object.keys(pages).map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => setCurrentView(p)}
                        className={`${view === p ? "font-bold" : ""} flex min-w-0 w-1/5 flex-col items-center px-0.5`}
                    >
                        <Icon icon={pages[p].icon} className="shrink-0 text-3xl" />
                        <h2 className="max-w-full truncate whitespace-nowrap text-xs sm:text-base">{pages[p].title}</h2>
                    </button>
                ))}
            </div>
        </div>
    );
}
