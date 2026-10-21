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
import QuantumDay from "@layouts/QuantumDay/index.js"
import SCC from "@layouts/SCC/index.js"
import DownloadApp from "@layouts/DownloadApp/index.js"
import Leaderboard from "@layouts/Leaderboard/index.js"
import Ticker from "@/ticker"
import RoadDivider from "@/road-divider"
import Timeline from "@layouts/Timeline/index.js"
import DiscoveryLab from "@layouts/DiscoveryLab/index.js"
import Passport from "@layouts/Passport/index.js"

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
        <Ticker />
        <Section variant="road" mile="MILE 01 · AWARDS" color="white" title="EOH 2026 Awards" id="awards">
          <Awards />
        </Section>
        <Section variant="road" mile="MILE 02 · VISITOR INFO" color="bg-white" title="Visitors Information" id="visitors">
          <Visitors />
        </Section>
        <RoadDivider />
        <Section
          variant="road"
          mile="MILE 03 · KEYNOTES"
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
            />
        </Section>
        <Section
          variant="road"
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
          />
        </Section>
        <Section
          variant="road"
          mile="MILE 04 · FEATURED EVENTS"
          title="Featured Events"
          color="bg-white"
          id="featured-events"
          wide
        >
          <EventList />
        </Section>
        {/* Discovery Lab, Passport and Timeline: draft content (confirm with team); delete a block to remove that section */}
        <Section variant="road" tone="navy" mile="MILE 05 · DISCOVERY LAB" title="Pick a field. Start discovering." id="discovery-lab">
          <DiscoveryLab />
        </Section>
        <Section variant="road" mile="MILE 06 · FUEL UP" title="Your discovery passport" id="passport">
          <Passport />
        </Section>
        <Section variant="road" mile="MILE 07 · QUANTUM DAY" color="bg-white" title="World Quantum Day" id="world-quantum-day">
          < QuantumDay/>
        </Section>
        <Section variant="road" mile="MILE 08 · SUSTAINABILITY" color="bg-white" title="EOH x Sustainability" id="scc">
          < SCC/>
        </Section>
        <RoadDivider car="orange" />
        <Section variant="road" mile="MILE 09 · SCHEDULE" title="Schedule" color="bg-white" id="schedule" wide>
          <ScheduleSection />
        </Section>
        <Section variant="road" mile="MILE 10 · DISCOVERED HERE" title="The road runs through history" id="history">
          <Timeline />
        </Section>
        <Section
          color="bg-white"
          variant="road"
          mile="MILE 11 · FROM THE DIRECTORS"
          title="Note from the Directors"
          id="directors"
        >
          <Directors />
        </Section>
        <RoadDivider />
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
          variant="road"
          mile="MILE 12 · SUPPORT"
          title="Support Our Mission"
          id="sponsors"
          color="bg-robot-banner bg-cover bg-left min-h-[550px]"
        >
          <Sponsors />
        </Section>
        <Section
          color="bg-white"
          variant="road"
          tone="navy"
          mile="MILE 13 · FUELED BY OUR SPONSORS"
          title="Corporate Sponsors"
          id="corporate-sponsors"
        >
          <CorporateSponsorLayout />
        </Section>

        {/* <Section color="white" title="EOH 2024 Awards" id="awards">
          <Awards />
        </Section> */}
        
      </main>
    </Fragment>
  )
}
