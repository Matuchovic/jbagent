'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Save, User, Shield, Bell } from 'lucide-react'

export default function NastaveniPage() {
  const { data: session } = useSession()
  const [saved, setSaved] = useState(false)

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Konfigurace</div>
        <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Nastavení</h1>
      </div>

      <div className="flex flex-col gap-5">
        {/* Profil */}
        <div className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-[#d4a843]" />
            <h2 className="text-[14px] font-bold text-[#0f0e0c]">Profil</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Jméno</label>
              <input defaultValue={session?.user?.name || ''} className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Email</label>
              <input defaultValue={session?.user?.email || ''} className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" />
            </div>
          </div>
        </div>

        {/* Firma */}
        <div className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-[#d4a843]" />
            <h2 className="text-[14px] font-bold text-[#0f0e0c]">Firma</h2>
          </div>
          <div className="flex flex-col gap-4">
            {[{l:'Název firmy',p:'JB Kominictví s.r.o.'},{l:'IČO',p:'12345678'},{l:'DIČ',p:'CZ12345678'},{l:'Adresa',p:'Ostrava, Hlavní 1'}].map(f => (
              <div key={f.l}>
                <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">{f.l}</label>
                <input placeholder={f.p} className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" />
              </div>
            ))}
          </div>
        </div>

        {/* Notifikace */}
        <div className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-[#d4a843]" />
            <h2 className="text-[14px] font-bold text-[#0f0e0c]">Notifikace</h2>
          </div>
          {[{l:'Nová zakázka',d:'Upozornění při přidání zakázky'},{l:'Faktura po splatnosti',d:'Upozornění na nezaplacené faktury'},{l:'Certifikáty BOZP',d:'Upozornění před vypršením'}].map(n => (
            <div key={n.l} className="flex items-center justify-between py-3 border-b border-[#f7f6f3] last:border-0">
              <div>
                <div className="text-[13px] font-semibold text-[#0f0e0c]">{n.l}</div>
                <div className="text-[11px] text-[#a8a49c]">{n.d}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-[#e8e6e0] peer-checked:bg-[#d4a843] rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4"></div>
              </label>
            </div>
          ))}
        </div>

        <button onClick={save} className="h-10 bg-[#0f0e0c] text-white rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#1a1916] transition-colors">
          <Save size={14} />{saved ? '✓ Uloženo!' : 'Uložit nastavení'}
        </button>
      </div>
    </div>
  )
}
