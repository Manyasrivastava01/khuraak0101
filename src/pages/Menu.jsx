import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { FaSearch, FaTimes, FaClock, FaReceipt, FaWhatsapp, FaUtensils } from 'react-icons/fa'
import { MENU_FOOTNOTES } from '../data/menuData'
import { useMenuData } from '../utils/menuStorage'

function DishCard({ item }) {
  const isAvailable = item.is_available !== false

  return (
    <div className={`bg-white rounded-2xl p-5 border border-border hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col justify-between ${!isAvailable ? 'opacity-60 bg-gray-50' : ''}`}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-4 h-4 border border-green-600 rounded-sm p-0.5 mt-1 shrink-0" title="100% Pure Vegetarian">
              <span className="w-2 h-2 rounded-full bg-green-600" />
            </span>
            <div>
              <h3 className="font-serif text-base font-semibold text-charcoal leading-snug">
                {item.name}
              </h3>
              {!isAvailable && (
                <span className="inline-block mt-1 text-[11px] font-sans font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Sold Out Today
                </span>
              )}
            </div>
          </div>
          <span className="font-sans font-bold text-primary text-base whitespace-nowrap">
            ₹{item.price}
          </span>
        </div>

        {item.description && (
          <p className="text-gray-500 text-sm font-sans leading-relaxed mt-2 pl-6">
            {item.description}
          </p>
        )}
      </div>
    </div>
  )
}

export default function Menu() {
  const { items: allMenuItems, categories: allCategories } = useMenuData()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allMenuItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category_id === Number(selectedCategory)
      const matchesSearch = !q || item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q))
      return matchesCategory && matchesSearch
    })
  }, [allMenuItems, selectedCategory, search])

  // Group filtered dishes by category
  const groupedCategories = useMemo(() => {
    return allCategories.map(cat => ({
      ...cat,
      items: filteredDishes.filter(d => d.category_id === cat.id),
    })).filter(cat => cat.items.length > 0)
  }, [allCategories, filteredDishes])

  const totalFilteredCount = filteredDishes.length

  return (
    <>
      <Helmet>
        <title>Menu — Khuraak Multi Cuisine Restaurant, Etawah</title>
        <meta
          name="description"
          content="Explore Khuraak Multi Cuisine Restaurant's authentic pure vegetarian menu in Etawah — mocktails, starters, pizza, main course, Indian breads, sizzlers, thali and desserts."
        />
      </Helmet>

      {/* Header */}
      <div className="bg-charcoal pt-28 pb-14 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #D7141A 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative container-max text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase font-sans mb-3">
            Pure Vegetarian Multi-Cuisine
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Our Menu</h1>
          <div className="ornament my-4">
            <span className="ornament-dot" />
          </div>
          <p className="text-white/70 font-sans max-w-xl mx-auto text-base">
            Handcrafted flavours made with the freshest ingredients. Explore our wide selection of appetizers, sizzlers, Indian gravies, and delicious desserts.
          </p>
        </div>
      </div>

      <div className="bg-offwhite min-h-screen">
        {/* Sticky Search & Category Navigation */}
        <div className="sticky top-16 md:top-20 z-30 bg-white border-b border-border shadow-sm">
          <div className="container-max py-3 space-y-3">
            {/* Search Input */}
            <div className="relative max-w-md mx-auto sm:mx-0">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                id="menu-search"
                type="text"
                placeholder="Search dishes (e.g. Paneer, Pizza, Dal, Mojito)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-input !pl-10 !pr-10 !py-2.5 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal p-1"
                >
                  <FaTimes size={13} />
                </button>
              )}
            </div>

            {/* Category scroll pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium font-sans transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-offwhite text-charcoal hover:bg-red-50 hover:text-primary'
                }`}
              >
                All Categories ({allMenuItems.length})
              </button>
              {allCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(String(cat.id))}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium font-sans transition-all ${
                    selectedCategory === String(cat.id)
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-offwhite text-charcoal hover:bg-red-50 hover:text-primary'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container-max py-10">
          {totalFilteredCount === 0 ? (
            <div className="text-center py-20 text-gray-400 font-sans bg-white rounded-2xl border border-border p-8">
              <FaUtensils size={44} className="mx-auto mb-3 opacity-30 text-primary" />
              <h3 className="font-serif text-xl font-semibold text-charcoal mb-1">No dishes found</h3>
              <p className="text-sm text-gray-500">
                No items match "{search}". Try searching for another item or clear your search.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSearch('')
                }}
                className="btn-outline mt-5"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {groupedCategories.map(cat => (
                <section key={cat.id} id={`category-${cat.id}`} className="scroll-mt-40">
                  {/* Category Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b border-border">
                    <div className="flex items-center gap-3">
                      <h2 className="font-serif text-2xl font-bold text-charcoal">
                        {cat.name}
                      </h2>
                      {cat.subtitle && (
                        <span className="text-xs bg-red-100 text-primary font-semibold font-sans px-2.5 py-1 rounded-full">
                          {cat.subtitle}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 font-sans">
                      {cat.items.length} {cat.items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Category Note (e.g. for Thali lunch timing) */}
                  {cat.note && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-sans flex items-center gap-2">
                      <FaClock className="text-amber-600 shrink-0" size={13} />
                      <span>{cat.note}</span>
                    </div>
                  )}

                  {/* Grid of Dishes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cat.items.map(item => (
                      <DishCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Menu Footnotes */}
          <div className="mt-14 bg-white rounded-2xl p-6 border border-border flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
            {MENU_FOOTNOTES.map((note, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-500 font-sans">
                {idx === 0 ? (
                  <FaClock className="text-primary shrink-0" size={14} />
                ) : (
                  <FaReceipt className="text-primary shrink-0" size={14} />
                )}
                <span className="font-medium">{note}</span>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-10 rounded-2xl bg-charcoal text-white p-8 sm:p-10 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #D7141A 1px, transparent 0)`,
                backgroundSize: '30px 30px',
              }}
            />
            <div className="relative">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
                Ready to Dine with Us?
              </h3>
              <p className="text-white/70 font-sans text-sm max-w-lg mx-auto mb-6">
                Reserve your table in advance or connect with our team on WhatsApp for takeaways and celebrations.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/reservations" className="btn-primary !px-7">
                  Book a Table
                </Link>
                <a
                  href="https://wa.me/919105104000?text=Hi%20Khuraak%2C%20I%20would%20like%20to%20place%20an%20order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline !border-white !text-white hover:!bg-white hover:!text-charcoal inline-flex items-center gap-2 !px-7"
                >
                  <FaWhatsapp size={16} /> Order on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
