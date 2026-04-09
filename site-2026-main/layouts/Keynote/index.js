import { Icon } from "@iconify/react";
import { LOCATIONS } from "../../utilities/links.js";
import { useEffect, useState } from "react";
import { times } from "underscore";

export const KeynoteSpeaker = ( {timeString, description, imagePath, name, backgroundNum} ) => {
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
        <div 
            className="flex flex-col md:flex-row md:justify-center items-center gap-8 px-14 relative min-h-[500px] pb-40"
            style={{
                backgroundImage: `url('/assets/banners/robot_banner_${backgroundNum}.png')`,
                backgroundSize: 'cover', // Ensures the image fits without cropping
                backgroundPosition: 'center bottom -70px', // Moves the image further down
                backgroundRepeat: 'no-repeat'
            }}            
        >
            <div className="flex flex-col md:w-1/2 gap-3">
                <div className="flex flex-col md:flex-row gap-5 text-lg -mt-10">
                    <span className="flex flex-row gap-3 items-center">
                        <Icon icon="mingcute:time-line" className="text-3xl" />
                        <h3>{timeString}</h3>
                    </span>
                    <span className="flex flex-row gap-3 items-center">
                        <Icon icon="mingcute:location-fill" className="text-3xl" />
                        <h3>
                            <a className="text-blue-600 hover:text-blue-500" href={LOCATIONS.CIF} target="_blank">CIF</a> Monumental Steps
                        </h3>
                    </span>
                </div>
                <p style={{backgroundColor: "rgba(255, 255, 255, 0.5)", borderRadius: "20px", marginTop: "20px"}}>{description}</p>
            </div>
            <img 
                src={imagePath}
                alt={`picture of ${name}`}
                className="w-80 h-80 object-cover object-top rounded-full 
                           ring-1 ring-black ring-offset-1 ring-offset-transparent" 
            />
        </div>
    );
};