import { Link } from 'react-router-dom'
import { FaWhatsapp, FaInstagram, FaFacebookF, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa'
import { useSitePhotos } from '../utils/photoStorage'

const QUICK_LINKS = [
  { to: '/',            label: 'Home' },
  { to: '/menu',        label: 'Our Menu' },
  { to: '/reservations',label: 'Reserve a Table' },
  { to: '/events',      label: 'Events' },
  { to: '/about',       label: 'About Us' },
  { to: '/contact',     label: 'Contact' },
]

export default function Footer() {
  const photos = useSitePhotos()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-white">
      {/* Top CTA strip */}
      <div className="bg-primary py-10">
        <div className="container-max flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl text-white font-bold">Ready for a fine dining experience?</h3>
            <p className="text-white/80 text-sm mt-1 font-sans">Reserve your table today — we'll confirm within 12 hours.</p>
          </div>
          <Link to="/reservations" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary whitespace-nowrap">
            Book a Table
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-max py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand col */}
        <div className="lg:col-span-1">
          <Link to="/" className="inline-block mb-4">
            <img
              src={photos.heroLogo || "/khuraak-logo.png"}
              alt="Khuraak Multi Cuisine Restaurant"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <p className="text-white/60 text-sm font-sans leading-relaxed mb-5">
            Fine dining with authentic multi-cuisine flavours. Every dish tells a story, every meal is a memory.
          </p>
          {/* Social */}
          <div className="flex gap-3">
            <a href="https://wa.me/919105104000" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-green-500 flex items-center justify-center transition-colors duration-200"
              aria-label="WhatsApp">
              <FaWhatsapp size={16} />
            </a>
            <a href="https://www.instagram.com/khuraak_etawah/" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-pink-500 flex items-center justify-center transition-colors duration-200"
              aria-label="Instagram">
              <FaInstagram size={16} />
            </a>
            <a href="https://www.facebook.com/khuraaketawah" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-colors duration-200"
              aria-label="Facebook">
              <FaFacebookF size={15} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-white/60 hover:text-primary text-sm font-sans transition-colors duration-150"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="font-serif text-lg font-semibold text-white mb-4">Opening Hours</h4>
          <ul className="space-y-2 text-sm font-sans text-white/60">
            <li className="flex items-start gap-2">
              <FaClock className="mt-0.5 text-primary shrink-0" size={13} />
              <span>Mon – Sun: 11:00 AM – 11:30 PM</span>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-serif text-lg font-semibold text-white mb-4">Find Us</h4>
          <ul className="space-y-3 text-sm font-sans text-white/60">
            <li className="flex items-start gap-2.5">
              <FaMapMarkerAlt className="mt-0.5 text-primary shrink-0" size={14} />
              <a
                href="https://maps.app.goo.gl/KRBYAgUNq4sURgmp9"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors leading-relaxed"
              >
                Near, bharthana chauraha, Ashok Nagar,<br/>Etawah, UP 206001
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <FaPhoneAlt className="text-primary shrink-0" size={13} />
              <a href="tel:+919105104000" className="hover:text-primary transition-colors">+91 91051 04000</a>
            </li>
            <li className="flex items-center gap-2.5">
              <FaEnvelope className="text-primary shrink-0" size={13} />
              <a href="https://mail.google.com/mail/?view=cm&to=Khuraaketawah@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Khuraaketawah@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-max py-5 text-center text-xs font-sans text-white/40">
          <span>© {year} Khuraak Multi Cuisine Restaurant. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
