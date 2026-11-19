import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  FaArrowRight,
  FaStar,
  FaQuoteLeft,
  FaMapMarkerAlt,
  FaClock,
  FaPhone,
  FaAward,
  FaUtensils,
  FaLeaf,
} from 'react-icons/fa'
import { MdRestaurant, MdMenuBook, MdCelebration } from 'react-icons/md'
import { FEATURED_DISHES, REVIEWS } from '../data/homeData'
import { useSitePhotos } from '../utils/photoStorage'

/* ─── Rating Component ─────────────────────────── */
function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-1 text-amber-400">
      {[1, 2, 3, 4, 5].map(i => (
        <FaStar
          key={i}
          size={14}
          className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
        />
      ))}
    </div>
  )
}

/* ─── Formal 5-Star Section Header ─────────────── */
function SectionHeader({ eyebrow, title, subtitle, light = false }) {
  return (
    <div className="text-center mb-10 sm:mb-14 px-2">
      {eyebrow && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2.5 sm:mb-3">
          <span className="w-6 sm:w-8 h-px bg-primary/40" />
          <span className="text-primary text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase font-sans">
            {eyebrow}
          </span>
          <span className="w-6 sm:w-8 h-px bg-primary/40" />
        </div>
      )}
      <h2
        className={`font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 ${light ? 'text-white' : 'text-charcoal'
          }`}
      >
        {title}
      </h2>
      <div className="ornament my-2.5 sm:my-3">
        <span className="ornament-dot" />
      </div>
      {subtitle && (
        <p
          className={`font-sans text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mt-2.5 sm:mt-3 ${light ? 'text-white/70' : 'text-gray-500'
            }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

/* ─── Luxury Dish Card ─────────────────────────── */
function DishCard({ item }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-border/80 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group">
      <div>
        {/* Card Header with Veg seal & category tag */}
        <div className="bg-gradient-to-r from-red-50/60 to-orange-50/40 p-4 border-b border-border/50 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            100% Pure Veg
          </span>
          <span className="text-primary text-xs font-sans font-medium uppercase tracking-wider">
            Signature Dish
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h3 className="font-serif text-xl font-bold text-charcoal leading-snug group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <span className="font-serif font-bold text-primary text-lg whitespace-nowrap">
              ₹{item.price}
            </span>
          </div>
          <p className="text-gray-500 text-sm font-sans leading-relaxed line-clamp-3">
            {item.description}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2">
        <Link
          to="/menu"
          className="text-xs font-sans font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
        >
          View in Menu <FaArrowRight size={10} />
        </Link>
      </div>
    </div>
  )
}

/* ─── Luxury Review Card ───────────────────────── */
function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm border border-border/80 hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between group">
      <FaQuoteLeft className="text-primary/10 absolute top-5 right-6" size={40} />
      <div>
        <div className="mb-4">
          <StarRating rating={review.rating} />
        </div>
        <p className="text-gray-600 font-sans text-sm sm:text-base leading-relaxed italic mb-6">
          "{review.text}"
        </p>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border/40">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-serif font-bold shadow-md">
          {review.name[0]}
        </div>
        <div>
          <p className="font-sans font-semibold text-sm text-charcoal">{review.name}</p>
          <p className="text-xs text-gray-400 font-sans">Verified Dining Guest</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Home Page ────────────────────────────────── */
export default function Home() {
  const photos = useSitePhotos()

  return (
    <>
      <Helmet>
        <title>Khuraak Multi Cuisine Restaurant — Fine Dining in Etawah</title>
        <meta
          name="description"
          content="Khuraak Multi Cuisine Restaurant — Etawah's premier pure vegetarian fine dining experience. 120 grand seats, authentic multi-cuisine delicacies, and royal Indian hospitality."
        />
      </Helmet>

      {/* ── Hero Section ── */}
      <section
        id="hero"
        className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-20"
        style={{
          background: 'radial-gradient(ellipse at top, #26090c 0%, #170709 45%, #0d0405 100%)',
        }}
      >
        {/* Single soft red radial glow — no dot pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/25 rounded-full blur-[160px]" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
          {/* Logo Showcase (Replacing the circular 'ख' design) */}
          <div className="mb-6 inline-block">
            <img
              src={photos.heroLogo || "/khuraak-logo.png"}
              alt="Khuraak Multi Cuisine Restaurant"
              className="h-20 sm:h-24 md:h-28 w-auto mx-auto object-contain drop-shadow-[0_12px_32px_rgba(215,20,26,0.4)]"
              fetchpriority="high"
              decoding="async"
            />
          </div>

          {/* Formal Eyebrow Ribbon */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-8 sm:w-16 h-px bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-amber-300/90 font-sans text-xs font-semibold tracking-[0.3em] uppercase">
              Multi Cuisine Restaurant
            </span>
            <span className="w-8 sm:w-16 h-px bg-gradient-to-l from-transparent to-amber-400" />
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-5 leading-[1.14] tracking-tight">
            Where Every Meal Becomes <br />
            <span className="bg-gradient-to-r from-red-400 via-rose-200 to-amber-200 bg-clip-text text-transparent italic">
              a Celebration
            </span>
          </h1>

          <div className="ornament my-4 sm:my-6">
            <span className="ornament-dot bg-amber-400/80" />
          </div>

          {/* Refined Formal Description */}
          <p className="text-white/75 font-sans text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-normal">
            Welcome to Khuraak, where authentic multi-cuisine artistry meets regal ambiance.
            With 120 luxurious seats and handcrafted culinary recipes, we transform every meal into a celebration.
          </p>

          {/* CTA Buttons — Reserve + Explore Menu only */}
          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center items-center mb-10 sm:mb-12 w-full max-w-md sm:max-w-none mx-auto">
            <Link
              to="/reservations"
              id="hero-reserve-btn"
              className="btn-primary w-full sm:w-auto !px-8 sm:!px-9 !py-3.5 sm:!py-4 !text-sm sm:!text-base shadow-[0_8px_30px_rgba(215,20,26,0.45)] hover:shadow-[0_10px_35px_rgba(215,20,26,0.6)]"
            >
              <MdRestaurant size={18} /> Reserve a Table
            </Link>
            <Link
              to="/menu"
              id="hero-menu-btn"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 sm:px-9 py-3.5 sm:py-4 rounded-full border border-white/30 text-white font-sans font-semibold text-sm sm:text-base bg-white/5 hover:bg-white hover:text-charcoal transition-all duration-200 backdrop-blur-sm"
            >
              <MdMenuBook size={18} /> Explore Menu
            </Link>
          </div>

          {/* Glassmorphism Luxury Quick Strip */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-5 shadow-2xl">
            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-6 lg:gap-8 text-white/75 text-xs sm:text-sm font-sans">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <FaClock size={13} className="text-amber-400 shrink-0" />
                <span>11:00 AM – 11:30 PM (All Days)</span>
              </span>
              <span className="hidden md:inline w-px h-4 bg-white/20" />
              <span className="flex items-center gap-1.5 sm:gap-2">
                <FaMapMarkerAlt size={13} className="text-amber-400 shrink-0" />
                <span>Near Bharthana Chauraha, Etawah</span>
              </span>
              <span className="hidden md:inline w-px h-4 bg-white/20" />
              <a
                href="tel:+919105104000"
                className="flex items-center gap-1.5 sm:gap-2 hover:text-white transition-colors"
              >
                <FaPhone size={12} className="text-amber-400 shrink-0" />
                <span>+91 91051 04000</span>
              </a>
              <span className="hidden md:inline w-px h-4 bg-white/20" />
              <span className="flex items-center gap-1 text-green-400 font-medium">
                <FaLeaf size={12} className="shrink-0" />
                <span>100% Pure Veg</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5-Star Hallmarks / Pillars ── */}
      <section className="bg-charcoal border-y border-white/10 py-10" >
        <div className="container-max">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center text-white">
            <div className="p-3">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-amber-400 mb-1">120</div>
              <div className="text-white font-sans text-sm font-semibold tracking-wide">Grand Seats</div>
              <p className="text-white/50 text-xs font-sans mt-1">Spacious & opulent family dining</p>
            </div>
            <div className="p-3">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-amber-400 mb-1">100+</div>
              <div className="text-white font-sans text-sm font-semibold tracking-wide">Pure Veg Delicacies</div>
              <p className="text-white/50 text-xs font-sans mt-1">Tandoor, Mains, Sizzlers & Thalis</p>
            </div>
            <div className="p-3">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-amber-400 mb-1">29</div>
              <div className="text-white font-sans text-sm font-semibold tracking-wide">Cuisine Categories</div>
              <p className="text-white/50 text-xs font-sans mt-1">From Mocktails to Desserts</p>
            </div>
            <div className="p-3">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-amber-400 mb-1">5 ★</div>
              <div className="text-white font-sans text-sm font-semibold tracking-wide">Rated Experience</div>
              <p className="text-white/50 text-xs font-sans mt-1">Etawah's finest hospitality</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Royal Heritage / Our Story (Using real interior photos instead of screenshot 'ख') ── */}
      <section className="section bg-white overflow-hidden" >
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Visual: Photography Showcase */}
            <div className="relative">
              {/* Primary framed restaurant photo */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-offwhite aspect-[4/3] relative">
                <img
                  src={photos.interior1 || "/interior-1.jpg"}
                  alt="Khuraak Grand Dining Hall"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs uppercase tracking-widest text-amber-300 font-sans font-semibold">
                    The Grand Dining Hall
                  </p>
                  <p className="font-serif text-lg font-bold">Refined Ambiance & Warmth</p>
                </div>
              </div>

              {/* Overlapping secondary photo */}
              <div className="hidden sm:block absolute -bottom-8 -right-6 w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-offwhite">
                <img
                  src={photos.interior2 || "/interior-2.jpg"}
                  alt="Khuraak Restaurant Detail"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Luxury floating seal */}
              <div className="absolute -top-4 -left-4 bg-charcoal text-white rounded-2xl px-5 py-3 shadow-xl border border-white/10 flex items-center gap-3">
                <FaAward className="text-amber-400 shrink-0" size={24} />
                <div>
                  <p className="font-serif font-bold text-sm leading-tight text-white">Excellence</p>
                  <p className="font-sans text-[11px] text-white/60">In Fine Dining</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-px bg-primary" />
                <span className="text-primary text-xs font-semibold tracking-[0.25em] uppercase font-sans">
                  Our Story & Philosophy
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-4 leading-tight">
                Born From an Unwavering Passion for Good Food
              </h2>
              <div className="ornament justify-start mb-6">
                <span className="ornament-dot" />
              </div>
              <p className="text-gray-600 font-sans leading-relaxed mb-4 text-base">
                Khuraak — meaning <em>"wholesome nourishment and culinary soul"</em> — was established in 2024 with a simple dream: to bring fine dining to the heart of Etawah.
              </p>
              <p className="text-gray-600 font-sans leading-relaxed mb-6 text-base">
                Our kitchen honours age-old Indian culinary traditions while embracing global multi-cuisine flavours. Every spice is selectively sourced, every sauce slow-simmered, and every guest welcomed like royalty.
              </p>

              {/* Key Features Bullet points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8 font-sans text-sm text-charcoal font-medium">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  120 Luxurious Air-Conditioned Seats
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  100% Pure Vegetarian Kitchen
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Signature Clay Tandoor & Curries
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Private Family & Celebration Lounges
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/about" className="btn-primary">
                  Our Story <FaArrowRight size={12} />
                </Link>
                <Link to="/reservations" className="btn-outline">
                  Reserve a Table
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Visual Ambiance Showcase ── */}
      <section className="section bg-offwhite pt-10 pb-16" >
        <div className="container-max">
          <SectionHeader
            eyebrow="Where Elegance Meets Comfort"
            title="The Khuraak Experience"
            subtitle="Designed for comfort, grandeur, and unforgettable memories. Explore the interiors of Khuraak."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group rounded-2xl overflow-hidden shadow-md bg-white border border-border">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={photos.interior2 || "/interior-2.jpg"}
                  alt="Khuraak Main Hall"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-serif font-bold text-charcoal text-base">Dining Room</h3>
                <p className="text-gray-500 font-sans text-xs mt-0.5">Spacious seating for families and gatherings</p>
              </div>
            </div>

            <div className="group rounded-2xl overflow-hidden shadow-md bg-white border border-border">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={photos.interior3 || "/interior-3.jpg"}
                  alt="Khuraak Ambiance"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-serif font-bold text-charcoal text-base">Atmospheric Lighting</h3>
                <p className="text-gray-500 font-sans text-xs mt-0.5">Warm, cozy fine-dining mood and decor</p>
              </div>
            </div>

            <div className="group rounded-2xl overflow-hidden shadow-md bg-white border border-border sm:col-span-2 lg:col-span-1">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={photos.interior4 || "/interior-4.jpg"}
                  alt="Khuraak Private Dining"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-serif font-bold text-charcoal text-base">Private Celebration Areas</h3>
                <p className="text-gray-500 font-sans text-xs mt-0.5">Perfect for birthdays and anniversaries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Signature Culinary Offerings ── */}
      <section className="section bg-white" >
        <div className="container-max">
          <SectionHeader
            eyebrow="Chef's Masterpieces"
            title="Featured Dishes"
            subtitle="Handcrafted pure vegetarian flavours prepared with fresh daily produce and authentic slow-cooking techniques."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_DISHES.map(item => (
              <DishCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/menu" className="btn-primary !px-10 !py-4 shadow-md">
              <FaUtensils size={14} /> View All 29 Menu Categories
            </Link>
          </div>
        </div>
      </section>

      {/* ── Celebrations & Private Dinners ── */}
      <section
        className="relative py-24 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1c0608 0%, #300a0e 40%, #150507 100%)',
        }}
      >
        {/* Single soft radial glow — no dot pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/20 rounded-full blur-[160px]" />
        </div>

        <div className="relative container-max text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-amber-400" />
            <span className="text-amber-300 font-sans text-xs font-semibold tracking-[0.25em] uppercase">
              Host Your Milestones
            </span>
            <span className="w-8 h-px bg-amber-400" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Celebrate In Khuraak
          </h2>
          <p className="text-white/80 font-sans text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            From intimate birthday celebrations and romantic anniversaries to corporate dinners and kitty parties — our restaurant provides customized decor, signature menus, and dedicated service.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/events"
              className="btn-primary !px-9 !py-4 !text-base shadow-lg"
            >
              Plan Your Celebration
            </Link>
            <Link
              to="/reservations"
              className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full border border-white/30 text-white font-sans font-semibold text-base bg-white/10 hover:bg-white hover:text-charcoal transition-all duration-200"
            >
              Book a Table Tonight
            </Link>
          </div>
        </div>
      </section>

      {/* ── Guest Reviews (5-Star Proof) ── */}
      <section className="section bg-offwhite" >
        <div className="container-max">
          <SectionHeader
            eyebrow="Guest Testimonials"
            title="Patron Experiences"
            subtitle="Hear what food enthusiasts and families have to say about dining at Khuraak in Etawah."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {REVIEWS.map(r => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Location & Directions ── */}
      <section className="section bg-white border-t border-border/60" >
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-px bg-primary" />
                <span className="text-primary text-xs font-semibold tracking-[0.25em] uppercase font-sans">
                  Visit Us
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mb-4">
                Experience Khuraak in Person
              </h2>
              <p className="text-gray-500 font-sans text-base mb-8 leading-relaxed">
                Conveniently located near Bharthana Chauraha in Etawah. We invite you and your family to dine with us tonight.
              </p>

              <div className="space-y-4 font-sans mb-8">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-offwhite border border-border">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FaMapMarkerAlt className="text-primary" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-sans uppercase tracking-wider">Address</p>
                    <p className="font-sans font-medium text-charcoal text-sm leading-relaxed mt-0.5">
                      Near, bharthana chauraha, Ashok Nagar, Etawah, UP 206001
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-offwhite border border-border">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <FaClock className="text-primary" size={15} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-sans uppercase tracking-wider">Opening Hours</p>
                    <p className="font-sans font-medium text-charcoal text-sm mt-0.5">
                      11:00 AM – 11:30 PM, Monday – Sunday
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-offwhite border border-border">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <FaPhone className="text-primary" size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-sans uppercase tracking-wider">Direct Hotline</p>
                    <a
                      href="tel:+919105104000"
                      className="font-sans font-medium text-charcoal hover:text-primary transition-colors text-sm mt-0.5 block"
                    >
                      +91 91051 04000
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://maps.app.goo.gl/KRBYAgUNq4sURgmp9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Get Directions <FaArrowRight size={12} />
                </a>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-square sm:aspect-video lg:aspect-[4/3] bg-offwhite flex items-center justify-center border border-border">
              <iframe
                src="https://maps.google.com/maps?q=26.7882172,79.0323821+(Khuraak+Multi+Cuisine+Restaurant)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Khuraak Restaurant Location in Etawah"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}