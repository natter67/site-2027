import Section from "@/section"
import Interest from "@layouts/Interest"
import Sponsors from "@layouts/Sponsors"
import Title from "@layouts/Title"
import Head from "next/head.js"
import { useRouter } from "next/router"
import { Fragment, useEffect } from "react"
import CorporateSponsorLayout from "../layouts/CorporateSponsorLayout/index.js"
import DownloadApp from "@layouts/DownloadApp/index.js"
import Leaderboard from "@layouts/Leaderboard/index.js"
import RoadDivider from "@/road-divider"
import QuickFacts from "@layouts/QuickFacts"
import StartHere from "@layouts/StartHere"
import Highlights from "@layouts/Highlights"
import SchedulePreview from "@layouts/SchedulePreview"
import DirectorsCard from "@layouts/DirectorsCard"

// Content that used to live on the home page. Old links such as /#awards still work: the browser
// never sends the #part to the server, so the redirect has to happen here.
const MOVED_ANCHORS = {
  "#awards": "/explore/awards",
  "#keynote": "/explore/keynotes",
  "#visitors": "/visit",
  "#world-quantum-day": "/explore/initiatives#world-quantum-day",
  "#scc": "/explore/initiatives#scc",
  "#special-events": "/explore/special-events",
}

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const to = MOVED_ANCHORS[window.location.hash]
    if (to) router.replace(to)
  }, [])

  return (
    <Fragment>
      <Head>
        <title>EOH 2026</title>
        <link rel="icon" href="/eoh2026.ico" />
        <meta name="google-site-verification" content="N_zq-IzUiNIJFGldY3CVIn-PDSYtHkdklYt2VuMSa4E" />
      </Head>

      <main>
        <Title />
        <QuickFacts />
        <Section variant="road" mile="MILE 01 · START HERE" title="Start here" id="start-here">
          <StartHere />
        </Section>
        <Section variant="road" mile="MILE 02 · HIGHLIGHTS" title="Highlights" id="featured-events">
          <Highlights />
        </Section>
        <RoadDivider />
        <Section variant="road" mile="MILE 03 · SCHEDULE" title="Schedule" id="schedule">
          <SchedulePreview />
        </Section>
        <Section variant="road" mile="MILE 04 · FROM THE DIRECTORS" title="Note from the Directors" id="directors">
          <DirectorsCard />
        </Section>
        <RoadDivider car="orange" />
        <Section
          color="bg-white"
          variant="road"
          tone="navy"
          mile="MILE 05 · FUELED BY OUR SPONSORS"
          title="Corporate Sponsors"
          id="corporate-sponsors"
        >
          <CorporateSponsorLayout />
        </Section>
        <Section
          variant="road"
          mile="MILE 06 · SUPPORT"
          title="Support Our Mission"
          id="sponsors"
          color="bg-robot-banner bg-cover bg-left min-h-[550px]"
        >
          <Sponsors />
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
        {/* <Section color="white" title="EOH 2024 Awards" id="awards">
          <Awards />
        </Section> */}
      </main>
    </Fragment>
  )
}
