'use client'

import { useState, useEffect } from 'react'
import { Plus, Phone, Mail, Shield } from 'lucide-react'

const ROLE_LABELS: Record<string, string> = { ADMIN: 'Administrátor', MANAGER: 'Manažer', WORKER: 'Pracovník' }
const ROLE_COLORS: Record<string, string> = { ADMIN: 'bg-purple-50 text-purple-700', MANAGER: 'bg-blue-50 text-blue-700', WORKER: 'bg-gray-100 text-gray-600' }

export default function LidePage() {
  const [lide, setLide] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'WORKER', password: '' })
  const [saving, setSaving] = useState(false)

  const load = () => fetch('/api/lide').then(r => r.json()).then(d => { setLide(d); setLoading(false) })
  useEffect(() => { load() }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    await fetch('/api/lide', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false); setShowForm(false); setForm({ name: '', email: '', phone: '', role: 'WORKER', password: '' }); load()
  }

  return (
    <div className="p-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[11px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-1">Tým</div>
          <h1 className="text-[26px] font-bold text-[#0f0e0c] tracking-tight">Lidé & přístupy</h1>
          <p className="text-[14px] text-[#6b6760] mt-1">{lide.length} uživatelů v systému</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#0f0e0c] text-white px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#1a1916] transition-colors">
          <Plus size={14} /> Přidat pracovníka
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-[17px] font-bold text-[#0f0e0c] mb-5">Nový pracovník</h2>
            <form onSubmit={submit} className="flex flex-col gap-4">
              <Input label="Jméno a příjmení" value={form.name} onChange={v => setForm({...form, name: v})} required />
              <Input label="Email" type="email" value={form.email} onChange={v => setForm({...form, email: v})} required />
              <Input label="Telefon" value={form.phone} onChange={v => setForm({...form, phone: v})} />
              <Input label="Heslo" type="password" value={form.password} onChange={v => setForm({...form, password: v})} placeholder="heslo123" />
              <div>
                <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                  className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]">
                  <option value="WORKER">Pracovník</option>
                  <option value="MANAGER">Manažer</option>
                  <option value="ADMIN">Administrátor</option>
                </select>
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-10 border border-[#e8e6e0] rounded-lg text-[13px] font-medium text-[#6b6760]">Zrušit</button>
                <button type="submit" disabled={saving} className="flex-1 h-10 bg-[#0f0e0c] text-white rounded-lg text-[13px] font-semibold">{saving ? 'Ukládám...' : 'Přidat'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {loading ? <p className="text-[#a8a49c]">Načítám...</p> : lide.map((l: any) => (
          <div key={l.id} className="bg-white border border-[#e8e6e0] rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/20 flex items-center justify-center text-[15px] font-bold text-[#d4a843] flex-shrink-0">
              {l.name?.slice(0,2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[15px] font-bold text-[#0f0e0c]">{l.name}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[l.role]}`}>{ROLE_LABELS[l.role]}</span>
              </div>
              <div className="flex items-center gap-4 text-[12px] text-[#6b6760]">
                {l.email && <span className="flex items-center gap-1"><Mail size={12} />{l.email}</span>}
                {l.phone && <span className="flex items-center gap-1"><Phone size={12} />{l.phone}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] text-[#a8a49c]">Aktivní zakázky</div>
              <div className="text-[20px] font-bold text-[#0f0e0c]">{l.zakázky?.filter((z: any) => z.stav === 'PROBIHA').length || 0}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Input({ label, value, onChange, type = 'text', required = false, placeholder = '' }: any) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-[#6b6760] uppercase tracking-wide block mb-1.5">{label}</label>
      <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-10 px-3 bg-[#f9f8f5] border border-[#e8e6e0] rounded-lg text-[13px] outline-none focus:border-[#d4a843]" />
    </div>
  )
}
