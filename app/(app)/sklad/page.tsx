'use client'

import { useEffect, useState } from 'react'
import { Package, AlertTriangle } from 'lucide-react'

export default function SkladPage() {
  const [sklad, setSklad] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sklad')
      .then(r => r.json())
      .then(data => { setSklad(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const nizkyStav = sklad.filter(s => s.mnozstvi <= s.minMnozstvi)

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Logistika</div>
        <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Sklad</h1>
        <p className="text-[14px] text-[#6b6760] mt-1">{sklad.length} položek · {nizkyStav.length} pod minimem</p>
      </div>

      {nizkyStav.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5 flex items-center gap-3">
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
          <div className="text-[13px] text-red-700 font-medium">{nizkyStav.length} položek pod minimálním stavem: {nizkyStav.map(s => s.nazev).join(', ')}</div>
        </div>
      )}

      <div className="bg-white border border-[#e8e6e0] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[14px] text-[#a8a49c]">Načítám...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9f8f5] border-b border-[#f0ede8]">
                {['Název','Množství','Min. množství','Cena/ks','Stav'].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-[#a8a49c] tracking-[1px] uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sklad.map((s: any) => (
                <tr key={s.id} className="border-b border-[#f7f6f3] last:border-0 hover:bg-[#faf9f7]">
                  <td className="px-4 py-3 text-[13px] font-semibold text-[#0f0e0c]">{s.nazev}</td>
                  <td className="px-4 py-3 text-[13px] text-[#6b6760]">{s.mnozstvi} {s.jednotka}</td>
                  <td className="px-4 py-3 text-[13px] text-[#6b6760]">{s.minMnozstvi} {s.jednotka}</td>
                  <td className="px-4 py-3 text-[13px] text-[#6b6760]">{s.cena ? s.cena.toLocaleString('cs') + ' Kč' : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={'text-[11px] font-semibold px-2.5 py-1 rounded-full ' + (s.mnozstvi <= s.minMnozstvi ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700')}>
                      {s.mnozstvi <= s.minMnozstvi ? 'Nízký stav' : 'OK'}
                    </span>
                  </td>
                </tr>
              ))}
              {sklad.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-[#a8a49c]">Prázdný sklad</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
