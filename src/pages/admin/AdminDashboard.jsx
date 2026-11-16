import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../hooks/useAuth'
import { useMenuData, saveStoredMenuItems, resetStoredMenuItems } from '../../utils/menuStorage'
import { useSitePhotos, saveStoredPhotos, resetStoredPhotos, DEFAULT_PHOTOS } from '../../utils/photoStorage'
import { useTeamData, saveStoredTeam, resetStoredTeam } from '../../utils/teamStorage'
import {
  MdMenuBook, MdAdd, MdEdit, MdDelete, MdSearch,
  MdCheck, MdClose, MdRefresh, MdLogout, MdPhotoCamera,
  MdFileUpload, MdLink, MdCheckCircle, MdCancel, MdPeople
} from 'react-icons/md'
import { FaWhatsapp, FaInfoCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('menu') // 'menu' | 'photos'

  // Menu data
  const { items: menuItems, categories } = useMenuData()
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')

  // Edit / Add dish state
  const [editingDish, setEditingDish] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [dishForm, setDishForm] = useState({
    id: null,
    name: '',
    price: '',
    category_id: 1,
    description: '',
    is_available: true,
  })

  // Photo data
  const photos = useSitePhotos()
  const [photoUrlInputs, setPhotoUrlInputs] = useState({})

  // Customer acceptance messenger state (Owner only tool)
  const [confirmForm, setConfirmForm] = useState({
    name: '',
    phone: '',
    type: 'table',
    date: new Date().toISOString().split('T')[0],
    time: '08:00 PM',
    guests: '2',
  })

  // Staff & Team data
  const teamMembers = useTeamData()
  const [editingTeam, setEditingTeam] = useState(() => teamMembers)

  useEffect(() => {
    setEditingTeam(teamMembers)
  }, [teamMembers])

  const handleUpdateMemberField = (id, field, value) => {
    setEditingTeam(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const handleSaveMember = (id) => {
    saveStoredTeam(editingTeam)
    toast.success('Staff details saved!')
  }

  const handleStaffPhotoUpload = (id, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Choose a valid image file (PNG, JPG, WEBP)')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image size must be under 4MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (loadEvt) => {
      const base64 = loadEvt.target.result
      const updated = editingTeam.map(m => m.id === id ? { ...m, image: base64 } : m)
      setEditingTeam(updated)
      saveStoredTeam(updated)
      toast.success('Staff photo updated!')
    }
    reader.readAsDataURL(file)
  }

  const handleStaffPhotoRemove = (id) => {
    const updated = editingTeam.map(m => m.id === id ? { ...m, image: null } : m)
    setEditingTeam(updated)
    saveStoredTeam(updated)
    toast.success('Photo removed!')
  }

  const handleAddMember = () => {
    const newMember = {
      id: 'staff_' + Date.now(),
      name: 'New Staff Member',
      role: 'Staff Role',
      desc: 'Dedicated to serving delicious food and warm hospitality.',
      image: null,
    }
    const updated = [...editingTeam, newMember]
    setEditingTeam(updated)
    saveStoredTeam(updated)
    toast.success('Added new team slot!')
  }

  const handleDeleteMember = (id, name) => {
    if (window.confirm(`Remove ${name} from the team list?`)) {
      const updated = editingTeam.filter(m => m.id !== id)
      setEditingTeam(updated)
      saveStoredTeam(updated)
      toast.success('Team member removed')
    }
  }

  const handleResetTeam = () => {
    if (window.confirm('Reset team profiles to original default?')) {
      resetStoredTeam()
      toast.success('Team reset to default!')
    }
  }

  const handleSendCustomerConfirmation = (e) => {
    e.preventDefault()
    const cleanPhone = confirmForm.phone.trim().replace(/\D/g, '')
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit customer mobile number')
      return
    }
    if (!confirmForm.name.trim()) {
      toast.error('Please enter customer name')
      return
    }

    const bookingTypeName = confirmForm.type === 'table' ? 'table reservation' : 'event celebration'
    const msg =
`Namaste ${confirmForm.name.trim()}! ✨ Your ${bookingTypeName} at *Khuraak Multi Cuisine Restaurant* for ${confirmForm.guests || 1} Guests on ${confirmForm.date} at ${confirmForm.time} is *CONFIRMED* ✅.

We look forward to welcoming you to an exceptional pure-vegetarian dining experience!
📍 Location: Near Bharthana Chauraha, Etawah
📞 Contact: +91 91051 04000`

    const link = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`
    window.open(link, '_blank')
    toast.success('Opening WhatsApp to send confirmation!')
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  /* ── Filtered menu items ── */
  const filteredDishes = useMemo(() => {
    const q = search.trim().toLowerCase()
    return menuItems.filter(item => {
      const matchCat = selectedCat === 'all' || item.category_id === Number(selectedCat)
      const matchSearch = !q || item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
  }, [menuItems, selectedCat, search])

  /* ── Dish CRUD Handlers ── */
  const handleOpenAdd = () => {
    setDishForm({
      id: Date.now(),
      name: '',
      price: '',
      category_id: selectedCat !== 'all' ? Number(selectedCat) : 1,
      description: '',
      is_available: true,
    })
    setIsAdding(true)
    setEditingDish(null)
  }

  const handleOpenEdit = (dish) => {
    setDishForm({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      category_id: dish.category_id,
      description: dish.description || '',
      is_available: dish.is_available !== false,
    })
    setEditingDish(dish.id)
    setIsAdding(false)
  }

  const handleSaveDish = (e) => {
    e.preventDefault()
    if (!dishForm.name.trim()) {
      toast.error('Dish name is required')
      return
    }
    if (!dishForm.price || Number(dishForm.price) <= 0) {
      toast.error('Enter a valid price')
      return
    }

    let updatedList
    if (isAdding) {
      const newDish = {
        id: Date.now(),
        name: dishForm.name.trim(),
        price: Number(dishForm.price),
        category_id: Number(dishForm.category_id),
        description: dishForm.description.trim(),
        is_available: dishForm.is_available,
      }
      updatedList = [newDish, ...menuItems]
      toast.success(`"${newDish.name}" added to menu!`)
    } else {
      updatedList = menuItems.map(d => {
        if (d.id === editingDish) {
          return {
            ...d,
            name: dishForm.name.trim(),
            price: Number(dishForm.price),
            category_id: Number(dishForm.category_id),
            description: dishForm.description.trim(),
            is_available: dishForm.is_available,
          }
        }
        return d
      })
      toast.success('Dish updated!')
    }

    saveStoredMenuItems(updatedList)
    setIsAdding(false)
    setEditingDish(null)
  }

  const handleDeleteDish = (dishId, dishName) => {
    if (window.confirm(`Are you sure you want to delete "${dishName}" from the menu?`)) {
      const updated = menuItems.filter(d => d.id !== dishId)
      saveStoredMenuItems(updated)
      toast.success(`"${dishName}" deleted`)
    }
  }

  const handleToggleAvailability = (dish) => {
    const nextState = dish.is_available === false ? true : false
    const updated = menuItems.map(d => d.id === dish.id ? { ...d, is_available: nextState } : d)
    saveStoredMenuItems(updated)
    toast.success(`${dish.name} marked ${nextState ? 'Available' : 'Sold Out'}`)
  }

  const handleResetMenu = () => {
    if (window.confirm('Reset all dishes to the original Khuraak menu (246 items)? Any custom added items will be replaced.')) {
      resetStoredMenuItems()
      toast.success('Menu reset to defaults!')
    }
  }

  /* ── Photo Management Handlers ── */
  const handlePhotoFileUpload = (photoKey, e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file (PNG, JPG, WEBP)')
      return
    }

    // Limit size to 4MB for localStorage performance
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image size must be under 4MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (loadEvt) => {
      const base64 = loadEvt.target.result
      const nextPhotos = { ...photos, [photoKey]: base64 }
      saveStoredPhotos(nextPhotos)
      toast.success('Photo updated successfully!')
    }
    reader.readAsDataURL(file)
  }

  const handlePhotoUrlSubmit = (photoKey) => {
    const url = photoUrlInputs[photoKey]?.trim()
    if (!url) return
    const nextPhotos = { ...photos, [photoKey]: url }
    saveStoredPhotos(nextPhotos)
    setPhotoUrlInputs(prev => ({ ...prev, [photoKey]: '' }))
    toast.success('Photo URL updated!')
  }

  const handleResetSinglePhoto = (photoKey) => {
    const nextPhotos = { ...photos, [photoKey]: DEFAULT_PHOTOS[photoKey] }
    saveStoredPhotos(nextPhotos)
    toast.success('Photo restored to default!')
  }

  const handleResetAllPhotos = () => {
    if (window.confirm('Reset all website photos and logo to default original images?')) {
      resetStoredPhotos()
      toast.success('All photos restored to default!')
    }
  }

  const PHOTO_SECTIONS = [
    {
      key: 'heroLogo',
      title: 'Restaurant Logo',
      desc: 'Shown on the homepage hero banner and about section',
      defaultSrc: DEFAULT_PHOTOS.heroLogo,
    },
    {
      key: 'interior1',
      title: 'Dining Hall Photo (Story & Heritage)',
      desc: 'Primary featured photo in the About/Story section on the Home page',
      defaultSrc: DEFAULT_PHOTOS.interior1,
    },
    {
      key: 'interior2',
      title: 'Ambiance Photo 1 (Dining Room)',
      desc: 'Shown in the Ambiance showcase & Story overlapping picture',
      defaultSrc: DEFAULT_PHOTOS.interior2,
    },
    {
      key: 'interior3',
      title: 'Ambiance Photo 2 (Lighting & Mood)',
      desc: 'Shown in the Ambiance showcase on the Home page',
      defaultSrc: DEFAULT_PHOTOS.interior3,
    },
    {
      key: 'interior4',
      title: 'Ambiance Photo 3 (Celebrations & Private Dining)',
      desc: 'Shown in the Ambiance showcase on the Home page',
      defaultSrc: DEFAULT_PHOTOS.interior4,
    },
  ]

  return (
    <>
      <Helmet><title>Admin Manager — Khuraak Multi Cuisine Restaurant</title></Helmet>

      <div className="min-h-screen bg-offwhite">
        {/* Top Header */}
        <header className="bg-charcoal text-white border-b border-white/10 sticky top-0 z-30">
          <div className="container-max py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={photos.heroLogo || "/khuraak-logo.png"}
                alt="Khuraak"
                className="h-10 w-auto object-contain bg-white/5 p-1 rounded-lg"
              />
              <div>
                <h1 className="font-serif font-bold text-lg text-white">Khuraak Manager</h1>
                <p className="text-white/50 text-xs font-sans">Menu & Photo Controls</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 p-1 rounded-xl flex-wrap">
              <button
                onClick={() => setActiveTab('menu')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-semibold transition-all ${
                  activeTab === 'menu' ? 'bg-primary text-white shadow' : 'text-white/70 hover:text-white'
                }`}
              >
                <MdMenuBook size={16} /> Menu
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-semibold transition-all ${
                  activeTab === 'photos' ? 'bg-primary text-white shadow' : 'text-white/70 hover:text-white'
                }`}
              >
                <MdPhotoCamera size={16} /> Photos
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-semibold transition-all ${
                  activeTab === 'team' ? 'bg-primary text-white shadow' : 'text-white/70 hover:text-white'
                }`}
              >
                <MdPeople size={16} /> Staff & Team
              </button>
              <button
                onClick={() => setActiveTab('accept')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-semibold transition-all ${
                  activeTab === 'accept' ? 'bg-green-600 text-white shadow' : 'text-white/70 hover:text-white'
                }`}
              >
                <FaWhatsapp size={16} /> Confirm Customer
              </button>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <MdLogout size={16} /> Sign Out
            </button>
          </div>
        </header>

        {/* Info Banner: WhatsApp Bookings */}
        <div className="bg-gradient-to-r from-emerald-900 to-green-950 text-white border-b border-green-800/40">
          <div className="container-max py-3.5 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                <FaWhatsapp size={16} />
              </span>
              <div>
                <strong className="text-green-300">WhatsApp Booking System Active:</strong> All table reservations & event requests go directly to manager's WhatsApp (<span className="text-white font-medium">+91 91051 04000</span>).
              </div>
            </div>
            <span className="text-green-200/70 text-[11px] sm:text-right">
              No need to monitor this dashboard for bookings — just tap the 1-click link in your WhatsApp to confirm customers!
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="container-max py-8">
          {activeTab === 'menu' ? (
            /* ═════════════════════════════════════════════════════════════
               TAB 1: MENU EDITOR
               ═════════════════════════════════════════════════════════════ */
            <div>
              {/* Menu Controls Bar */}
              <div className="bg-white rounded-2xl p-5 border border-border shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal">Menu Management</h2>
                  <p className="text-gray-400 text-xs font-sans mt-0.5">
                    Currently showing {filteredDishes.length} of {menuItems.length} pure vegetarian dishes across {categories.length} categories
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handleOpenAdd}
                    className="btn-primary !py-2.5 !px-5 text-sm flex items-center gap-2"
                  >
                    <MdAdd size={18} /> Add New Dish
                  </button>
                  <button
                    onClick={handleResetMenu}
                    className="btn-outline !py-2.5 !px-4 text-xs flex items-center gap-1.5 text-gray-500 hover:text-charcoal"
                    title="Restore default 246 dishes"
                  >
                    <MdRefresh size={16} /> Reset to Defaults
                  </button>
                </div>
              </div>

              {/* Add / Edit Dish Form Modal or Inline Card */}
              {(isAdding || editingDish) && (
                <div className="bg-white rounded-2xl p-6 border-2 border-primary/30 shadow-lg mb-8 animate-slide-up">
                  <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
                    <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
                      {isAdding ? <MdAdd className="text-primary" size={20} /> : <MdEdit className="text-primary" size={20} />}
                      {isAdding ? 'Add New Dish to Menu' : 'Edit Dish Details'}
                    </h3>
                    <button
                      onClick={() => { setIsAdding(false); setEditingDish(null) }}
                      className="text-gray-400 hover:text-charcoal p-1"
                    >
                      <MdClose size={22} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveDish} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="form-label">Dish Name *</label>
                      <input
                        type="text"
                        value={dishForm.name}
                        onChange={e => setDishForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Paneer Butter Masala"
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Price (₹) *</label>
                      <input
                        type="number"
                        value={dishForm.price}
                        onChange={e => setDishForm(f => ({ ...f, price: e.target.value }))}
                        placeholder="e.g. 280"
                        min="1"
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Category *</label>
                      <select
                        value={dishForm.category_id}
                        onChange={e => setDishForm(f => ({ ...f, category_id: Number(e.target.value) }))}
                        className="form-input"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="form-label">Description (Shown under dish name)</label>
                      <input
                        type="text"
                        value={dishForm.description}
                        onChange={e => setDishForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Fresh cottage cheese in creamy tomato-butter gravy with aromatic spices..."
                        className="form-input"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-charcoal">
                        <input
                          type="checkbox"
                          checked={dishForm.is_available}
                          onChange={e => setDishForm(f => ({ ...f, is_available: e.target.checked }))}
                          className="w-4 h-4 rounded text-primary focus:ring-primary"
                        />
                        <span>In Stock / Available</span>
                      </label>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-3 pt-3 border-t border-border">
                      <button
                        type="button"
                        onClick={() => { setIsAdding(false); setEditingDish(null) }}
                        className="btn-outline !py-2.5 !px-5 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary !py-2.5 !px-7 text-sm flex items-center gap-2"
                      >
                        <MdCheck size={18} /> Save Dish
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Search & Category Filter */}
              <div className="bg-white rounded-2xl p-4 border border-border shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search dish by name or ingredients..."
                    className="form-input !pl-10 !py-2.5 text-sm"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal"
                    >
                      <MdClose size={18} />
                    </button>
                  )}
                </div>

                <div className="w-full md:w-72 shrink-0">
                  <select
                    value={selectedCat}
                    onChange={e => setSelectedCat(e.target.value)}
                    className="form-input !py-2.5 text-sm font-sans"
                  >
                    <option value="all">All Categories ({categories.length})</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dishes List */}
              <div className="space-y-3">
                {filteredDishes.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center text-gray-400 font-sans border border-border">
                    <MdMenuBook size={48} className="mx-auto mb-3 opacity-30 text-primary" />
                    <p className="text-base font-medium text-charcoal">No dishes match your search.</p>
                    <p className="text-xs text-gray-400 mt-1">Try changing the category filter or search term.</p>
                  </div>
                ) : (
                  filteredDishes.map((dish) => {
                    const catName = categories.find(c => c.id === dish.category_id)?.name || 'General'
                    const isAvail = dish.is_available !== false

                    return (
                      <div
                        key={dish.id}
                        className={`bg-white rounded-xl p-4 border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          !isAvail ? 'opacity-65 border-amber-200 bg-amber-50/20' : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="inline-flex items-center justify-center w-3.5 h-3.5 border border-green-600 rounded-sm p-0.5 shrink-0" title="Pure Veg">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                            </span>
                            <h4 className="font-serif font-bold text-charcoal text-base truncate">
                              {dish.name}
                            </h4>
                            <span className="text-xs font-sans px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                              {catName}
                            </span>
                            {!isAvail && (
                              <span className="text-xs font-sans px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-medium">
                                Sold Out
                              </span>
                            )}
                          </div>
                          {dish.description && (
                            <p className="text-gray-500 font-sans text-xs mt-1 line-clamp-1 pl-6">
                              {dish.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          <span className="font-serif font-bold text-primary text-base">
                            ₹{dish.price}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleAvailability(dish)}
                              title={isAvail ? 'Mark as Sold Out' : 'Mark as Available'}
                              className={`p-2 rounded-lg text-xs font-sans font-medium transition-colors ${
                                isAvail
                                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }`}
                            >
                              {isAvail ? 'In Stock' : 'Sold Out'}
                            </button>

                            <button
                              onClick={() => handleOpenEdit(dish)}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-primary hover:text-white text-charcoal transition-colors"
                              title="Edit dish"
                            >
                              <MdEdit size={16} />
                            </button>

                            <button
                              onClick={() => handleDeleteDish(dish.id, dish.name)}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-red-500 hover:text-white text-gray-500 transition-colors"
                              title="Delete dish"
                            >
                              <MdDelete size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          ) : activeTab === 'photos' ? (
            /* ═════════════════════════════════════════════════════════════
               TAB 2: WEBSITE PHOTOS MANAGER
               ═════════════════════════════════════════════════════════════ */
            <div>
              <div className="bg-white rounded-2xl p-5 border border-border shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal">Website Photos & Branding</h2>
                  <p className="text-gray-400 text-xs font-sans mt-0.5">
                    Update photos of the restaurant hall, ambiance, and logo. Changes reflect live on the website immediately!
                  </p>
                </div>
                <button
                  onClick={handleResetAllPhotos}
                  className="btn-outline !py-2.5 !px-4 text-xs flex items-center gap-1.5 text-gray-500 hover:text-charcoal"
                >
                  <MdRefresh size={16} /> Reset All Photos to Default
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {PHOTO_SECTIONS.map(({ key, title, desc, defaultSrc }) => {
                  const currentImg = photos[key] || defaultSrc

                  return (
                    <div key={key} className="bg-white rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h3 className="font-serif font-bold text-charcoal text-lg">{title}</h3>
                            <p className="text-gray-400 text-xs font-sans mt-0.5">{desc}</p>
                          </div>
                          {photos[key] && photos[key] !== defaultSrc && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-green-100 text-green-700">
                              Custom Active
                            </span>
                          )}
                        </div>

                        {/* Image Preview Box */}
                        <div className="rounded-xl overflow-hidden border border-border bg-charcoal/5 aspect-video relative flex items-center justify-center mb-4">
                          <img
                            src={currentImg}
                            alt={title}
                            className="w-full h-full object-contain sm:object-cover"
                          />
                        </div>

                        {/* Upload Controls */}
                        <div className="space-y-3">
                          {/* File input */}
                          <div>
                            <label className="text-xs font-sans font-semibold text-charcoal mb-1 block">
                              Option 1: Upload from Phone / Computer
                            </label>
                            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-dashed border-gray-300 hover:border-primary text-gray-600 hover:text-primary text-xs font-sans font-medium cursor-pointer transition-colors bg-offwhite hover:bg-red-50/50">
                              <MdFileUpload size={16} /> Choose Image File (PNG, JPG, WebP)
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoFileUpload(key, e)}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {/* URL input */}
                          <div>
                            <label className="text-xs font-sans font-semibold text-charcoal mb-1 block">
                              Option 2: Or Paste Image Web Link (URL)
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                placeholder="https://example.com/new-photo.jpg"
                                value={photoUrlInputs[key] || ''}
                                onChange={(e) => setPhotoUrlInputs(prev => ({ ...prev, [key]: e.target.value }))}
                                className="form-input !py-2 text-xs flex-1"
                              />
                              <button
                                onClick={() => handlePhotoUrlSubmit(key)}
                                className="px-4 py-2 bg-charcoal hover:bg-primary text-white text-xs font-sans font-medium rounded-xl transition-colors shrink-0"
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reset button if custom */}
                      <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => handleResetSinglePhoto(key)}
                          className="text-xs font-sans text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <MdRefresh size={14} /> Restore Default Photo
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : activeTab === 'team' ? (
            /* ═════════════════════════════════════════════════════════════
               TAB 3: STAFF & TEAM MANAGEMENT
               ═════════════════════════════════════════════════════════════ */
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="bg-white rounded-2xl p-5 border border-border shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal">Meet Our People / Staff Profiles</h2>
                  <p className="text-gray-400 text-xs font-sans mt-0.5">
                    Update names, roles, bios, and upload photos for your Head Chef, Manager, or team members.
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handleAddMember}
                    className="btn-primary !py-2.5 !px-4 text-xs flex items-center gap-1.5"
                  >
                    <MdAdd size={16} /> Add Staff Member
                  </button>
                  <button
                    onClick={handleResetTeam}
                    className="btn-outline !py-2.5 !px-4 text-xs flex items-center gap-1 text-gray-500 hover:text-charcoal"
                  >
                    <MdRefresh size={14} /> Reset Team Defaults
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {editingTeam.map((member) => (
                  <div key={member.id} className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col justify-between">
                    <div>
                      {/* Photo Header */}
                      <div className="flex items-center gap-4 pb-5 border-b border-border mb-5">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/10 flex items-center justify-center shrink-0 relative group">
                          {member.image ? (
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-primary font-serif font-bold text-2xl">{member.name ? member.name[0] : 'S'}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="text-xs font-sans font-semibold text-charcoal mb-1 block">Staff Photo</label>
                          <div className="flex items-center gap-2 flex-wrap">
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 hover:border-primary text-gray-600 hover:text-primary text-xs font-sans cursor-pointer transition-colors bg-offwhite">
                              <MdFileUpload size={14} /> Upload Photo
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleStaffPhotoUpload(member.id, e)}
                                className="hidden"
                              />
                            </label>
                            {member.image && (
                              <button
                                type="button"
                                onClick={() => handleStaffPhotoRemove(member.id)}
                                className="text-xs text-red-500 hover:underline font-sans"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="space-y-4">
                        <div>
                          <label className="form-label">Staff Name * (e.g. If head chef changes)</label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleUpdateMemberField(member.id, 'name', e.target.value)}
                            placeholder="e.g. Chef Ramesh Sharma"
                            className="form-input text-sm"
                          />
                        </div>

                        <div>
                          <label className="form-label">Role / Designation *</label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => handleUpdateMemberField(member.id, 'role', e.target.value)}
                            placeholder="e.g. Executive Chef"
                            className="form-input text-sm"
                          />
                        </div>

                        <div>
                          <label className="form-label">Bio / Description</label>
                          <textarea
                            rows={3}
                            value={member.desc}
                            onChange={(e) => handleUpdateMemberField(member.id, 'desc', e.target.value)}
                            placeholder="Brief description of their expertise..."
                            className="form-input text-sm resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-border flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        className="text-xs font-sans text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <MdDelete size={14} /> Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveMember(member.id)}
                        className="btn-primary !py-2 !px-5 text-xs flex items-center gap-1.5"
                      >
                        <MdCheck size={16} /> Save Changes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ═════════════════════════════════════════════════════════════
               TAB 4: SEND WHATSAPP CONFIRMATION (OWNER-ONLY TOOL)
               ═════════════════════════════════════════════════════════════ */
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm">
                <div className="flex items-center gap-3 pb-5 border-b border-border mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                    <FaWhatsapp size={26} />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-charcoal">Send Booking Confirmation</h2>
                    <p className="text-gray-400 text-xs font-sans mt-0.5">
                      Enter the customer's details to send an official confirmation WhatsApp message directly from your phone.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSendCustomerConfirmation} className="space-y-4">
                  <div>
                    <label className="form-label">Booking Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setConfirmForm(f => ({ ...f, type: 'table' }))}
                        className={`py-2.5 px-4 rounded-xl text-xs font-sans font-semibold border transition-all ${
                          confirmForm.type === 'table' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-offwhite border-border text-charcoal'
                        }`}
                      >
                        🍽️ Table Reservation
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmForm(f => ({ ...f, type: 'event' }))}
                        className={`py-2.5 px-4 rounded-xl text-xs font-sans font-semibold border transition-all ${
                          confirmForm.type === 'event' ? 'bg-purple-600 text-white border-purple-600 shadow-sm' : 'bg-offwhite border-border text-charcoal'
                        }`}
                      >
                        🎉 Event / Party
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Customer Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Manya"
                        value={confirmForm.name}
                        onChange={e => setConfirmForm(f => ({ ...f, name: e.target.value }))}
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Customer Mobile Number *</label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile (e.g. 6396777244)"
                        value={confirmForm.phone}
                        onChange={e => setConfirmForm(f => ({ ...f, phone: e.target.value }))}
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Date *</label>
                      <input
                        type="date"
                        value={confirmForm.date}
                        onChange={e => setConfirmForm(f => ({ ...f, date: e.target.value }))}
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Time / Slot *</label>
                      <input
                        type="text"
                        placeholder="e.g. 08:30 PM"
                        value={confirmForm.time}
                        onChange={e => setConfirmForm(f => ({ ...f, time: e.target.value }))}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="form-label">Number of Guests</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 4"
                        value={confirmForm.guests}
                        onChange={e => setConfirmForm(f => ({ ...f, guests: e.target.value }))}
                        className="form-input sm:max-w-xs"
                      />
                    </div>
                  </div>

                  {/* Live Message Preview */}
                  <div className="mt-6 p-4 rounded-2xl bg-gray-900 text-white font-sans text-xs leading-relaxed space-y-1">
                    <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider mb-2">Message Preview to Customer:</p>
                    <p>Namaste {confirmForm.name || '[Customer Name]'}! ✨</p>
                    <p>Your {confirmForm.type === 'table' ? 'table reservation' : 'event celebration'} at <strong>Khuraak Multi Cuisine Restaurant</strong> for {confirmForm.guests || '1'} Guests on {confirmForm.date || '[Date]'} at {confirmForm.time || '[Time]'} is <strong>CONFIRMED ✅</strong>.</p>
                    <p className="text-gray-300">We look forward to welcoming you to an exceptional pure-vegetarian dining experience!</p>
                    <p className="text-gray-400 text-[11px] pt-1">📍 Near Bharthana Chauraha, Etawah | 📞 +91 91051 04000</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-sans font-bold flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all mt-4"
                  >
                    <FaWhatsapp size={20} /> Open WhatsApp to Send Acceptance
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
