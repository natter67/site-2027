import React from 'react';

export default function QuantumDay() {
    return (
        // Add flex-col instead of justify-center if you're including the text
        <div className="flex justify-center md:flex-row items-center 
                        gap-8 mx-6 md:mx-auto md:w-3/4 text-sm">
            <img 
                src="assets/images/quantumDayFlyer.jpg" 
                alt="World Quantum Day flyer" 
                className="w-full md:w-2/5 lg:w-1/2
                           object-cover rounded-2xl shadow-xl"
            />

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