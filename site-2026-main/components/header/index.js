import { Fragment, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import MegaMenu from "@/mega-menu"
import MobileNav from "@/mobile-nav"
import EventTabBar from "@/event-tab-bar"
import { useEventMode } from "@utilities/useEventMode"
import { VISITOR_HUB, DONATE_URL, linkProps } from "@utilities/navigation"
import { useAuth } from "../../providers/Auth"

// Site header. Menu links live in utilities/navigation.js.
// Heights: 64px on mobile, 72px on desktop (one bar). Page top offsets in components/content,
// components/section, layouts/Title and pages/vv leave room for these heights.

const FOCUS = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-da-orange"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const router = useRouter()
  const { user, loading } = useAuth()
  const mode = useEventMode()
  // Mobile's one primary action: "Plan your visit", or the Visitor Hub while EOH is on
  const primary = mode === "event" ? VISITOR_HUB : { label: "Plan your visit", href: "/visit" }
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

      {/* Desktop: one bar with the logo, mega menu, then Log in, Visitor Hub and Donate */}
      <header className="fixed top-0 z-30 hidden h-[72px] w-screen border-b-2 border-da-navy bg-white font-body lg:block">
        <div className="mx-auto flex h-full max-w-[1280px] items-stretch px-6">
          <Link href="/" aria-label="Engineering Open House home" className={`mr-4 flex shrink-0 items-center ${FOCUS}`}>
            <img src="/assets/logo/eohheader2027.svg" alt="Engineering Open House" className="h-10 w-auto" draggable={false} />
          </Link>
          <MegaMenu />
          <div className="flex items-center gap-2">
            {[accountLink, VISITOR_HUB].filter(Boolean).map((link) => (
              <Link key={link.href} href={link.href} className={`da-pill da-pill--sm da-pill--primary whitespace-nowrap ${FOCUS}`}>
                {link.label}
              </Link>
            ))}
            {/* Hidden below 1280px so the bar fits; Donate is also under Get Involved */}
            <span className="hidden xl:flex">
              <a href={DONATE_URL} {...linkProps(DONATE_URL)} className={`da-pill da-pill--sm da-pill--navy whitespace-nowrap ${FOCUS}`}>
                Donate
              </a>
            </span>
          </div>
        </div>
      </header>
    </Fragment>
  )
}
