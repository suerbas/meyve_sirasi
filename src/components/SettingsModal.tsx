import React, { useState } from 'react'
import { Settings, Calendar, Plus, Trash2, Download, RotateCcw, Check, Sparkles } from 'lucide-react'
import { Holiday, ScheduleDay } from '../types'
import { formatTurkishDate } from '../utils/scheduler'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  startDate: string
  onChangeStartDate: (date: string) => void
  portions: number
  onChangePortions: (portions: number) => void
  allHolidays: Holiday[]
  disabledHolidayDates: string[]
  onToggleHoliday: (date: string) => void
  onAddCustomHoliday: (h: Holiday) => void
  onDeleteCustomHoliday: (date: string) => void
  schedule: ScheduleDay[]
  onResetAll: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  startDate,
  onChangeStartDate,
  portions,
  onChangePortions,
  allHolidays,
  disabledHolidayDates,
  onToggleHoliday,
  onAddCustomHoliday,
  onDeleteCustomHoliday,
  schedule,
  onResetAll
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'holidays'>('general')
  const [newHolidayDate, setNewHolidayDate] = useState('')
  const [newHolidayName, setNewHolidayName] = useState('')

  if (!isOpen) return null

  const handleCreateHoliday = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHolidayDate || !newHolidayName.trim()) return

    onAddCustomHoliday({
      date: newHolidayDate,
      name: newHolidayName.trim(),
      type: 'custom',
      isSchoolClosed: true
    })

    setNewHolidayDate('')
    setNewHolidayName('')
  }

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF' // UTF-8 BOM
    csvContent += 'Tarih,Gun,Durum,Nobetci,Meyve,Adet,Not\n'

    for (const d of schedule) {
      if (d.isHoliday) {
        csvContent += `"${d.date}","${formatTurkishDate(d.date, false)}","TATIL","","","","${d.holidayName || ''}"\n`
      } else if (d.isWeekend) {
        csvContent += `"${d.date}","${formatTurkishDate(d.date, false)}","HAFTA SONU","","","",""\n`
      } else if (d.isSchoolDay && d.fruit && d.parentNumber) {
        csvContent += `"${d.date}","${formatTurkishDate(d.date, false)}","OKUL GUNU","Veli ${d.parentNumber}","${d.fruit.name}","${d.quantity}",""\n`
      }
    }

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `meyve_nobet_takvimi_${startDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 text-slate-800 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Program Ayarları & Tatiller
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Takvim başlangıcı, porsiyon ve MEB tatilleri
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

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'general' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Genel Ayarlar & Dışa Aktar
          </button>
          <button
            onClick={() => setActiveTab('holidays')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'holidays' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            MEB & Özel Tatiller ({allHolidays.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-4">
          {activeTab === 'general' && (
            <div className="space-y-4 text-xs">
              {/* Start Date */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="font-extrabold text-slate-900 text-xs block">
                  Takvim Başlangıç Tarihi
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onChangeStartDate(e.target.value)}
                    className="p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white"
                  />
                  <span className="text-slate-500 font-medium">
                    (Seçilen gün: {formatTurkishDate(startDate, true)})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Varsayılan: En yakın Pazartesi (5 Ekim 2026).
                </p>
              </div>

              {/* Portions */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="font-extrabold text-slate-900 text-xs block">
                  Günlük Toplam Meyve Adedi (Porsiyon)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={portions}
                    onChange={(e) => onChangePortions(Number(e.target.value))}
                    className="w-24 p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white"
                  />
                  <span className="text-slate-600 font-semibold">
                    Adet (21 Öğrenci + 1 Öğretmen)
                  </span>
                </div>
              </div>

              {/* Export to CSV */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-emerald-950 text-xs">
                    Excel / CSV Olarak İndir
                  </h4>
                  <p className="text-[11px] text-emerald-800/80">
                    Tüm eğitim döneminin nöbet takvimini Excel tablosu olarak kaydedin.
                  </p>
                </div>
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>İndir (CSV)</span>
                </button>
              </div>

              {/* Reset */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Özel ayarları ve takasları sıfırla:</span>
                <button
                  onClick={() => {
                    if (confirm('Tüm özel isimleri ve nöbet takaslarını sıfırlamak istediğinize emin misiniz?')) {
                      onResetAll()
                    }
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sıfırla</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'holidays' && (
            <div className="space-y-4 text-xs">
              {/* Add Custom Holiday form */}
              <form onSubmit={handleCreateHoliday} className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2.5">
                <span className="font-extrabold text-indigo-950 text-xs block">
                  Yeni Özel Tatil Ekle (Örn: Kar Tatili)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="date"
                    required
                    value={newHolidayDate}
                    onChange={(e) => setNewHolidayDate(e.target.value)}
                    className="p-2 rounded-xl border border-indigo-200 bg-white font-semibold text-slate-800"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Tatil Açıklaması (Örn: Kar Tatili)"
                    value={newHolidayName}
                    onChange={(e) => setNewHolidayName(e.target.value)}
                    className="p-2 rounded-xl border border-indigo-200 bg-white font-semibold text-slate-800"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer transition"
                >
                  <Plus className="w-4 h-4" /> Tatil Ekle
                </button>
              </form>

              {/* Holiday List */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-500 uppercase text-[11px] block">
                  MEB ve Resmi Tatiller Listesi:
                </span>
                {allHolidays.map((h) => {
                  const isDisabled = disabledHolidayDates.includes(h.date)

                  return (
                    <div
                      key={h.date}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                        isDisabled
                          ? 'bg-slate-50 border-slate-200 opacity-50'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!isDisabled}
                          onChange={() => onToggleHoliday(h.date)}
                          className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                        />
                        <div>
                          <div className="font-extrabold text-slate-800">
                            {h.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {formatTurkishDate(h.date, false)}
                          </div>
                        </div>
                      </div>

                      {h.type === 'custom' && (
                        <button
                          type="button"
                          onClick={() => onDeleteCustomHoliday(h.date)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Özel Tatili Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}
