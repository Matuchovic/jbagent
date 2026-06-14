'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, ClipboardList, Users, Receipt, FileText, Home, Package, Settings, LogOut } from 'lucide-react'

const nav = [
  { section: 'Přehled', items: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/zakazky', label: 'Zakázky', icon: ClipboardList },
    { href: '/lide', label: 'Lidé', icon: Users },
    { href: '/faktury', label: 'Faktury', icon: Receipt },
  ]},
  { section: 'Firma', items: [
    { href: '/dokumenty', label: 'Dokumenty', icon: FileText },
    { href: '/zakaznici', label: 'Zákazníci', icon: Home },
    { href: '/sklad', label: 'Sklad', icon: Package },
  ]},
  { section: 'Systém', items: [
    { href: '/nastaveni', label: 'Nastavení', icon: Settings },
  ]},
]

export default function Sidebar({ userName, userEmail }: { userName?: string; userEmail?: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#0f0e0c] flex flex-col">
      <div className="px-4 py-5 border-b border-white/5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#1c1508] to-[#080604] border border-[#d4a843]/30 flex items-center justify-center flex-shrink-0">
            <AgentIcon size={20} />
          </div>
          <div>
            <div className="text-[13px] font-bold tracking-[2px] bg-gradient-to-r from-[#f5e6b0] to-[#d4a843] bg-clip-text text-transparent">JB AGENT</div>
            <div className="text-[9px] text-white/20 tracking-[1.5px] uppercase">Software</div>
          </div>
        </div>
        <div className="bg-[#d4a843]/6 border border-[#d4a843]/15 rounded-[10px] px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#30d158] flex-shrink-0" />
          <div>
            <div className="text-[11px] font-semibold text-[#d4a843]">AI Agent aktivní</div>
            <div className="text-[10px] text-[#d4a843]/35 mt-0.5">Systém běží</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {nav.map(group => (
          <div key={group.section}>
            <div className="text-[9px] text-white/20 tracking-[2px] uppercase px-3 py-2 font-semibold">{group.section}</div>
            {group.items.map(item => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-all ${active ? 'bg-[#d4a843]/10 text-[#d4a843] border border-[#d4a843]/15' : 'text-white/40 hover:bg-white/5 hover:text-white/70'}`}>
                  <item.icon size={15} className="flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}
            <div className="h-px bg-white/5 my-2 mx-2" />
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#d4a843]/12 border border-[#d4a843]/25 flex items-center justify-center text-[11px] font-bold text-[#d4a843] flex-shrink-0">
            {userName?.slice(0, 2).toUpperCase() || 'JB'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-white/75 truncate">{userName || 'Admin'}</div>
            <div className="text-[10px] text-white/25 truncate">{userEmail}</div>
          </div>
          <button
            onClick={async () => {
              await fetch('/api/auth/signout', { method: 'POST' })
              window.location.href = '/login'
            }}
            className="text-white/20 hover:text-white/60 transition-colors p-1"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}

function AgentIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 200 230" fill="none">
      <rect x="54" y="114" width="92" height="72" rx="22" fill="#1a1a22"/>
      <path d="M97 126 L93 168 L100 174 L107 168 L103 126 Z" fill="#d4a843"/>
      <rect x="28" y="116" width="28" height="64" rx="14" fill="#141420"/>
      <rect x="144" y="116" width="28" height="64" rx="14" fill="#141420"/>
      <ellipse cx="100" cy="84" rx="44" ry="46" fill="#f0d5a0"/>
      <rect x="60" y="76" width="34" height="22" rx="9" fill="#0c0c0c"/>
      <rect x="61" y="77" width="32" height="20" rx="8" fill="rgba(100,160,255,0.3)"/>
      <rect x="106" y="76" width="34" height="22" rx="9" fill="#0c0c0c"/>
      <rect x="107" y="77" width="32" height="20" rx="8" fill="rgba(100,160,255,0.3)"/>
      <rect x="94" y="82" width="12" height="4" rx="2" fill="#181818"/>
      <ellipse cx="100" cy="42" rx="62" ry="10" fill="#111118"/>
      <rect x="62" y="4" width="76" height="42" rx="20" fill="#09090f"/>
      <rect x="62" y="38" width="76" height="8" fill="#d4a843"/>
    </svg>
  )
}
