'use client'

import { useEffect, useState } from 'react'
import { Package, AlertTriangle, Plus, X } from 'lucide-react'

export default function SkladPage() {
  const [sklad, setSklad] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nazev: '', jednotka: 'ks', mnozstvi: '', minMnozstvi: '', cena: '' })

  const load = () => {
    fetch('/api/sklad')
      .then(r => r.json())
      .then(data => { setSklad(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async () => {
    if (!form.nazev.trim()) return
    setSaving(true)
    const res = await fetch('/api/sklad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      setForm({ nazev: '', jednotka: 'ks', mnozstvi: '', minMnozstvi: '', cena: '' })
      setShowForm(false)
      load()
    }
    setSaving(false)
  }

  const nizkyStav = sklad.filter(s => s.mnozstvi <= s.minMnozstvi)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Logistika</div>
          <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Sklad</h1>
          <p className="text-[14px] text-[#6b6760] mt-1">{sklad.length} položek · {nizkyStav.length} pod minimem</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="h-10 px-4 bg-[#0f0e0c] text-white rounded-lg text-[13px] font-semibold flex items-center gap-2 hover:bg-[#1a1916]"
        >
          <Plus size={14} /> Přidat položku
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[14px] font-bold text-[#0f0e0c]">Nová položka skladu</div>
            <button onClick={() => setShowForm(false)} className="text-[#a8a49c] hover:text-[#0f0e0c]"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Název *</label>
              <input
                value={form.nazev}
                onChange={e => setForm({...form, nazev: e.target.value})}
                placeholder="Např. Komínový kartáč 200mm"
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Jednotka</label>
              <select
                value={form.jednotka}
                onChange={e => setForm({...form, jednotka: e.target.value})}
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]"
              >
                {['ks', 'kg', 'l', 'm', 'balení', 'm²'].map(j => <option key={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Množství</label>
              <input
                type="number"
                value={form.mnozstvi}
                onChange={e => setForm({...form, mnozstvi: e.target.value})}
                placeholder="0"
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Minimální množství</label>
              <input
                type="number"
                value={form.minMnozstvi}
                onChange={e => setForm({...form, minMnozstvi: e.target.value})}
                placeholder="0"
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Cena / ks (Kč)</label>
              <input
                type="number"
                value={form.cena}
                onChange={e => setForm({...form, cena: e.target.value})}
                placeholder="0"
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={saving || !form.nazev.trim()}
              className="h-10 px-5 bg-[#0f0e0c] text-white rounded-lg text-[13px] font-semibold hover:bg-[#1a1916] disabled:opacity-50"
            >
              {saving ? 'Ukládám...' : 'Uložit položku'}
            </button>
            <button onClick={() => setShowForm(false)} className="h-10 px-5 bg-[#f5f4f0] text-[#6b6760] rounded-lg text-[13px] font-semibold hover:bg-[#eeede8]">
              Zrušit
            </button>
          </div>
        </div>
      )}

      {nizkyStav.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5 flex items-center gap-3">
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
          <div className="text-[13px] text-red-700 font-medium">{nizkyStav.length} položek pod minimálním stavem: {nizkyStav.map(s => s.nazev).join(', ')}</div>
        </div>
      )}

      <div className="bg-white border border-[#e8e6e0] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[14px] text-[#a8a49c]">Načítám...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9f8f5] border-b border-[#f0ede8]">
                {['Název','Množství','Min. množství','Cena/ks','Stav'].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-[#a8a49c] tracking-[1px] uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sklad.map((s: any) => (
                <tr key={s.id} className="border-b border-[#f7f6f3] last:border-0 hover:bg-[#faf9f7]">
                  <td className="px-4 py-3 text-[13px] font-semibold text-[#0f0e0c]">{s.nazev}</td>
                  <td className="px-4 py-3 text-[13px] text-[#6b6760]">{s.mnozstvi} {s.jednotka}</td>
                  <td className="px-4 py-3 text-[13px] text-[#6b6760]">{s.minMnozstvi} {s.jednotka}</td>
                  <td className="px-4 py-3 text-[13px] text-[#6b6760]">{s.cena ? s.cena.toLocaleString('cs') + ' Kč' : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={'text-[11px] font-semibold px-2.5 py-1 rounded-full ' + (s.mnozstvi <= s.minMnozstvi ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700')}>
                      {s.mnozstvi <= s.minMnozstvi ? 'Nízký stav' : 'OK'}
                    </span>
                  </td>
                </tr>
              ))}
              {sklad.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-[#a8a49c]">Prázdný sklad</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
