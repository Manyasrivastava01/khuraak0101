import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FaCheckCircle, FaInfoCircle, FaBirthdayCake, FaRing, FaBriefcase, FaGlassCheers, FaBuilding, FaWhatsapp, FaPhone } from 'react-icons/fa'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const ADMIN_PHONE = '919105104000'

const EVENT_TYPES = [
  { value: 'birthday',    label: '🎂 Birthday Party',          icon: <FaBirthdayCake /> },
  { value: 'anniversary', label: '💑 Anniversary Celebration',  icon: <FaGlassCheers /> },
  { value: 'corporate',   label: '💼 Corporate Event',         icon: <FaBriefcase /> },
  { value: 'kitty',       label: '🎉 Kitty Party',             icon: <FaGlassCheers /> },
  { value: 'ring',        label: '💍 Ring Ceremony',           icon: <FaRing /> },
  { value: 'other',       label: '✨ Other Celebration',        icon: null },
]

const INITIAL_FORM = {
  name: '', phone: '', event_type: '',
  date: '', guests: '', location_type: 'restaurant', notes: '',
}

export default function Events() {
  const [form, setForm]           = useState(INITIAL_FORM)
  const [errors, setErrors]       = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const validate = () => {
    const e = {}
    if (!form.name.trim())       e.name       = 'Name is required'
    if (!form.phone.trim())      e.phone      = 'Phone is required'
    if (!/^[6-9]\d{9}$/.test(form.phone.trim().replace(/\D/g, ''))) e.phone = 'Enter a valid 10-digit mobile number'
    if (!form.event_type)        e.event_type = 'Please select an event type'
    if (!form.date)              e.date       = 'Please select a date'
    if (!form.guests || form.guests < 1) e.guests = 'Please enter number of guests'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)

    const cleanPhone = form.phone.trim().replace(/\D/g, '')
    const eventLabel = EVENT_TYPES.find(e => e.value === form.event_type)?.label || form.event_type

    // Clean event enquiry message sent by the client to Khuraak WhatsApp
    const clientEnquiryMsg =
`🎉 *EVENT / CELEBRATION ENQUIRY*
*Khuraak Multi Cuisine Restaurant*
━━━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${form.name.trim()}
📞 *Contact Number:* +91 ${cleanPhone}
🎈 *Occasion:* ${eventLabel}
📅 *Event Date:* ${form.date}
👥 *Expected Guests:* ${form.guests} Persons
🏢 *Venue:* At Khuraak Restaurant (Etawah)
${form.notes ? `📝 *Special Requests:* ${form.notes.trim()}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━
Please let me know about table availability and packages. Thank you!`

    const waLink = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(clientEnquiryMsg)}`
    setWhatsappUrl(waLink)

    // Save backup to Supabase if configured (silently catch if offline)
    try {
      await supabase.from('event_enquiries').insert([{
        name:          form.name.trim(),
        phone:         cleanPhone,
        event_type:    form.event_type,
        date:          form.date,
        guests:        parseInt(form.guests),
        location_type: form.location_type,
        notes:         form.notes.trim() || null,
        status:        'pending',
      }])
    } catch (err) {
      console.warn('Backup sync note:', err)
    }

    setLoading(false)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Open WhatsApp directly in new window
    window.open(waLink, '_blank')
  }

  const packages = [
    { icon: '🎂', title: 'Birthday Celebrations',   desc: 'Festive celebrations with cake arrangements, balloon decor, and dedicated table service.' },
    { icon: '💑', title: 'Anniversary Dinners',     desc: 'Romantic and family anniversary setups with exquisite multi-cuisine dishes and warm hospitality.' },
    { icon: '💼', title: 'Corporate Events',        desc: 'Business dinners, team lunches, and client entertainment in a sophisticated setting.' },
    { icon: '🎉', title: 'Kitty Parties',           desc: 'Fun-filled gatherings with customised menus, mocktails, and exclusive seating.' },
    { icon: '💍', title: 'Ring Ceremonies',         desc: 'Mark your special milestone with family and friends in an elegant, celebratory environment.' },
    { icon: '✨', title: 'Private Dining',           desc: 'Reserve a section of our restaurant exclusively for your group (up to 120 seats).' },
  ]

  return (
    <>
      <Helmet>
        <title>Events & Celebrations — Khuraak Multi Cuisine Restaurant, Etawah</title>
        <meta name="description" content="Host your birthday party, anniversary dinner, corporate event, or kitty party at Khuraak Multi Cuisine Restaurant. Enquire now." />
      </Helmet>

      {/* Header */}
      <div className="bg-charcoal pt-28 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #D7141A 1px, transparent 0)`, backgroundSize: '40px 40px' }}
        />
        <div className="relative container-max text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase font-sans mb-3">Celebrate With Us</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Events & Celebrations</h1>
          <div className="ornament my-4"><span className="ornament-dot" /></div>
          <p className="text-white/60 font-sans max-w-lg mx-auto">
            From birthdays and anniversaries to grand family celebrations — we make every occasion unforgettable at our restaurant.
          </p>
        </div>
      </div>

      {/* What we offer */}
      <section className="section bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-charcoal mb-3">What We Offer</h2>
            <div className="ornament"><span className="ornament-dot" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map(({ icon, title, desc }) => (
              <div key={title}
                className="bg-offwhite rounded-2xl p-6 border border-border hover:shadow-md hover:border-primary/20
                           transition-all duration-200 group">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-serif text-lg font-semibold text-charcoal mb-2 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-gray-500 text-sm font-sans leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="section bg-offwhite">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-charcoal mb-3">Send an Enquiry</h2>
            <div className="ornament mb-3"><span className="ornament-dot" /></div>
            <p className="text-gray-500 font-sans text-sm">
              Share your details and our team will reach out on WhatsApp to plan your event.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-border text-center animate-slide-up">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                <FaCheckCircle size={40} className="text-green-500" />
              </div>
              <h3 className="font-serif text-3xl font-bold text-charcoal mb-2">Enquiry Sent!</h3>
              <div className="ornament mb-4"><span className="ornament-dot" /></div>
              <p className="text-gray-600 font-sans leading-relaxed mb-3 max-w-lg mx-auto">
                Thank you, <strong>{form.name}</strong>! Your enquiry for{' '}
                <strong>{EVENT_TYPES.find(e => e.value === form.event_type)?.label}</strong> with{' '}
                <strong>{form.guests} guests</strong> on <strong>{form.date}</strong> is ready.
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 max-w-lg mx-auto text-left mb-6">
                <p className="font-sans font-semibold text-purple-900 text-sm mb-1 flex items-center gap-2">
                  <FaWhatsapp className="text-green-600" size={16} /> Ready to send to Khuraak Restaurant
                </p>
                <p className="font-sans text-xs text-purple-800 leading-relaxed">
                  Click the green button below to send your event details directly to Khuraak Restaurant (+91 91051 04000). Our manager will reply to your WhatsApp to confirm and coordinate arrangements!
                </p>
              </div>

              {whatsappUrl && (
                <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-green-500 hover:bg-green-600 text-white font-sans font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    <FaWhatsapp size={18} /> Open WhatsApp to Send Details
                  </a>
                  <a
                    href="tel:+919105104000"
                    className="btn-outline !py-3.5 flex items-center justify-center gap-2"
                  >
                    <FaPhone size={13} /> Call +91 91051 04000
                  </a>
                </div>
              )}

              <button onClick={() => { setForm(INITIAL_FORM); setSubmitted(false) }} className="text-gray-400 hover:text-charcoal text-xs font-sans underline">
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-border" noValidate>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-7 flex gap-3">
                <FaInfoCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                <p className="text-amber-700 text-sm font-sans">
                  The admin will reply to your enquiry personally via WhatsApp. No payment is needed online.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="ev-name" className="form-label">Your Name *</label>
                  <input id="ev-name" name="name" type="text" value={form.name} onChange={handleChange}
                    placeholder="e.g. Sunita Kapoor"
                    className={`form-input ${errors.name ? '!border-red-400' : ''}`} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="ev-phone" className="form-label">Mobile Number *</label>
                  <input id="ev-phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                    placeholder="10-digit number"
                    className={`form-input ${errors.phone ? '!border-red-400' : ''}`} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="ev-type" className="form-label">Event Type *</label>
                  <select id="ev-type" name="event_type" value={form.event_type} onChange={handleChange}
                    className={`form-input ${errors.event_type ? '!border-red-400' : ''}`}>
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  {errors.event_type && <p className="text-red-500 text-xs mt-1">{errors.event_type}</p>}
                </div>

                <div>
                  <label htmlFor="ev-date" className="form-label">Event Date *</label>
                  <input id="ev-date" name="date" type="date" value={form.date} onChange={handleChange}
                    min={today}
                    className={`form-input ${errors.date ? '!border-red-400' : ''}`} />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label htmlFor="ev-guests" className="form-label">Approximate Guests *</label>
                  <input id="ev-guests" name="guests" type="number" value={form.guests} onChange={handleChange}
                    min={1} placeholder="e.g. 40"
                    className={`form-input ${errors.guests ? '!border-red-400' : ''}`} />
                  {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests}</p>}
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center gap-2 p-3 bg-red-50/60 rounded-xl border border-red-100 text-charcoal text-xs font-sans">
                    <FaBuilding className="text-primary shrink-0" size={13} />
                    <span>All celebrations are hosted at <strong>Khuraak Multi Cuisine Restaurant</strong> (120 seating capacity).</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="ev-notes" className="form-label">Additional Notes</label>
                  <textarea id="ev-notes" name="notes" value={form.notes} onChange={handleChange}
                    rows={3} placeholder="Theme, special decoration requests, dietary needs, timing preferences..."
                    className="form-input resize-none" />
                </div>
              </div>

              <div className="mt-8">
                <button id="event-submit-btn" type="submit" disabled={loading}
                  className="btn-primary w-full sm:w-auto !px-10 !py-4 disabled:opacity-60">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                    : 'Send Enquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
