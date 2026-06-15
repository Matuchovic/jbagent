'use client'

import { useEffect, useState } from 'react'
import { Plus, X, Eye, Printer, ChevronDown, ChevronUp } from 'lucide-react'

const STAVY: Record<string, { label: string; color: string }> = {
  NOVA: { label: 'Nová', color: 'bg-gray-50 text-gray-600' },
  KONCEPT: { label: 'Koncept', color: 'bg-gray-50 text-gray-600' },
  ODESLANA: { label: 'Odeslaná', color: 'bg-blue-50 text-blue-700' },
  ZAPLACENA: { label: 'Zaplacená', color: 'bg-green-50 text-green-700' },
  PO_SPLATNOSTI: { label: 'Po splatnosti', color: 'bg-red-50 text-red-700' },
}

const emptyPolozka = () => ({ popis: '', mnozstvi: '1', jednotka: 'ks', cenaJednotka: '', dph: '21' })
const emptyForm = () => ({
  stav: 'ODESLANA', dph: '21', splatnost: '', zakazkaId: '', poznamka: '', zpusobPlatby: 'převodem', variabilniSymbol: '',
  dodFirma: '', dodIco: '', dodDic: '', dodAdresa: '', dodUcet: '', dodBanka: '',
  odbJmeno: '', odbIco: '', odbDic: '', odbAdresa: '',
  polozky: [emptyPolozka()]
})

function PrintView({ f, onClose }: { f: any; onClose: () => void }) {
  const polozky = f.polozky || []
  const celkemBezDph = polozky.reduce((s: number, p: any) => s + p.mnozstvi * p.cenaJednotka, 0)
  const dphCastka = celkemBezDph * ((f.dph || 21) / 100)
  const celkem = polozky.length > 0 ? celkemBezDph + dphCastka : (f.castka || 0)
  return (
    <div id="faktura-overlay" style={{position:'fixed',inset:'0',background:'rgba(0,0,0,0.75)',zIndex:50,overflowY:'auto',padding:'2rem 1rem'}}>
      <div id="faktura-nahled" style={{background:'white',maxWidth:'760px',margin:'0 auto',borderRadius:'16px',overflow:'hidden'}}>
        <div style={{background:'#0f0e0c',padding:'1rem 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:'13px',color:'rgba(255,255,255,0.5)'}}>Náhled faktury</span>
          <div style={{display:'flex',gap:'8px'}}>
            <button onClick={() => {
              const el = document.getElementById('faktura-nahled')
              if (!el) return
              const win = window.open('', '_blank', 'width=900,height=700')
              if (!win) return
              win.document.write('<html><head><title>Faktura</title><style>body{margin:0;font-family:system-ui,sans-serif}@media print{.no-print{display:none}}</style></head><body>')
              win.document.write(el.innerHTML)
              win.document.write('</body></html>')
              win.document.close()
              setTimeout(() => { win.focus(); win.print() }, 500)
            }} style={{height:'34px',padding:'0 14px',background:'#d4a843',color:'#0f0e0c',border:'none',borderRadius:'7px',fontSize:'13px',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:'5px'}}>
              <Printer size={13}/> Tisknout
            </button>
            <button onClick={onClose} style={{height:'34px',width:'34px',background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.5)',border:'none',borderRadius:'7px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <X size={15}/>
            </button>
          </div>
        </div>
        <div style={{background:'#171613',padding:'2rem 2.5rem',display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'2rem'}}>
          <div>
            <div style={{fontSize:'30px',fontWeight:700,color:'white',letterSpacing:'-0.5px',lineHeight:1}}>FAKTURA</div>
            <div style={{fontSize:'19px',fontWeight:600,color:'#d4a843',marginTop:'6px'}}>{f.cislo}</div>
            <div style={{marginTop:'1.25rem',lineHeight:1.9}}>
              {f.dodFirma && <div style={{fontSize:'13px',fontWeight:600,color:'rgba(255,255,255,0.85)'}}>{f.dodFirma}</div>}
              {f.dodIco && <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>IČO: {f.dodIco}{f.dodDic ? ` · DIČ: ${f.dodDic}` : ''}</div>}
              {f.dodAdresa && <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>{f.dodAdresa}</div>}
              {f.dodUcet && <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>Účet: {f.dodUcet}{f.dodBanka ? ` · ${f.dodBanka}` : ''}</div>}
            </div>
          </div>
          <div style={{textAlign:'right',lineHeight:2.1,flexShrink:0}}>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>Datum vystavení: <span style={{color:'rgba(255,255,255,0.75)'}}>{f.datumVystaveni ? new Date(f.datumVystaveni).toLocaleDateString('cs') : new Date().toLocaleDateString('cs')}</span></div>
            {f.splatnost && <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>Datum splatnosti: <span style={{color:'#f87171'}}>{new Date(f.splatnost).toLocaleDateString('cs')}</span></div>}
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>Způsob platby: <span style={{color:'rgba(255,255,255,0.75)'}}>{f.zpusobPlatby || 'převodem'}</span></div>
            {f.variabilniSymbol && <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>Var. symbol: <span style={{color:'rgba(255,255,255,0.75)'}}>{f.variabilniSymbol}</span></div>}
          </div>
        </div>
        <div style={{padding:'1.25rem 2.5rem',background:'#f9f8f5',borderBottom:'1px solid #eeede8'}}>
          <div style={{fontSize:'10px',fontWeight:600,color:'#a8a49c',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'6px'}}>Odběratel</div>
          <div style={{fontSize:'14px',fontWeight:600,color:'#0f0e0c'}}>{f.odbJmeno || '—'}</div>
          <div style={{fontSize:'12px',color:'#6b6760',marginTop:'3px',lineHeight:1.7}}>
            {(f.odbIco || f.odbDic) && <span>IČO: {f.odbIco}{f.odbDic ? ` · DIČ: ${f.odbDic}` : ''}<br/></span>}
            {f.odbAdresa && <span>{f.odbAdresa}</span>}
          </div>
        </div>
        <div style={{padding:'0 2.5rem'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
            <thead>
              <tr style={{borderBottom:'1px solid #e8e6e0'}}>
                {['Popis','Množ.','Cena/j','DPH','Celkem'].map((h,i) => (
                  <th key={h} style={{textAlign:i===0?'left':'right',padding:'11px 6px 9px',fontSize:'10px',fontWeight:600,color:'#a8a49c',letterSpacing:'1px',textTransform:'uppercase'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {polozky.length > 0 ? polozky.map((p: any, i: number) => (
                <tr key={i} style={{borderBottom:'1px solid #f5f4f1'}}>
                  <td style={{padding:'11px 6px',color:'#0f0e0c'}}>{p.popis}</td>
                  <td style={{padding:'11px 6px',textAlign:'right',color:'#6b6760'}}>{p.mnozstvi} {p.jednotka}</td>
                  <td style={{padding:'11px 6px',textAlign:'right',color:'#6b6760'}}>{Number(p.cenaJednotka).toLocaleString('cs')} Kč</td>
                  <td style={{padding:'11px 6px',textAlign:'right',color:'#6b6760'}}>{p.dph}%</td>
                  <td style={{padding:'11px 6px',textAlign:'right',fontWeight:600,color:'#0f0e0c'}}>{(p.mnozstvi * p.cenaJednotka).toLocaleString('cs')} Kč</td>
                </tr>
              )) : (
                <tr><td colSpan={5} style={{padding:'2rem',textAlign:'center',color:'#a8a49c'}}>Celkem {(f.castka||0).toLocaleString('cs')} Kč</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',padding:'1rem 2.5rem 0'}}>
          <div style={{width:'270px'}}>
            {polozky.length > 0 && <>
              <div style={{display:'flex',justifyContent:'space-between',padding:'5px 0',fontSize:'13px',color:'#6b6760',borderBottom:'1px solid #f0ede8'}}>
                <span>Základ bez DPH</span><span>{celkemBezDph.toLocaleString('cs')} Kč</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'5px 0',fontSize:'13px',color:'#6b6760',borderBottom:'1px solid #f0ede8'}}>
                <span>DPH {f.dph||21}%</span><span>{Math.round(dphCastka).toLocaleString('cs')} Kč</span>
              </div>
            </>}
            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0 6px',fontSize:'17px',fontWeight:700,color:'#0f0e0c',borderTop:'2px solid #0f0e0c',marginTop:'4px'}}>
              <span>Celkem k úhradě</span><span>{Math.round(celkem).toLocaleString('cs')} Kč</span>
            </div>
          </div>
        </div>
        {f.poznamka && (
          <div style={{margin:'1.25rem 2.5rem 0',padding:'0.875rem 1rem',background:'#faf9f7',borderRadius:'8px',borderLeft:'3px solid #d4a843'}}>
            <div style={{fontSize:'11px',fontWeight:600,color:'#6b6760',marginBottom:'3px'}}>Poznámka</div>
            <div style={{fontSize:'12px',color:'#6b6760'}}>{f.poznamka}</div>
          </div>
        )}
        <div style={{margin:'1.25rem 2.5rem',paddingTop:'1rem',borderTop:'1px solid #f0ede8',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:'11px',color:'#a8a49c'}}>Vystavil: {f.vystavil?.name || 'Admin'}</div>
          <div style={{fontSize:'10px',color:'#d0cdc6',letterSpacing:'1px'}}>JB AGENT · {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  )
}

export default function FakturyPage() {
  const [faktury, setFaktury] = useState<any[]>([])
  const [zakazky, setZakazky] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>(emptyForm())
  const [preview, setPreview] = useState<any>(null)
  const [showDodavatel, setShowDodavatel] = useState(false)
  const [showOdberatel, setShowOdberatel] = useState(false)

  const load = () => {
    fetch('/api/faktury').then(r => r.json()).then(data => { setFaktury(Array.isArray(data) ? data : []); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => {
    load()
    fetch('/api/zakazky').then(r => r.json()).then(data => setZakazky(Array.isArray(data) ? data : [])).catch(() => {})
  }, [])

  const setPolozka = (i: number, field: string, val: string) => {
    const p = [...form.polozky]; p[i] = { ...p[i], [field]: val }; setForm({ ...form, polozky: p })
  }
  const addPolozka = () => setForm({ ...form, polozky: [...form.polozky, emptyPolozka()] })
  const removePolozka = (i: number) => setForm({ ...form, polozky: form.polozky.filter((_: any, idx: number) => idx !== i) })
  const celkemForm = form.polozky.reduce((s: number, p: any) => s + (parseFloat(p.mnozstvi) || 0) * (parseFloat(p.cenaJednotka) || 0), 0)

  const handleSubmit = async () => {
    setSaving(true)
    const res = await fetch('/api/faktury', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { setForm(emptyForm()); setShowForm(false); load() }
    setSaving(false)
  }

  const celkem = faktury.reduce((s, f) => s + (f.castka || 0), 0)
  const zaplaceno = faktury.filter(f => f.stav === 'ZAPLACENA').reduce((s, f) => s + (f.castka || 0), 0)
  const poSplatnosti = faktury.filter(f => f.stav === 'PO_SPLATNOSTI').reduce((s, f) => s + (f.castka || 0), 0)

  const inp = 'w-full h-9 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]'
  const lbl = 'text-[10px] font-bold text-[#6b6760] uppercase tracking-wide block mb-1'

  return (
    <div className="p-6">
      {preview && <PrintView f={preview} onClose={() => setPreview(null)} />}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Finance</div>
          <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Faktury</h1>
          <p className="text-[14px] text-[#6b6760] mt-1">{faktury.length} faktur celkem</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="h-10 px-4 bg-[#0f0e0c] text-white rounded-lg text-[13px] font-semibold flex items-center gap-2 hover:bg-[#1a1916]">
          <Plus size={14}/> Nová faktura
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-[#e8e6e0] rounded-xl shadow-sm mb-5 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0ede8]">
            <div className="text-[14px] font-bold text-[#0f0e0c]">Nová faktura</div>
            <button onClick={() => setShowForm(false)} className="text-[#a8a49c] hover:text-[#0f0e0c]"><X size={16}/></button>
          </div>
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div><label className={lbl}>Stav</label>
                <select value={form.stav} onChange={e => setForm({...form, stav: e.target.value})} className={inp}>
                  <option value="ODESLANA">Odeslaná</option><option value="ZAPLACENA">Zaplacená</option>
                  <option value="KONCEPT">Koncept</option><option value="PO_SPLATNOSTI">Po splatnosti</option>
                </select>
              </div>
              <div><label className={lbl}>Datum splatnosti</label><input type="date" value={form.splatnost} onChange={e => setForm({...form, splatnost: e.target.value})} className={inp}/></div>
              <div><label className={lbl}>DPH (%)</label><input type="number" value={form.dph} onChange={e => setForm({...form, dph: e.target.value})} className={inp}/></div>
              <div><label className={lbl}>Způsob platby</label>
                <select value={form.zpusobPlatby} onChange={e => setForm({...form, zpusobPlatby: e.target.value})} className={inp}>
                  <option>převodem</option><option>hotově</option><option>kartou</option>
                </select>
              </div>
              <div><label className={lbl}>Variabilní symbol</label><input value={form.variabilniSymbol} onChange={e => setForm({...form, variabilniSymbol: e.target.value})} className={inp} placeholder="auto"/></div>
              <div><label className={lbl}>Zakázka</label>
                <select value={form.zakazkaId} onChange={e => setForm({...form, zakazkaId: e.target.value})} className={inp}>
                  <option value="">— Bez zakázky —</option>
                  {zakazky.map((z: any) => <option key={z.id} value={z.id}>{z.nazev}</option>)}
                </select>
              </div>
            </div>
            <div className="border border-[#e8e6e0] rounded-xl overflow-hidden">
              <button onClick={() => setShowDodavatel(!showDodavatel)} className="w-full flex items-center justify-between px-4 py-3 bg-[#f9f8f5] text-[13px] font-semibold text-[#0f0e0c]">
                Dodavatel {showDodavatel ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
              </button>
              {showDodavatel && (
                <div className="p-4 grid grid-cols-2 gap-3">
                  <div className="col-span-2"><label className={lbl}>Název firmy</label><input value={form.dodFirma} onChange={e => setForm({...form, dodFirma: e.target.value})} className={inp} placeholder="PROFI KOMINICTVÍ S.R.O."/></div>
                  <div><label className={lbl}>IČO</label><input value={form.dodIco} onChange={e => setForm({...form, dodIco: e.target.value})} className={inp}/></div>
                  <div><label className={lbl}>DIČ</label><input value={form.dodDic} onChange={e => setForm({...form, dodDic: e.target.value})} className={inp}/></div>
                  <div className="col-span-2"><label className={lbl}>Adresa</label><input value={form.dodAdresa} onChange={e => setForm({...form, dodAdresa: e.target.value})} className={inp}/></div>
                  <div><label className={lbl}>Číslo účtu</label><input value={form.dodUcet} onChange={e => setForm({...form, dodUcet: e.target.value})} className={inp}/></div>
                  <div><label className={lbl}>Banka</label><input value={form.dodBanka} onChange={e => setForm({...form, dodBanka: e.target.value})} className={inp}/></div>
                </div>
              )}
            </div>
            <div className="border border-[#e8e6e0] rounded-xl overflow-hidden">
              <button onClick={() => setShowOdberatel(!showOdberatel)} className="w-full flex items-center justify-between px-4 py-3 bg-[#f9f8f5] text-[13px] font-semibold text-[#0f0e0c]">
                Odběratel {showOdberatel ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
              </button>
              {showOdberatel && (
                <div className="p-4 grid grid-cols-2 gap-3">
                  <div className="col-span-2"><label className={lbl}>Jméno / Firma</label><input value={form.odbJmeno} onChange={e => setForm({...form, odbJmeno: e.target.value})} className={inp}/></div>
                  <div><label className={lbl}>IČO</label><input value={form.odbIco} onChange={e => setForm({...form, odbIco: e.target.value})} className={inp}/></div>
                  <div><label className={lbl}>DIČ</label><input value={form.odbDic} onChange={e => setForm({...form, odbDic: e.target.value})} className={inp}/></div>
                  <div className="col-span-2"><label className={lbl}>Adresa</label><input value={form.odbAdresa} onChange={e => setForm({...form, odbAdresa: e.target.value})} className={inp}/></div>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[13px] font-bold text-[#0f0e0c]">Položky faktury</div>
                <button onClick={addPolozka} className="text-[12px] font-semibold text-[#d4a843] flex items-center gap-1"><Plus size={14}/> Přidat řádek</button>
              </div>
              <div className="border border-[#e8e6e0] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead><tr className="bg-[#f9f8f5] border-b border-[#f0ede8]">
                    {['Popis','Množství','Jednotka','Cena/j (Kč)','DPH%',''].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold text-[#a8a49c] uppercase tracking-wide px-3 py-2">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {form.polozky.map((p: any, i: number) => (
                      <tr key={i} className="border-b border-[#f7f6f3] last:border-0">
                        <td className="px-2 py-1.5"><input value={p.popis} onChange={e => setPolozka(i,'popis',e.target.value)} placeholder="Čištění komína..." className={inp}/></td>
                        <td className="px-2 py-1.5 w-20"><input type="number" value={p.mnozstvi} onChange={e => setPolozka(i,'mnozstvi',e.target.value)} className={inp}/></td>
                        <td className="px-2 py-1.5 w-20"><input value={p.jednotka} onChange={e => setPolozka(i,'jednotka',e.target.value)} className={inp}/></td>
                        <td className="px-2 py-1.5 w-28"><input type="number" value={p.cenaJednotka} onChange={e => setPolozka(i,'cenaJednotka',e.target.value)} placeholder="0" className={inp}/></td>
                        <td className="px-2 py-1.5 w-16"><input type="number" value={p.dph} onChange={e => setPolozka(i,'dph',e.target.value)} className={inp}/></td>
                        <td className="px-2 py-1.5 w-8"><button onClick={() => removePolozka(i)} className="text-[#c0bdb6] hover:text-red-500"><X size={14}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-3 bg-[#f9f8f5] border-t border-[#f0ede8] text-right text-[13px] font-bold text-[#0f0e0c]">
                  Celkem bez DPH: {celkemForm.toLocaleString('cs')} Kč
                </div>
              </div>
            </div>
            <div>
              <label className={lbl}>Poznámka</label>
              <textarea value={form.poznamka} onChange={e => setForm({...form, poznamka: e.target.value})} rows={2} className="w-full px-3 py-2 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843] resize-none" placeholder="Volitelná poznámka..."/>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} disabled={saving || form.polozky.every((p: any) => !p.popis)} className="h-10 px-5 bg-[#0f0e0c] text-white rounded-lg text-[13px] font-semibold hover:bg-[#1a1916] disabled:opacity-50">
                {saving ? 'Ukládám...' : 'Vystavit fakturu'}
              </button>
              <button onClick={() => setShowForm(false)} className="h-10 px-5 bg-[#f5f4f0] text-[#6b6760] rounded-lg text-[13px] font-semibold hover:bg-[#eeede8]">Zrušit</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{label:'Celkem',value:celkem,color:'text-[#0f0e0c]'},{label:'Zaplaceno',value:zaplaceno,color:'text-green-600'},{label:'Po splatnosti',value:poSplatnosti,color:'text-red-600'}].map(c => (
          <div key={c.label} className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm">
            <div className="text-[10px] font-semibold text-[#a8a49c] uppercase tracking-wide mb-2">{c.label}</div>
            <div className={`text-[22px] font-bold ${c.color}`}>{c.value.toLocaleString('cs')} Kč</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#e8e6e0] rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="py-16 text-center text-[14px] text-[#a8a49c]">Načítám...</div> : (
          <table className="w-full">
            <thead><tr className="bg-[#f9f8f5] border-b border-[#f0ede8]">
              {['Číslo','Zakázka','Částka','DPH','Splatnost','Stav',''].map(h => (
                <th key={h} className="text-left text-[10px] font-semibold text-[#a8a49c] tracking-[1px] uppercase px-4 py-3">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {faktury.map((f: any) => {
                const stav = STAVY[f.stav] || {label:f.stav,color:'bg-gray-50 text-gray-600'}
                return (
                  <tr key={f.id} className="border-b border-[#f7f6f3] last:border-0 hover:bg-[#faf9f7]">
                    <td className="px-4 py-3 text-[13px] font-bold text-[#0f0e0c]">{f.cislo}</td>
                    <td className="px-4 py-3 text-[13px] text-[#6b6760]">{f.zakázka?.nazev || '—'}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[#0f0e0c]">{f.castka?.toLocaleString('cs')} Kč</td>
                    <td className="px-4 py-3 text-[13px] text-[#6b6760]">{f.dph}%</td>
                    <td className="px-4 py-3 text-[13px] text-[#6b6760]">{f.splatnost ? new Date(f.splatnost).toLocaleDateString('cs') : '—'}</td>
                    <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${stav.color}`}>{stav.label}</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setPreview(f)} className="h-7 px-3 bg-[#f5f4f0] text-[#6b6760] rounded-lg text-[11px] font-semibold flex items-center gap-1 hover:bg-[#eeede8]">
                        <Eye size={12}/> Náhled
                      </button>
                    </td>
                  </tr>
                )
              })}
              {faktury.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-[#a8a49c]">Žádné faktury</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
