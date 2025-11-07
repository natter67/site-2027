import Button from '@/button';
import { Modal } from '../../components/modal/index.js';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import Countdown from 'react-countdown';

export default function ExhibitApplication() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 md:px-16 py-12">

      {/* Description Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-10 text-[#333] max-w-3xl leading-relaxed border border-white/40">
        <p className="text-base md:text-lg mb-4">
          Join us for an Exhibits Town Hall to learn about the application process, exhibitor expectations, and safety. 
          Each exhibit is required to have <strong>at least one representative attend</strong> Exhibits Town Hall 
          <strong> prior to submitting</strong> the application in order to participate in EOH 2026.
        </p>

        <div className="text-left md:text-center text-[#5a2a00] font-medium">
          <p className="mb-1">Remaining Town Halls:</p>
          <ul className="space-y-1">
            <li>Sunday, November 16, 2025 – 6–7 PM, Digital Computer Laboratory 1320</li>
          </ul>
        </div>

        <p className="mt-4 text-base md:text-lg">
          Applications are live and will be due <strong>December 21 at 11:59 PM</strong>. 
          It is highly recommended you attend one of the town halls prior to the application process!
        </p>

        <div className="mt-6">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSd0tk0y6-JgCthtNGlDVeQbjXIK_JgufToRxqqjHNT-GhFxyQ/viewform?pli=1"
            target='_blank'
            className="inline-block bg-gradient-to-r from-[#ff7b00] to-[#ffb347] text-white font-bold py-3 px-8 rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-200"
          >
            APPLY TO BE AN EXHIBITOR
          </a>
        </div>
    </div>
    {/* Countdown */}
    <div className="mt-16 text-center">
    <h3 className="text-3xl md:text-4xl font-extrabold text-theme-dark-purple mb-6">
        Countdown to Second Town Hall
    </h3>
    <Countdown
        date={new Date('2025-11-16T18:00:00')}
        renderer={({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return (
            <div className="text-xl md:text-2xl font-semibold bg-theme-dark-purple text-white px-10 py-6 rounded-3xl shadow-lg inline-block">
                The second town hall has started!
            </div>
            );
        }
        return (
            <div className="inline-flex flex-col items-center justify-center bg-[#4b0082] text-white text-4xl md:text-6xl font-bold px-12 py-8 rounded-3xl shadow-2xl tracking-wider space-y-3 md:space-y-5">
            <div className="flex gap-8 md:gap-14">
                <div className="flex flex-col items-center">
                <span className="text-6xl md:text-7xl">{days}</span>
                <span className="text-sm md:text-base uppercase opacity-80 mt-2">Days</span>
                </div>
                <div className="flex flex-col items-center">
                <span className="text-6xl md:text-7xl">{hours}</span>
                <span className="text-sm md:text-base uppercase opacity-80 mt-2">Hours</span>
                </div>
                <div className="flex flex-col items-center">
                <span className="text-6xl md:text-7xl">{minutes}</span>
                <span className="text-sm md:text-base uppercase opacity-80 mt-2">Minutes</span>
                </div>
                <div className="flex flex-col items-center">
                <span className="text-6xl md:text-7xl">{seconds}</span>
                <span className="text-sm md:text-base uppercase opacity-80 mt-2">Seconds</span>
                </div>
            </div>
            </div>
        );
        }}
    />
    </div>
    
    </div>
  );
}