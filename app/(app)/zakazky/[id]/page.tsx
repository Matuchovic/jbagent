'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, Camera, FileText, Plus } from 'lucide-react'

const STAV_OPTIONS = [{ v: 'NOVA', l: 'Nová' }, { v: 'CEKA', l: 'Čeká' }, { v: 'PROBIHA', l: 'Probíhá' }, { v: 'HOTOVO', l: 'Hotovo' }, { v: 'FAKTURACE', l: 'Fakturace' }, { v: 'ZAPLACENO', l: 'Zaplaceno' }]
const STAV_COLORS: Record<string, string> = { NOVA: 'bg-blue-50 text-blue-700', CEKA: 'bg-amber-50 text-amber-700', PROBIHA: 'bg-green-50 text-green-700', HOTOVO: 'bg-gray-100 text-gray-600', FAKTURACE: 'bg-yellow-50 text-yellow-700', ZAPLACENO: 'bg-emerald-50 text-emerald-700' }

export default function ZakazkaDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [z, setZ] = useState<any>(null)
  const [lide, setLide] = useState<any[]>([])
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>({})

  useEffect(() => {
    fetch(`/api/zakazky/${id}`).then(r => r.json()).then(d => { setZ(d); setForm(d) })
    fetch('/api/lide').then(r => r.json()).then(setLide)
  }, [id])

  const save = async () => {
    setSaving(true)
    const res = await fetch(`/api/zakazky/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { const d = await res.json(); setZ(d); setForm(d); setEditing(false) }
    setSaving(false)
  }

  const del = async () => {
    if (!confirm('Smazat zakázku?')) return
    await fetch(`/api/zakazky/${id}`, { method: 'DELETE' })
    router.push('/zakazky')
  }

  if (!z) return <div className="p-6 text-[#a8a49c]">Načítám...</div>

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/zakazky" className="text-[#a8a49c] hover:text-[#0f0e0c]"><ArrowLeft size={20} /></Link>
          <div>
            <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Zakázka #{z.cislo}</div>
            <h1 className="text-[22px] font-bold text-[#0f0e0c]">{z.nazev}</h1>
            <p className="text-[13px] text-[#6b6760]">{z.adresa}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="h-9 px-4 border border-[#e8e6e0] rounded-lg text-[12px] font-medium text-[#6b6760]">Zrušit</button>
              <button onClick={save} disabled={saving} className="h-9 px-4 bg-[#0f0e0c] text-white rounded-lg text-[12px] font-semibold flex items-center gap-2">
                <Save size={13} />{saving ? 'Ukládám...' : 'Uložit'}
              </button>
            </>
          ) : (
            <>
              <button onClick={del} className="h-9 px-3 border border-red-100 bg-red-50 text-red-500 rounded-lg text-[12px] font-medium flex items-center gap-2 hover:bg-red-100">
                <Trash2 size={13} /> Smazat
              </button>
              <button onClick={() => setEditing(true)} className="h-9 px-4 bg-[#0f0e0c] text-white rounded-lg text-[12px] font-semibold">Upravit</button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-5">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          {/* Detail */}
          <div className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm">
            <h2 className="text-[13px] font-bold text-[#0f0e0c] mb-4">Detail zakázky</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Název" editing={editing} value={form.nazev} onChange={v => setForm({...form, nazev: v})} />
              <Field label="Adresa" editing={editing} value={form.adresa} onChange={v => setForm({...form, adresa: v})} />
              <div>
                <div className="text-[10px] font-semibold text-[#a8a49c] uppercase tracking-wide mb-1">Stav</div>
                {editing ? (
                  <select value={form.stav} onChange={e => setForm({...form, stav: e.target.value})}
                    className="w-full h-9 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[12px] outline-none focus:border-[#d4a843]">
                    {STAV_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                ) : (
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${STAV_COLORS[z.stav]}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />{STAV_OPTIONS.find(o => o.v === z.stav)?.l}
                  </span>
                )}
              </div>
              <div>
                <div className="text-[10px] font-semibold text-[#a8a49c] uppercase tracking-wide mb-1">Postup (%)</div>
                {editing ? (
                  <input type="number" min={0} max={100} value={form.postup} onChange={e => setForm({...form, postup: e.target.value})}
                    className="w-full h-9 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[12px] outline-none focus:border-[#d4a843]" />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-[#f0ede8] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#b8922a] to-[#f5e6b0] rounded-full" style={{width: `${z.postup}%`}} />
                    </div>
                    <span className="text-[12px] font-bold text-[#0f0e0c]">{z.postup}%</span>
                  </div>
                )}
              </div>
              <Field label="Cena (Kč)" editing={editing} value={form.cena} onChange={v => setForm({...form, cena: v})} type="number" />
              <div>
                <div className="text-[10px] font-semibold text-[#a8a49c] uppercase tracking-wide mb-1">Pracovník</div>
                {editing ? (
                  <select value={form.pracovnikId || ''} onChange={e => setForm({...form, pracovnikId: e.target.value})}
                    className="w-full h-9 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[12px] outline-none focus:border-[#d4a843]">
                    <option value="">— Nepřiřazen —</option>
                    {lide.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                ) : (
                  <div className="text-[13px] text-[#0f0e0c] font-medium mt-1">{z.pracovnik?.name || <span className="text-red-500">Nepřiřazen</span>}</div>
                )}
              </div>
              <Field label="Datum zahájení" editing={editing} value={form.datumZahajeni?.slice(0,10)} onChange={v => setForm({...form, datumZahajeni: v})} type="date" />
              <Field label="Datum dokončení" editing={editing} value={form.datumDokonceni?.slice(0,10)} onChange={v => setForm({...form, datumDokonceni: v})} type="date" />
            </div>
            {editing && (
              <div className="mt-4">
                <div className="text-[10px] font-semibold text-[#a8a49c] uppercase tracking-wide mb-1">Popis</div>
                <textarea value={form.popis || ''} onChange={e => setForm({...form, popis: e.target.value})} rows={3}
                  className="w-full px-3 py-2 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[12px] outline-none focus:border-[#d4a843] resize-none" />
              </div>
            )}
          </div>

          {/* Fotodokumentace */}
          <div className="bg-white border border-[#e8e6e0] rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-[#f0ede8] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold text-[#a8a49c] uppercase tracking-wide mb-0.5">Fotodokumentace</div>
                <div className="text-[14px] font-bold text-[#0f0e0c]">{z.fotky?.length || 0} fotek</div>
              </div>
              <button className="flex items-center gap-1.5 text-[12px] font-semibold text-[#d4a843]">
                <Camera size={14} /> Přidat foto
              </button>
            </div>
            <div className="p-5">
              {z.fotky?.length === 0 ? (
                <div className="border-2 border-dashed border-[#e8e6e0] rounded-xl p-8 text-center">
                  <Camera size={24} className="text-[#d4d0c8] mx-auto mb-2" />
                  <p className="text-[13px] text-[#a8a49c]">Zatím žádné fotky</p>
                  <p className="text-[11px] text-[#c0bdb6] mt-1">Přidejte fotodokumentaci ze zakázky</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {z.fotky?.map((f: any) => (
                    <div key={f.id} className="aspect-square bg-[#f5f4f0] rounded-lg overflow-hidden">
                      <img src={f.url} alt={f.nazev} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dokumenty */}
          <div className="bg-white border border-[#e8e6e0] rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-[#f0ede8] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold text-[#a8a49c] uppercase tracking-wide mb-0.5">Dokumenty</div>
                <div className="text-[14px] font-bold text-[#0f0e0c]">{z.dokumenty?.length || 0} dokumentů</div>
              </div>
              <button className="flex items-center gap-1.5 text-[12px] font-semibold text-[#d4a843]">
                <Plus size={14} /> Přidat dokument
              </button>
            </div>
            <div className="divide-y divide-[#f7f6f3]">
              {z.dokumenty?.length === 0 ? (
                <div className="p-5 text-center text-[13px] text-[#a8a49c]">Žádné dokumenty</div>
              ) : z.dokumenty?.map((d: any) => (
                <div key={d.id} className="px-5 py-3 flex items-center gap-3">
                  <FileText size={16} className="text-[#a8a49c]" />
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-[#0f0e0c]">{d.nazev}</div>
                    <div className="text-[11px] text-[#a8a49c]">{d.typ}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          {/* Zákazník */}
          <div className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm">
            <div className="text-[10px] font-semibold text-[#a8a49c] uppercase tracking-wide mb-3">Zákazník</div>
            {z.zákazník ? (
              <div>
                <div className="text-[15px] font-bold text-[#0f0e0c]">{z.zákazník.jmeno}</div>
                {z.zákazník.telefon && <div className="text-[13px] text-[#d4a843] mt-1">{z.zákazník.telefon}</div>}
                {z.zákazník.email && <div className="text-[12px] text-[#6b6760] mt-0.5">{z.zákazník.email}</div>}
              </div>
            ) : (
              <p className="text-[13px] text-[#a8a49c]">Žádný zákazník</p>
            )}
          </div>

          {/* Faktury */}
          <div className="bg-white border border-[#e8e6e0] rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-[#f0ede8] flex items-center justify-between">
              <div className="text-[13px] font-bold text-[#0f0e0c]">Faktury</div>
              <button className="text-[11px] font-semibold text-[#d4a843]">+ Nová</button>
            </div>
            <div className="divide-y divide-[#f7f6f3]">
              {z.faktury?.length === 0 ? (
                <div className="p-4 text-center text-[12px] text-[#a8a49c]">Žádné faktury</div>
              ) : z.faktury?.map((f: any) => (
                <div key={f.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-semibold text-[#0f0e0c]">{f.cislo}</div>
                    <div className="text-[11px] text-[#a8a49c]">{f.stav}</div>
                  </div>
                  <div className="text-[13px] font-bold text-[#0f0e0c]">{f.castka.toLocaleString('cs')} Kč</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, editing, onChange, type = 'text' }: { label: string; value: any; editing: boolean; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-[#a8a49c] uppercase tracking-wide mb-1">{label}</div>
      {editing ? (
        <input type={type} value={value || ''} onChange={e => onChange(e.target.value)}
          className="w-full h-9 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[12px] outline-none focus:border-[#d4a843]" />
      ) : (
        <div className="text-[13px] text-[#0f0e0c] font-medium mt-1">{value || '—'}</div>
      )}
    </div>
  )
}
