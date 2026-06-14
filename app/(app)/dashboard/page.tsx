'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ClipboardList, Users, Receipt, AlertTriangle, TrendingUp, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const [zakázky, setZakázky] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/zakazky').then(r => r.json()).then(setZakázky).catch(() => {})
  }, [])

  const aktivni = zakázky.filter(z => z.stav === 'PROBIHA').length
  const celkemCena = zakázky.reduce((s, z) => s + (z.cena || 0), 0)
  const nezaplaceno = zakázky.filter(z => z.stav !== 'ZAPLACENO').reduce((s, z) => s + (z.cena || 0), 0)

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Červen 2026</div>
        <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Přehled zakázek</h1>
        <p className="text-[14px] text-[#6b6760] mt-1">{zakázky.length} zakázek · {aktivni} aktivních</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Tržby — červen', value: celkemCena.toLocaleString('cs') + ' Kč', color: 'text-[#d4a843]', icon: TrendingUp },
          { label: 'Aktivní zakázky', value: String(aktivni), color: 'text-[#0f0e0c]', icon: ClipboardList },
          { label: 'Nezaplaceno', value: nezaplaceno.toLocaleString('cs') + ' Kč', color: 'text-red-500', icon: AlertTriangle },
          { label: 'Celkem zakázek', value: String(zakázky.length), color: 'text-[#0f0e0c]', icon: Calendar },
        ].map(card => (
          <div key={card.label} className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-semibold text-[#a8a49c] uppercase tracking-wide">{card.label}</div>
              <card.icon size={16} className="text-[#d4d0c8]" />
            </div>
            <div className={"text-[24px] font-bold " + card.color}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#e8e6e0] rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[#f0ede8] flex items-center justify-between">
          <div className="text-[14px] font-bold text-[#0f0e0c]">Aktuálně probíhající práce</div>
          <Link href="/zakazky" className="text-[12px] font-semibold text-[#d4a843]">Zobrazit vše →</Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9f8f5] border-b border-[#f0ede8]">
              {['#','Zakázka','Zákazník','Pracovník','Stav','Postup','Cena'].map(h => (
                <th key={h} className="text-left text-[10px] font-semibold text-[#a8a49c] tracking-[1px] uppercase px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {zakázky.slice(0, 8).map((z: any) => (
              <tr key={z.id} className="border-b border-[#f7f6f3] last:border-0 hover:bg-[#faf9f7]">
                <td className="px-4 py-3 text-[11px] font-semibold text-[#c0bdb6]">{z.cislo}</td>
                <td className="px-4 py-3">
                  <div className="text-[13px] font-semibold text-[#0f0e0c]">{z.nazev}</div>
                  <div className="text-[11px] text-[#a8a49c]">{z.adresa}</div>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#6b6760]">{z.zákazník?.jmeno || '—'}</td>
                <td className="px-4 py-3 text-[13px] text-[#6b6760]">{z.pracovnik?.name || '—'}</td>
                <td className="px-4 py-3">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700">{z.stav}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-[#f0ede8] rounded-full overflow-hidden">
                      <div className="h-full bg-[#d4a843] rounded-full" style={{width: z.postup + '%'}} />
                    </div>
                    <span className="text-[11px] font-bold text-[#6b6760]">{z.postup}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] font-bold text-[#0f0e0c]">{z.cena ? z.cena.toLocaleString('cs') + ' Kč' : '—'}</td>
              </tr>
            ))}
            {zakázky.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-[#a8a49c]">Žádné zakázky</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
