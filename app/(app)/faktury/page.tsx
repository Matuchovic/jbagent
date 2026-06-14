'use client'

import { useState, useEffect } from 'react'
import { Plus, FileText } from 'lucide-react'

const STAV_COLORS: Record<string, string> = { NOVA: 'bg-blue-50 text-blue-700', ODESLANA: 'bg-amber-50 text-amber-700', ZAPLACENA: 'bg-green-50 text-green-700', PO_SPLATNOSTI: 'bg-red-50 text-red-700', STORNO: 'bg-gray-100 text-gray-500' }
const STAV_LABELS: Record<string, string> = { NOVA: 'Nová', ODESLANA: 'Odeslaná', ZAPLACENA: 'Zaplacena', PO_SPLATNOSTI: 'Po splatnosti', STORNO: 'Storno' }

export default function FakturaPage() {
  const [faktury, setFaktury] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [zakázky, setZakázky] = useState<any[]>([])
  const [form, setForm] = useState({ castka: '', dph: '21', zakazkaId: '', splatnost: '' })
  const [saving, setSaving] = useState(false)

  const load = () => { fetch('/api/faktury').then(r => r.json()).then(d => { setFaktury(d); setLoading(false) }) }
  useEffect(() => { load(); fetch('/api/zakázky').then(r => r.json()).then(setZakázky) }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    await fetch('/api/faktury', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false); setShowForm(false); setForm({ castka: '', dph: '21', zakazkaId: '', splatnost: '' }); load()
  }

  const celkem = faktury.reduce((s, f) => s + f.castka, 0)
  const nezaplaceno = faktury.filter(f => f.stav !== 'ZAPLACENA' && f.stav !== 'STORNO').reduce((s, f) => s + f.castka, 0)

  return (
    <div className="p-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Finance</div>
          <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Faktury</h1>
          <p className="text-[14px] text-[#6b6760] mt-1">{faktury.length} faktur</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#0f0e0c] text-white px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#1a1916] transition-colors">
          <Plus size={14} /> Nová faktura
        </button>
      </div>

      {/* Metriky */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 shadow-sm">
          <div className="text-[10px] font-semibold text-[#a8a49c] uppercase tracking-wide mb-2">Celkem fakturováno</div>
          <div className="text-[24px] font-bold text-[#d4a843]">{celkem.toLocaleString('cs')} Kč</div>
        </div>
        <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 shadow-sm">
          <div className="text-[10px] font-semibold text-[#a8a49c] uppercase tracking-wide mb-2">Nezaplaceno</div>
          <div className="text-[24px] font-bold text-red-500">{nezaplaceno.toLocaleString('cs')} Kč</div>
        </div>
        <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 shadow-sm">
          <div className="text-[10px] font-semibold text-[#a8a49c] uppercase tracking-wide mb-2">Počet faktur</div>
          <div className="text-[24px] font-bold text-[#0f0e0c]">{faktury.length}</div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-[17px] font-bold text-[#0f0e0c] mb-5">Nová faktura</h2>
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Zakázka</label>
                <select value={form.zakazkaId} onChange={e => setForm({...form, zakazkaId: e.target.value})}
                  className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]">
                  <option value="">— Bez zakázky —</option>
                  {zakázky.map((z: any) => <option key={z.id} value={z.id}>#{z.cislo} {z.nazev}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Částka (Kč)</label>
                  <input required type="number" value={form.castka} onChange={e => setForm({...form, castka: e.target.value})}
                    className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">DPH (%)</label>
                  <input type="number" value={form.dph} onChange={e => setForm({...form, dph: e.target.value})}
                    className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Splatnost</label>
                <input type="date" value={form.splatnost} onChange={e => setForm({...form, splatnost: e.target.value})}
                  className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-10 border border-[#e8e6e0] rounded-lg text-[13px] font-medium text-[#6b6760]">Zrušit</button>
                <button type="submit" disabled={saving} className="flex-1 h-10 bg-[#0f0e0c] text-white rounded-lg text-[13px] font-semibold">{saving ? 'Ukládám...' : 'Vytvořit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#e8e6e0] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9f8f5] border-b border-[#f0ede8]">
              {['Číslo','Zakázka','Stav','Splatnost','Částka bez DPH','Celkem s DPH'].map(h => (
                <th key={h} className="text-left text-[10px] font-semibold text-[#a8a49c] tracking-[1px] uppercase px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="text-center py-12 text-[#a8a49c]">Načítám...</td></tr>
            : faktury.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-[#a8a49c]">Žádné faktury</td></tr>
            : faktury.map((f: any) => (
              <tr key={f.id} className="border-b border-[#f7f6f3] last:border-0 hover:bg-[#faf9f7]">
                <td className="px-4 py-3 text-[13px] font-bold text-[#0f0e0c]">{f.cislo}</td>
                <td className="px-4 py-3 text-[13px] text-[#6b6760]">{f.zakázka?.nazev || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STAV_COLORS[f.stav]}`}>{STAV_LABELS[f.stav]}</span>
                </td>
                <td className="px-4 py-3 text-[12px] text-[#6b6760]">{f.splatnost ? new Date(f.splatnost).toLocaleDateString('cs') : '—'}</td>
                <td className="px-4 py-3 text-[13px] font-semibold text-[#0f0e0c]">{f.castka.toLocaleString('cs')} Kč</td>
                <td className="px-4 py-3 text-[13px] font-bold text-[#d4a843]">{(f.castka * (1 + f.dph/100)).toLocaleString('cs', {maximumFractionDigits: 0})} Kč</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
