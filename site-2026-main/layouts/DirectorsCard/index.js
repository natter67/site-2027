import Link from "next/link";

// Home page card for the Note from the Directors. The quote is the letter's first paragraph,
// copied word for word from layouts/Directors (the full letter at /about/directors). If the
// letter changes, update this quote too.
const DIRECTORS = [
  { name: "Aparna Kamath", initials: "AK", photo: "/assets/headshots/aparna.jpg" },
  { name: "Maddie Conrad", initials: "MC", photo: "/assets/headshots/maddie.jpg" },
];

export default function DirectorsCard() {
  return (
    <figure className="da-card mx-auto w-[calc(100%-2rem)] max-w-4xl p-6 text-left md:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
        <div className="flex shrink-0 gap-3">
          {DIRECTORS.map((d) => (
            <img
              key={d.name}
              src={d.photo}
              alt={d.name}
              width={96}
              height={96}
              loading="lazy"
              className="!h-24 !w-24 rounded-full border-[3px] border-da-navy object-cover"
            />
          ))}
        </div>
        <blockquote className="m-0">
          <p className="text-lg leading-relaxed md:text-xl">
            <span aria-hidden="true" className="font-display text-4xl leading-none text-da-orange-text">“</span>
            Welcome to the 104th Engineering Open House (EOH) at the University of Illinois Urbana–Champaign! Whether this is your first visit or your tenth, we are incredibly excited to welcome you all to the nation’s largest student-run STEM (Science, Technology, Engineering, and Math) fair and to showcase how the Grainger College of Engineering is <b>Forging the Future</b>.
          </p>
        </blockquote>
      </div>
      <figcaption className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t-2 border-da-navy pt-5">
        <span className="flex items-center gap-4">
          <span aria-hidden="true" className="font-display text-3xl text-da-orange-text">
            {DIRECTORS.map((d) => d.initials).join(" · ")}
          </span>
          <span>
            <span className="block font-semibold">Aparna Kamath &amp; Maddie Conrad</span>
            <span className="block text-sm">Co-Directors, Engineering Open House 2026</span>
          </span>
        </span>
        <Link href="/about/directors" className="da-pill da-pill--navy">
          Read the full letter <span aria-hidden="true">→</span>
        </Link>
      </figcaption>
    </figure>
  );
}
