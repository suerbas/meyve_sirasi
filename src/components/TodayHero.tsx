import React, { useState } from 'react'
import { Bell, Check, Sparkles, UserCheck } from 'lucide-react'
import { Parent, ScheduleDay } from '../types'
import { formatTurkishDate, generateDayReminderText, getParentDisplayName } from '../utils/scheduler'
import confetti from 'canvas-confetti'

interface TodayHeroProps {
  todayStr: string
  todaySchedule?: ScheduleDay
  nextSchoolDaySchedule?: ScheduleDay
  parents: Parent[]
  onOpenSwapModal: (day: ScheduleDay) => void
}

export const TodayHero: React.FC<TodayHeroProps> = ({
  todayStr,
  todaySchedule,
  nextSchoolDaySchedule,
  parents,
  onOpenSwapModal
}) => {
  const [copied, setCopied] = useState(false)

  // Use today if it is a school day, else use the next upcoming school day
  const activeDay = (todaySchedule && todaySchedule.isSchoolDay) ? todaySchedule : nextSchoolDaySchedule
  const isActualToday = activeDay?.date === todayStr

  const handleCopyReminder = () => {
    if (!activeDay) return
    const text = generateDayReminderText(activeDay, parents, !isActualToday)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      })
      setTimeout(() => setCopied(false), 2500)
    })
  }

  if (!activeDay || !activeDay.fruit || !activeDay.parentNumber) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs mb-5">
        <p className="text-slate-500 text-sm">Aktif nöbet günü bulunamadı.</p>
      </div>
    )
  }

  const parentName = getParentDisplayName(activeDay.parentNumber, parents)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-slate-50 shadow-sm transition-all mb-6">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 rounded-full bg-white/40 blur-2xl pointer-events-none" />

      <div className="p-4 sm:p-6 relative z-10">
        {/* Top notification pill */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide shadow-2xs ${
              isActualToday
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 text-white'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              {isActualToday ? 'BUGÜNÜN NÖBETÇİSİ' : 'SIRADAKİ İLK OKUL GÜNÜ'}
            </span>
            <span className="text-xs font-semibold text-slate-600">
              {formatTurkishDate(activeDay.date, true)}
            </span>
          </div>

          {activeDay.isOverridden && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
              <UserCheck className="w-3 h-3" /> Nöbet Takası Yapıldı
            </span>
          )}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Fruit Hero Graphic */}
          <div className="md:col-span-5 flex items-center gap-4">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shadow-md border ${
              activeDay.fruit.bgColor
            } ${activeDay.fruit.borderColor} ring-4 ring-white`}>
              {activeDay.fruit.emoji}
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {activeDay.fruit.name}
              </h2>
              <p className="text-sm font-semibold text-slate-600 mt-1 flex items-center gap-1.5">
                <span className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-md font-bold">
                  {activeDay.quantity} Adet
                </span>
                <span className="text-xs text-slate-500">(21 Öğrenci + 1 Öğretmen)</span>
              </p>
            </div>
          </div>

          {/* Assigned Parent Card */}
          <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nöbetçi Veli
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center border border-emerald-300">
                    #{activeDay.parentNumber}
                  </span>
                  <div className="font-extrabold text-slate-900 text-base sm:text-lg">
                    {parentName}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Okul günü sırası: #{((activeDay.schoolDayIndex ?? 0) + 1)}. gün
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <button
                  onClick={handleCopyReminder}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition shadow-2xs active:scale-95 cursor-pointer ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                  title="WhatsApp Hatırlatması Kopyala"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  <span>{copied ? 'Kopyalandı!' : 'Hatırlatmayı Kopyala'}</span>
                </button>

                <button
                  onClick={() => onOpenSwapModal(activeDay)}
                  className="px-3 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                  title="Nöbeti Başka Veliye Devret/Takas Et"
                >
                  Takas Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
