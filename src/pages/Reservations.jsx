import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FaCalendarAlt, FaClock, FaUsers, FaInfoCircle, FaCheckCircle, FaWhatsapp, FaPhone } from 'react-icons/fa'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const ADMIN_PHONE = '919105104000'

const TIME_SLOTS = [
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM',  '1:30 PM',  '2:00 PM',  '2:30 PM',
  '3:00 PM',  '3:30 PM',  '4:00 PM',  '4:30 PM',
  '5:00 PM',  '5:30 PM',  '6:00 PM',  '6:30 PM',
  '7:00 PM',  '7:30 PM',  '8:00 PM',  '8:30 PM',
  '9:00 PM',  '9:30 PM',  '10:00 PM', '10:30 PM',
  '11:00 PM',
]

const INITIAL_FORM = {
  name: '', phone: '', email: '',
  date: '', time: '', guests: 2,
  address: '', notes: '',
}

export default function Reservations() {
  const [form, setForm]         = useState(INITIAL_FORM)
  const [errors, setErrors]     = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Name is required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!/^[6-9]\d{9}$/.test(form.phone.trim().replace(/\D/g, ''))) e.phone = 'Enter a valid 10-digit mobile number'
    if (!form.date)         e.date  = 'Please select a date'
    if (!form.time)         e.time  = 'Please select a time'
    if (form.guests < 1 || form.guests > 120) e.guests = 'Guests must be between 1 and 120'
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

    // Clean reservation message sent by the customer to Khuraak WhatsApp
    const customerReservationMsg =
`🍽️ *TABLE RESERVATION REQUEST*
*Khuraak Multi Cuisine Restaurant*
━━━━━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${form.name.trim()}
📞 *Contact Number:* +91 ${cleanPhone}
📅 *Date:* ${form.date}
⏰ *Time:* ${form.time}
👥 *Number of Guests:* ${form.guests} Persons
${form.address ? `📍 *Area:* ${form.address.trim()}\n` : ''}${form.notes ? `📝 *Special Request:* ${form.notes.trim()}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━
Please check availability and let me know if my reservation is confirmed. Thank you!`

    const waLink = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(customerReservationMsg)}`
    setWhatsappUrl(waLink)

    // Save backup to Supabase if configured (silently catch if offline)
    try {
      await supabase.from('reservations').insert([{
        name:    form.name.trim(),
        phone:   cleanPhone,
        email:   form.email.trim() || null,
        date:    form.date,
        time:    form.time,
        guests:  parseInt(form.guests),
        address: form.address.trim() || null,
        notes:   form.notes.trim() || null,
        status:  'pending',
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

  return (
    <>
      <Helmet>
        <title>Reserve a Table — Khuraak Multi Cuisine Restaurant</title>
        <meta name="description" content="Book a table at Khuraak Multi Cuisine Restaurant. Fill in your details and we'll confirm within 12 hours." />
      </Helmet>

      {/* Header */}
      <div className="bg-charcoal pt-28 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #D7141A 1px, transparent 0)`, backgroundSize: '40px 40px' }}
        />
        <div className="relative container-max text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase font-sans mb-3">Dine With Us</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Reserve a Table</h1>
          <div className="ornament my-4"><span className="ornament-dot" /></div>
          <p className="text-white/60 font-sans max-w-lg mx-auto">
            Fill in your details below. We'll confirm your table within 12 hours.
          </p>
        </div>
      </div>

      <div className="bg-offwhite min-h-screen py-12">
        <div className="container-max max-w-3xl">

          {submitted ? (
            /* ── Success State ── */
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-border text-center animate-slide-up">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                <FaCheckCircle size={40} className="text-green-500" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-charcoal mb-2">Reservation Created!</h2>
              <div className="ornament mb-4"><span className="ornament-dot" /></div>
              <p className="text-gray-600 font-sans leading-relaxed mb-3 max-w-lg mx-auto">
                Thank you, <strong>{form.name}</strong>. Your request for{' '}
                <strong>{form.guests} guest{form.guests > 1 ? 's' : ''}</strong> on{' '}
                <strong>{form.date}</strong> at <strong>{form.time}</strong> is ready.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 max-w-lg mx-auto text-left mb-6">
                <p className="font-sans font-semibold text-amber-900 text-sm mb-1 flex items-center gap-2">
                  <FaWhatsapp className="text-green-600" size={16} /> Ready to send to Khuraak Restaurant
                </p>
                <p className="font-sans text-xs text-amber-800 leading-relaxed">
                  Click the green button below to send your reservation directly to Khuraak Restaurant (+91 91051 04000). Our manager will reply to your WhatsApp chat to confirm your table!
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

              <button
                onClick={() => { setForm(INITIAL_FORM); setSubmitted(false) }}
                className="text-gray-400 hover:text-charcoal text-xs font-sans underline"
              >
                Make Another Reservation
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-border" noValidate>
              <h2 className="font-serif text-2xl font-bold text-charcoal mb-1">Your Details</h2>
              <p className="text-gray-400 text-sm font-sans mb-7">Fields marked * are required</p>

              {/* Notice */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-7 flex gap-3">
                <FaInfoCircle className="text-blue-400 shrink-0 mt-0.5" size={16} />
                <p className="text-blue-700 text-sm font-sans leading-relaxed">
                  Reservations are confirmed manually. You'll receive a WhatsApp message once confirmed.
                  We typically respond within <strong>12 hours</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="res-name" className="form-label">Full Name *</label>
                  <input
                    id="res-name" name="name" type="text"
                    value={form.name} onChange={handleChange}
                    placeholder="e.g. Rahul Verma"
                    className={`form-input ${errors.name ? '!border-red-400' : ''}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-sans">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="res-phone" className="form-label">Mobile Number *</label>
                  <input
                    id="res-phone" name="phone" type="tel"
                    value={form.phone} onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={`form-input ${errors.phone ? '!border-red-400' : ''}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 font-sans">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="res-email" className="form-label">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    id="res-email" name="email" type="email"
                    value={form.email} onChange={handleChange}
                    placeholder="you@example.com"
                    className="form-input"
                  />
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="res-date" className="form-label">
                    <FaCalendarAlt className="inline mr-1.5 text-primary" size={12} />
                    Date *
                  </label>
                  <input
                    id="res-date" name="date" type="date"
                    value={form.date} onChange={handleChange}
                    min={today}
                    className={`form-input ${errors.date ? '!border-red-400' : ''}`}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1 font-sans">{errors.date}</p>}
                </div>

                {/* Time */}
                <div>
                  <label htmlFor="res-time" className="form-label">
                    <FaClock className="inline mr-1.5 text-primary" size={12} />
                    Time *
                  </label>
                  <select
                    id="res-time" name="time"
                    value={form.time} onChange={handleChange}
                    className={`form-input ${errors.time ? '!border-red-400' : ''}`}
                  >
                    <option value="">Select time slot</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.time && <p className="text-red-500 text-xs mt-1 font-sans">{errors.time}</p>}
                </div>

                {/* Guests */}
                <div className="sm:col-span-2">
                  <label htmlFor="res-guests" className="form-label">
                    <FaUsers className="inline mr-1.5 text-primary" size={12} />
                    Number of Guests * <span className="text-gray-400 font-normal">(Up to 120 guests)</span>
                  </label>
                  <input
                    id="res-guests" name="guests" type="number"
                    value={form.guests} onChange={handleChange}
                    min={1} max={120}
                    className={`form-input sm:max-w-xs ${errors.guests ? '!border-red-400' : ''}`}
                  />
                  {errors.guests && <p className="text-red-500 text-xs mt-1 font-sans">{errors.guests}</p>}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="res-address" className="form-label">Your Address <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    id="res-address" name="address" type="text"
                    value={form.address} onChange={handleChange}
                    placeholder="Area / Landmark in or around Etawah"
                    className="form-input"
                  />
                </div>

                {/* Notes */}
                <div className="sm:col-span-2">
                  <label htmlFor="res-notes" className="form-label">Special Requests <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea
                    id="res-notes" name="notes"
                    value={form.notes} onChange={handleChange}
                    rows={3}
                    placeholder="Dietary requirements, special occasions, seating preferences..."
                    className="form-input resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
                <button
                  id="reservation-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full sm:w-auto !px-10 !py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                  ) : 'Request Reservation'}
                </button>
                <p className="text-gray-400 text-xs font-sans text-center">
                  Or call directly at <a href="tel:+919105104000" className="text-primary font-medium hover:underline">+91 91051 04000</a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
