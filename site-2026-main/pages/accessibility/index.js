import { Fragment } from "react";
import Content from "@/content";
import Head from "next/head";
import Link from "next/link";

export default function AccessibilityPage() {
  return (
    <Fragment>
      <Head>
        <title>Event Accessibility | EOH 2026</title>
        <meta name="description" content="Engineering Open House accessibility information and accommodation requests for events and programs." />
      </Head>
      <Content title="Event Accessibility">
        <div className="text-left font-montserrat space-y-8 max-w-3xl mx-auto">
          <p className="text-lg">
            Engineering Open House is committed to ensuring our programs, courses, and events are accessible to all participants. We follow university accessibility guidelines for every event, symposium, and meeting.
          </p>

          <section aria-labelledby="publications-statement">
            <h2 id="publications-statement" className="text-2xl font-bold mb-3 text-primary-brown">
              Alternative Formats
            </h2>
            <p>
              Alternative accessible formats of this document and other EOH materials can be obtained upon request by contacting the{" "}
              <Link href="/contact-us" className="text-blue-600 underline hover:text-blue-800">
                EOH Committee
              </Link>{" "}
              at <a href="mailto:eoh@ec.illinois.edu" className="text-blue-600 underline hover:text-blue-800">eoh@ec.illinois.edu</a>.
            </p>
          </section>

          <section aria-labelledby="accommodations-statement">
            <h2 id="accommodations-statement" className="text-2xl font-bold mb-3 text-primary-brown">
              Disability-Related Accommodations
            </h2>
            <p>
              If you will need disability-related accommodations in order to participate in Engineering Open House or any EOH program or event, please contact the{" "}
              <Link href="/contact-us" className="text-blue-600 underline hover:text-blue-800">
                EOH Committee
              </Link>{" "}
              at <a href="mailto:eoh@ec.illinois.edu" className="text-blue-600 underline hover:text-blue-800">eoh@ec.illinois.edu</a>. Early requests are strongly encouraged to allow sufficient time to meet your access needs.
            </p>
            <p className="mt-2 text-sm text-gray-700">
              Please allow at least two weeks&apos; notice for requests for CART or sign language interpreters. While we may set a preferred deadline for accommodation requests, we will make every effort to provide accommodations even when requests are made after that date.
            </p>
          </section>

          <section aria-labelledby="dietary-statement">
            <h2 id="dietary-statement" className="text-2xl font-bold mb-3 text-primary-brown">
              Dietary Needs
            </h2>
            <p>
              If you have special dietary needs for any EOH event that includes a meal, please contact us at{" "}
              <a href="mailto:eoh@ec.illinois.edu" className="text-blue-600 underline hover:text-blue-800">eoh@ec.illinois.edu</a>.
            </p>
          </section>

          <section aria-labelledby="digital-accessibility">
            <h2 id="digital-accessibility" className="text-2xl font-bold mb-3 text-primary-brown">
              Digital Accessibility
            </h2>
            <p>
              We strive to make our website and digital materials accessible. If you encounter barriers or have questions about digital accessibility, please contact your unit&apos;s IT Director or the university&apos;s{" "}
              <a href="mailto:adacoordinator@illinois.edu" className="text-blue-600 underline hover:text-blue-800">ADA Coordinator Office</a>.
            </p>
          </section>

          <section aria-labelledby="university-contacts">
            <h2 id="university-contacts" className="text-2xl font-bold mb-3 text-primary-brown">
              University Resources
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>ADA Coordinator Office</strong> (general accessibility questions): Phone{" "}
                <a href="tel:+12173008670" className="text-blue-600 underline hover:text-blue-800">217-300-8670</a>, Email{" "}
                <a href="mailto:adacoordinator@illinois.edu" className="text-blue-600 underline hover:text-blue-800">adacoordinator@illinois.edu</a>
              </li>
              <li>
                <strong>Special Events</strong> (event-related questions): Email{" "}
                <a href="mailto:specialevents@illinois.edu" className="text-blue-600 underline hover:text-blue-800">specialevents@illinois.edu</a> or call{" "}
                <a href="tel:+12173338834" className="text-blue-600 underline hover:text-blue-800">217-333-8834</a>
              </li>
            </ul>
          </section>

          <p className="pt-4 border-t border-gray-200">
            For all other EOH questions, visit our{" "}
            <Link href="/contact-us" className="text-blue-600 underline hover:text-blue-800">
              Contact Us
            </Link>{" "}
            page.
          </p>
        </div>
      </Content>
    </Fragment>
  );
}
