import { Fruit, Holiday, Parent, ParentStats, ScheduleDay } from '../types'
import { FRUITS, TOTAL_PARENTS, TOTAL_PORTIONS } from './fruits'

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const TURKISH_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
]

export function formatTurkishDate(dateStr: string, includeDayName = true): string {
  const date = parseDate(dateStr)
  const d = date.getDate()
  const m = TURKISH_MONTHS[date.getMonth()]
  const y = date.getFullYear()
  const dayName = TURKISH_DAYS[date.getDay()]
  return includeDayName ? `${d} ${m} ${y}, ${dayName}` : `${d} ${m} ${y}`
}

export function formatShortDate(dateStr: string): string {
  const date = parseDate(dateStr)
  const d = date.getDate()
  const m = TURKISH_MONTHS[date.getMonth()].slice(0, 3)
  return `${d} ${m}`
}

export function getDayName(dateStr: string): string {
  const date = parseDate(dateStr)
  return TURKISH_DAYS[date.getDay()]
}

// Generate schedule for the whole school year (e.g. from start date up to end of June)
export function generateSchedule(
  startDateStr: string,
  endDateStr: string,
  holidays: Holiday[],
  swaps: Record<string, number> = {},
  portions: number = TOTAL_PORTIONS
): ScheduleDay[] {
  const schedule: ScheduleDay[] = []
  const startDate = parseDate(startDateStr)
  const endDate = parseDate(endDateStr)

  let currentDate = new Date(startDate)
  let schoolDayCount = 0

  while (currentDate <= endDate) {
    const dateStr = formatDate(currentDate)
    const dayOfWeek = currentDate.getDay() // 0: Sun, 1: Mon, ..., 6: Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // Check holiday
    const holiday = holidays.find(h => h.date === dateStr && h.isSchoolClosed)
    const isHoliday = !!holiday

    const isSchoolDay = !isWeekend && !isHoliday

    if (!isSchoolDay) {
      schedule.push({
        date: dateStr,
        dayOfWeek,
        isWeekend,
        isHoliday,
        holidayName: holiday?.name,
        isSchoolDay: false,
        quantity: portions
      })
    } else {
      const dayIndex = schoolDayCount
      schoolDayCount++

      // Mathematical fairness sequence
      const originalParent = (dayIndex % TOTAL_PARENTS) + 1
      const swappedParent = swaps[dateStr]
      const parentNumber = swappedParent !== undefined ? swappedParent : originalParent
      const fruit = FRUITS[dayIndex % FRUITS.length]

      schedule.push({
        date: dateStr,
        dayOfWeek,
        isWeekend: false,
        isHoliday: false,
        isSchoolDay: true,
        schoolDayIndex: dayIndex,
        parentNumber,
        originalParentNumber: originalParent,
        isOverridden: swappedParent !== undefined && swappedParent !== originalParent,
        fruit,
        quantity: portions
      })
    }

    // Next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return schedule
}

// Calculate Fairness Statistics across all parents
export function calculateParentStats(
  schedule: ScheduleDay[],
  parents: Parent[],
  todayStr: string = formatDate(new Date())
): ParentStats[] {
  // Initialize stats for 1..21
  const statsMap: Record<number, ParentStats> = {}

  for (let i = 1; i <= TOTAL_PARENTS; i++) {
    statsMap[i] = {
      parentId: i,
      totalDutyCount: 0,
      fruitCounts: {
        elma: 0,
        armut: 0,
        mandalina: 0,
        muz: 0,
        havuc: 0
      },
      expensiveCount: 0,
      cheapCount: 0,
      mediumCount: 0,
      nextDutyDate: undefined,
      nextDutyFruit: undefined
    }
  }

  // Iterate school days
  for (const day of schedule) {
    if (!day.isSchoolDay || !day.parentNumber || !day.fruit) continue

    const pStats = statsMap[day.parentNumber]
    if (!pStats) continue

    pStats.totalDutyCount++
    pStats.fruitCounts[day.fruit.id] = (pStats.fruitCounts[day.fruit.id] || 0) + 1

    if (day.fruit.costTier === 'expensive') {
      pStats.expensiveCount++
    } else if (day.fruit.costTier === 'cheap') {
      pStats.cheapCount++
    } else {
      pStats.mediumCount++
    }

    // Track next duty date (first duty >= today)
    if (day.date >= todayStr && !pStats.nextDutyDate) {
      pStats.nextDutyDate = day.date
      pStats.nextDutyFruit = day.fruit
    }
  }

  return Object.values(statsMap)
}

// Get week start (Monday) for a given date
export function getMondayOfWeek(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
  return new Date(date.setDate(diff))
}

// Get 5 school days (Mon-Fri) for a given week date
export function getWeekDays(weekMonday: Date): string[] {
  const days: string[] = []
  const cur = new Date(weekMonday)
  for (let i = 0; i < 5; i++) {
    days.push(formatDate(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

// Helper to get parent label
export function getParentDisplayName(parentId: number, parents: Parent[]): string {
  const p = parents.find(item => item.id === parentId)
  if (p?.name && p.name.trim()) {
    if (p.childName && p.childName.trim()) {
      return `Veli ${parentId} (${p.name} - ${p.childName})`
    }
    return `Veli ${parentId} (${p.name})`
  }
  if (p?.childName && p.childName.trim()) {
    return `Veli ${parentId} (${p.childName})`
  }
  return `Veli ${parentId}`
}

// Generate WhatsApp Share Text
export function generateWhatsAppWeeklyText(
  weekDays: ScheduleDay[],
  parents: Parent[]
): string {
  if (weekDays.length === 0) return ''

  const firstDay = weekDays[0]
  const lastDay = weekDays[weekDays.length - 1]
  const weekRange = `${formatShortDate(firstDay.date)} - ${formatShortDate(lastDay.date)} ${parseDate(lastDay.date).getFullYear()}`

  let text = `🍎 *HAFTALIK MEYVE NÖBET LİSTESİ* 🍐\n`
  text += `🏫 *Sınıf:* 21 Öğrenci + 1 Öğretmen = *${TOTAL_PORTIONS} Adet*\n`
  text += `📅 *Hafta:* ${weekRange}\n`
  text += `━━━━━━━━━━━━━━━━━━━━━\n`

  for (const day of weekDays) {
    const dayTitle = `${TURKISH_DAYS[day.dayOfWeek]} (${formatShortDate(day.date)})`
    if (day.isHoliday) {
      text += `🚫 *${dayTitle}*: TATİL (${day.holidayName || 'Okul Kapalı'})\n`
    } else if (day.isSchoolDay && day.parentNumber && day.fruit) {
      const parentLabel = getParentDisplayName(day.parentNumber, parents)
      text += `• *${dayTitle}*:\n  👤 ${parentLabel}\n  ${day.fruit.emoji} *${day.fruit.name}* (${day.quantity} Adet)\n`
    }
  }

  text += `━━━━━━━━━━━━━━━━━━━━━\n`
  text += `✨ *Not:* Meyvelerin taze ve yıkanmış olması rica olunur. Afiyet olsun! 🌿`

  return text
}

// Generate Today/Tomorrow Reminder Text
export function generateDayReminderText(
  day: ScheduleDay,
  parents: Parent[],
  isTomorrow = false
): string {
  if (!day.isSchoolDay || !day.parentNumber || !day.fruit) return ''

  const prefix = isTomorrow ? 'YARINKİ' : 'BUGÜNKÜ'
  const parentLabel = getParentDisplayName(day.parentNumber, parents)

  let text = `🔔 *${prefix} MEYVE NÖBETİ HATIRLATMASI*\n`
  text += `📅 *Tarih:* ${formatTurkishDate(day.date)}\n`
  text += `👤 *Nöbetçi:* ${parentLabel}\n`
  text += `🍎 *Meyve:* ${day.fruit.emoji} ${day.fruit.name} (${day.quantity} Adet)\n`
  text += `\nAfiyet olsun, çocuklarımıza şifa olsun! 🌿`
  return text
}
