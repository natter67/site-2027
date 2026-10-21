import React from 'react';
import Image from 'next/image';

export default function QuantumDay() {
    return (
        // Add flex-col instead of justify-center if you're including the text
        <div className="flex justify-center md:flex-row items-center 
                        gap-8 mx-6 md:mx-auto md:w-3/4 text-sm">
            <div className="da-card w-full max-w-2xl overflow-hidden p-2 sm:p-3">
                <Image
                    src="/assets/images/quantumDayFlyer.jpg"
                    width={2550}
                    height={3300}
                    sizes="(min-width: 768px) 640px, 92vw"
                    alt="World Quantum Day flyer"
                    className="rounded-xl"
                />
            </div>

            {/* <div className="w-full md:w-3/5 lg:w-2/3 
                            border p-6 rounded-lg 
                            text-center md:text-left">
                <p className="font-montserrat text-lg">
                    Check out IQUIST's World Quantum Day events happening during EOH! 
                    Learn more about quantum computing through live shows, demos, and 
                    escape rooms, and grab some free quantum swag. Unlike Schrödinger's 
                    Cat, you're guaranteed to have a great time!
                </p>
            </div> */}

        </div>
    );
}