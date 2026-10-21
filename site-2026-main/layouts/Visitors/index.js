import { Icon } from "@iconify/react"
import Info from "../../components/content/info.js"
import { LOCATIONS } from "../../utilities/links.js"
import { ShuttleInformation } from "../../components/shuttle/index.js"

const visitorBooths = [
  {
    link: LOCATIONS.CIF,
    text: "Campus Instructional Facility (CIF)",
  },
  {
    link: LOCATIONS.GrazianoPlaza,
    text: "on Graziano Plaza",
  },
  {
    link: LOCATIONS.SidneyLu,
    text: "outside Sidney Lu",
  },
  {
    link: LOCATIONS.MEB,
    text: "Mechanical Engineering Building",
  },
  {
    link: LOCATIONS.Loomis,
    text: "outside Loomis Laboratory",
  },
  {
    link: LOCATIONS.ECEB,
    text: "outside Electrical and Computer Engineering Building (ECEB)",
  },
]

export default function Visitors() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      <div className="da-card mx-auto flex w-full flex-col items-center gap-6 p-6 md:flex-row md:p-8">
        <svg aria-hidden="true" viewBox="0 0 80 80" className="h-20 w-20 shrink-0">
          <circle cx="40" cy="40" r="34" className="fill-white stroke-da-navy" strokeWidth="4" />
          <text x="40" y="18" textAnchor="middle" fontSize="11" className="font-display fill-da-navy">N</text>
          <g className="da-compass-needle">
            <path d="M40 14 L46 40 L40 66 L34 40 Z" className="fill-da-navy" />
            <path d="M40 14 L46 40 L34 40 Z" className="fill-da-orange" />
          </g>
          <circle cx="40" cy="40" r="4" className="fill-white stroke-da-navy" strokeWidth="2" />
        </svg>
      <div className="flex w-full flex-1 flex-col gap-3">
          <a
            href="/guide.pdf"
            className="da-pill da-pill--primary w-full text-lg"
          >
            <Icon icon="oi:book" className="text-2xl" />
            <span>Visitor Guide</span>
          </a>

          <a
            href="/faq"
            className="da-pill da-pill--secondary w-full text-lg"
          >
            <Icon icon="wpf:faq" className="text-2xl" />
            <span>FAQs</span>
          </a>
          
          {/* <p className="mt-2">
            We're excited to help you discover EOH! <br />
            Find our volunteers to answer your questions here:
          </p> */}
          {/* <ul className="pl-3">
            {visitorBooths.map((booth) => (
              <li key={booth.link}>
                <a
                  className="hover:text-blue-600 duration-200 text-blue-800"
                  href={booth.link}
                  target="_blank"
                >
                  {booth.text}
                </a>
              </li>
            ))}
          </ul> */}
          {/* <div className="mt-4">
            <Info>
              All minors must be accompanied by a parent or guardian at all
              times!
            </Info>
          </div> */}
        </div>
        <div className="flex w-full flex-1 flex-col gap-3">
          <a
            href="/students"
            className="da-pill da-pill--secondary w-full text-lg"
          >
            <Icon icon="mdi:backpack" className="text-2xl" />
            <span>New Students</span>

          </a>

          <ShuttleInformation />
        </div>
      </div>
    </div>
  )
}
