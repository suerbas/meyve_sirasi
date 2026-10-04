import React, { useState } from 'react'
import { Sparkles, CheckCircle2, Search, Filter } from 'lucide-react'
import { Parent, ParentStats } from '../types'
import { formatShortDate, getParentDisplayName } from '../utils/scheduler'

interface FairnessStatsProps {
  stats: ParentStats[]
  parents: Parent[]
}

export const FairnessStats: React.FC<FairnessStatsProps> = ({ stats, parents }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'id' | 'muz' | 'total'>('id')

  // Calculate high-level aggregates
  const minMuz = Math.min(...stats.map(s => s.expensiveCount))
  const maxMuz = Math.max(...stats.map(s => s.expensiveCount))
  const muzDiff = maxMuz - minMuz // Should be 0 or 1 at any point

  // Filter and sort stats
  const filteredStats = stats
    .filter(s => {
      const p = parents.find(item => item.id === s.parentId)
      const name = p?.name?.toLowerCase() || ''
      const child = p?.childName?.toLowerCase() || ''
      const term = searchTerm.toLowerCase()
      return `veli ${s.parentId}`.includes(term) || name.includes(term) || child.includes(term)
    })
    .sort((a, b) => {
      if (sortBy === 'muz') return b.expensiveCount - a.expensiveCount
      if (sortBy === 'total') return b.totalDutyCount - a.totalDutyCount
      return a.parentId - b.parentId
    })

  return (
    <div className="space-y-5">
      {/* Mathematical Fairness Banner */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-black border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MATEMATİKSEL ADALET GARANTİSİ</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Neden %100 Kusursuz ve Eşit Dağılım?
          </h3>

          <div className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed max-w-3xl space-y-2">
            <p>
              Sınıfta <strong>21 veli</strong> ve döngüde <strong>5 çeşit meyve</strong> (Elma, Armut, Mandalina, Muz, Havuç) bulunmaktadır. 
              <strong> 21 ile 5 sayıları aralarında asaldır (EBOB = 1).</strong>
            </p>
            <p>
              Veliler 1'den 21'e sırayla nöbet tutarken her tur tamamlandığında meyve sırası 1 gün kayar. 
              Bu kural sayesinde, <strong>105 okul günü (5 tam tur)</strong> tamamlandığında istisnasız 
              <strong> her veli tam olarak 1 kez Muz, 1 kez Havuç, 1 kez Elma, 1 kez Armut ve 1 kez Mandalina</strong> getirmiş olur!
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] font-bold text-emerald-200 block">Denge Farkı</span>
              <span className="text-lg sm:text-2xl font-black text-white">
                {muzDiff <= 1 ? 'Maks. 1 Adet' : `${muzDiff}`}
              </span>
              <span className="text-[10px] text-emerald-300 block">Tüm Meyveler Dengeli</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] font-bold text-emerald-200 block">Adalet Skoru</span>
              <span className="text-lg sm:text-2xl font-black text-emerald-300 flex items-center gap-1">
                %100 <CheckCircle2 className="w-4 h-4 inline" />
              </span>
              <span className="text-[10px] text-emerald-300 block">Tam Simetrik Döngü</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] font-bold text-emerald-200 block">1 Tam Tur</span>
              <span className="text-lg sm:text-2xl font-black text-white">21 Okul Günü</span>
              <span className="text-[10px] text-emerald-300 block">Her Veli 1 Kez Getirir</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] font-bold text-emerald-200 block">Tam Eşitlik Periyodu</span>
              <span className="text-lg sm:text-2xl font-black text-white">105 Okul Günü</span>
              <span className="text-[10px] text-emerald-300 block">5 Meyve x 21 Veli</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Veli no veya isim ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-emerald-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Sırala:
          </span>
          <button
            onClick={() => setSortBy('id')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              sortBy === 'id'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Veli No
          </button>
          <button
            onClick={() => setSortBy('muz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              sortBy === 'muz'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🍌 Muz Sayısı
          </button>
          <button
            onClick={() => setSortBy('total')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              sortBy === 'total'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Toplam Nöbet
          </button>
        </div>
      </div>

      {/* 21 Parents Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Veli</th>
                <th className="py-3 px-3 text-center">🍏 Elma</th>
                <th className="py-3 px-3 text-center">🍐 Armut</th>
                <th className="py-3 px-3 text-center">🍊 Mandalina</th>
                <th className="py-3 px-3 text-center">🍌 Muz</th>
                <th className="py-3 px-3 text-center">🥕 Havuç</th>
                <th className="py-3 px-3 text-center">Toplam</th>
                <th className="py-3 px-4">Sıradaki Nöbet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStats.map((item) => {
                const parentDisplayName = getParentDisplayName(item.parentId, parents)

                return (
                  <tr key={item.parentId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center border border-emerald-300">
                          #{item.parentId}
                        </span>
                        <span className="font-bold text-slate-800">
                          {parentDisplayName}
                        </span>
                      </div>
                    </td>

                    {/* Elma */}
                    <td className="py-3 px-3 text-center font-bold text-slate-700">
                      {item.fruitCounts['elma'] || 0}
                    </td>

                    {/* Armut */}
                    <td className="py-3 px-3 text-center font-bold text-slate-700">
                      {item.fruitCounts['armut'] || 0}
                    </td>

                    {/* Mandalina */}
                    <td className="py-3 px-3 text-center font-bold text-slate-700">
                      {item.fruitCounts['mandalina'] || 0}
                    </td>

                    {/* Muz */}
                    <td className="py-3 px-3 text-center font-bold text-slate-700">
                      {item.fruitCounts['muz'] || 0}
                    </td>

                    {/* Havuç */}
                    <td className="py-3 px-3 text-center font-bold text-slate-700">
                      {item.fruitCounts['havuc'] || 0}
                    </td>

                    {/* Toplam */}
                    <td className="py-3 px-3 text-center">
                      <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {item.totalDutyCount}
                      </span>
                    </td>

                    {/* Next duty */}
                    <td className="py-3 px-4">
                      {item.nextDutyDate && item.nextDutyFruit ? (
                        <div className="flex items-center gap-1.5">
                          <span>{item.nextDutyFruit.emoji}</span>
                          <span className="font-semibold text-slate-700">
                            {formatShortDate(item.nextDutyDate)}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            ({item.nextDutyFruit.name})
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">-</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
