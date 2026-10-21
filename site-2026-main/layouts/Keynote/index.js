import { Icon } from "@iconify/react";
import Image from "next/image";
import { LOCATIONS } from "../../utilities/links.js";
import { useEffect, useState } from "react";
import { times } from "underscore";

export const KeynoteSpeaker = ( {timeString, description, imagePath, name} ) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkWindowSize = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust as per your mobile screen size
        };
        checkWindowSize();
        window.addEventListener("resize", checkWindowSize);
        return () => {
            window.removeEventListener("resize", checkWindowSize);
        };
    }, []);

    return (
        <div className="mx-auto w-full max-w-5xl px-4">
            <div className="flex flex-col items-center gap-8 rounded-[18px] border-2 border-da-navy bg-da-navy p-6 text-left text-white md:flex-row md:p-10">
                <div className="flex flex-col gap-4 md:w-2/3">
                    <div className="flex flex-col gap-3 font-label text-sm font-bold uppercase tracking-[0.06em] md:flex-row md:gap-6">
                        <span className="flex flex-row items-center gap-2">
                            <Icon icon="mingcute:time-line" className="text-2xl text-da-orange-light" />
                            <h3>{timeString}</h3>
                        </span>
                        <span className="flex flex-row items-center gap-2">
                            <Icon icon="mingcute:location-fill" className="text-2xl text-da-orange-light" />
                            <h3>
                                <a className="text-da-orange-light underline underline-offset-4 hover:text-white" href={LOCATIONS.CIF} target="_blank">CIF</a> Monumental Steps
                            </h3>
                        </span>
                    </div>
                    <p className="leading-relaxed">{description}</p>
                </div>
                <div className="relative h-56 w-56 shrink-0 overflow-hidden rounded-full border-4 border-da-orange md:h-64 md:w-64">
                    <Image src={`/${imagePath}`} alt={`picture of ${name}`} fill sizes="256px" className="object-cover object-top" />
                </div>
            </div>
        </div>
    );
};
