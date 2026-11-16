import { useState, useEffect } from 'react'
import { MENU_ITEMS, MENU_CATEGORIES } from '../data/menuData'

const STORAGE_KEY = 'khuraak_custom_menu'

export function getStoredMenuItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Error reading custom menu from localStorage', err)
  }
  return MENU_ITEMS
}

export function saveStoredMenuItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    window.dispatchEvent(new Event('khuraak_menu_updated'))
  } catch (err) {
    console.error('Error saving menu to localStorage', err)
  }
}

export function resetStoredMenuItems() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event('khuraak_menu_updated'))
    return MENU_ITEMS
  } catch (err) {
    console.error('Error resetting menu', err)
    return MENU_ITEMS
  }
}

export function useMenuData() {
  const [items, setItems] = useState(getStoredMenuItems)

  useEffect(() => {
    const handleUpdate = () => setItems(getStoredMenuItems())
    window.addEventListener('khuraak_menu_updated', handleUpdate)
    return () => window.removeEventListener('khuraak_menu_updated', handleUpdate)
  }, [])

  return { items, categories: MENU_CATEGORIES }
}
