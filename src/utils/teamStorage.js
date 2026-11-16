import { useState, useEffect } from 'react'

export const DEFAULT_TEAM = [
  {
    id: 'chef',
    name: 'Head Chef',
    role: 'Executive Chef',
    desc: 'Leading our kitchen with 15+ years of pure-vegetarian culinary mastery and authentic heritage recipes.',
    image: null,
  },
  {
    id: 'manager',
    name: 'Team Lead',
    role: 'Restaurant Manager',
    desc: 'Ensuring seamless service, royal Indian hospitality, and memorable dining for every guest.',
    image: null,
  },
]

const STORAGE_KEY = 'khuraak_team_members'

export function getStoredTeam() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (err) {
    console.error('Error reading team from storage', err)
  }
  return DEFAULT_TEAM
}

export function saveStoredTeam(team) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(team))
    window.dispatchEvent(new Event('khuraak_team_updated'))
  } catch (err) {
    console.error('Error saving team to storage', err)
  }
}

export function resetStoredTeam() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event('khuraak_team_updated'))
    return DEFAULT_TEAM
  } catch (err) {
    return DEFAULT_TEAM
  }
}

export function useTeamData() {
  const [team, setTeam] = useState(getStoredTeam)

  useEffect(() => {
    const handleUpdate = () => setTeam(getStoredTeam())
    window.addEventListener('khuraak_team_updated', handleUpdate)
    return () => window.removeEventListener('khuraak_team_updated', handleUpdate)
  }, [])

  return team
}
