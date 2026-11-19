import { Helmet } from 'react-helmet-async'
import { FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaInstagram, FaFacebookF } from 'react-icons/fa'

const HOURS = [
  { day: 'Monday – Sunday', time: '11:00 AM – 11:30 PM' },
]

// Real Google Maps short link provided by restaurant owner
const MAPS_LINK = 'https://maps.app.goo.gl/KRBYAgUNq4sURgmp9'
// Gmail compose link so it opens Gmail instead of Outlook
const GMAIL_LINK = 'https://mail.google.com/mail/?view=cm&to=Khuraaketawah@gmail.com'

export default function Contact() {

  return (
    <>
      <Helmet>
        <title>Contact & Location — Khuraak Multi Cuisine Restaurant</title>
        <meta name="description" content="Find Khuraak Multi Cuisine Restaurant — address, phone, WhatsApp, opening hours, and Google Maps directions." />
      </Helmet>

      {/* Header */}
      <div className="bg-charcoal pt-28 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #D7141A 1px, transparent 0)`, backgroundSize: '40px 40px' }}
        />
        <div className="relative container-max text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase font-sans mb-3">Get in Touch</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Contact & Location</h1>
          <div className="ornament my-4"><span className="ornament-dot" /></div>
          <p className="text-white/60 font-sans max-w-lg mx-auto">
            We'd love to hear from you. Visit us, call us, or reach out to us on WhatsApp.
          </p>
        </div>
      </div>

      <div className="section bg-offwhite">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Left — Info */}
            <div className="space-y-6">
              {/* Quick contact */}
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                <h2 className="font-serif text-xl font-bold text-charcoal mb-5">Contact Details</h2>
                <div className="space-y-4">
                  <a href="tel:+919105104000"
                    className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                      <FaPhone size={14} className="text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-sans">Call Us</p>
                      <p className="font-sans font-medium text-charcoal group-hover:text-primary transition-colors">+91 91051 04000</p>
                    </div>
                  </a>

                  <a href="https://wa.me/919105104000" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-500 transition-colors">
                      <FaWhatsapp size={16} className="text-green-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-sans">WhatsApp</p>
                      <p className="font-sans font-medium text-charcoal group-hover:text-green-600 transition-colors">Chat on WhatsApp</p>
                    </div>
                  </a>

                  <a href={GMAIL_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                      <FaEnvelope size={14} className="text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-sans">Email</p>
                      <p className="font-sans font-medium text-charcoal group-hover:text-primary transition-colors">Khuraaketawah@gmail.com</p>
                    </div>
                  </a>

                  <a href="https://www.instagram.com/khuraak_etawah/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center shrink-0 group-hover:bg-pink-500 transition-colors">
                      <FaInstagram size={15} className="text-pink-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-sans">Instagram</p>
                      <p className="font-sans font-medium text-charcoal group-hover:text-pink-600 transition-colors">@khuraak_etawah</p>
                    </div>
                  </a>

                  <a href="https://www.facebook.com/khuraaketawah" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                      <FaFacebookF size={14} className="text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-sans">Facebook</p>
                      <p className="font-sans font-medium text-charcoal group-hover:text-blue-600 transition-colors">khuraaketawah</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                      <FaMapMarkerAlt size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-sans">Address</p>
                      <p className="font-sans font-medium text-charcoal">Khuraak Multi Cuisine Restaurant</p>
                      <p className="text-sm text-gray-500 font-sans leading-relaxed mt-0.5">
                        Near, bharthana chauraha, Ashok Nagar, Etawah, Uttar Pradesh 206001
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                <h2 className="font-serif text-xl font-bold text-charcoal mb-4">Opening Hours</h2>
                <div className="space-y-2">
                  {HOURS.map(({ day, time }) => (
                    <div key={day} className="flex items-center justify-between font-sans text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <FaClock size={12} className="text-primary" /> {day}
                      </span>
                      <span className="font-medium text-charcoal">{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/919105104000?text=Hi%20Khuraak%2C%20I%20have%20a%20query"
                target="_blank"
                rel="noopener noreferrer"
                id="contact-whatsapp-btn"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl
                           bg-green-500 hover:bg-green-600 text-white font-sans font-semibold
                           transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FaWhatsapp size={20} /> Chat with Us on WhatsApp
              </a>
            </div>

            {/* Right — Map only */}
            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex flex-col gap-4">
              <h2 className="font-serif text-xl font-bold text-charcoal">Find Us on Map</h2>
              <div className="rounded-xl overflow-hidden border border-border" style={{ minHeight: '340px', height: '360px' }}>
                <iframe
                  src="https://maps.google.com/maps?q=26.7882172,79.0323821+(Khuraak+Multi+Cuisine+Restaurant)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Khuraak Restaurant Location - Etawah"
                />
              </div>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center justify-center gap-2 w-full py-3 text-center"
              >
                <FaMapMarkerAlt size={14} /> Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
