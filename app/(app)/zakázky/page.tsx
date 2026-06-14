'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ClipboardList, Plus, Search } from 'lucide-react'

const STAVY: Record<string, { label: string; color: string }> = {
  NOVA: { label: 'Nová', color: 'bg-blue-50 text-blue-700' },
  CEKA: { label: 'Čeká', color: 'bg-yellow-50 text-yellow-700' },
  PROBIHA: { label: 'Probíhá', color: 'bg-green-50 text-green-700' },
  HOTOVO: { label: 'Hotovo', color: 'bg-gray-50 text-gray-700' },
  FAKTURACE: { label: 'Fakturace', color: 'bg-orange-50 text-orange-700' },
  ZAPLACENO: { label: 'Zaplaceno', color: 'bg-emerald-50 text-emerald-700' },
}

export default function ZakázkyPage() {
  const [zakázky, setZakázky] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/zakázky')
      .then(r => r.json())
      .then(data => { setZakázky(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = zakázky.filter(z =>
    z.nazev?.toLowerCase().includes(search.toLowerCase()) ||
    z.zákazník?.jmeno?.toLowerCase().includes(search.toLowerCase()) ||
    z.adresa?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Správa</div>
          <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Zakázky</h1>
          <p className="text-[14px] text-[#6b6760] mt-1">{zakázky.length} zakázek celkem</p>
        </div>
        <Link href="/zakázky/nova" className="h-10 px-4 bg-[#0f0e0c] text-white rounded-lg text-[13px] font-semibold flex items-center gap-2 hover:bg-[#1a1916]">
          <Plus size={14} /> Nová zakázka
        </Link>
      </div>

      <div className="bg-white border border-[#e8e6e0] rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0ede8] flex items-center gap-3">
          <Search size={15} className="text-[#a8a49c]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Hledat zakázku nebo zákazníka..."
            className="flex-1 text-[13px] outline-none bg-transparent placeholder:text-[#c0bdb6]"
          />
        </div>

        {loading ? (
          <div className="py-16 text-center text-[14px] text-[#a8a49c]">Načítám...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9f8f5] border-b border-[#f0ede8]">
                {['#','Zakázka','Zákazník','Pracovník','Stav','Postup','Cena'].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-[#a8a49c] tracking-[1px] uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((z: any) => {
                const stav = STAVY[z.stav] || { label: z.stav, color: 'bg-gray-50 text-gray-700' }
                return (
                  <tr key={z.id} className="border-b border-[#f7f6f3] last:border-0 hover:bg-[#faf9f7] cursor-pointer">
                    <td className="px-4 py-3 text-[11px] font-semibold text-[#c0bdb6]">{z.cislo}</td>
                    <td className="px-4 py-3">
                      <Link href={'/zakázky/' + z.id}>
                        <div className="text-[13px] font-semibold text-[#0f0e0c]">{z.nazev}</div>
                        <div className="text-[11px] text-[#a8a49c]">{z.adresa}</div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#6b6760]">{z.zákazník?.jmeno || '—'}</td>
                    <td className="px-4 py-3 text-[13px] text-[#6b6760]">{z.pracovnik?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={'text-[11px] font-semibold px-2.5 py-1 rounded-full ' + stav.color}>{stav.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-[#f0ede8] rounded-full overflow-hidden">
                          <div className="h-full bg-[#d4a843] rounded-full" style={{width: (z.postup || 0) + '%'}} />
                        </div>
                        <span className="text-[11px] font-bold text-[#6b6760]">{z.postup || 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[#0f0e0c]">{z.cena ? z.cena.toLocaleString('cs') + ' Kč' : '—'}</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={7} className="text-center py-12 text-[#a8a49c]">Žádné zakázky</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
