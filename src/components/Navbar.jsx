import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { useSitePhotos } from '../utils/photoStorage'

const NAV_LINKS = [
  { to: '/',            label: 'Home' },
  { to: '/menu',        label: 'Menu' },
  { to: '/reservations',label: 'Reserve' },
  { to: '/events',      label: 'Events' },
  { to: '/about',       label: 'About' },
  { to: '/contact',     label: 'Contact' },
]

export default function Navbar() {
  const photos = useSitePhotos()
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location              = useLocation()
  const isHome                = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on route change & prevent body scroll
  useEffect(() => {
    setOpen(false)
  }, [location])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-white nav-shadow'

  const textColor = isHome && !scrolled ? 'text-white' : 'text-charcoal'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="container-max flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img
              src={photos.heroLogo || "/khuraak-logo.png"}
              alt="Khuraak Multi Cuisine Restaurant"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav (laptops and larger) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 font-sans
                  ${isActive
                    ? 'text-primary font-semibold'
                    : `${textColor} hover:text-primary`
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/reservations"
              className="ml-3 btn-primary !py-2.5 !px-5 !text-xs whitespace-nowrap shadow-sm"
              id="nav-reserve-btn"
            >
              Book a Table
            </Link>
          </nav>

          {/* Mobile / Tablet menu button */}
          <button
            id="mobile-menu-btn"
            onClick={() => setOpen(o => !o)}
            className={`lg:hidden p-2.5 rounded-xl ${textColor} hover:text-primary transition-colors focus:outline-none`}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <HiX size={26} /> : <HiOutlineMenuAlt3 size={26} />}
          </button>
        </div>
      </header>

      {/* Mobile & Tablet Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${open ? 'visible' : 'invisible'}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />

        {/* Drawer panel */}
        <nav
          className={`absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col
            transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <img
              src={photos.heroLogo || "/khuraak-logo.png"}
              alt="Khuraak"
              className="h-10 w-auto object-contain"
            />
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-charcoal hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <HiX size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-1.5">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl text-base font-medium font-sans transition-all
                  ${isActive
                    ? 'bg-red-50 text-primary font-semibold'
                    : 'text-charcoal hover:bg-offwhite hover:text-primary'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="p-6 border-t border-border flex flex-col gap-3 bg-offwhite/50">
            <Link to="/reservations" className="btn-primary w-full justify-center !py-3.5" id="drawer-reserve-btn">
              Book a Table
            </Link>
            <a
              href="https://wa.me/919105104000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full justify-center !py-3.5 !border-green-500 !text-green-600 hover:!bg-green-500 hover:!text-white"
            >
              <FaWhatsapp size={16} /> WhatsApp Us
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
