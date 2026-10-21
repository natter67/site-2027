import { Fragment, useMemo, useState } from "react"
import Button from "@/button"
import Link from "next/link"
import MobileMenu from "@/mobile-menu"
import { useAuth } from "../../providers/Auth"

export default function Header({ headerItems }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, loading } = useAuth()

  const mobileMenu = useMemo(() => {
    // hardcore js right here
    const items = []
    headerItems.forEach((item) => {
      if (typeof item.menuItems === "undefined") {
        items.push(item)
      } else {
        if (item.href && !item.noMobile)
          items.push({ text: item.text, href: item.href, type: item.type })
        item.menuItems.forEach((child) => {
          items.push(child)
        })
      }
    })

    if (!loading) {
      if (user) {
        items.push({ text: "Account", href: "/account", type: "da-link" })
      } else {
        items.push({ text: "Login", href: "/login", type: "da-link" })
      }
    }
    return items
  }, [headerItems, user, loading])

  return (
    <Fragment>
      {/* Mobile (96px tall: page top offsets in components/content, components/section and pages/vv depend on it) */}
      <div className="fixed top-0 z-30 flex h-24 w-screen flex-col justify-center border-b-2 border-da-navy bg-white lg:hidden">
        <div className="flex w-full items-center justify-between gap-2 px-4 sm:px-6">
          <Link href="/" aria-label="Engineering Open House home" className="shrink-0">
            <img
              src="/assets/logo/eohheader2027.svg"
              alt="Engineering Open House"
              className="h-14 w-auto cursor-pointer object-contain sm:h-16"
            />
          </Link>

          <div className="flex min-w-0 flex-1 justify-center px-1">
            <Button
              text="Visitor View"
              href="/vv"
              type="da-navy"
              className="text-center"
            >
              Visitor View
            </Button>
          </div>

          <button
            type="button"
            className="shrink-0 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
          >
            <img
              src="/assets/ui/menu.svg"
              className="h-10 w-auto cursor-pointer object-contain"
              alt=""
            />
          </button>
        </div>
      </div>
      <MobileMenu
        menuOpen={menuOpen}
        items={mobileMenu}
        kill={() => setMenuOpen(false)}
      />

      {/* Desktop (88px tall: page top offsets depend on it) */}
      <div className="hidden lg:block fixed top-0 w-screen h-[88px] border-b-2 border-da-navy bg-white z-30">
        <div className="mx-auto flex h-full max-w-[1280px] items-center px-6">
          <nav className="flex w-full flex-row items-center" aria-label="Main navigation">
            <Link href="/" aria-label="Engineering Open House home" className="mr-4 shrink-0">
              <img
                src="/assets/logo/eohheader2027.svg"
                alt="Engineering Open House"
                className="h-12 w-auto cursor-pointer xl:h-14"
                draggable={false}
              />
            </Link>
            <div className="flex w-full flex-row items-center justify-end">
              {/* These are the nav bar buttons dynamically loaded in */}
              {headerItems.map(({ type, text, href, target, menuItems }) => (
                <Button
                  key={text}
                  type={type}
                  text={text}
                  href={href}
                  target={target}
                  menuItems={menuItems}
                  className={`${
                    type === "da-link" ? "mr-3 xl:mr-5" : "mr-2 xl:mr-3"
                  } text-center`}
                  flyoutClassName={
                    "uppercase text-center font-bold text-sm hover:text-theme-red transition delay-150 duration-200 ease-in-out font-montserrat"
                  }
                  // multiline
                >
                  {text}
                </Button>
              ))}

              {!loading && (
                user ? (
                  <Button
                    text="Account"
                    href="/account"
                    type="da-link"
                    className="text-center"
                  >
                    Account
                  </Button>
                ) : (
                  <Button
                    text="Login"
                    href="/login"
                    type="da-link"
                    className="text-center"
                  >
                    Login
                  </Button>
                )
              )}
            </div>
          </nav>
        </div>
      </div>
    </Fragment>
  )
}
