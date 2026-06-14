'use client'

import { useState, useEffect } from 'react'
import { FileText, Plus, Sparkles } from 'lucide-react'

const TYP_LABELS: Record<string, string> = { REVIZNI_ZPRAVA: 'Revizní zpráva', SMLOUVA: 'Smlouva', PROTOKOL: 'Protokol', BOZP: 'BOZP', FAKTURA: 'Faktura', OSTATNI: 'Ostatní' }
const TYP_COLORS: Record<string, string> = { REVIZNI_ZPRAVA: 'bg-blue-50 text-blue-700', SMLOUVA: 'bg-purple-50 text-purple-700', PROTOKOL: 'bg-green-50 text-green-700', BOZP: 'bg-orange-50 text-orange-700', FAKTURA: 'bg-yellow-50 text-yellow-700', OSTATNI: 'bg-gray-100 text-gray-600' }

export default function DokumentyPage() {
  const [zakázky, setZakázky] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedDoc, setGeneratedDoc] = useState('')
  const [form, setForm] = useState({ typ: 'REVIZNI_ZPRAVA', zakazkaId: '', nazev: '' })

  useEffect(() => { fetch('/api/zakázky').then(r => r.json()).then(setZakázky) }, [])

  const generateAI = async () => {
    if (!form.zakazkaId) return
    setGenerating(true)
    const zakázka = zakázky.find(z => z.id === form.zakazkaId)
    // Simulace AI generování
    await new Promise(r => setTimeout(r, 1500))
    setGeneratedDoc(`REVIZNÍ ZPRÁVA KOMÍNOVÉHO PRŮDUCHU\n\nDatum: ${new Date().toLocaleDateString('cs')}\nZakázka: ${zakázka?.nazev}\nAdresa: ${zakázka?.adresa}\n\nZjištění:\n- Komínový průduch byl vyčištěn a zkontrolován\n- Průměr průduchu: 200 mm\n- Délka průduchu: cca 8 m\n- Stav: vyhovující\n\nZávěr:\nKomín je způsobilý k dalšímu provozu. Doporučujeme pravidelnou roční údržbu.\n\nRevizi provedl: Jan Baran\nDatum příští revize: ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('cs')}`)
    setGenerating(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Dokumentace</div>
          <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Dokumenty</h1>
          <p className="text-[14px] text-[#6b6760] mt-1">Smlouvy, revize, BOZP — generováno AI</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#0f0e0c] text-white px-4 py-2 rounded-lg text-[13px] font-semibold">
          <Sparkles size={14} /> Generovat dokument
        </button>
      </div>

      {/* Šablony */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(TYP_LABELS).map(([k, l]) => (
          <button key={k} onClick={() => { setForm({...form, typ: k}); setShowForm(true) }}
            className="bg-white border border-[#e8e6e0] rounded-xl p-4 shadow-sm text-left hover:border-[#d4a843] transition-colors group">
            <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit mb-3 ${TYP_COLORS[k]}`}>{l}</div>
            <div className="text-[13px] font-bold text-[#0f0e0c] group-hover:text-[#d4a843] transition-colors">Generovat AI</div>
            <div className="text-[11px] text-[#a8a49c] mt-0.5">Z dat zakázky</div>
          </button>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl">
            <h2 className="text-[17px] font-bold text-[#0f0e0c] mb-5">Generovat dokument — AI</h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Typ dokumentu</label>
                  <select value={form.typ} onChange={e => setForm({...form, typ: e.target.value})}
                    className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]">
                    {Object.entries(TYP_LABELS).map(([k,l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Zakázka</label>
                  <select value={form.zakazkaId} onChange={e => setForm({...form, zakazkaId: e.target.value})}
                    className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]">
                    <option value="">— Vybrat zakázku —</option>
                    {zakázky.map((z: any) => <option key={z.id} value={z.id}>#{z.cislo} {z.nazev}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={generateAI} disabled={!form.zakazkaId || generating}
                className="h-10 bg-[#d4a843] text-white rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                <Sparkles size={14} />{generating ? 'AI generuje dokument...' : 'Generovat AI'}
              </button>

              {generatedDoc && (
                <div>
                  <div className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide mb-2">Vygenerovaný dokument</div>
                  <pre className="bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg p-4 text-[12px] text-[#0f0e0c] whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">{generatedDoc}</pre>
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => navigator.clipboard.writeText(generatedDoc)}
                      className="flex-1 h-9 border border-[#e8e6e0] rounded-lg text-[12px] font-medium text-[#6b6760]">Kopírovat</button>
                    <button onClick={() => {
                      const blob = new Blob([generatedDoc], {type: 'text/plain'})
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url; a.download = `dokument-${Date.now()}.txt`; a.click()
                    }} className="flex-1 h-9 bg-[#0f0e0c] text-white rounded-lg text-[12px] font-semibold">Stáhnout</button>
                  </div>
                </div>
              )}

              <button onClick={() => { setShowForm(false); setGeneratedDoc('') }}
                className="h-9 border border-[#e8e6e0] rounded-lg text-[12px] font-medium text-[#6b6760]">Zavřít</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#e8e6e0] rounded-xl p-8 text-center shadow-sm">
        <FileText size={32} className="text-[#d4d0c8] mx-auto mb-3" />
        <div className="text-[15px] font-bold text-[#0f0e0c] mb-1">Dokumenty jsou propojeny se zakázkami</div>
        <div className="text-[13px] text-[#a8a49c]">Vygenerované dokumenty se ukládají přímo k zakázce</div>
      </div>
    </div>
  )
}
