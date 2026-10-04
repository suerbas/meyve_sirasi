import { Parent, Holiday } from '../types'
import { TOTAL_PARENTS, TOTAL_PORTIONS } from './fruits'

const STORAGE_KEYS = {
  PARENTS: 'meyve_parents_v1',
  START_DATE: 'meyve_start_date_v1',
  CUSTOM_HOLIDAYS: 'meyve_custom_holidays_v1',
  DISABLED_HOLIDAYS: 'meyve_disabled_holidays_v1',
  SWAPS: 'meyve_day_swaps_v1',
  PORTIONS: 'meyve_portions_v1'
}

// Generate default 21 parents
export function getDefaultParents(): Parent[] {
  return Array.from({ length: TOTAL_PARENTS }, (_, i) => ({
    id: i + 1,
    name: '',
    childName: '',
    phone: '',
    notes: ''
  }))
}

export function loadParents(): Parent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PARENTS)
    if (!raw) return getDefaultParents()
    const parsed: Parent[] = JSON.parse(raw)
    // Ensure all 21 parents exist
    const defaultParents = getDefaultParents()
    return defaultParents.map(dp => {
      const found = parsed.find(p => p.id === dp.id)
      return found ? { ...dp, ...found } : dp
    })
  } catch (e) {
    console.error('Failed to load parents:', e)
    return getDefaultParents()
  }
}

export function saveParents(parents: Parent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PARENTS, JSON.stringify(parents))
  } catch (e) {
    console.error('Failed to save parents:', e)
  }
}

export function loadStartDate(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.START_DATE)
    if (saved) return saved
  } catch (e) {
    // ignore
  }
  return '2026-10-05' // Nearest Monday
}

export function saveStartDate(dateStr: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.START_DATE, dateStr)
  } catch (e) {
    console.error('Failed to save start date:', e)
  }
}

export function loadCustomHolidays(): Holiday[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_HOLIDAYS)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export function saveCustomHolidays(holidays: Holiday[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_HOLIDAYS, JSON.stringify(holidays))
  } catch (e) {
    console.error('Failed to save custom holidays:', e)
  }
}

export function loadDisabledHolidays(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DISABLED_HOLIDAYS)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export function saveDisabledHolidays(dates: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DISABLED_HOLIDAYS, JSON.stringify(dates))
  } catch (e) {
    console.error('Failed to save disabled holidays:', e)
  }
}

export function loadSwaps(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SWAPS)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

export function saveSwaps(swaps: Record<string, number>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SWAPS, JSON.stringify(swaps))
  } catch (e) {
    console.error('Failed to save swaps:', e)
  }
}

export function loadPortions(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PORTIONS)
    return raw ? parseInt(raw, 10) : TOTAL_PORTIONS
  } catch (e) {
    return TOTAL_PORTIONS
  }
}

export function savePortions(val: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PORTIONS, val.toString())
  } catch (e) {
    console.error('Failed to save portions:', e)
  }
}
