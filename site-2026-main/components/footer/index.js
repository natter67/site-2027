import Link from 'next/link';

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
    <footer
      className="relative flex flex-col w-full p-10 md:p-20 bg-no-repeat bg-bottom bg-cover"
      style={{ backgroundImage: "url('/assets/banners/robot_banner_4.png')" }}
    >

      {/* Purple-to-transparent gradient behind text */}
      {/* <div
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(128, 0, 128, 0.65) 25%, rgba(128, 0, 128, 0) 85%)",
        }}
      /> */}

      <div className="relative z-10 flex flex-col md:flex-row w-full items-center md:items-start bg-theme-orange bg-opacity-15 rounded-lg">
        <div className="flex flex-row flex-wrap items-stretch justify-evenly md:w-2/3">
          {footerSections.map((section) => (
            <div className="flex flex-col p-3 w-44 gap-1" key={section.heading}>
              <h3 className="font-bold mb-1 font-montserrat text-black">{section.heading}</h3>
              {section.links?.map((link) => (
                <a
                  href={link.href}
                  className="hover:text-blue-700 duration-200 font-montserrat font-medium mt-2 text-black focus:outline focus:ring-2 focus:ring-primary-brown focus:ring-offset-2 rounded"
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

      <p className="relative z-10 font-montserrat text-sm text-black text-center mt-20 font-medium">
        Copyright EOH 2026
      </p>
    </footer>
  );
}
