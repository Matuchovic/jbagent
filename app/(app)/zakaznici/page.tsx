'use client'

import { useState, useEffect } from 'react'
import { Plus, Phone, Mail, Home } from 'lucide-react'

export default function ZakazniciPage() {
  const [zakaznici, setZakaznici] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ jmeno: '', email: '', telefon: '', adresa: '', poznamka: '' })
  const [saving, setSaving] = useState(false)

  const load = () => fetch('/api/zakaznici').then(r => r.json()).then(d => { setZakaznici(d); setLoading(false) })
  useEffect(() => { load() }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    await fetch('/api/zakaznici', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false); setShowForm(false); setForm({ jmeno: '', email: '', telefon: '', adresa: '', poznamka: '' }); load()
  }

  return (
    <div className="p-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Zákazníci</div>
          <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Zákazníci & objekty</h1>
          <p className="text-[14px] text-[#6b6760] mt-1">{zakaznici.length} zákazníků</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#0f0e0c] text-white px-4 py-2 rounded-lg text-[13px] font-semibold">
          <Plus size={14} /> Nový zákazník
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-[17px] font-bold text-[#0f0e0c] mb-5">Nový zákazník</h2>
            <form onSubmit={submit} className="flex flex-col gap-4">
              {[{k:'jmeno',l:'Jméno a příjmení',r:true},{k:'email',l:'Email',t:'email'},{k:'telefon',l:'Telefon'},{k:'adresa',l:'Adresa'}].map(f => (
                <div key={f.k}>
                  <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">{f.l}</label>
                  <input required={f.r} type={f.t||'text'} value={(form as any)[f.k]} onChange={e => setForm({...form, [f.k]: e.target.value})}
                    className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" />
                </div>
              ))}
              <div>
                <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Poznámka</label>
                <textarea value={form.poznamka} onChange={e => setForm({...form, poznamka: e.target.value})} rows={2}
                  className="w-full px-3 py-2 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843] resize-none" />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-10 border border-[#e8e6e0] rounded-lg text-[13px] font-medium text-[#6b6760]">Zrušit</button>
                <button type="submit" disabled={saving} className="flex-1 h-10 bg-[#0f0e0c] text-white rounded-lg text-[13px] font-semibold">{saving ? 'Ukládám...' : 'Přidat'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {loading ? <p className="text-[#a8a49c]">Načítám...</p> : zakaznici.map((z: any) => (
          <div key={z.id} className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[16px] font-bold text-[#0f0e0c] mb-2">{z.jmeno}</div>
                <div className="flex items-center gap-4 text-[12px] text-[#6b6760] flex-wrap">
                  {z.telefon && <span className="flex items-center gap-1"><Phone size={12} />{z.telefon}</span>}
                  {z.email && <span className="flex items-center gap-1"><Mail size={12} />{z.email}</span>}
                  {z.adresa && <span className="flex items-center gap-1"><Home size={12} />{z.adresa}</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[11px] text-[#a8a49c] mb-1">Zakázky</div>
                <div className="text-[20px] font-bold text-[#0f0e0c]">{z.zakázky?.length || 0}</div>
                <div className="text-[11px] text-[#d4a843] font-semibold">
                  {z.zakázky?.reduce((s: number, zz: any) => s + (zz.cena || 0), 0).toLocaleString('cs')} Kč
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
