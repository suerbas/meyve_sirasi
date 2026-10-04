import React, { useState, useEffect } from 'react'
import { Share2, Copy, Check, ExternalLink, X, MessageSquare, Sparkles } from 'lucide-react'
import { Parent, ScheduleDay } from '../types'
import { generateWhatsAppWeeklyText } from '../utils/scheduler'
import confetti from 'canvas-confetti'

interface WhatsAppModalProps {
  isOpen: boolean
  onClose: () => void
  weekDays: ScheduleDay[]
  parents: Parent[]
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  weekDays,
  parents
}) => {
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen && weekDays.length > 0) {
      const generated = generateWhatsAppWeeklyText(weekDays, parents)
      setMessage(generated)
    }
  }, [isOpen, weekDays, parents])

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true)
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      })
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(message)
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                WhatsApp Nöbet Listesi
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Sınıf grubunda paylaşmaya hazır mesaj
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

        {/* Message preview area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> Mesaj Önizlemesi (Düzenleyebilirsiniz):
            </label>
            <span className="text-[11px] font-semibold text-slate-400">
              {message.length} karakter
            </span>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={10}
            className="w-full p-3.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-2xl focus:outline-emerald-500 focus:bg-white text-slate-800 leading-relaxed resize-none shadow-inner"
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={handleCopy}
            className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm transition shadow-sm active:scale-95 cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Panoya Kopyalandı!' : 'Metni Kopyala'}</span>
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs sm:text-sm transition shadow-sm active:scale-95 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>WhatsApp'ta Aç</span>
          </button>
        </div>
      </div>
    </div>
  )
}
