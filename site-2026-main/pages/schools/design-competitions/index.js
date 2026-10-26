import Content from "@/content";
import Info from "@/content/info.js";
import Button from "@/button";

// MSDC and HSDC on one page (they were /msdc and /hsdc, which redirect to #msdc and #hsdc here;
// see next.config.js). The shared description is written once.
export default function DesignCompetitionsPage() {
  return (
    <Content
      title="Design Competitions"
      onThisPage={[{ id: "msdc", label: "Middle School (MSDC)" }, { id: "hsdc", label: "High School (HSDC)" }]}
    >
      <div className="font-body mb-10">
        Our Middle School and High School Design Competitions (MSDC and HSDC) are engineering-focused competitions on Friday, April 9. Students work in teams of 3-5 to create a design and presentation that will be evaluated at the end of the competition. It’s a great opportunity for students to gain hands-on engineering design and teamwork experience!
        <br />
        <br />
        <Info>
          We have decided not to release the themes this year to ensure a fair competition.
        </Info>
      </div>
      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <section id="msdc" aria-labelledby="msdc-heading" className="da-card scroll-mt-24 p-6 lg:scroll-mt-32">
          <h2 id="msdc-heading" className="font-display text-2xl uppercase">Middle School Design Competition</h2>
          <Button
            type="big"
            divClass="mt-6 flex justify-center"
            className="px-6 py-3 rounded-md drop-shadow-md text-lg font-semibold"
            href="https://docs.google.com/forms/d/e/1FAIpQLSekpeSFjM1RHXKDca-OCqi5ldS5q_Zxy296I5WThF-YjvewyA/viewform"
            target="_blank"
          >
            MSDC Registration Closed
          </Button>
        </section>
        <section id="hsdc" aria-labelledby="hsdc-heading" className="da-card scroll-mt-24 p-6 lg:scroll-mt-32">
          <h2 id="hsdc-heading" className="font-display text-2xl uppercase">High School Design Competition</h2>
          <Button
            type="big"
            divClass="mt-6 flex justify-center"
            className="px-6 py-3 rounded-md drop-shadow-md text-lg font-semibold"
            href="https://docs.google.com/forms/d/e/1FAIpQLSehjy07XLsKKv7BTrGMHRpfBf0NYCpYT28yhV_QU_E0ksqZVg/viewform"
            target="_blank"
          >
            HSDC 2027 Interest Form
          </Button>
        </section>
      </div>
    </Content>
  );
}
