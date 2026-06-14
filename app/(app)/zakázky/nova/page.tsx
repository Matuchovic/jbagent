'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NovaZakazkaPage() {
  const router = useRouter()
  const [lide, setLide] = useState<any[]>([])
  const [zakaznici, setZakaznici] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nazev: '', adresa: '', popis: '', typ: 'KOMINSTVI', cena: '', pracovnikId: '', zakaznikId: '', datumZahajeni: '', datumDokonceni: '' })

  useEffect(() => {
    fetch('/api/lide').then(r => r.json()).then(setLide)
    fetch('/api/zakaznici').then(r => r.json()).then(setZakaznici)
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/zakázky', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { const z = await res.json(); router.push(`/zakázky/${z.id}`) }
    else setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/zakázky" className="text-[#a8a49c] hover:text-[#0f0e0c] transition-colors"><ArrowLeft size={20} /></Link>
        <div>
          <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Nová zakázka</div>
          <h1 className="text-[22px] font-bold text-[#0f0e0c]">Vytvořit zakázku</h1>
        </div>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-5">
        <div className="bg-white border border-[#e8e6e0] rounded-xl p-6 shadow-sm">
          <h2 className="text-[13px] font-bold text-[#0f0e0c] mb-4">Základní informace</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Název zakázky *</label>
              <input required value={form.nazev} onChange={e => setForm({...form, nazev: e.target.value})}
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" placeholder="Čištění komína..." />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Adresa *</label>
              <input required value={form.adresa} onChange={e => setForm({...form, adresa: e.target.value})}
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" placeholder="Ostrava-Poruba, Hlavní 14" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Typ práce</label>
                <select value={form.typ} onChange={e => setForm({...form, typ: e.target.value})}
                  className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]">
                  <option value="KOMINSTVI">Kominictví</option>
                  <option value="STAVBA">Stavba</option>
                  <option value="REVIZE">Revize</option>
                  <option value="MONTAZ">Montáž</option>
                  <option value="OPRAVA">Oprava</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Cena (Kč bez DPH)</label>
                <input type="number" value={form.cena} onChange={e => setForm({...form, cena: e.target.value})}
                  className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" placeholder="0" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Popis</label>
              <textarea value={form.popis} onChange={e => setForm({...form, popis: e.target.value})} rows={3}
                className="w-full px-3 py-2 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843] resize-none" placeholder="Popis zakázky..." />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e8e6e0] rounded-xl p-6 shadow-sm">
          <h2 className="text-[13px] font-bold text-[#0f0e0c] mb-4">Přiřazení</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Zákazník</label>
              <select value={form.zakaznikId} onChange={e => setForm({...form, zakaznikId: e.target.value})}
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]">
                <option value="">— Vybrat zákazníka —</option>
                {zakaznici.map((z: any) => <option key={z.id} value={z.id}>{z.jmeno}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Pracovník</label>
              <select value={form.pracovnikId} onChange={e => setForm({...form, pracovnikId: e.target.value})}
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]">
                <option value="">— Přiřadit pracovníka —</option>
                {lide.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Datum zahájení</label>
              <input type="date" value={form.datumZahajeni} onChange={e => setForm({...form, datumZahajeni: e.target.value})}
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Datum dokončení</label>
              <input type="date" value={form.datumDokonceni} onChange={e => setForm({...form, datumDokonceni: e.target.value})}
                className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/zakázky" className="flex-1 h-10 border border-[#e8e6e0] rounded-lg text-[13px] font-medium text-[#6b6760] flex items-center justify-center hover:border-[#d4d0c8] transition-colors">Zrušit</Link>
          <button type="submit" disabled={loading}
            className="flex-1 h-10 bg-[#0f0e0c] text-white rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#1a1916] transition-colors disabled:opacity-50">
            <Save size={14} /> {loading ? 'Ukládám...' : 'Vytvořit zakázku'}
          </button>
        </div>
      </form>
    </div>
  )
}
