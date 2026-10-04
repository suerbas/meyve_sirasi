import React, { useState, useMemo, useEffect } from 'react'
import { Header } from './components/Header'
import { Navigation, TabType } from './components/Navigation'
import { TodayHero } from './components/TodayHero'
import { WeeklyView } from './components/WeeklyView'
import { CalendarView } from './components/CalendarView'
import { FairnessStats } from './components/FairnessStats'
import { ParentManager } from './components/ParentManager'
import { WhatsAppModal } from './components/WhatsAppModal'
import { SwapModal } from './components/SwapModal'
import { SettingsModal } from './components/SettingsModal'

import { Holiday, Parent, ScheduleDay } from './types'
import { DEFAULT_HOLIDAYS } from './utils/holidays'
import { TOTAL_PARENTS, TOTAL_PORTIONS } from './utils/fruits'
import {
  formatDate,
  generateSchedule,
  calculateParentStats,
  getMondayOfWeek,
  parseDate
} from './utils/scheduler'
import {
  loadParents,
  saveParents,
  loadStartDate,
  saveStartDate,
  loadCustomHolidays,
  saveCustomHolidays,
  loadDisabledHolidays,
  saveDisabledHolidays,
  loadSwaps,
  saveSwaps,
  loadPortions,
  savePortions,
  getDefaultParents
} from './utils/storage'

export default function App() {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('weekly')
  const [startDate, setStartDate] = useState<string>(loadStartDate)
  const [portions, setPortions] = useState<number>(loadPortions)
  const [parents, setParents] = useState<Parent[]>(loadParents)
  const [customHolidays, setCustomHolidays] = useState<Holiday[]>(loadCustomHolidays)
  const [disabledHolidays, setDisabledHolidays] = useState<string[]>(loadDisabledHolidays)
  const [swaps, setSwaps] = useState<Record<string, number>>(loadSwaps)

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false)
  const [swapModalDay, setSwapModalDay] = useState<ScheduleDay | null>(null)
  const [whatsAppWeekDays, setWhatsAppWeekDays] = useState<ScheduleDay[]>([])

  // Today representation
  const todayStr = useMemo(() => formatDate(new Date()), [])

  // Calculate week monday
  const [currentWeekMonday, setCurrentWeekMonday] = useState<Date>(() => {
    // If today is before start date, default to start date's week monday
    const today = new Date()
    const start = parseDate(startDate)
    return today < start ? getMondayOfWeek(start) : getMondayOfWeek(today)
  })

  // Combine holidays
  const allHolidays = useMemo(() => {
    return [...DEFAULT_HOLIDAYS, ...customHolidays]
  }, [customHolidays])

  const activeHolidays = useMemo(() => {
    return allHolidays.filter(h => !disabledHolidays.includes(h.date))
  }, [allHolidays, disabledHolidays])

  // End date is set to end of current academic year (June 30)
  const endDateStr = useMemo(() => {
    const startYear = parseDate(startDate).getFullYear()
    return `${startYear + 1}-06-30`
  }, [startDate])

  // Generate full schedule
  const schedule = useMemo(() => {
    return generateSchedule(startDate, endDateStr, activeHolidays, swaps, portions)
  }, [startDate, endDateStr, activeHolidays, swaps, portions])

  // Compute Parent Stats
  const parentStats = useMemo(() => {
    return calculateParentStats(schedule, parents, todayStr)
  }, [schedule, parents, todayStr])

  // Find today's and next school day's schedule
  const todaySchedule = useMemo(() => {
    return schedule.find(d => d.date === todayStr)
  }, [schedule, todayStr])

  const nextSchoolDaySchedule = useMemo(() => {
    return schedule.find(d => d.date >= todayStr && d.isSchoolDay)
  }, [schedule, todayStr])

  // Current week days (Monday - Friday)
  const weekScheduleDays = useMemo(() => {
    const mon = new Date(currentWeekMonday)
    const dates: string[] = []
    for (let i = 0; i < 5; i++) {
      dates.push(formatDate(mon))
      mon.setDate(mon.getDate() + 1)
    }

    return dates.map(dStr => {
      const found = schedule.find(item => item.date === dStr)
      if (found) return found
      // Fallback
      const d = parseDate(dStr)
      return {
        date: dStr,
        dayOfWeek: d.getDay(),
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
        isHoliday: false,
        isSchoolDay: false,
        quantity: portions
      }
    })
  }, [schedule, currentWeekMonday, portions])

  // Handlers
  const handleUpdateParents = (updated: Parent[]) => {
    setParents(updated)
    saveParents(updated)
  }

  const handleChangeStartDate = (date: string) => {
    setStartDate(date)
    saveStartDate(date)
    setCurrentWeekMonday(getMondayOfWeek(parseDate(date)))
  }

  const handleChangePortions = (p: number) => {
    setPortions(p)
    savePortions(p)
  }

  const handleToggleHoliday = (date: string) => {
    const next = disabledHolidays.includes(date)
      ? disabledHolidays.filter(d => d !== date)
      : [...disabledHolidays, date]
    setDisabledHolidays(next)
    saveDisabledHolidays(next)
  }

  const handleAddCustomHoliday = (h: Holiday) => {
    const next = [...customHolidays, h]
    setCustomHolidays(next)
    saveCustomHolidays(next)
  }

  const handleDeleteCustomHoliday = (date: string) => {
    const next = customHolidays.filter(h => h.date !== date)
    setCustomHolidays(next)
    saveCustomHolidays(next)
  }

  const handleSaveSwap = (dateStr: string, newParentId: number | null) => {
    const next = { ...swaps }
    if (newParentId === null) {
      delete next[dateStr]
    } else {
      next[dateStr] = newParentId
    }
    setSwaps(next)
    saveSwaps(next)
  }

  const handleResetAll = () => {
    const defParents = getDefaultParents()
    setParents(defParents)
    saveParents(defParents)
    setSwaps({})
    saveSwaps({})
    setCustomHolidays([])
    saveCustomHolidays([])
    setDisabledHolidays([])
    saveDisabledHolidays([])
  }

  const handleOpenWhatsAppModal = (days?: ScheduleDay[]) => {
    setWhatsAppWeekDays(days || weekScheduleDays)
    setIsWhatsAppOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-20 sm:pb-10">
      {/* Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWhatsApp={() => handleOpenWhatsAppModal()}
      />

      <main className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex-1 w-full space-y-5">
        {/* Navigation Tabs */}
        <Navigation activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Prominent Hero Duty Card (on weekly and calendar views) */}
        {(activeTab === 'weekly' || activeTab === 'calendar') && (
          <TodayHero
            todayStr={todayStr}
            todaySchedule={todaySchedule}
            nextSchoolDaySchedule={nextSchoolDaySchedule}
            parents={parents}
            onOpenSwapModal={(day) => setSwapModalDay(day)}
          />
        )}

        {/* Tab 1: Weekly View */}
        {activeTab === 'weekly' && (
          <WeeklyView
            currentWeekMonday={currentWeekMonday}
            onChangeWeek={setCurrentWeekMonday}
            weekScheduleDays={weekScheduleDays}
            parents={parents}
            todayStr={todayStr}
            onOpenWhatsApp={handleOpenWhatsAppModal}
            onOpenSwapModal={(day) => setSwapModalDay(day)}
          />
        )}

        {/* Tab 2: Monthly Calendar View */}
        {activeTab === 'calendar' && (
          <CalendarView
            schedule={schedule}
            parents={parents}
            todayStr={todayStr}
            onOpenSwapModal={(day) => setSwapModalDay(day)}
          />
        )}

        {/* Tab 3: Fairness & Stats */}
        {activeTab === 'fairness' && (
          <FairnessStats stats={parentStats} parents={parents} />
        )}

        {/* Tab 4: Parent Manager */}
        {activeTab === 'parents' && (
          <ParentManager parents={parents} onUpdateParents={handleUpdateParents} />
        )}
      </main>

      {/* WhatsApp Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        weekDays={whatsAppWeekDays.length > 0 ? whatsAppWeekDays : weekScheduleDays}
        parents={parents}
      />

      {/* Swap Modal */}
      <SwapModal
        isOpen={!!swapModalDay}
        onClose={() => setSwapModalDay(null)}
        day={swapModalDay}
        parents={parents}
        onSaveSwap={handleSaveSwap}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        startDate={startDate}
        onChangeStartDate={handleChangeStartDate}
        portions={portions}
        onChangePortions={handleChangePortions}
        allHolidays={allHolidays}
        disabledHolidayDates={disabledHolidays}
        onToggleHoliday={handleToggleHoliday}
        onAddCustomHoliday={handleAddCustomHoliday}
        onDeleteCustomHoliday={handleDeleteCustomHoliday}
        schedule={schedule}
        onResetAll={handleResetAll}
      />
    </div>
  )
}
