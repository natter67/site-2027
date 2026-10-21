import Footer from '@/footer';
import Header from '@/header';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { useEventMode } from '@utilities/useEventMode';

// Pages that keep their own look instead of the Direction A page background and body font:
// home draws its own sections, and the rest are event-day tools (plus every /judging/... page).
const OWN_LOOK_PAGES = ['/', '/vv', '/volunteer', '/admin', '/login', '/account'];

export default function BasicApp({ Component, pageProps }) {
  const router = useRouter()
  const mode = useEventMode()
  const daPage = !OWN_LOOK_PAGES.includes(router.pathname) && !router.pathname.startsWith('/judging/');
  // flow-root keeps a page's top margin inside the background; isolate keeps z-index:-1 images
  // (the Sponsor Us photo) painted above it. da-ground lives in styles/direction-a.css.
  const daClasses = daPage ? 'da-ground font-body text-da-navy flow-root isolate' : '';
  return (
    <Fragment>
      {(
        <div>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <div id="main-content" className={`w-screen main-content ${daClasses}`} role="main">
            <Component {...pageProps} />
          </div>
          {router.pathname != '/vv' && <Footer />}
          {/* Room for the event-day tab bar (components/event-tab-bar) on phones */}
          {mode === 'event' && router.pathname != '/vv' && <div aria-hidden="true" className="h-16 lg:hidden" />}
        </div>
      )}
    </Fragment>
  )
}
