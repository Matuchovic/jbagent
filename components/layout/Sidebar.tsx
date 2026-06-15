'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { handleSignOut } from '@/app/actions/signout'
import { LayoutDashboard, ClipboardList, Users, Receipt, FileText, Home, Package, Settings, LogOut, Menu, X } from 'lucide-react'

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
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <aside className="w-[220px] flex-shrink-0 bg-[#0f0e0c] flex flex-col h-full">
      <div className="px-4 py-5 border-b border-white/5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-[-6px] rounded-[14px] border border-[#d4a843]/40 animate-pulse-ring-1" />
              <div className="absolute inset-[-12px] rounded-[18px] border border-[#d4a843]/15 animate-pulse-ring-2" />
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#1c1508] to-[#080604] border border-[#d4a843]/50 flex items-center justify-center animate-float overflow-hidden relative">
                <div className="absolute inset-0 animate-scan-line bg-gradient-to-b from-transparent via-[#d4a843]/30 to-transparent" style={{height:'2px',top:'0'}} />
                <AgentIcon size={22} />
              </div>
            </div>
            <div>
              <div className="text-[14px] font-black tracking-[3px] animate-shimmer-gold" style={{background:'linear-gradient(90deg,#8B6914 0%,#d4a843 20%,#f5e6b0 35%,#ffffff 45%,#f5e6b0 55%,#d4a843 70%,#c49030 85%,#f5e6b0 95%,#d4a843 100%)',backgroundSize:'300% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer-gold 4s linear infinite'}}>JB AGENT</div>
              <div className="flex items-center gap-[4px] mt-[3px]">
                <span style={{fontSize:'7.5px',fontWeight:700,letterSpacing:'2px',background:'linear-gradient(90deg,rgba(212,168,67,0.3) 0%,rgba(245,230,176,0.9) 40%,rgba(212,168,67,0.9) 60%,rgba(245,230,176,0.9) 80%,rgba(212,168,67,0.3) 100%)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer-sub 2.5s linear infinite'}}>SOFTWARE</span>
                <span style={{color:'rgba(212,168,67,0.4)',fontSize:'7px',WebkitTextFillColor:'rgba(212,168,67,0.4)'}}>·</span>
                <span style={{fontSize:'7.5px',fontWeight:700,letterSpacing:'1.5px',background:'linear-gradient(90deg,rgba(212,168,67,0.3) 0%,rgba(245,230,176,0.9) 40%,rgba(212,168,67,0.9) 60%,rgba(245,230,176,0.9) 80%,rgba(212,168,67,0.3) 100%)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer-sub 2.5s linear infinite 0.8s'}}>AI POWERED</span>
                <span style={{display:'inline-block',width:'5px',height:'10px',background:'rgba(212,168,67,0.7)',borderRadius:'1px',animation:'type-cursor 1s ease-in-out infinite',marginLeft:'1px'}} />
              </div>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="md:hidden text-white/40 hover:text-white/80 p-1">
            <X size={18} />
          </button>
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
        {nav.map(section => (
          <div key={section.section}>
            <div className="text-[9px] font-semibold text-white/20 tracking-[2px] uppercase px-2 pt-3 pb-1.5">{section.section}</div>
            {section.items.map(item => {
              const Icon = item.icon
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[13px] transition-colors ${active ? 'bg-[#d4a843]/10 text-[#d4a843]' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-7 h-7 rounded-full bg-[#d4a843]/20 flex items-center justify-center text-[11px] font-bold text-[#d4a843] flex-shrink-0">
            {userName?.slice(0, 2).toUpperCase() || 'JB'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-white/75 truncate">{userName || 'Admin'}</div>
            <div className="text-[10px] text-white/25 truncate">{userEmail}</div>
          </div>
          <form action={handleSignOut}>
            <button type="submit" className="text-white/20 hover:text-white/60 transition-colors p-1">
              <LogOut size={14} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <SidebarContent />
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0f0e0c] border-b border-white/5 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-[-5px] rounded-[12px] border border-[#d4a843]/40" style={{animation:'pulse-ring-1 2.4s ease-in-out infinite'}} />
            <div className="absolute inset-[-10px] rounded-[15px] border border-[#d4a843]/15" style={{animation:'pulse-ring-2 2.4s ease-in-out infinite 0.3s'}} />
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#1c1508] to-[#080604] border border-[#d4a843]/50 flex items-center justify-center overflow-hidden relative">
              <AgentIcon size={18} />
            </div>
          </div>
          <div>
            <div className="text-[14px] font-black tracking-[3px]" style={{background:'linear-gradient(90deg,#8B6914 0%,#d4a843 20%,#f5e6b0 35%,#ffffff 45%,#f5e6b0 55%,#d4a843 70%,#c49030 85%,#f5e6b0 95%,#d4a843 100%)',backgroundSize:'300% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer-gold 4s linear infinite'}}>JB AGENT</div>
            <div className="flex items-center gap-1">
              <span style={{fontSize:'7px',fontWeight:700,letterSpacing:'1.5px',background:'linear-gradient(90deg,rgba(212,168,67,0.3),rgba(245,230,176,0.9),rgba(212,168,67,0.9),rgba(245,230,176,0.9),rgba(212,168,67,0.3))',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer-sub 2.5s linear infinite'}}>SOFTWARE · AI POWERED</span>
              <span style={{display:'inline-block',width:'4px',height:'9px',background:'rgba(212,168,67,0.7)',borderRadius:'1px',animation:'type-cursor 1s ease-in-out infinite'}} />
            </div>
          </div>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-white/60 hover:text-white p-2">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="flex-shrink-0">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
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
      <ellipse cx="84" cy="80" rx="7" ry="8" fill="#1a1612"/>
      <ellipse cx="116" cy="80" rx="7" ry="8" fill="#1a1612"/>
      <path d="M88 100 Q100 110 112 100" stroke="#c0956a" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>
  )
}
