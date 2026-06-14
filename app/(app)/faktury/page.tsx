'use client'

import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'

const STAVY: Record<string, { label: string; color: string }> = {
  KONCEPT: { label: 'Koncept', color: 'bg-gray-50 text-gray-600' },
  ODESLANA: { label: 'Odeslaná', color: 'bg-blue-50 text-blue-700' },
  ZAPLACENA: { label: 'Zaplacená', color: 'bg-green-50 text-green-700' },
  PO_SPLATNOSTI: { label: 'Po splatnosti', color: 'bg-red-50 text-red-700' },
}

export default function FakturyPage() {
  const [faktury, setFaktury] = useState<any[]>([])
  const [zakazky, setZakazky] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ castka: '', dph: '21', stav: 'ODESLANA', splatnost: '', zakazkaId: '' })

  const load = () => {
    fetch('/api/faktury')
      .then(r => r.json())
      .then(data => { setFaktury(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    load()
    fetch('/api/zakazky').then(r => r.json()).then(data => setZakazky(Array.isArray(data) ? data : [])).catch(() => {})
  }, [])

  const handleSubmit = async () => {
    if (!form.castka) return
    setSaving(true)
    const res = await fetch('/api/faktury', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      setForm({ castka: '', dph: '21', stav: 'ODESLANA', splatnost: '', zakazkaId: '' })
      setShowForm(false)
      load()
    }
    setSaving(false)
  }

  const celkem = faktury.reduce((s, f) => s + (f.castka || 0), 0)
  const zaplaceno = faktury.filter(f => f.stav === 'ZAPLACENA').reduce((s, f) => s + (f.castka || 0), 0)
  const poSplatnosti = faktury.filter(f => f.stav === 'PO_SPLATNOSTI').reduce((s, f) => s + (f.castka || 0), 0)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Finance</div>
          <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Faktury</h1>
          <p className="text-[14px] text-[#6b6760] mt-1">{faktury.length} faktur celkem</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="h-10 px-4 bg-[#0f0e0c] text-white rounded-lg text-[13px] font-semibold flex items-center gap-2 hover:bg-[#1a1916]"
        >
          <Plus size={14} /> Nová faktura
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[14px] font-bold text-[#0f0e0c]">Nová faktura</div>
            <button onClick={() => setShowForm(false)} className="text-[#a8a49c] hover:text-[#0f0e0c]"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Částka (Kč) *</label>
              <input
                type="number"
                value={form.castka}
                onChange={e => setForm({...form, castka: e.target.value})}
                placeholder="0"
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">DPH (%)</label>
              <input
                type="number"
                value={form.dph}
                onChange={e => setForm({...form, dph: e.target.value})}
                placeholder="21"
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Stav</label>
              <select
                value={form.stav}
                onChange={e => setForm({...form, stav: e.target.value})}
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]"
              >
                <option value="KONCEPT">Koncept</option>
                <option value="ODESLANA">Odeslaná</option>
                <option value="ZAPLACENA">Zaplacená</option>
                <option value="PO_SPLATNOSTI">Po splatnosti</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Datum splatnosti</label>
              <input
                type="date"
                value={form.splatnost}
                onChange={e => setForm({...form, splatnost: e.target.value})}
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Zakázka (volitelné)</label>
              <select
                value={form.zakazkaId}
                onChange={e => setForm({...form, zakazkaId: e.target.value})}
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]"
              >
                <option value="">— Bez zakázky —</option>
                {zakazky.map((z: any) => (
                  <option key={z.id} value={z.id}>{z.nazev} {z.adresa ? '— ' + z.adresa : ''}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={saving || !form.castka}
              className="h-10 px-5 bg-[#0f0e0c] text-white rounded-lg text-[13px] font-semibold hover:bg-[#1a1916] disabled:opacity-50"
            >
              {saving ? 'Ukládám...' : 'Vystavit fakturu'}
            </button>
            <button onClick={() => setShowForm(false)} className="h-10 px-5 bg-[#f5f4f0] text-[#6b6760] rounded-lg text-[13px] font-semibold hover:bg-[#eeede8]">
              Zrušit
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Celkem', value: celkem, color: 'text-[#0f0e0c]' },
          { label: 'Zaplaceno', value: zaplaceno, color: 'text-green-600' },
          { label: 'Po splatnosti', value: poSplatnosti, color: 'text-red-600' },
        ].map(c => (
          <div key={c.label} className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm">
            <div className="text-[10px] font-semibold text-[#a8a49c] uppercase tracking-wide mb-2">{c.label}</div>
            <div className={'text-[22px] font-bold ' + c.color}>{c.value.toLocaleString('cs')} Kč</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#e8e6e0] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[14px] text-[#a8a49c]">Načítám...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9f8f5] border-b border-[#f0ede8]">
                {['Číslo','Zakázka','Částka','DPH','Splatnost','Stav'].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-[#a8a49c] tracking-[1px] uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {faktury.map((f: any) => {
                const stav = STAVY[f.stav] || { label: f.stav, color: 'bg-gray-50 text-gray-600' }
                return (
                  <tr key={f.id} className="border-b border-[#f7f6f3] last:border-0 hover:bg-[#faf9f7]">
                    <td className="px-4 py-3 text-[13px] font-bold text-[#0f0e0c]">{f.cislo}</td>
                    <td className="px-4 py-3 text-[13px] text-[#6b6760]">{f.zakázka?.nazev || '—'}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[#0f0e0c]">{f.castka?.toLocaleString('cs')} Kč</td>
                    <td className="px-4 py-3 text-[13px] text-[#6b6760]">{f.dph}%</td>
                    <td className="px-4 py-3 text-[13px] text-[#6b6760]">{f.splatnost ? new Date(f.splatnost).toLocaleDateString('cs') : '—'}</td>
                    <td className="px-4 py-3"><span className={'text-[11px] font-semibold px-2.5 py-1 rounded-full ' + stav.color}>{stav.label}</span></td>
                  </tr>
                )
              })}
              {faktury.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-[#a8a49c]">Žádné faktury</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
