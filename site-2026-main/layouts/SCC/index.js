import React from 'react';
import Image from 'next/image';

export default function SCC() {
    return (
        // Add flex-col instead of justify-center if you're including the text
        <div className="flex flex-col md:flex-row items-center justify-center
                gap-10 mx-6 md:mx-auto md:w-3/4 text-sm">

            <div className="da-card w-full p-6 text-left md:w-1/2">
                <p className="text-xl font-bold">EOH's new sustainability initiatives, sponsored by the Student Sustainability Committee (SSC):</p>
                <br></br>
                <ul className="text-lg list-disc list-inside space-y-1 marker:text-da-orange">
                    <li>Sustainably made t-shirts </li>
                    <li>Build-your-Own Terrarium workshop</li>
                    <li>Soda Tab Buddy workshop</li>
                    <li>Refillable water station</li>
                    <li>Compost bins stationed across the engineering campus</li>
                    <li>Compostable silverware at the food trucks</li>
                </ul>
            </div>

            <div className="da-card w-full overflow-hidden p-2 md:w-2/5 lg:w-1/3">
                <Image
                    src="/assets/images/scc.png"
                    width={1024}
                    height={1024}
                    sizes="(min-width: 768px) 33vw, 92vw"
                    alt=""
                    className="rounded-xl"
                />
            </div>

        </div>
    );
}