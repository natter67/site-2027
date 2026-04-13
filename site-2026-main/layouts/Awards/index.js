import Button from '@/button';
import { Modal } from '../../components/modal/index.js';
import { useState } from 'react';
import { Icon } from '@iconify/react';

const slotGradients = {
  0: 'bg-gradient-to-tr from-[#d62828] via-[#d62828] to-[#d62828]',
  1: 'bg-gradient-to-tr from-[#ff8400] via-[#ff8400] to-[#ff8400]',
  2: 'bg-gradient-to-tr from-[#c578d6] via-[#c578d6] to-[#c578d6]',
  3: 'bg-gradient-to-tr from-[#a2d3c2] via-[#a2d3c2] to-[#a2d3c2]',
  4: 'bg-gradient-to-tr from-[#c578d6] via-[#c578d6] to-[#c578d6]',
  5: 'bg-gradient-to-tr from-[#a2d3c2] via-[#a2d3c2] to-[#a2d3c2]',
}

const awards = [
  {
    "title": "Visitor’s Favorite Award",
    "1": "Rocket Races",
    "2": "NovoPrint 3D-Printing Robot Arm",
    "3": "Exploring Curie Temperature"
  },
  {
    "title": "Outstanding RSO Exhibit",
    "1": "Motor Testing Technology",
    "2": "Mystery Compound Chemical Investigation",
    "3": "Mouse Integration Glasses"
  },
  {
    "title": "Outstanding Freshman Exhibit",
    "1": "bioplastics",
    "2": "Near-Infrared Diffused Optical Tomography (NIR-DOT)",
    "3": "Dextera"
  },
  {
    "title": "Most Engaging",
    "1": "Step into the Future: Pavement Energy Harvesting",
    "2": "Big Hero 6 Microbots",
    "3": "Department of Climate, Meteorology, and Atmospheric Sciences"
  },
  {
    "title": "Outstanding Undergraduate Research",
    "1": "Scario",
    "2": "Students Pushing INnovation (SPIN) Internship Program",
    "3": "Visual Nutrition"
  },
  {
    "title": "Most Industry Impact",
    "1": "VidaCloud - Intelligent Mattress Topper",
    "2": "FormFit",
    "3": "Market in a Minute"
  },
  {
    "title": "Visionary Impact Award",
    "1": "Devices for Hand/Wrist Mobility Impairment",
    "2": "Novel Mobile Robots Lab",
    "3": "Mouse Integration Glasses"
  },
  {
    "title": "Distinguished Tech Award",
    "1": "Big Hero 6 Microbots",
    "2": "Novel Mobile Robots Lab",
    "3": "SIGRobotics"
  },
  {
    "title": "Sustainability Efforts Award",
    "1": "Step into the Future: Pavement Energy Harvesting",
    "2": "Fueling the Future: From Chemistry to Cars",
    "3": "Solar Cell LBIC Mapping"
  },
  {
    "title": "Forging the Future (Theme Award)",
    "1": "Fueling the Future: From Chemistry to Cars",
    "2": "Students Pushing INnovation (SPIN) Internship Program",
    "3": "IonSpark"
  },
  {
    "title": "Research Showcase",
    "1": "Savindi Devmal",
    "2": null,
    "3": null
  }
];

export default function () {
  const [award, setAward] = useState(null);
  return (
    <>
      <p className='md:w-2/3 mx-5 md:mx-auto text-center mb-5'>
        The Awards Ceremony provides an opportunity to celebrate the hard work that our exhibitors have put into their exhibits.
        We look forward to highlighting outstanding exhibits that demonstrate creativity, innovation, and passion. <br />
        Congratulations to all of our EOH 2026 award winners!
      </p>
      <div className="flex flex-row flex-wrap justify-center gap-5 mx-10">
        {
          award &&
          <Modal open={award != null} setOpen={_x => setAward(null)} title={award.title}>
            <div className="flex flex-col gap-2">
              <h3 className='mt-2 font-heading text-lg'>First Place</h3>
              <span className='flex flex-row rounded-lg items-center gap-4 p-3 text-white font-bold bg-yellow-600'>
                <Icon icon="game-icons:podium-winner" className='text-3xl min-w-[25px]' />
                <p>{award["1"]}</p>
              </span>
              {award["2"] && <>
              <h3 className='mt-2 font-heading text-lg'>Second Place</h3>
              <span className='flex flex-row rounded-lg items-center gap-4 p-3 text-white font-bold bg-gray-600'>
                <Icon icon="game-icons:podium-second" className='text-3xl min-w-[25px]' />
                <p>{award["2"]}</p>
              </span>
              </>}
              {award["3"] && <>
              <h3 className='mt-2 font-heading text-lg'>Third Place</h3>
              <span className='flex flex-row rounded-lg items-center gap-4 p-3 text-white font-bold bg-primary-brown'>
                <Icon icon="game-icons:podium-third" className='text-3xl min-w-[25px]' />
                <p>{award["3"]}</p>
              </span>
              </>}
            </div>
          </Modal>
        }

        {
          awards.map((a, idx) =>
            <button
  key={a.title ?? idx}
  onClick={() => setAward(a)}
  className={`w-72 ${slotGradients[idx % Object.keys(slotGradients).length]} 
            rounded-lg p-4 text-white 
            flex items-center justify-center 
            shadow-lg shadow-gray-600 hover:shadow-lg hover:rounded-xl duration-300`}
>
  <h4 className='text-lg font-semibold text-center'>{a.title}</h4>
</button>

          )
        }
      </div>
    </>
  );
}
