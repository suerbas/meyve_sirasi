import React from 'react'
import { CalendarDays, CalendarRange, Scale, Users } from 'lucide-react'

export type TabType = 'weekly' | 'calendar' | 'fairness' | 'parents'

interface NavigationProps {
  activeTab: TabType
  onChangeTab: (tab: TabType) => void
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    {
      id: 'weekly' as TabType,
      label: 'Haftalık Liste',
      icon: CalendarDays,
      badge: 'Nöbet'
    },
    {
      id: 'calendar' as TabType,
      label: 'Aylık Takvim',
      icon: CalendarRange
    },
    {
      id: 'fairness' as TabType,
      label: 'Adalet & İstatistik',
      icon: Scale,
      badge: '%100'
    },
    {
      id: 'parents' as TabType,
      label: 'Veli Rehberi',
      icon: Users
    }
  ]

  return (
    <>
      {/* Desktop / Tablet Navigation Pills */}
      <div className="hidden sm:flex items-center justify-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl max-w-xl mx-auto my-4 shadow-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl font-bold text-xs transition cursor-pointer select-none ${
                isActive
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-300 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Mobile Bottom Navigation Bar (Native App Style) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-2 py-1 shadow-lg">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer ${
                  isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className={`relative p-1 rounded-lg ${isActive ? 'bg-emerald-50' : ''}`}>
                  <Icon className="w-5 h-5" />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2 text-[9px] font-bold px-1 rounded-full bg-emerald-600 text-white leading-tight">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-full">
                  {tab.label.split(' ')[0]}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
