import Button from '@/button';
import { Modal } from '../../components/modal/index.js';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import Countdown from 'react-countdown';



const slotGradients = {
  0: 'bg-gradient-to-tr from-[#d62828] via-[#d62828] to-[#d62828]',
  1: 'bg-gradient-to-tr from-[#ff8400] via-[#ff8400] to-[#ff8400]',
  2: 'bg-gradient-to-tr from-[#c578d6] via-[#c578d6] to-[#c578d6]',
  3: 'bg-gradient-to-tr from-[#a2d3c2] via-[#a2d3c2] to-[#a2d3c2]',
  4: 'bg-gradient-to-tr from-[#c578d6] via-[#c578d6] to-[#c578d6]',
  5: 'bg-gradient-to-tr from-[#a2d3c2] via-[#a2d3c2] to-[#a2d3c2]',
}


export default function ExhibitApplication() {
  return (
    <div>
        <p className='md:w-2/3 mx-5 md:mx-auto text-center mb-5'>
            Join us for an Exhibits Town Hall to learn about the application process, exhibitor expectations, and safety. Each exhibit is required to have <strong>at least one representative attend</strong> Exhibits Town Hall <strong>prior to submitting</strong> the application in order to participate in EOH 2026.
            <br />
            Remaining Town Halls:
            <br />
            - Wednesday, November 5, 2025 – 6–7 PM, Engineering Hall 106B6
            <br />
            - Sunday, November 16, 2025 – 6–7 PM, Digital Computer Laboratory 1320
            <br />
            Applications are live and will be due December 21 at 11:59pm. It is highly recommended you attend one of the town halls prior to the application process!
            <br />
            <strong>APPLY TO BE AN EXHIBITOR!</strong>
        </p>

        <Countdown date={new Date('2025-12-21T23:59:00')} 
            renderer = {({ days, hours, minutes, seconds, completed }) => {
                if (completed) {
                    return (
                        <div className={`w-full text-center py-6 rounded-2xl bg-white/5`}>
                        <div className="text-lg font-semibold">Time's up!</div>
                        </div>
                    );
                }
                return (
                    <div className={`inline-flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-white/5 to-white/3`}>
                        <div>({days}:{hours}:{minutes}:{seconds})</div>
                    </div>
                );
        }} />
    </div>
  );
}