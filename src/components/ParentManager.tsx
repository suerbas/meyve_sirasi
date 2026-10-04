import React, { useState } from 'react'
import { Users, Edit3, Check, X, Search, Phone, FileText } from 'lucide-react'
import { Parent } from '../types'

interface ParentManagerProps {
  parents: Parent[]
  onUpdateParents: (parents: Parent[]) => void
}

export const ParentManager: React.FC<ParentManagerProps> = ({ parents, onUpdateParents }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingParentId, setEditingParentId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Parent>({ id: 0 })

  const startEdit = (p: Parent) => {
    setEditingParentId(p.id)
    setEditForm({ ...p })
  }

  const cancelEdit = () => {
    setEditingParentId(null)
  }

  const saveEdit = () => {
    const updated = parents.map(p => p.id === editForm.id ? editForm : p)
    onUpdateParents(updated)
    setEditingParentId(null)
  }

  const filteredParents = parents.filter(p => {
    const term = searchTerm.toLowerCase()
    return (
      `veli ${p.id}`.includes(term) ||
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.childName && p.childName.toLowerCase().includes(term))
    )
  })

  return (
    <div className="space-y-4">
      {/* Intro info box */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base">
              Veli & Numara Rehberi (21 Veli)
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Sistemde numaralar esastır (#1 - #21). İsteğe bağlı olarak isim ve öğrenci bilgisi ekleyebilirsiniz.
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Numara veya isim ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-emerald-500 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Parents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredParents.map((parent) => {
          const isEditing = editingParentId === parent.id

          if (isEditing) {
            return (
              <div
                key={parent.id}
                className="bg-white rounded-2xl p-4 border-2 border-emerald-500 shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                    #{parent.id}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">Düzenleniyor</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">
                      Veli Adı Soyadı
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Ayşe Yılmaz"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full mt-0.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">
                      Öğrenci Adı
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Eren"
                      value={editForm.childName || ''}
                      onChange={(e) => setEditForm({ ...editForm, childName: e.target.value })}
                      className="w-full mt-0.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">
                      Telefon / Not
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: 05xx... veya Not"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full mt-0.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={saveEdit}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Kaydet
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          }

          return (
            <div
              key={parent.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-slate-300 transition flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-black text-sm flex items-center justify-center border border-slate-200 group-hover:bg-emerald-100 group-hover:text-emerald-800 group-hover:border-emerald-300 transition shrink-0">
                  #{parent.id}
                </span>

                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-900 text-sm truncate">
                    Veli {parent.id}
                    {parent.name && (
                      <span className="font-bold text-slate-600 ml-1">({parent.name})</span>
                    )}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
                    {parent.childName ? (
                      <span className="font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[11px] border border-emerald-100">
                        👶 {parent.childName}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">İsim atanmadı</span>
                    )}
                    {parent.phone && (
                      <span className="text-slate-400 text-[11px]">
                        📞 {parent.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => startEdit(parent)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
                title="Düzenle"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
