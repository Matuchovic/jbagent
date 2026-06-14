'use client'

import { useState, useEffect } from 'react'
import { Plus, AlertTriangle } from 'lucide-react'

export default function SkladPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nazev: '', jednotka: 'ks', mnozstvi: '', minMnozstvi: '', cena: '' })
  const [saving, setSaving] = useState(false)

  const load = () => fetch('/api/sklad').then(r => r.json()).then(d => { setItems(d); setLoading(false) })
  useEffect(() => { load() }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    await fetch('/api/sklad', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false); setShowForm(false); setForm({ nazev: '', jednotka: 'ks', mnozstvi: '', minMnozstvi: '', cena: '' }); load()
  }

  const kriticke = items.filter(i => i.mnozstvi <= i.minMnozstvi)

  return (
    <div className="p-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Zásoby</div>
          <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Sklad & materiál</h1>
          <p className="text-[14px] text-[#6b6760] mt-1">{items.length} položek · {kriticke.length} vyžaduje doplnění</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#0f0e0c] text-white px-4 py-2 rounded-lg text-[13px] font-semibold">
          <Plus size={14} /> Přidat položku
        </button>
      </div>

      {kriticke.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[13px] font-bold text-red-700 mb-1">Kritické zásoby — {kriticke.length} položek</div>
            <div className="text-[12px] text-red-600">{kriticke.map(i => i.nazev).join(', ')}</div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-[17px] font-bold text-[#0f0e0c] mb-5">Nová položka skladu</h2>
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Název</label>
                <input required value={form.nazev} onChange={e => setForm({...form, nazev: e.target.value})}
                  className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Množství</label>
                  <input type="number" value={form.mnozstvi} onChange={e => setForm({...form, mnozstvi: e.target.value})}
                    className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Jednotka</label>
                  <select value={form.jednotka} onChange={e => setForm({...form, jednotka: e.target.value})}
                    className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]">
                    <option>ks</option><option>m</option><option>kg</option><option>l</option><option>balení</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Min. množství</label>
                  <input type="number" value={form.minMnozstvi} onChange={e => setForm({...form, minMnozstvi: e.target.value})}
                    className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Cena/ks (Kč)</label>
                  <input type="number" value={form.cena} onChange={e => setForm({...form, cena: e.target.value})}
                    className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-10 border border-[#e8e6e0] rounded-lg text-[13px] font-medium text-[#6b6760]">Zrušit</button>
                <button type="submit" disabled={saving} className="flex-1 h-10 bg-[#0f0e0c] text-white rounded-lg text-[13px] font-semibold">{saving ? 'Ukládám...' : 'Přidat'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#e8e6e0] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9f8f5] border-b border-[#f0ede8]">
              {['Název','Množství','Min. množství','Cena/ks','Hodnota','Stav'].map(h => (
                <th key={h} className="text-left text-[10px] font-semibold text-[#a8a49c] tracking-[1px] uppercase px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="text-center py-12 text-[#a8a49c]">Načítám...</td></tr>
            : items.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-[#a8a49c]">Sklad je prázdný</td></tr>
            : items.map((i: any) => {
              const kriticka = i.mnozstvi <= i.minMnozstvi
              return (
                <tr key={i.id} className={`border-b border-[#f7f6f3] last:border-0 hover:bg-[#faf9f7] ${kriticka ? 'bg-red-50/50' : ''}`}>
                  <td className="px-4 py-3 text-[13px] font-semibold text-[#0f0e0c]">{i.nazev}</td>
                  <td className="px-4 py-3 text-[13px] font-bold text-[#0f0e0c]">{i.mnozstvi} {i.jednotka}</td>
                  <td className="px-4 py-3 text-[13px] text-[#6b6760]">{i.minMnozstvi} {i.jednotka}</td>
                  <td className="px-4 py-3 text-[13px] text-[#6b6760]">{i.cena ? `${i.cena} Kč` : '—'}</td>
                  <td className="px-4 py-3 text-[13px] font-semibold text-[#0f0e0c]">{i.cena ? `${(i.mnozstvi * i.cena).toLocaleString('cs')} Kč` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${kriticka ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                      {kriticka ? 'Doplnit' : 'OK'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
