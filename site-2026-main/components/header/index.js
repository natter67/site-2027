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
        items.push({ text: "Account", href: "/account", type: undefined })
      } else {
        items.push({ text: "Login", href: "/login", type: undefined })
      }
    }
    return items
  }, [headerItems, user, loading])

  return (
    <Fragment>
      {/* Mobile */}
      <div className="fixed top-0 z-30 flex h-24 w-screen flex-col justify-center border-4 bg-white lg:hidden">
        <div className="flex w-full items-center justify-between gap-2 px-4 sm:px-6">
          <Link href="/" aria-label="Engineering Open House home" className="shrink-0">
            <img
              src="/assets/logo/eohheader.svg"
              alt="Engineering Open House"
              className="h-14 w-auto cursor-pointer object-contain sm:h-16"
            />
          </Link>

          <div className="flex min-w-0 flex-1 justify-center px-1">
            <Button
              text="Visitor View"
              href="/vv"
              type="green"
              className="uppercase text-center font-montserrat"
              style={{ fontWeight: 700, fontSize: 14 }}
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

      {/* Desktop */}
      <div className="hidden lg:block fixed top-0 w-screen h-34 bg-white flex-col justify-center z-30">
        <div className="w-5/6 m-auto py-0">
          <nav className="flex flex-row w-full" aria-label="Main navigation">
            <Link href="/" aria-label="Engineering Open House home">
              <img
                src="/assets/logo/eohheader.svg"
                alt="Engineering Open House"
                className="h-20 mt-2 cursor-pointer -ml-4"
                draggable={false}
              />
            </Link>
            <div className="mt-6 flex flex-row w-full justify-end">
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
                    typeof type === "undefined" ? "mr-6" : "mr-3"
                  } uppercase text-center font-montserrat`}
                  flyoutClassName={
                    "uppercase text-center font-bold text-sm hover:text-theme-red transition delay-150 duration-200 ease-in-out font-montserrat"
                  }
                  style={{ fontWeight: 700, fontSize: 14 }}
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
                    className="mr-3 uppercase text-center font-montserrat"
                    style={{ fontWeight: 700, fontSize: 14 }}
                  >
                    Account
                  </Button>
                ) : (
                  <Button
                    text="Login"
                    href="/login"
                    className="mr-3 uppercase text-center font-montserrat"
                    style={{ fontWeight: 700, fontSize: 14 }}
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
