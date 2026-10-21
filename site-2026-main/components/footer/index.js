const footerSections = [
  {
    heading: "Special Events",
    links: [
      { text: "Middle School Design Competition", href: "/msdc" },
      { text: "High School Design Competition", href: "/hsdc" },
      { text: "Students", href: "/students" },
    ],
  },
  {
    heading: "Get Involved",
    links: [
      { text: "Linktree", href: "https://linktr.ee/EOHuiuc" },
    ],
  },
  {
    heading: "EOH Committee",
    links: [
      { text: "Contact Us", href: "/contact-us" },
      { text: "Accessibility", href: "/accessibility" },
      { text: "Support EOH", href: "/#sponsors" },
      { text: "Engineering Council", href: "https://www.ecillinois.org/" },
      { text: "History of EOH", href: "https://grainger.illinois.edu/news/features/EOH-100" },
      { text: "Future Dates", href: "/future-dates" },
    ],
  },
  {
    heading: "Keep In Touch",
    links: [
      { text: "Mailing List", href: "https://forms.gle/A7QqftMGGXKgbBmv5" },
      { text: "Facebook", href: "https://www.facebook.com/EngineeringOpenHouse/" },
      { text: "Instagram", href: "https://www.instagram.com/eoh_illinois/" },
      { text: "X (formerly Twitter)", href: "https://twitter.com/IllinoisEOH" },
    ],
  },
];

export default function Footer({ socials }) {
  return (
    <footer className="relative flex flex-col w-full p-10 md:p-16 overflow-hidden bg-da-navy font-body text-white">
      {/* Purple-to-transparent gradient behind text */}
      {/* <div
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(128, 0, 128, 0.65) 25%, rgba(128, 0, 128, 0) 85%)",
        }}
      /> */}

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center md:flex-row md:items-start">
        <div className="flex w-full flex-row flex-wrap items-stretch justify-evenly">
          {footerSections.map((section) => (
            <div className="flex flex-col p-3 w-44 gap-1" key={section.heading}>
              <h3 className="mb-1 font-display text-xl uppercase tracking-wide text-da-orange-light">{section.heading}</h3>
              {section.links?.map((link) => (
                <a
                  href={link.href}
                  className="mt-2 rounded font-medium text-white hover:underline hover:decoration-da-orange-light hover:decoration-2 hover:underline-offset-4 focus:outline focus:ring-2 focus:ring-da-orange focus:ring-offset-2 focus:ring-offset-da-navy"
                  key={link.href}
                  style={{lineHeight: "1"}}
                  {...(link.href.startsWith("http") ? { rel: "noopener noreferrer", target: "_blank" } : {})}
                >
                  {link.text}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="relative z-10 mt-12 text-center font-label text-xs uppercase tracking-[0.1em] text-white">
        Copyright EOH 2026
      </p>
    </footer>
  );
}
