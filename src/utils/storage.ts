import { Parent, Holiday } from '../types'
import { TOTAL_PARENTS, TOTAL_PORTIONS } from './fruits'

const STORAGE_KEYS = {
  PARENTS: 'meyve_parents_v2',
  START_DATE: 'meyve_start_date_v1',
  CUSTOM_HOLIDAYS: 'meyve_custom_holidays_v1',
  DISABLED_HOLIDAYS: 'meyve_disabled_holidays_v1',
  SWAPS: 'meyve_day_swaps_v1',
  PORTIONS: 'meyve_portions_v1'
}

// Listedeki 21 veli (Anne Adı Soyadı)
export const INITIAL_PARENT_NAMES: string[] = [
  'Safiye Şentürk',        // 1
  'Rahime Güzeller',       // 2
  'Sevda Oyankaya',        // 3
  'Emel Buldu',            // 4
  'Mehtap Erbaş',          // 5
  'Gülşah Maraşlıoğlu',    // 6
  'Merve Balıkçı',         // 7
  'Gülnihal Özmumcu',      // 8
  'Hatice Yıldırım',       // 9
  'Gülbahar Tatlı',        // 10
  'Merve Yörük',           // 11
  'Hilal Karakaş',         // 12
  'Mukadder Rabia Demir',  // 13
  'Büşra Tetik',           // 14
  'Kader Çakırlar',        // 15
  'Esra Ağarlıoğlu',       // 16
  'Büşra Kartal',          // 17
  'Haver Kiciroğlu',       // 18
  'Vedia Naz Maltaş',      // 19
  'Eda Kızıltan',          // 20
  'Gizem Kuruk'            // 21
]

// Generate default 21 parents with list names
export function getDefaultParents(): Parent[] {
  return Array.from({ length: TOTAL_PARENTS }, (_, i) => ({
    id: i + 1,
    name: INITIAL_PARENT_NAMES[i] || '',
    childName: '',
    phone: '',
    notes: ''
  }))
}

export function loadParents(): Parent[] {
  try {
    const defaultParents = getDefaultParents()
    const raw = localStorage.getItem(STORAGE_KEYS.PARENTS)
    if (!raw) {
      saveParents(defaultParents)
      return defaultParents
    }
    const parsed: Parent[] = JSON.parse(raw)
    // Ensure all 21 parents exist and inherit names if missing/empty
    return defaultParents.map(dp => {
      const found = parsed.find(p => p.id === dp.id)
      if (!found) return dp
      return {
        ...dp,
        ...found,
        name: found.name && found.name.trim() ? found.name : dp.name
      }
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
