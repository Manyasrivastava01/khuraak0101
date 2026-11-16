import { useState, useEffect } from 'react'

export const DEFAULT_PHOTOS = {
  heroLogo: '/khuraak-logo.png',
  interior1: '/interior-1.jpg',
  interior2: '/interior-2.jpg',
  interior3: '/interior-3.jpg',
  interior4: '/interior-4.jpg',
}

const STORAGE_KEY = 'khuraak_site_photos'

export function getStoredPhotos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_PHOTOS, ...parsed }
    }
  } catch (err) {
    console.error('Error reading photos from localStorage', err)
  }
  return { ...DEFAULT_PHOTOS }
}

export function saveStoredPhotos(photos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos))
    window.dispatchEvent(new Event('khuraak_photos_updated'))
  } catch (err) {
    console.error('Error saving photos to localStorage', err)
  }
}

export function resetStoredPhotos() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event('khuraak_photos_updated'))
  } catch (err) {
    console.error('Error resetting photos', err)
  }
}

export function useSitePhotos() {
  const [photos, setPhotos] = useState(getStoredPhotos)

  useEffect(() => {
    const handleUpdate = () => setPhotos(getStoredPhotos())
    window.addEventListener('khuraak_photos_updated', handleUpdate)
    return () => window.removeEventListener('khuraak_photos_updated', handleUpdate)
  }, [])

  return photos
}
