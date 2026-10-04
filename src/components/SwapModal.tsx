import React, { useState } from 'react'
import { ArrowRightLeft, UserCheck, Check, X, RotateCcw } from 'lucide-react'
import { Parent, ScheduleDay } from '../types'
import { formatTurkishDate, getParentDisplayName } from '../utils/scheduler'

interface SwapModalProps {
  isOpen: boolean
  onClose: () => void
  day: ScheduleDay | null
  parents: Parent[]
  onSaveSwap: (dateStr: string, newParentId: number | null) => void
}

export const SwapModal: React.FC<SwapModalProps> = ({
  isOpen,
  onClose,
  day,
  parents,
  onSaveSwap
}) => {
  if (!isOpen || !day || !day.fruit) return null

  const currentParentId = day.parentNumber || day.originalParentNumber || 1
  const [selectedParentId, setSelectedParentId] = useState<number>(currentParentId)

  const handleSave = () => {
    if (selectedParentId === day.originalParentNumber) {
      onSaveSwap(day.date, null) // reset to original
    } else {
      onSaveSwap(day.date, selectedParentId)
    }
    onClose()
  }

  const handleReset = () => {
    onSaveSwap(day.date, null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-100 text-purple-800 rounded-xl">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Nöbet Değişimi / Takas
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                {formatTurkishDate(day.date, true)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Current info */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">{day.fruit.emoji}</span>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">
                {day.fruit.name} ({day.quantity} Adet)
              </span>
              <span className="text-xs text-slate-500">
                Varsayılan: Veli #{day.originalParentNumber}
              </span>
            </div>
          </div>

        </div>

        {/* Parent selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase block">
            Bu günün nöbetini devralacak veli:
          </label>
          <select
            value={selectedParentId}
            onChange={(e) => setSelectedParentId(Number(e.target.value))}
            className="w-full p-3 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:outline-emerald-500 text-slate-800 shadow-2xs"
          >
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                Veli #{p.id} {p.name ? `- ${p.name}` : ''} {p.childName ? `(${p.childName})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2">
          {day.isOverridden && (
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer"
              title="Orijinal Veliye Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Sıfırla</span>
            </button>
          )}

          <button
            onClick={handleSave}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs sm:text-sm transition shadow-xs cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Takası Onayla</span>
          </button>
        </div>
      </div>
    </div>
  )
}
