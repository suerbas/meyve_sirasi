import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, ArrowRightLeft } from 'lucide-react'
import { Parent, ScheduleDay } from '../types'
import { formatTurkishDate, getDayName, getParentDisplayName, parseDate } from '../utils/scheduler'

interface CalendarViewProps {
  schedule: ScheduleDay[]
  parents: Parent[]
  todayStr: string
  onOpenSwapModal: (day: ScheduleDay) => void
  onToggleHoliday?: (dateStr: string) => void
}

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
]

const WEEK_HEADERS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

export const CalendarView: React.FC<CalendarViewProps> = ({
  schedule,
  parents,
  todayStr,
  onOpenSwapModal
}) => {
  // Current viewed month and year
  const initialDate = parseDate(todayStr || '2026-10-05')
  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear())
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth()) // 0 to 11
  const [selectedDay, setSelectedDay] = useState<ScheduleDay | null>(null)

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Create grid cells for currentMonth & currentYear
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const totalDaysInMonth = lastDayOfMonth.getDate()

  // Find Monday-based starting day (0: Mon, 1: Tue, ..., 6: Sun)
  let startDayOfWeek = firstDayOfMonth.getDay() // 0 is Sun, 1 is Mon
  const paddingBefore = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1

  // Map schedule days by date string for quick lookup
  const scheduleMap = new Map<string, ScheduleDay>()
  for (const day of schedule) {
    scheduleMap.set(day.date, day)
  }

  // Build grid items
  const gridCells: { dateStr?: string; dayNum?: number; dayData?: ScheduleDay }[] = []

  // Leading empty cells
  for (let i = 0; i < paddingBefore; i++) {
    gridCells.push({})
  }

  // Actual days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const mStr = String(currentMonth + 1).padStart(2, '0')
    const dStr = String(d).padStart(2, '0')
    const dateStr = `${currentYear}-${mStr}-${dStr}`
    gridCells.push({
      dateStr,
      dayNum: d,
      dayData: scheduleMap.get(dateStr)
    })
  }

  return (
    <div className="space-y-4">
      {/* Month Navigator Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Aylık Görünüm & Meyve Takvimi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            title="Önceki Ay"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            title="Sonraki Ay"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Day Headers (Pzt to Paz) */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center py-2.5">
          {WEEK_HEADERS.map((h, i) => (
            <div
              key={h}
              className={`text-xs font-extrabold tracking-wider ${
                i >= 5 ? 'text-slate-400' : 'text-slate-700'
              }`}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
          {gridCells.map((cell, index) => {
            if (!cell.dayNum || !cell.dateStr) {
              return <div key={`empty-${index}`} className="min-h-[75px] sm:min-h-[90px] bg-slate-50/30" />
            }

            const dayData = cell.dayData
            const isToday = cell.dateStr === todayStr
            const isWeekend = (index % 7) >= 5
            const isHoliday = dayData?.isHoliday
            const isSchoolDay = dayData?.isSchoolDay

            return (
              <div
                key={cell.dateStr}
                onClick={() => dayData && setSelectedDay(dayData)}
                className={`min-h-[75px] sm:min-h-[95px] p-1 sm:p-2 transition flex flex-col justify-between cursor-pointer group ${
                  isToday
                    ? 'bg-emerald-50/60 ring-2 ring-emerald-500 ring-inset'
                    : isHoliday
                    ? 'bg-amber-50/60 hover:bg-amber-100/60'
                    : isWeekend
                    ? 'bg-slate-50/40 text-slate-400'
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                {/* Header: Day number & badges */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs sm:text-sm font-extrabold rounded-md px-1 ${
                    isToday
                      ? 'bg-emerald-600 text-white'
                      : isHoliday
                      ? 'text-amber-800'
                      : isWeekend
                      ? 'text-slate-400'
                      : 'text-slate-800'
                  }`}>
                    {cell.dayNum}
                  </span>

                  {isHoliday && (
                    <span className="text-[9px] font-black uppercase text-amber-800 bg-amber-200/80 px-1 rounded truncate max-w-[50px] sm:max-w-none">
                      Tatil
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="mt-1 flex-1 flex flex-col justify-center">
                  {isSchoolDay && dayData?.fruit && dayData.parentNumber ? (
                    <div className="space-y-1">
                      {/* Fruit Emoji & Name */}
                      <div className={`flex items-center gap-1 rounded-md px-1 py-0.5 text-[11px] font-bold border truncate ${dayData.fruit.bgColor} ${dayData.fruit.borderColor} ${dayData.fruit.textColor}`}>
                        <span>{dayData.fruit.emoji}</span>
                        <span className="hidden sm:inline truncate">{dayData.fruit.name}</span>
                      </div>

                      {/* Parent pill */}
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold text-slate-700 bg-slate-100 rounded px-1 py-0.5 truncate border border-slate-200">
                        <span className="text-emerald-700">#{dayData.parentNumber}</span>
                        <span className="hidden sm:inline truncate">
                          {parents.find(p => p.id === dayData.parentNumber)?.name || `Veli ${dayData.parentNumber}`}
                        </span>
                      </div>
                    </div>
                  ) : isHoliday ? (
                    <div className="text-[10px] text-amber-700 font-bold truncate">
                      {dayData?.holidayName || 'Okul Kapalı'}
                    </div>
                  ) : isWeekend ? (
                    <div className="text-[10px] text-slate-400 font-medium hidden sm:block">
                      Hafta Sonu
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Day Details Modal / Bottom Sheet */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Seçili Gün Detayı</span>
                <h4 className="text-lg font-black text-slate-900">
                  {formatTurkishDate(selectedDay.date, true)}
                </h4>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedDay.isHoliday ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <div className="font-extrabold text-sm flex items-center gap-1.5">
                  <span>🏖️</span>
                  <span>{selectedDay.holidayName || 'Resmi Tatil'}</span>
                </div>
                <p className="text-xs text-amber-800">
                  Okul kapalı olduğu için bu günde meyve dağıtımı yapılmaz. Nöbet sırası bir sonraki açık güne ötelenmiştir.
                </p>
              </div>
            ) : selectedDay.isWeekend ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-sm">
                😴 Hafta sonu olduğu için okul kapalıdır.
              </div>
            ) : selectedDay.isSchoolDay && selectedDay.fruit && selectedDay.parentNumber ? (
              <div className="space-y-3">
                {/* Fruit */}
                <div className={`p-4 rounded-2xl border ${selectedDay.fruit.bgColor} ${selectedDay.fruit.borderColor} flex items-center gap-3`}>
                  <span className="text-4xl">{selectedDay.fruit.emoji}</span>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-base">
                      {selectedDay.fruit.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-slate-600 bg-white/70 px-2 py-0.5 rounded-md border border-slate-200">
                        {selectedDay.quantity} Adet (21 Öğrenci + 1 Öğretmen)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Parent */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Nöbetçi Veli</span>
                    <div className="font-extrabold text-slate-900 text-base flex items-center gap-2 mt-0.5">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center border border-emerald-300">
                        #{selectedDay.parentNumber}
                      </span>
                      <span>{getParentDisplayName(selectedDay.parentNumber, parents)}</span>
                    </div>
                  </div>
                  {selectedDay.isOverridden && (
                    <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-lg">
                      Takaslı
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onOpenSwapModal(selectedDay)
                      setSelectedDay(null)
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition shadow-xs cursor-pointer"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Nöbeti Başka Veliyle Değiştir (Takas)</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
