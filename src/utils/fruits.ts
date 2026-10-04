import { Fruit } from '../types'

export const FRUITS: Fruit[] = [
  {
    id: 'elma',
    name: 'Elma',
    emoji: '🍏',
    costTier: 'medium',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'armut',
    name: 'Armut',
    emoji: '🍐',
    costTier: 'medium',
    bgColor: 'bg-lime-50',
    borderColor: 'border-lime-200',
    textColor: 'text-lime-700',
    badgeBg: 'bg-lime-100 text-lime-800'
  },
  {
    id: 'mandalina',
    name: 'Mandalina',
    emoji: '🍊',
    costTier: 'medium',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    badgeBg: 'bg-amber-100 text-amber-800'
  },
  {
    id: 'muz',
    name: 'Muz',
    emoji: '🍌',
    costTier: 'expensive',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    badgeBg: 'bg-yellow-100 text-yellow-900'
  },
  {
    id: 'havuc',
    name: 'Havuç',
    emoji: '🥕',
    costTier: 'cheap',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    badgeBg: 'bg-orange-100 text-orange-800'
  }
]

export const TOTAL_STUDENTS = 21
export const TOTAL_TEACHERS = 1
export const TOTAL_PORTIONS = TOTAL_STUDENTS + TOTAL_TEACHERS // 22
export const TOTAL_PARENTS = 21
