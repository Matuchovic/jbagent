'use client'

import { useEffect, useState } from 'react'
import { Receipt } from 'lucide-react'

const STAVY: Record<string, { label: string; color: string }> = {
  KONCEPT: { label: 'Koncept', color: 'bg-gray-50 text-gray-600' },
  ODESLANA: { label: 'Odeslaná', color: 'bg-blue-50 text-blue-700' },
  ZAPLACENA: { label: 'Zaplacená', color: 'bg-green-50 text-green-700' },
  PO_SPLATNOSTI: { label: 'Po splatnosti', color: 'bg-red-50 text-red-700' },
}

export default function FakturyPage() {
  const [faktury, setFaktury] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/faktury')
      .then(r => r.json())
      .then(data => { setFaktury(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Finance</div>
        <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Faktury</h1>
        <p className="text-[14px] text-[#6b6760] mt-1">{faktury.length} faktur celkem</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Celkem', value: faktury.reduce((s,f) => s + (f.castka||0), 0), color: 'text-[#0f0e0c]' },
          { label: 'Zaplaceno', value: faktury.filter(f => f.stav === 'ZAPLACENA').reduce((s,f) => s + (f.castka||0), 0), color: 'text-green-600' },
          { label: 'Po splatnosti', value: faktury.filter(f => f.stav === 'PO_SPLATNOSTI').reduce((s,f) => s + (f.castka||0), 0), color: 'text-red-600' },
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
                {['Číslo','Zakázka','Částka','Splatnost','Stav'].map(h => (
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
                    <td className="px-4 py-3 text-[13px] text-[#6b6760]">{f.splatnost ? new Date(f.splatnost).toLocaleDateString('cs') : '—'}</td>
                    <td className="px-4 py-3"><span className={'text-[11px] font-semibold px-2.5 py-1 rounded-full ' + stav.color}>{stav.label}</span></td>
                  </tr>
                )
              })}
              {faktury.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-[#a8a49c]">Žádné faktury</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
