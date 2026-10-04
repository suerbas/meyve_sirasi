import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Share2, ArrowRightLeft, Bell, Check, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react'
import { Parent, ScheduleDay } from '../types'
import { formatShortDate, formatTurkishDate, generateDayReminderText, getDayName, getParentDisplayName, parseDate } from '../utils/scheduler'
import confetti from 'canvas-confetti'

interface WeeklyViewProps {
  currentWeekMonday: Date
  onChangeWeek: (newMonday: Date) => void
  weekScheduleDays: ScheduleDay[]
  parents: Parent[]
  todayStr: string
  onOpenWhatsApp: (weekDays: ScheduleDay[]) => void
  onOpenSwapModal: (day: ScheduleDay) => void
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  currentWeekMonday,
  onChangeWeek,
  weekScheduleDays,
  parents,
  todayStr,
  onOpenWhatsApp,
  onOpenSwapModal
}) => {
  const [copiedDayDate, setCopiedDayDate] = useState<string | null>(null)

  const handlePrevWeek = () => {
    const prev = new Date(currentWeekMonday)
    prev.setDate(prev.getDate() - 7)
    onChangeWeek(prev)
  }

  const handleNextWeek = () => {
    const next = new Date(currentWeekMonday)
    next.setDate(next.getDate() + 7)
    onChangeWeek(next)
  }

  const handleCurrentWeek = () => {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    onChangeWeek(new Date(now.setDate(diff)))
  }

  const handleCopySingleDay = (day: ScheduleDay) => {
    const text = generateDayReminderText(day, parents, day.date > todayStr)
    navigator.clipboard.writeText(text).then(() => {
      setCopiedDayDate(day.date)
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 }
      })
      setTimeout(() => setCopiedDayDate(null), 2000)
    })
  }

  const weekStartDateStr = weekScheduleDays[0]?.date
  const weekEndDateStr = weekScheduleDays[weekScheduleDays.length - 1]?.date

  return (
    <div className="space-y-4">
      {/* Week Navigator Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Haftalık Nöbet Listesi
            </h3>
            {weekStartDateStr && weekEndDateStr && (
              <p className="text-xs font-semibold text-slate-500">
                {formatShortDate(weekStartDateStr)} - {formatShortDate(weekEndDateStr)} {parseDate(weekEndDateStr).getFullYear()}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={handlePrevWeek}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            title="Önceki Hafta"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleCurrentWeek}
            className="flex-1 sm:flex-initial text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer text-center"
          >
            Bu Hafta
          </button>

          <button
            onClick={handleNextWeek}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            title="Sonraki Hafta"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenWhatsApp(weekScheduleDays)}
            className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition active:scale-95 cursor-pointer ml-1"
          >
            <Share2 className="w-4 h-4" />
            <span>Haftalık WhatsApp Metni</span>
          </button>
        </div>
      </div>

      {/* Week Day Cards */}
      <div className="space-y-2.5">
        {weekScheduleDays.map((day) => {
          const isToday = day.date === todayStr
          const isCopied = copiedDayDate === day.date

          if (day.isHoliday) {
            return (
              <div
                key={day.date}
                className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-amber-200">
                    <span className="uppercase text-[10px]">{getDayName(day.date).slice(0, 3)}</span>
                    <span className="text-sm font-extrabold">{parseDate(day.date).getDate()}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-amber-900 text-sm">
                        {getDayName(day.date)} ({formatShortDate(day.date)})
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                        TATİL • Okul Kapalı
                      </span>
                    </div>
                    <p className="text-xs text-amber-800/80 font-medium mt-0.5">
                      {day.holidayName || 'Resmi Tatil'}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-amber-700 font-medium sm:text-right">
                  Meyve nöbeti bu günde uygulanmaz, sıra ertesi okul gününe geçer.
                </div>
              </div>
            )
          }

          if (!day.isSchoolDay || !day.fruit || !day.parentNumber) {
            return null
          }

          const parentName = getParentDisplayName(day.parentNumber, parents)
          const isExpensive = day.fruit.costTier === 'expensive'

          return (
            <div
              key={day.date}
              className={`bg-white rounded-2xl p-4 border transition-all shadow-2xs hover:shadow-xs ${
                isToday
                  ? 'border-emerald-500 ring-2 ring-emerald-400/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Date and Day */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs shrink-0 border ${
                    isToday
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    <span className="uppercase text-[10px] leading-tight">{getDayName(day.date).slice(0, 3)}</span>
                    <span className="text-base font-black leading-none">{parseDate(day.date).getDate()}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {getDayName(day.date)}
                      </h4>
                      {isToday && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                          BUGÜN
                        </span>
                      )}
                      {day.isOverridden && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                          Takaslı
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {formatTurkishDate(day.date, false)}
                    </p>
                  </div>
                </div>

                {/* Fruit & Parent Info */}
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  {/* Fruit Badge */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${day.fruit.bgColor} ${day.fruit.borderColor}`}>
                    <span className="text-2xl">{day.fruit.emoji}</span>
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm block">
                        {day.fruit.name}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {day.quantity} Adet
                      </span>
                    </div>
                  </div>

                  {/* Parent Badge */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                    <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center border border-emerald-300">
                      #{day.parentNumber}
                    </span>
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none">
                        Nöbetçi
                      </span>
                      <span className="font-extrabold text-slate-800 text-xs sm:text-sm">
                        {parentName}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopySingleDay(day)}
                      className={`p-2 rounded-xl transition cursor-pointer border ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                      title="Günün Hatırlatma Mesajını Kopyala"
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onOpenSwapModal(day)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                      title="Nöbet Takası Yap"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
