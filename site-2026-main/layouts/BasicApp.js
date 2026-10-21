import Footer from '@/footer';
import Header from '@/header';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

const LINKTREE_URL = 'https://linktr.ee/eoh2025';
const FB_URL = 'https://www.facebook.com/EngineeringOpenHouse/';
const INSTA_URL = 'https://www.instagram.com/eoh_illinois/';
const TWITTER_URL = 'https://twitter.com/IllinoisEOH';
const CONTACT_US = '/contact-us';

const SOCIALS = { LINKTREE_URL, FB_URL, INSTA_URL, TWITTER_URL };

// `type` picks the button style in utilities/types.js (da-* = Direction A header styles)
const HEADER_ITEMS = [
  { text: "Volunteer", href: "/volunteer", type: "da-link" },
  {
    text: "Contact Us",
    href: CONTACT_US,
    type: "da-link"
  },
  {
    text: "FAQs",
    href: "/faq",
    type: "da-link"
  },
  {
    text: "Sponsors",
    href: "/#sponsors",
    type: "da-link"
  },
  {
    text: "Field Trips",
    href: "/field-trips",
    type: "da-link"
  },
  {
    text: "Judging",
    href: "/judging",
    type: "da-link"
  },
  {
    text: "Students",
    href: "/students",
    type: "da-link"
  },
  { text: "Visitor View",
    href: "/vv",
    type: "da-navy",
  },
  {
    text: "Visitor Guide",
    href: "/guide.pdf",
    target: "_blank",
    type: "da-primary"
  },
  {
    text: 'Linktree',
    href: LINKTREE_URL,
    type: 'da-secondary'
  }
];

export default function BasicApp({ Component, pageProps }) {
  const router = useRouter()
  return (
    <Fragment>
      {(
        <div>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Header
            headerItems={HEADER_ITEMS}
          />
          <div id="main-content" className="w-screen main-content" role="main">
            <Component {...pageProps} />
          </div>
          {router.pathname != '/vv' && <Footer socials={SOCIALS} />}
        </div>
      )}
    </Fragment>
  )
}
