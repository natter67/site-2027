import React from 'react';

export default function SCC() {
    return (
        // Add flex-col instead of justify-center if you're including the text
        <div className="flex flex-col md:flex-row items-center justify-center
                gap-10 mx-6 md:mx-auto md:w-3/4 text-sm">

            <div className="w-full md:w-2/5 lg:w-2/5
                            border p-6 rounded-lg 
                            text-center md:text-left">
                <p className="font-montserrat text-xl">EOH's new sustainability initiatives, sponsored by the Student Sustainability Committee (SSC):</p>
                <br></br>
                <ul className="font-montserrat text-lg list-disc list-inside space-y-1 md:list-outside">
                    <li>Sustainably made t-shirts </li>
                    <li>Build-your-Own Terrarium workshop</li>
                    <li>Soda Tab Buddy workshop</li>
                    <li>Refillable water station</li>
                    <li>Compost bins stationed across the engineering campus</li>
                    <li>Compostable silverware at the food trucks</li>
                </ul>
            </div>

            <img 
                src="assets/images/scc.png" 
                alt="" 
                className="w-full md:w-2/5 lg:w-1/3
                        object-cover rounded-2xl shadow-xl"
            />

        </div>
    );
}