import { Icon } from "@iconify/react";
import { LOCATIONS } from "../../utilities/links.js";
import { useEffect, useState } from "react";

export const KeynoteSpeaker = () => {
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
                backgroundImage: !isMobile && `linear-gradient(to bottom, rgba(255, 255, 255, 0) 60%, white 100%), url('/assets/banners/robot_banner_1.png')`,
                backgroundSize: 'cover', // Ensures the image fits without cropping
                backgroundPosition: 'center bottom -70px', // Moves the image further down
                backgroundRepeat: 'no-repeat'
            }}            
        >
            <div className="flex flex-col md:w-1/2 gap-3">
                <div className="flex flex-col md:flex-row gap-5 text-lg -mt-10">
                    <span className="flex flex-row gap-3 items-center">
                        <Icon icon="mingcute:time-line" className="text-3xl" />
                        <h3>Saturday, April 10th - 2:30 PM to 3:30 PM</h3>
                    </span>
                    <span className="flex flex-row gap-3 items-center">
                        <Icon icon="mingcute:location-fill" className="text-3xl" />
                        <h3>
                            <a className="text-blue-600 hover:text-blue-500" href={LOCATIONS.CIF} target="_blank">CIF</a> Monumental Steps
                        </h3>
                    </span>
                </div>
                <p>
                    Christina Ernst is a senior software engineer at Google and the fashioneering content creator behind <a className="text-blue-600 hover:text-blue-500" href="https://shebuildsrobots.com/" target="_blank">She Builds Robots</a> (@shebuildsrobots). Her tech-fashion crossover work has been featured in CNN Style, Make: Magazine, Forbes, Entertainment Weekly, CBC, and Popular Science. She was a recurring engineering correspondent on Season 6 of the educational STEM show 'Mission Unstoppable with Miranda Cosgrove' and also served as the 2024 Maker-in-Residence at Chicago Public Library.
                </p>
            </div>
            <img 
                src="assets/images/keynote-headshot.jpg" 
                alt="picture of Christina Ernst" 
                className="w-80 h-80 object-cover object-top rounded-full 
                           ring-1 ring-black ring-offset-1 ring-offset-transparent" 
            />
        </div>
    );
};
