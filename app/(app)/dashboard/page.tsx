import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { LogOut, LayoutDashboard, ClipboardList, Users, Receipt, FileText, Home, Package, Settings } from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex h-screen bg-[#f5f4f0] font-sans">

      {/* SIDEBAR */}
      <aside className="w-[220px] flex-shrink-0 bg-[#0f0e0c] flex flex-col">

        {/* Logo */}
        <div className="px-4 py-5 border-b border-white/5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#1c1508] to-[#080604] border border-[#d4a843]/30 flex items-center justify-center flex-shrink-0">
              <AgentIcon size={20} />
            </div>
            <div>
              <div className="text-[13px] font-bold tracking-[2px] bg-gradient-to-r from-[#f5e6b0] to-[#d4a843] bg-clip-text text-transparent">
                JB AGENT
              </div>
              <div className="text-[9px] text-white/20 tracking-[1.5px] uppercase">Software</div>
            </div>
          </div>

          {/* AI Status */}
          <div className="bg-[#d4a843]/6 border border-[#d4a843]/15 rounded-[10px] px-3 py-2.5 flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#30d158] flex-shrink-0" />
            <div>
              <div className="text-[11px] font-semibold text-[#d4a843]">AI Agent aktivní</div>
              <div className="text-[10px] text-[#d4a843]/35 mt-0.5">3 upozornění čekají</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5 overflow-y-auto">
          <NavLabel>Přehled</NavLabel>
          <NavItem icon={<LayoutDashboard size={15}/>} label="Dashboard" />
          <NavItem icon={<ClipboardList size={15}/>} label="Zakázky" badge="12" active />
          <NavItem icon={<Users size={15}/>} label="Lidé" badge="5" badgeColor="blue" />
          <NavItem icon={<Receipt size={15}/>} label="Faktury" badge="3" badgeColor="red" />
          <div className="h-px bg-white/5 my-2 mx-2" />
          <NavLabel>Firma</NavLabel>
          <NavItem icon={<FileText size={15}/>} label="Dokumenty" />
          <NavItem icon={<Home size={15}/>} label="Zákazníci" />
          <NavItem icon={<Package size={15}/>} label="Sklad" />
          <div className="h-px bg-white/5 my-2 mx-2" />
          <NavLabel>Systém</NavLabel>
          <NavItem icon={<Settings size={15}/>} label="Nastavení" />
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#d4a843]/12 border border-[#d4a843]/25 flex items-center justify-center text-[11px] font-bold text-[#d4a843] flex-shrink-0">
              {session.user?.name?.slice(0, 2).toUpperCase() || 'JB'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-white/75 truncate">{session.user?.name || 'Admin'}</div>
              <div className="text-[10px] text-white/25 truncate">{session.user?.email}</div>
            </div>
            <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }) }}>
              <button type="submit" className="text-white/20 hover:text-white/60 transition-colors p-1">
                <LogOut size={14} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="h-[52px] bg-white border-b border-[#e8e6e0] flex items-center px-6 gap-4 flex-shrink-0">
          <div>
            <span className="text-[16px] font-bold text-[#0f0e0c] tracking-tight">Zakázky</span>
            <span className="text-[13px] text-[#a8a49c] ml-1.5">— červen 2026</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <input
              placeholder="Hledat zakázku nebo zákazníka…"
              className="h-8 px-3 bg-[#f5f4f0] border border-[#e8e6e0] rounded-lg text-[12px] text-[#0f0e0c] placeholder:text-[#c0bdb6] outline-none focus:border-[#d4a843] w-52 transition-colors"
            />
            <button className="h-8 px-3 rounded-lg border border-[#e8e6e0] bg-white text-[12px] font-medium text-[#6b6760] hover:border-[#d4d0c8] transition-colors">
              Filtrovat
            </button>
            <button className="h-8 px-4 rounded-lg bg-[#0f0e0c] text-[12px] font-semibold text-white hover:bg-[#1a1916] transition-colors">
              + Nová zakázka
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">

          {/* Welcome */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Červen 2026</div>
              <div className="text-[26px] font-bold text-[#0f0e0c] tracking-tight leading-tight">
                Přehled zakázek
              </div>
              <div className="text-[14px] text-[#6b6760] mt-1">
                12 aktivních zakázek · 4 pracovníci v terénu · příští týden 6 naplánovaných
              </div>
            </div>
            <div className="flex gap-0.5 bg-[#e8e6e0] p-1 rounded-lg">
              {['Všechny','Aktivní','Čekající','Hotové'].map((t, i) => (
                <button key={t} className={`px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all ${i===1 ? 'bg-white text-[#0f0e0c] shadow-sm' : 'text-[#6b6760] hover:text-[#0f0e0c]'}`}>{t}</button>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-3">
            <MetricCard eyebrow="Tržby — červen" value="284 900 Kč" delta="+18 %" deltaType="up" sub="vs. minulý měsíc" gold />
            <MetricCard eyebrow="Aktivní zakázky" value="12" delta="↑ 3 nové" deltaType="up" sub="tento týden" />
            <MetricCard eyebrow="Nezaplaceno" value="67 200 Kč" delta="⚠ 2 faktury" deltaType="warn" sub="po splatnosti" />
            <MetricCard eyebrow="Lidé v terénu" value="4 / 5" delta="" deltaType="neutral" sub="Jana N. na dovolené" />
          </div>

          {/* Two col */}
          <div className="grid grid-cols-[1fr_320px] gap-5">

            {/* LEFT */}
            <div className="flex flex-col gap-4">
              {/* Zakázky table */}
              <div className="bg-white border border-[#e8e6e0] rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-[#f0ede8] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-[#a8a49c] tracking-[1.5px] uppercase mb-0.5">Aktivní zakázky</div>
                    <div className="text-[14px] font-bold text-[#0f0e0c]">Aktuálně probíhající práce</div>
                  </div>
                  <button className="text-[12px] font-semibold text-[#d4a843] hover:opacity-75 transition-opacity">Zobrazit vše →</button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f9f8f5]">
                      {['#','Zakázka','Zákazník','Pracovník','Stav','Postup','Cena'].map(h => (
                        <th key={h} className="text-left text-[10px] font-semibold text-[#a8a49c] tracking-[1px] uppercase px-5 py-2.5 border-b border-[#f0ede8]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ZAKÁZKY.map((z) => (
                      <tr key={z.id} className="border-b border-[#f7f6f3] last:border-0 hover:bg-[#faf9f7] transition-colors cursor-pointer">
                        <td className="px-5 py-3.5 text-[11px] font-semibold text-[#c0bdb6]">{z.id}</td>
                        <td className="px-5 py-3.5">
                          <div className="text-[13px] font-semibold text-[#0f0e0c]">{z.name}</div>
                          <div className="text-[11px] text-[#a8a49c] mt-0.5">{z.addr}</div>
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-[#6b6760]">{z.client}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${z.workerColor}`}>{z.workerInitials}</div>
                            <span className="text-[12px] text-[#6b6760]">{z.worker}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5"><StatusBadge status={z.status} /></td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-[#f0ede8] rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-[#b8922a] to-[#f5e6b0]" style={{width: `${z.progress}%`}} />
                            </div>
                            <span className="text-[11px] font-semibold text-[#6b6760]">{z.progress}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-[13px] font-bold text-[#0f0e0c]">{z.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Lidé */}
              <div className="bg-white border border-[#e8e6e0] rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-[#f0ede8] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-[#a8a49c] tracking-[1.5px] uppercase mb-0.5">Tým</div>
                    <div className="text-[14px] font-bold text-[#0f0e0c]">Kdo je dnes kde</div>
                  </div>
                  <button className="text-[12px] font-semibold text-[#d4a843]">Správa týmu →</button>
                </div>
                {PEOPLE.map(p => (
                  <div key={p.name} className="flex items-center gap-3 px-5 py-3.5 border-b border-[#f7f6f3] last:border-0 hover:bg-[#faf9f7] transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${p.avColor}`}>{p.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-[#0f0e0c]">{p.name}</div>
                      <div className="text-[11px] text-[#a8a49c] mt-0.5 truncate">{p.task}</div>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[11px] font-semibold flex-shrink-0 ${p.statusColor}`}>
                      <div className={`w-2 h-2 rounded-full ${p.dotColor}`} />{p.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-4">

              {/* AI */}
              <div className="bg-[#0f0e0c] rounded-xl p-5 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-[9px] bg-[#d4a843]/15 border border-[#d4a843]/25 flex items-center justify-center flex-shrink-0">
                    <AgentIcon size={20} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white">JB Agent</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/35 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />Aktivní · právě teď
                    </div>
                  </div>
                </div>
                <p className="text-[12px] text-white/50 leading-relaxed mb-4">
                  Mám pro vás <span className="text-white font-semibold">3 věci</span> které potřebují vaši pozornost. Zakázka #1086 nemá pracovníka. Faktura #F-1081 je <span className="text-white font-semibold">5 dní po splatnosti</span>. Certifikát BOZP vyprší za <span className="text-white font-semibold">14 dní</span>.
                </p>
                <div className="flex flex-col gap-2">
                  {AI_ACTIONS.map(a => (
                    <button key={a.label} className="bg-white/5 border border-white/8 rounded-lg px-3 py-2.5 text-left flex items-center gap-3 hover:bg-white/10 transition-colors group">
                      <span className="text-[#d4a843] text-[14px] flex-shrink-0">{a.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-white/85">{a.label}</div>
                        <div className="text-[10px] text-white/30 mt-0.5">{a.sub}</div>
                      </div>
                      <span className="text-white/15 group-hover:text-white/40 transition-colors text-[11px]">›</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upcoming */}
              <div className="bg-white border border-[#e8e6e0] rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-[#f0ede8]">
                  <div className="text-[10px] font-semibold text-[#a8a49c] tracking-[1.5px] uppercase mb-0.5">Plánováno</div>
                  <div className="text-[14px] font-bold text-[#0f0e0c]">Nadcházející zakázky</div>
                </div>
                {UPCOMING.map(u => (
                  <div key={u.name} className="flex gap-4 px-5 py-3.5 border-b border-[#f7f6f3] last:border-0 items-start">
                    <div className="text-center min-w-[36px]">
                      <div className="text-[20px] font-bold text-[#0f0e0c] leading-none">{u.day}</div>
                      <div className="text-[9px] font-semibold text-[#a8a49c] uppercase tracking-wide mt-0.5">{u.month}</div>
                    </div>
                    <div className="w-px bg-[#f0ede8] self-stretch flex-shrink-0" />
                    <div>
                      <div className="text-[13px] font-semibold text-[#0f0e0c]">{u.name}</div>
                      <div className={`text-[11px] mt-0.5 ${u.alert ? 'text-red-500 font-medium' : 'text-[#a8a49c]'}`}>{u.meta}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sklad alert */}
              <div className="bg-white border border-red-100 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-red-50 bg-red-50/50 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-red-400 tracking-[1.5px] uppercase mb-0.5">Sklad — upozornění</div>
                    <div className="text-[14px] font-bold text-[#0f0e0c]">2 položky chybí</div>
                  </div>
                  <button className="text-[12px] font-semibold text-red-500">Objednat →</button>
                </div>
                <div className="px-5 py-3.5 border-b border-[#f7f6f3] flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-semibold text-[#0f0e0c]">Kartáče Ø 200 mm</div>
                    <div className="text-[11px] text-[#a8a49c] mt-0.5">Potřeba pro #1084 a #1086</div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500">0 ks</span>
                </div>
                <div className="px-5 py-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-semibold text-[#0f0e0c]">Flexi průchodky</div>
                    <div className="text-[11px] text-[#a8a49c] mt-0.5">Minimální zásoba 5 ks</div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">2 ks</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// ── DATA ──
const ZAKÁZKY = [
  { id:'1084', name:'Čištění komína', addr:'Ostrava-Poruba, Hlavní 14', client:'Novák Jiří', worker:'Martin K.', workerInitials:'MK', workerColor:'bg-amber-50 text-amber-700', status:'probíhá', progress:65, price:'4 800 Kč' },
  { id:'1085', name:'Rekonstrukce střechy', addr:'Ostrava-Hrabůvka, Závodní 88', client:'Kovář s.r.o.', worker:'Petr V.', workerInitials:'PV', workerColor:'bg-blue-50 text-blue-600', status:'čeká', progress:20, price:'38 500 Kč' },
  { id:'1086', name:'Revize průduchu', addr:'Opava, Ratibořská 22', client:'Bílková Anna', worker:'Nepřiřazeno', workerInitials:'?', workerColor:'bg-red-50 text-red-400', status:'nová', progress:0, price:'2 200 Kč' },
  { id:'1083', name:'Zdění komínové hlavy', addr:'Frýdek-Místek, Příční 5', client:'Horák Pavel', worker:'Tomáš B.', workerInitials:'TB', workerColor:'bg-green-50 text-green-700', status:'fakturace', progress:100, price:'12 400 Kč' },
]

const PEOPLE = [
  { name:'Martin Krejčí', task:'Čištění komína #1084 · Ostrava-Poruba', initials:'MK', avColor:'bg-amber-50 text-amber-700', status:'V terénu', statusColor:'text-green-600', dotColor:'bg-green-500' },
  { name:'Petr Vávra', task:'Rekonstrukce střechy #1085 · Hrabůvka', initials:'PV', avColor:'bg-blue-50 text-blue-600', status:'V terénu', statusColor:'text-green-600', dotColor:'bg-green-500' },
  { name:'Tomáš Blaha', task:'Zakázka #1083 dokončena · Vrací se', initials:'TB', avColor:'bg-green-50 text-green-700', status:'Na cestě', statusColor:'text-amber-600', dotColor:'bg-amber-400' },
  { name:'Jana Novotná', task:'Dovolená · vrací se 20. 6. 2026', initials:'JN', avColor:'bg-[#f5f4f0] text-[#a8a49c]', status:'Dovolená', statusColor:'text-[#a8a49c]', dotColor:'bg-[#d4d0c8]' },
]

const AI_ACTIONS = [
  { icon:'👤', label:'Přiřadit pracovníka k #1086', sub:'Revize Opava · 18. 6. 2026' },
  { icon:'📨', label:'Poslat upomínku zákazníkovi', sub:'Faktura #F-1081 · 12 400 Kč' },
  { icon:'📋', label:'Prodloužit BOZP certifikát', sub:'Martin Krejčí · vyprší 30. 6.' },
]

const UPCOMING = [
  { day:'16', month:'Čvn', name:'Kontrola komína #1084', meta:'15:00 · Martin Krejčí · Ostrava-Poruba', alert:false },
  { day:'18', month:'Čvn', name:'Revize průduchu #1086', meta:'Nepřiřazeno · Opava', alert:true },
  { day:'19', month:'Čvn', name:'Střecha Hrabůvka #1085', meta:'08:00 · Petr Vávra · celý den', alert:false },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'probíhá': 'bg-green-50 text-green-700',
    'čeká': 'bg-amber-50 text-amber-700',
    'nová': 'bg-blue-50 text-blue-700',
    'fakturace': 'bg-[#d4a843]/10 text-[#b8922a]',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${map[status] || 'bg-gray-50 text-gray-500'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function MetricCard({ eyebrow, value, delta, deltaType, sub, gold }: {
  eyebrow: string; value: string; delta: string; deltaType: string; sub: string; gold?: boolean
}) {
  const deltaColors: Record<string, string> = {
    up: 'bg-green-50 text-green-700',
    warn: 'bg-amber-50 text-amber-700',
    down: 'bg-red-50 text-red-600',
    neutral: '',
  }
  return (
    <div className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm">
      <div className="text-[10px] font-semibold text-[#a8a49c] tracking-[1.5px] uppercase mb-3">{eyebrow}</div>
      <div className={`text-[26px] font-bold tracking-tight leading-none ${gold ? 'bg-gradient-to-br from-[#b8922a] to-[#d4a843] bg-clip-text text-transparent' : 'text-[#0f0e0c]'}`}>{value}</div>
      <div className="flex items-center gap-2 mt-2">
        {delta && <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${deltaColors[deltaType]}`}>{delta}</span>}
        <span className="text-[11px] text-[#a8a49c]">{sub}</span>
      </div>
    </div>
  )
}

function NavLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[9px] text-white/20 tracking-[2px] uppercase px-3 py-2 font-semibold">{children}</div>
}

function NavItem({ icon, label, badge, badgeColor, active }: { icon: React.ReactNode; label: string; badge?: string; badgeColor?: string; active?: boolean }) {
  const badgeColors: Record<string, string> = { blue: 'bg-blue-500 text-white', red: 'bg-red-500 text-white' }
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] cursor-pointer transition-all ${active ? 'bg-[#d4a843]/10 text-[#d4a843] border border-[#d4a843]/15' : 'text-white/40 hover:bg-white/5 hover:text-white/70'}`}>
      <span className="w-4 text-center">{icon}</span>
      {label}
      {badge && <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColors[badgeColor || ''] || 'bg-[#d4a843] text-black'}`}>{badge}</span>}
    </div>
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
