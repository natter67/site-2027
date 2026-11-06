import { Fragment } from "react";
import Content from "@/content";
import Head from "next/head";
import Bubble from "@/bubble";
import Button from "@/button";
import SponsorCard from "@/sponsor-card";

export default function StartupShowcasePage() {
  return (
    <Content title="Startup Showcase">
        <div className="lg:col-span-3 mb-10">
        <div className="font-body col-span-5">
        EOH Startup Showcase is a subset of the exhibits dedicated to celebrating entrepreneurship at Illinois. You can expect opportunities to be in a pitch competition for a cash prize, a chance to talk to visitors from all across the country about your startup, exposure to Venture Capitalists through dedicated events, and exposure to EOH’s corporate sponsors. We are looking to host around 10 startups from UIUC for EOH, and we are very excited about the awesome ventures that come out of Startup Showcase each year. EOH receives <span className="font-bold">35,000+ visitors</span> every year, so the selected teams stand to gain a lot of traction from participating in this event.
          </div>
          <br/>
          <br/>
          <p className="text-center font-body font-bold">
          Applications are reviewed on a rolling basis until <span className="text-theme-red font-black">March 1st</span>, and next semester we will begin info sessions for the selected candidates to finalize your level of involvement. EOH seems far away, but if you expect to have a prototype or anything tangible come spring, fill out the form!
            
            <br/>
        </p>
        <div className="flex align-center justify-center mt-10">
            <Button type="mail" className="px-2 rounded-none drop-shadow-md inline-block" href="https://docs.google.com/forms/d/e/1FAIpQLSdMZkrcqtVlomWrQuFC295SA7oxNDOWH9z-q2tt_I87ld8eBw/viewform?usp=send_form">
                Startup Showcase Form
            </Button>
        </div>
        <p className="text-center font-body mt-5">Startup Showcase will occur during both days of EOH. More information will be provided during the info sessions. A rough itinerary is attached to the form.</p>
        
        </div>
    </Content>
  );
}
