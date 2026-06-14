'use client'

import { useEffect, useState } from 'react'
import { Users, Phone, Mail } from 'lucide-react'

const ROLE: Record<string, string> = { ADMIN: 'Admin', MANAGER: 'Manažer', WORKER: 'Pracovník' }

export default function LidePage() {
  const [lide, setLide] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/lide')
      .then(r => r.json())
      .then(data => { setLide(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Tým</div>
        <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Lidé</h1>
        <p className="text-[14px] text-[#6b6760] mt-1">{lide.length} pracovníků</p>
      </div>
      {loading ? (
        <div className="py-16 text-center text-[14px] text-[#a8a49c]">Načítám...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {lide.map((l: any) => (
            <div key={l.id} className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#d4a843]/10 flex items-center justify-center text-[16px] font-bold text-[#d4a843]">
                  {l.name?.[0] || '?'}
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#0f0e0c]">{l.name}</div>
                  <div className="text-[11px] text-[#a8a49c]">{ROLE[l.role] || l.role}</div>
                </div>
              </div>
              {l.email && <div className="flex items-center gap-2 text-[12px] text-[#6b6760] mb-1"><Mail size={12} />{l.email}</div>}
              {l.phone && <div className="flex items-center gap-2 text-[12px] text-[#6b6760]"><Phone size={12} />{l.phone}</div>}
            </div>
          ))}
          {lide.length === 0 && <div className="col-span-3 text-center py-12 text-[#a8a49c]">Žádní pracovníci</div>}
        </div>
      )}
    </div>
  )
}
