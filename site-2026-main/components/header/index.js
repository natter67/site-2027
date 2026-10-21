import { Fragment, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import MegaMenu from "@/mega-menu"
import MobileNav from "@/mobile-nav"
import EventTabBar from "@/event-tab-bar"
import { useEventMode } from "@utilities/useEventMode"
import { UTILITY_NAV, DONATE_URL, linkProps } from "@utilities/navigation"
import { useAuth } from "../../providers/Auth"

// Site header. Menu links live in utilities/navigation.js.
// Heights: 64px on mobile, 88px on desktop (28px utility bar + 60px main row). Page top offsets
// in components/content, components/section, layouts/Title and pages/vv assume these heights.

const FOCUS = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-da-orange"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const router = useRouter()
  const { user, loading } = useAuth()
  const mode = useEventMode()
  // One primary action: "Plan your visit", or the Event Day Hub while EOH is on
  const primary = mode === "event" ? { label: "Event Day Hub", href: "/vv" } : { label: "Plan your visit", href: "/visit" }
  const accountLink = loading ? null : user ? { label: "Account", href: "/account" } : { label: "Log in", href: "/login" }

  useEffect(() => {
    const close = () => setMenuOpen(false)
    router.events.on("routeChangeStart", close)
    return () => router.events.off("routeChangeStart", close)
  }, [router.events])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [menuOpen])

  return (
    <Fragment>
      {/* Mobile: logo, the one primary action, menu button */}
      <header className="fixed top-0 z-30 flex h-16 w-screen items-center justify-between gap-2 border-b-2 border-da-navy bg-white px-4 font-body lg:hidden">
        <Link href="/" aria-label="Engineering Open House home" className={`shrink-0 ${FOCUS}`}>
          <img src="/assets/logo/eohheader2027.svg" alt="Engineering Open House" className="h-10 w-auto" />
        </Link>
        <Link href={primary.href} className={`da-pill da-pill--sm da-pill--primary whitespace-nowrap ${FOCUS}`}>
          {primary.label}
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          className={`shrink-0 rounded p-1 ${FOCUS}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <img src="/assets/ui/menu.svg" className="h-8 w-auto" alt="" />
        </button>
      </header>
      <MobileNav open={menuOpen} accountLink={accountLink} />
      {mode === "event" && router.pathname !== "/vv" && (
        <EventTabBar onMenu={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />
      )}

      {/* Desktop: utility bar, then logo + mega menu + primary action */}
      <header className="fixed top-0 z-30 hidden h-[88px] w-screen border-b-2 border-da-navy bg-white font-body lg:block">
        <div className="h-7 bg-da-navy text-white">
          <div className="mx-auto flex h-full max-w-[1280px] items-center justify-end gap-5 px-6 text-xs">
            {[...UTILITY_NAV, accountLink].filter(Boolean).map((link) => (
              <Link key={link.href} href={link.href} className={`font-medium hover:underline hover:decoration-da-orange-light hover:underline-offset-4 ${FOCUS}`}>
                {link.label}
              </Link>
            ))}
            <a href={DONATE_URL} {...linkProps(DONATE_URL)} className={`rounded-full bg-da-orange px-3 py-0.5 font-bold text-da-navy hover:bg-da-orange-light ${FOCUS}`}>
              Donate
            </a>
          </div>
        </div>
        <div className="mx-auto flex h-[58px] max-w-[1280px] items-stretch px-6">
          <Link href="/" aria-label="Engineering Open House home" className={`mr-4 flex shrink-0 items-center ${FOCUS}`}>
            <img src="/assets/logo/eohheader2027.svg" alt="Engineering Open House" className="h-10 w-auto" draggable={false} />
          </Link>
          <MegaMenu />
          <div className="flex items-center">
            <Link href={primary.href} className={`da-pill da-pill--sm da-pill--primary whitespace-nowrap ${FOCUS}`}>
              {primary.label}
            </Link>
          </div>
        </div>
      </header>
    </Fragment>
  )
}
