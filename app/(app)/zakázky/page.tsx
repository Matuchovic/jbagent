'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Plus, Filter, ChevronRight } from 'lucide-react'

const STAV_LABELS: Record<string, string> = { NOVA: 'Nová', CEKA: 'Čeká', PROBIHA: 'Probíhá', HOTOVO: 'Hotovo', FAKTURACE: 'Fakturace', ZAPLACENO: 'Zaplaceno' }
const STAV_COLORS: Record<string, string> = { NOVA: 'bg-blue-50 text-blue-700', CEKA: 'bg-amber-50 text-amber-700', PROBIHA: 'bg-green-50 text-green-700', HOTOVO: 'bg-gray-100 text-gray-600', FAKTURACE: 'bg-yellow-50 text-yellow-700', ZAPLACENO: 'bg-emerald-50 text-emerald-700' }

export default function ZakazkyPage() {
  const [zakázky, setZakázky] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stav, setStav] = useState('all')

  useEffect(() => {
    fetch(`/api/zakázky?stav=${stav}&search=${search}`)
      .then(r => r.json()).then(d => { setZakázky(d); setLoading(false) })
  }, [stav, search])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Červen 2026</div>
          <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Zakázky</h1>
          <p className="text-[14px] text-[#6b6760] mt-1">{zakázky.length} zakázek celkem</p>
        </div>
        <Link href="/zakázky/nova" className="flex items-center gap-2 bg-[#0f0e0c] text-white px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#1a1916] transition-colors">
          <Plus size={14} /> Nová zakázka
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="flex gap-0.5 bg-[#e8e6e0] p-1 rounded-lg">
          {['all','NOVA','PROBIHA','CEKA','HOTOVO','FAKTURACE'].map(s => (
            <button key={s} onClick={() => setStav(s)}
              className={`px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all ${stav === s ? 'bg-white text-[#0f0e0c] shadow-sm' : 'text-[#6b6760] hover:text-[#0f0e0c]'}`}>
              {s === 'all' ? 'Všechny' : STAV_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#e8e6e0] rounded-lg px-3 h-9 flex-1 max-w-xs">
          <Search size={14} className="text-[#a8a49c]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Hledat zakázku..." className="bg-none border-none outline-none text-[12px] text-[#0f0e0c] placeholder:text-[#c0bdb6] flex-1 bg-transparent" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e8e6e0] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9f8f5] border-b border-[#f0ede8]">
              {['#','Zakázka','Zákazník','Pracovník','Stav','Postup','Cena',''].map(h => (
                <th key={h} className="text-left text-[10px] font-semibold text-[#a8a49c] tracking-[1px] uppercase px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-12 text-[#a8a49c]">Načítám...</td></tr>
            ) : zakázky.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-[#a8a49c]">Žádné zakázky</td></tr>
            ) : zakázky.map(z => (
              <tr key={z.id} className="border-b border-[#f7f6f3] last:border-0 hover:bg-[#faf9f7] transition-colors cursor-pointer">
                <td className="px-4 py-3 text-[11px] font-semibold text-[#c0bdb6]">{z.cislo}</td>
                <td className="px-4 py-3">
                  <div className="text-[13px] font-semibold text-[#0f0e0c]">{z.nazev}</div>
                  <div className="text-[11px] text-[#a8a49c] mt-0.5">{z.adresa}</div>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#6b6760]">{z.zákazník?.jmeno || '—'}</td>
                <td className="px-4 py-3 text-[13px] text-[#6b6760]">{z.pracovnik?.name || <span className="text-red-500 text-[11px]">Nepřiřazen</span>}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${STAV_COLORS[z.stav]}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    {STAV_LABELS[z.stav]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-[#f0ede8] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#b8922a] to-[#f5e6b0]" style={{width: `${z.postup}%`}} />
                    </div>
                    <span className="text-[11px] font-semibold text-[#6b6760]">{z.postup}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] font-bold text-[#0f0e0c]">{z.cena ? `${z.cena.toLocaleString('cs')} Kč` : '—'}</td>
                <td className="px-4 py-3">
                  <Link href={`/zakázky/${z.id}`} className="text-[#d4a843] hover:opacity-75">
                    <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
