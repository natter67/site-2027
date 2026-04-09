import Section from "@/section"
import Interest from "@layouts/Interest"
import Sponsors from "@layouts/Sponsors"
import Title from "@layouts/Title"
import Head from "next/head.js"
import { Fragment } from "react"
import CorporateSponsorLayout from "../layouts/CorporateSponsorLayout/index.js"
import Directors from "../layouts/Directors/index.js"
import EventList from "../layouts/EventList/index.js"
import { KeynoteSpeaker } from "../layouts/Keynote/index.js"
import ScheduleSection from "../layouts/Schedule/index.js"
import Visitors from "../layouts/Visitors/index.js"
import Awards from "../layouts/Awards/index.js"
import ExhibitApplication from "@layouts/ExhibitApplication /index.js"
import QuantumDay from "@layouts/QuantumDay/index.js"
import SCC from "@layouts/SCC/index.js"

export default function Home() {
  return (
    <Fragment>
      <Head>
        <title>EOH 2026</title>
        <link rel="icon" href="/eoh2026.ico" />
        <meta name="google-site-verification" content="N_zq-IzUiNIJFGldY3CVIn-PDSYtHkdklYt2VuMSa4E" />
      </Head>

      <main>
        <Title />
        <div className="mt-24 sm:mt-16 md:mt-0"></div>
        {/* <Section color="white" title="EOH 2025 Awards" id="awards">
          <Awards />
        </Section>  */}
        <Section color="bg-white" title="Visitors Information" id="visitors">
          <Visitors />
        </Section>
        <Section
          color="bg-cover bg-center"
          id="keynote"
          title={
            <span className="block text-center font-bold">
              {/* Mobile version: with <br> */}
              <span className="block sm:hidden">
                Keynote from<br />Christina Ernst
              </span>
              {/* Desktop version: no <br> */}
              <span className="hidden sm:inline">
                Keynote from Christina Ernst
              </span>
            </span>
          }
        >
          <KeynoteSpeaker
            timeString="Friday, April 10th - 2:30 PM to 3:30 PM" 
            description="Christina Ernst is a senior software engineer at Google and the fashioneering content creator behind shebuildsrobots.com. Her tech-fashion crossover work has been featured in CNN Style, Make: Magazine, Forbes, Entertainment Weekly, CBC, and Popular Science. She was a recurring engineering correspondent on Season 6 of the educational STEM show 'Mission Unstoppable with Miranda Cosgrove' and also served as the 2024 Maker-in-Residence at Chicago Public Library."
            imagePath="assets/images/keynote-headshot-christina.jpg"
            name="Christina Ernst"
            backgroundNum="1"
            />
        </Section>
        <Section
          color="bg-cover bg-center"
          id="keynote"
          title={
            <span className="block text-center font-bold">
              {/* Mobile version: with <br> */}
              <span className="block sm:hidden">
                Keynote from<br />Dr. Aadeel Akhtar
              </span>
              {/* Desktop version: no <br> */}
              <span className="hidden sm:inline">
                Keynote from Dr. Aadeel Akhtar
              </span>
            </span>
          }
        >
          <KeynoteSpeaker
            timeString="Saturday, April 11th - 3:00 PM to 4:00 PM" 
            description="Dr. Aadeel Akhtar, CEO of PSYONIC, founded the company to create advanced, accessible bionic limbs after meeting a young girl missing a limb in Pakistan. PSYONIC's bionic Ability Hand is the fastest on the market, impact-resistant, and the first to provide a sense of touch. It is also covered by Medicare and is being used by humans and robotics companies globally, including NASA, Meta, Mercedes, and Google. Dr. Akhtar earned a Ph.D. in Neuroscience and an M.S. in Electrical & Computer Engineering from the University of Illinois, along with a B.S. in Biology and an M.S. in Computer Science from Loyola University Chicago. He’s been recognized by MIT Technology Review and Newsweek and secured a 3-shark deal on Shark Tank."
            imagePath="assets/images/keynote-headshot-aadeel.jpg"
            name="Dr. Aadeel Akhtar"
            backgroundNum="2"
          />
        </Section>
        <Section
          title="Featured Events"
          color="bg-white"
          id="featured-events"
          wide
        >
          <EventList />
        </Section>
        <Section color="bg-white" title="World Quantum Day" id="world-quantum-day">
          < QuantumDay/>
        </Section>
        <Section color="bg-white" title="EOH x Sustainability" id="scc">
          < SCC/>
        </Section>
        <Section title="Schedule" color="bg-white" id="schedule" wide>
          <ScheduleSection />
        </Section>
        <Section
          color="bg-white"
          title="Note from the Directors"
          id="directors"
        >
          <Directors />
        </Section>
        {/*<Section color="white" title="Director's Note" id="about-us">
					<AboutUs />
				</Section>
				<Section color="theme" title="Special events timeline" id="special-events" wide>
					<SpecialEvents />
				</Section>
				<Section color="white" title="Exhibits" id="exhibits" wide>
					<Exhibits />
      </Section>*/}
        <Section
          title="Support Our Mission"
          id="sponsors"
          color="bg-robot-banner bg-cover bg-left min-h-[550px]"
        >
          <Sponsors />
        </Section>
        <Section
          color="bg-white"
          title="Corporate Sponsors"
          id="corporate-sponsors"
        >
          <CorporateSponsorLayout />
        </Section>

        {/* <Section color="white" title="EOH 2024 Awards" id="awards">
          <Awards />
        </Section> */}
        
        <div className="h-12"></div>
      </main>
    </Fragment>
  )
}
