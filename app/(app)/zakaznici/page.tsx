'use client'

import { useEffect, useState } from 'react'
import { Home, Phone, Mail } from 'lucide-react'

export default function ZakaznicPage() {
  const [zakaznici, setZakaznici] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/zakaznici')
      .then(r => r.json())
      .then(data => { setZakaznici(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Databáze</div>
        <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Zákazníci</h1>
        <p className="text-[14px] text-[#6b6760] mt-1">{zakaznici.length} zákazníků</p>
      </div>
      {loading ? (
        <div className="py-16 text-center text-[14px] text-[#a8a49c]">Načítám...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {zakaznici.map((z: any) => (
            <div key={z.id} className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm">
              <div className="text-[15px] font-bold text-[#0f0e0c] mb-2">{z.jmeno}</div>
              {z.adresa && <div className="flex items-center gap-2 text-[12px] text-[#6b6760] mb-1"><Home size={12} />{z.adresa}</div>}
              {z.telefon && <div className="flex items-center gap-2 text-[12px] text-[#6b6760] mb-1"><Phone size={12} />{z.telefon}</div>}
              {z.email && <div className="flex items-center gap-2 text-[12px] text-[#6b6760]"><Mail size={12} />{z.email}</div>}
            </div>
          ))}
          {zakaznici.length === 0 && <div className="col-span-2 text-center py-12 text-[#a8a49c]">Žádní zákazníci</div>}
        </div>
      )}
    </div>
  )
}
