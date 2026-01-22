import { Fragment } from "react";
import Content from "@/content";
import Head from "next/head";
import Bubble from "@/bubble";
import Button from "@/button";
import SponsorCard from "@/sponsor-card";

export default function Judging() {
  return (
    <Content title="Judging">
      <div className="lg:col-span-3 mb-0 text-center">

        {/* Hook */}
        <h2 className="font-montserrat text-3xl font-bold mb-2">
          Help Shape the Future of Engineering at EOH
        </h2>

        <p className="font-montserrat text-lg max-w-3xl mx-auto mb-4">
          Engineering Open House (EOH) is a flagship showcase of hands-on
          engineering projects. UIUC alumni, professors, and graduate students
          are invited to serve as judges and engage directly with student teams.
        </p>

        {/* Event Details */}
        <div className="max-w-xl mx-auto mb-2 p-3 rounded-lg bg-gray-50">
          <p className="text-lg mb-1">
            <span className="font-bold">📅 Date:</span> April 10th
          </p>
          <p className="text-lg mb-1">
            <span className="font-bold">⏰ Time:</span> 8:00 AM – 5:00 PM
          </p>
          <p className="text-lg">
            <span className="font-bold">📍 Location:</span> Across the UIUC Engineering Campus
          </p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-4">
          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2">🤝 Team-Based Judging</h3>
            <p>
              Collaborate with fellow judges to evaluate innovative student projects.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2">🎓 No Experience Needed</h3>
            <p>
              No prior EOH judging experience required — we’ll guide you through it.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm bg-yellow-50">
            <h3 className="text-xl font-bold mb-2">
              🍕 Free Food & 👕 EOH T-Shirt
            </h3>
            <p className="font-semibold">
              Enjoy complimentary meals and take home an exclusive EOH T-shirt.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="font-montserrat mb-2">
          Questions? Reach out to{" "}
          <a
            href="mailto:eoh-judging@ec.illinois.edu"
            className="font-bold underline"
          >
            eoh-judging@ec.illinois.edu
          </a>
        </div>

        {/* CTA */}
        <div className="mx-auto">
          <Button
            type="big"
            className="px-10 py-4 text-lg font-bold rounded-none
                       bg-gradient-to-r from-yellow-400 to-yellow-500
                       hover:scale-105 transition-transform
                       drop-shadow-lg"
            href="https://docs.google.com/forms/d/e/1FAIpQLSeNWz-dxvtHJQpYfBSIUCWy9fvQZsKtnxLHG_mC_BWMobvohw/viewform"
            target="_blank"
          >
            Apply to Judge
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            Takes less than 3 minutes
          </p>
        </div>

      </div>
    </Content>
  );
}
