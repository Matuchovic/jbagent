'use client'

import { FileText, Upload } from 'lucide-react'

export default function DokumentyPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Archiv</div>
        <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Dokumenty</h1>
      </div>
      <div className="bg-white border border-[#e8e6e0] rounded-xl p-10 text-center shadow-sm">
        <div className="w-16 h-16 bg-[#f5f4f0] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText size={28} className="text-[#d4a843]" />
        </div>
        <div className="text-[16px] font-bold text-[#0f0e0c] mb-2">Správa dokumentů</div>
        <div className="text-[13px] text-[#a8a49c] mb-5">Revizní zprávy, certifikáty BOZP, smlouvy</div>
        <button className="h-10 px-5 bg-[#0f0e0c] text-white rounded-lg text-[13px] font-semibold flex items-center gap-2 mx-auto hover:bg-[#1a1916]">
          <Upload size={14} /> Nahrát dokument
        </button>
      </div>
    </div>
  )
}
