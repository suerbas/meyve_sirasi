export interface Fruit {
  id: string
  name: string
  emoji: string
  costTier: 'expensive' | 'medium' | 'cheap'
  bgColor: string
  borderColor: string
  textColor: string
  badgeBg: string
}

export interface Parent {
  id: number // 1 to 21
  name?: string // Custom name (e.g. "Ahmet K.")
  childName?: string // Custom child name (e.g. "Eren")
  phone?: string
  notes?: string
}

export interface Holiday {
  date: string // YYYY-MM-DD
  name: string
  type: 'national' | 'religious' | 'break' | 'semester' | 'custom'
  isSchoolClosed: boolean
}

export interface ScheduleDay {
  date: string // YYYY-MM-DD
  dayOfWeek: number // 1: Mon, 2: Tue, ..., 5: Fri, 6: Sat, 0: Sun
  isWeekend: boolean
  isHoliday: boolean
  holidayName?: string
  isSchoolDay: boolean
  schoolDayIndex?: number // 0, 1, 2, ...
  parentNumber?: number // 1 to 21
  fruit?: Fruit
  quantity: number // default 22 (21 students + 1 teacher)
  isOverridden?: boolean
  originalParentNumber?: number
  note?: string
}

export interface ParentStats {
  parentId: number
  totalDutyCount: number
  fruitCounts: Record<string, number> // fruit.id -> count
  expensiveCount: number // Muz
  cheapCount: number // Havuç
  mediumCount: number // Elma, Armut, Mandalina
  nextDutyDate?: string
  nextDutyFruit?: Fruit
}
