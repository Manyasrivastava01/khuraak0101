import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaLeaf, FaFire, FaHeart } from 'react-icons/fa'
import { MdRestaurant } from 'react-icons/md'
import { useSitePhotos } from '../utils/photoStorage'
import { useTeamData } from '../utils/teamStorage'

const VALUES = [
  { icon: <FaLeaf />, title: 'Fresh Ingredients', desc: 'We source seasonal, fresh produce daily to ensure quality in every dish.' },
  { icon: <FaFire />, title: 'Authentic Recipes', desc: 'Time-honoured recipes passed down and perfected over years of craft.' },
  { icon: <MdRestaurant />, title: 'Multi Cuisine', desc: 'Indian, continental, Chinese and more — a world of flavour under one roof.' },
  { icon: <FaHeart />, title: 'Warm Hospitality', desc: 'Every guest is treated like family. That\'s the Khuraak promise.' },
]

export default function About() {
  const photos = useSitePhotos()
  const team = useTeamData()

  return (
    <>
      <Helmet>
        <title>About Us — Khuraak Multi Cuisine Restaurant</title>
        <meta name="description" content="Learn about Khuraak Multi Cuisine Restaurant — our story, our team, and what makes our food different." />
      </Helmet>

      {/* Header */}
      <div className="bg-charcoal pt-28 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #D7141A 1px, transparent 0)`, backgroundSize: '40px 40px' }}
        />
        <div className="relative container-max text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase font-sans mb-3">Our Story</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">About Khuraak</h1>
          <div className="ornament my-4"><span className="ornament-dot" /></div>
          <p className="text-white/60 font-sans max-w-lg mx-auto">
            A fine dining experience rooted in authentic flavours and warm hospitality.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="section bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase font-sans mb-3 block">Who We Are</span>
              <h2 className="font-serif text-3xl font-bold text-charcoal mb-4">Born From a Love of Good Food</h2>
              <div className="ornament justify-start mb-5"><span className="ornament-dot" /></div>
              <div className="space-y-4 text-gray-600 font-sans leading-relaxed">
                <p>
                  Khuraak — meaning "food" or "nourishment" in Hindi — was born from a simple belief:
                  that a great meal has the power to bring people together, to celebrate life's moments,
                  and to create lasting memories.
                </p>
                <p>
                  With 120 seats and a kitchen that spans multiple cuisines, we've built a space
                  where every guest feels at home — whether they're here for a quiet dinner,
                  a festive celebration, or a corporate gathering.
                </p>
                <p>
                  Our menu is a carefully curated journey through the flavours of India and beyond.
                  From the smoky depths of our tandoor to the delicate sweetness of our desserts,
                  every dish is crafted with intention and served with care.
                </p>
              </div>
              <Link to="/menu" className="btn-primary mt-8 inline-flex">
                Explore Our Menu <FaArrowRight size={13} />
              </Link>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="aspect-[4/5] max-w-sm mx-auto lg:mx-0 lg:ml-auto rounded-3xl overflow-hidden
                              shadow-[0_20px_60px_rgba(215,20,26,0.25)] relative border-4 border-white bg-offwhite">
                <img
                  src={photos.interior1 || "/interior-1.jpg"}
                  alt="Khuraak Restaurant"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white text-center">
                  <img
                    src={photos.heroLogo || "/khuraak-logo.png"}
                    alt="Khuraak"
                    className="h-12 w-auto mx-auto object-contain mb-2 drop-shadow"
                  />
                  <p className="font-serif text-base italic text-white/90">Pure Vegetarian Fine Dining</p>
                  <p className="text-white/60 font-sans text-xs mt-1">120 Grand Seats • Etawah</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-white rounded-2xl px-5 py-3 shadow-lg">
                <p className="font-sans font-bold text-2xl leading-none">Fine</p>
                <p className="font-serif italic text-xl leading-none">Dining</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-offwhite">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase font-sans mb-3 block">Our Promise</span>
            <h2 className="font-serif text-3xl font-bold text-charcoal mb-3">What Makes Us Different</h2>
            <div className="ornament"><span className="ornament-dot" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title}
                className="bg-white rounded-2xl p-6 text-center border border-border hover:shadow-md hover:border-primary/20 transition-all duration-200 group">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4
                                group-hover:bg-primary group-hover:text-white transition-all duration-200">
                  <span className="text-primary text-xl group-hover:text-white transition-colors">{icon}</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">{title}</h3>
                <p className="text-gray-500 text-sm font-sans leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase font-sans mb-3 block">The Team</span>
            <h2 className="font-serif text-3xl font-bold text-charcoal mb-3">Meet Our People</h2>
            <div className="ornament"><span className="ornament-dot" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {team.map((member) => (
              <div
                key={member.id || member.name}
                className="bg-offwhite rounded-3xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 bg-primary/10 flex items-center justify-center shrink-0">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary font-serif font-bold text-3xl sm:text-4xl">
                      {member.name ? member.name[0] : 'K'}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal">{member.name}</h3>
                <p className="text-primary text-xs sm:text-sm font-sans font-semibold tracking-wide uppercase mt-1 mb-2">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm font-sans leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary">
        <div className="container-max text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Come, Experience Khuraak
          </h2>
          <p className="text-white/80 font-sans mb-8 max-w-lg mx-auto">
            Reserve your table today and let us show you what fine dining truly means.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservations" className="bg-white text-primary font-sans font-semibold px-8 py-4 rounded-full hover:bg-offwhite transition-colors inline-flex items-center gap-2">
              Book a Table <FaArrowRight size={13} />
            </Link>
            <Link to="/contact" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
