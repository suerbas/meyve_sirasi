import React from 'react'
import { Calendar, Settings, Sparkles, Share2, Award } from 'lucide-react'
import { FRUITS } from '../utils/fruits'

interface HeaderProps {
  onOpenSettings: () => void
  onOpenWhatsApp: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenWhatsApp }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 flex items-center justify-center text-2xl shadow-md shadow-emerald-500/20 ring-2 ring-white">
              🍎
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Meyve Nöbetçisi
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> %100 Adil Dağıtım
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <span>21 Veli</span>
                <span>•</span>
                <span>Her Gün 22 Adet</span>
                <span className="hidden xs:inline">•</span>
                <span className="hidden xs:inline text-emerald-600 font-semibold">(21 Öğrenci + 1 Öğretmen)</span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenWhatsApp}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl transition shadow-sm active:scale-95 cursor-pointer"
              title="WhatsApp Haftalık Listesi"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp Listesi</span>
              <span className="sm:hidden">Paylaş</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition border border-slate-200 cursor-pointer"
              title="Ayarlar & Tatil Yönetimi"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Fruit rotation bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between overflow-x-auto no-scrollbar gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-500" /> Meyve Sırası:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {FRUITS.map((fruit, idx) => (
              <span
                key={fruit.id}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${fruit.badgeBg} border ${fruit.borderColor}`}
              >
                <span>{fruit.emoji}</span>
                <span>{fruit.name}</span>
                {idx < FRUITS.length - 1 && <span className="text-slate-300 ml-0.5">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
