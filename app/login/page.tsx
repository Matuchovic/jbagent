'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Nesprávný email nebo heslo.')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center p-4">

      {/* Background subtle pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-radial from-[#d4a843]/4 to-transparent blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-radial from-[#d4a843]/3 to-transparent blur-3xl" />
      </div>

      <div className="w-full max-w-[420px] relative">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1c1508] to-[#080604] border border-[#d4a843]/30 flex items-center justify-center mb-5 shadow-xl shadow-[#d4a843]/10">
            <AgentIcon size={40} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f0e0c] mb-1">
            JB AGENT
          </h1>
          <p className="text-sm text-[#a8a49c] tracking-widest uppercase font-medium">
            Software Platform
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white border border-[#e8e6e0] rounded-2xl shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="px-8 pt-8 pb-6 border-b border-[#f0ede8]">
            <p className="text-[10px] font-semibold text-[#d4a843] tracking-[2px] uppercase mb-2">
              Přihlášení
            </p>
            <h2 className="text-xl font-bold text-[#0f0e0c] tracking-tight">
              Vítejte zpět
            </h2>
            <p className="text-sm text-[#a8a49c] mt-1">
              Přihlaste se do systému JB Agent
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-5">

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-[#6b6760] tracking-wide uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jakub@jbagent.cz"
                required
                className="h-11 px-4 bg-[#f9f8f5] border border-[#e8e6e0] rounded-xl text-sm text-[#0f0e0c] placeholder:text-[#c0bdb6] outline-none focus:border-[#d4a843] focus:ring-2 focus:ring-[#d4a843]/10 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-[#6b6760] tracking-wide uppercase">
                  Heslo
                </label>
                <button
                  type="button"
                  className="text-[11px] text-[#d4a843] font-semibold hover:opacity-75 transition-opacity"
                >
                  Zapomenuté heslo?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 w-full px-4 pr-11 bg-[#f9f8f5] border border-[#e8e6e0] rounded-xl text-sm text-[#0f0e0c] placeholder:text-[#c0bdb6] outline-none focus:border-[#d4a843] focus:ring-2 focus:ring-[#d4a843]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8a49c] hover:text-[#6b6760] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="h-11 mt-1 bg-[#0f0e0c] hover:bg-[#1a1916] text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Přihlašování…
                </>
              ) : (
                'Přihlásit se'
              )}
            </button>

          </form>

          {/* Footer */}
          <div className="px-8 pb-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-[#f0ede8]" />
              <span className="text-[11px] text-[#c0bdb6] font-medium">nebo</span>
              <div className="flex-1 h-px bg-[#f0ede8]" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-10 rounded-xl border border-[#e8e6e0] flex items-center justify-center gap-2 text-sm text-[#6b6760] font-medium cursor-not-allowed opacity-50">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google (připravujeme)
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-[11px] text-[#c0bdb6] mt-6">
          © 2026 JB Agent Software · Všechna práva vyhrazena
        </p>

      </div>
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
