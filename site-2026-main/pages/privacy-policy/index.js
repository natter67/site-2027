import { Fragment } from "react";
import Content from "@/content";
import Head from "next/head";

export default function PrivacyPolicyPage() {
  return (
    <Fragment>
      <Head>
        <meta
          name="description"
          content="Privacy policy for the Engineering Open House 2026 mobile application."
        />
      </Head>
      <Content title="Privacy Policy" metaTitle="Privacy Policy | EOH 2026 App">
        <div className="text-left font-montserrat space-y-8 max-w-3xl mx-auto pb-16">
          <p className="text-sm text-gray-600">
            Last updated: March 31, 2026
          </p>
          <p className="text-lg">
            The EOH 2026 mobile application (the &quot;App&quot;) keeps sign-in information so accounts can be recognized, and records points from engagement with Engineering Open House (EOH) through the App. No other personal information is collected or used beyond what is needed for those purposes.
          </p>

          <section aria-labelledby="what-is-stored">
            <h2 id="what-is-stored" className="text-2xl font-bold mb-3 text-primary-brown">
              What the App maintains
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Sign-in information</strong> — credentials or account identifiers needed to sign in and stay signed in.
              </li>
              <li>
                <strong>Points</strong> — totals tied to engagement with EOH in the App (for example, participating in event-related activities as designed in the App).
              </li>
            </ul>
          </section>

          <section aria-labelledby="contact">
            <h2 id="contact" className="text-2xl font-bold mb-3 text-primary-brown">
              Questions
            </h2>
            <p>
              Email the EOH Committee at{" "}
              <a href="mailto:eoh@ec.illinois.edu" className="text-blue-600 underline hover:text-blue-800">
                eoh@ec.illinois.edu
              </a>
              , or for technology-related matters,{" "}
              <a href="mailto:eoh-tech@ec.illinois.edu" className="text-blue-600 underline hover:text-blue-800">
                eoh-tech@ec.illinois.edu
              </a>
              .
            </p>
          </section>

          <p className="text-sm text-gray-600 pt-4 border-t border-gray-200">
            This page may be updated; the date at the top reflects the latest version.
          </p>
        </div>
      </Content>
    </Fragment>
  );
}
