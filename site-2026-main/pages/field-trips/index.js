import Link from "next/link";
import Content from "@/content";
import Button from "@/button";

export default function FieldTripsPage() {
  return (
    <Content title="Field Trips">
      <div className="lg:flex">
        <img
          className="w-48 h-48 mx-auto lg:mr-10 mb-10"
          src="assets/background/children.png"
          alt="Children illustration"
        />
        <div className="lg:col-span-3 mb-10 text-center">
          <p className="font-body text-lg">
            In order to help us plan and streamline traffic managment this year, we are asking groups to let us know when they will be arriving on campus. Please reach out to (eoh-outreach@ec.illinois.edu) if you have any questions, comments, or concerns!
          </p>
          <Button
            type="big"
            className="px-6 py-3 rounded-md drop-shadow-md mt-6 text-lg font-semibold"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdy2jym4Tf1uj0Ek4elr9ecCb4a29vdAfhYyWlEvBQzh5dygQ/viewform"
            target="_blank"
          >
            EOH School Interest Form 2027
          </Button>
          {/* DRAFT copy */}
          <p className="font-body mt-3">
            The registration form is coming soon, once T-shirt pricing is out.
          </p>
        </div>
      </div>

      <div className="text-center mx-auto max-w-3xl">
        <h2 className="title text-3xl font-bold mb-4">MSDC and HSDC</h2>
        {/* Details and forms live on /schools/design-competitions */}
        <p className="font-body text-lg">
          Our Middle School and High School Design Competitions (MSDC and HSDC)
          are on <b>Friday, April 9</b>. Details and forms are on the{" "}
          <Link href="/schools/design-competitions" className="font-semibold underline decoration-da-orange decoration-2 underline-offset-4">
            Design Competitions
          </Link>{" "}
          page.
        </p>
      </div>

      {/* Bus Drop-Off & Parking Section */}
      <div className="mt-16 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Bus Drop-Off & Parking</h2>

        <h3 className="text-lg font-semibold mb-2">For Field Trip Buses:</h3>
        <p className="font-body text-lg">
          Buses should arrive via <b>Goodwin Avenue</b> and drop off students
          at lot <b>B-22</b>, following directions from EOH volunteers.
        </p>
        <p className="font-body text-lg mt-2">
          After drop-off, buses will park in <b>Lot B22</b> (corner of Goodwin
          Street and University Street, east of the Parking Department
          building).
        </p>
        <p className="font-body text-lg mt-2">
          At the end of the day, EOH will have <b>shuttles</b> running from campus
          to <b>B22</b> to bring students back to their buses for departure.
        </p>

        {/* Car parking and the shuttle live on /visit (utilities/parking.js, components/shuttle) */}
        <h3 className="text-lg font-semibold mt-6 mb-2">For Visitors Arriving in Cars:</h3>
        <p className="font-body text-lg">
          Parking lots (with Google Maps links) and the EOH shuttle are under{" "}
          <Link href="/visit#getting-here" className="font-semibold underline decoration-da-orange decoration-2 underline-offset-4">
            Shuttles & parking
          </Link>
          . Visitors may also drop off near EOH and then go park.
        </p>
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <img
          className="w-1/2 md:w-1/3 rounded-md shadow-md"
          src="assets/images/b22.png"
          alt="Parking at B22 illustration"
        />
      </div>

      {/* FAQs live on the FAQ page (layouts/FAQs/faqs.json, "Field Trip" category) */}
      <p className="mt-16 font-body text-lg">
        Planning your group's day or lunch? See the{" "}
        <Link href="/faq#field-trip-faqs" className="font-semibold underline decoration-da-orange decoration-2 underline-offset-4">
          field trip FAQs
        </Link>
        .
      </p>
    </Content>
  );
}
