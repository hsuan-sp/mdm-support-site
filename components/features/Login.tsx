'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Mail, ShieldCheck, ArrowRight, Loader2, Globe, AlertCircle, CheckCircle2 } from 'lucide-react'
import { translations } from '@/locales'
import { useLanguage } from '@/hooks/useLanguage'

export default function LoginPage() {
  const router = useRouter()
  const { language: locale, setLanguage } = useLanguage()
  const t = translations[locale as keyof typeof translations]?.auth || translations['zh-TW'].auth

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
  const [health, setHealth] = useState<'online' | 'offline' | 'checking'>('checking')

  useEffect(() => {
    // Check health
    fetch('/api/auth/health')
      .then(res => res.ok ? setHealth('online') : setHealth('offline'))
      .catch(() => setHealth('offline'))
  }, [])

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: t.invalidEmail })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStep('otp')
        setMessage({ type: 'success', text: t.otpSent + ' ' + email })
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Failed to send OTP' })
      }
    } catch (e) {
      setMessage({ type: 'error', text: t.networkError })
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length < 6) return
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: otp }),
      })
      if (res.ok) {
        setStep('success')
        setMessage({ type: 'success', text: t.verifySuccess })
        setTimeout(() => router.push('/'), 1000)
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || t.verifyError })
      }
    } catch (e) {
      setMessage({ type: 'error', text: t.networkError })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" />
      </div>

      <main className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl p-10 md:p-14 rounded-[32px] border border-white dark:border-zinc-800 shadow-2xl shadow-black/10 text-center transition-all hover:-translate-y-1">
          <header className="mb-10">
            <div className="flex justify-center mb-8">
              <img src="/logo-square.png" alt="Superinfo Logo" className="w-24 h-auto drop-shadow-sm" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-zinc-900 dark:text-zinc-100">{t.title}</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: t.subtitle }} />
          </header>

          {step === 'email' && (
            <form onSubmit={sendOtp} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-zinc-400 uppercase tracking-widest ml-1">{t.emailLabel}</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="username@school.edu.tw"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-blue-500/20"
                style={{ height: '56px' }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {loading ? t.sending : t.btnSend}
              </button>
            </form>
          )}

          {(step === 'otp' || step === 'success') && (
            <form onSubmit={verifyOtp} className="space-y-6 text-left">
              <p className="text-xs font-bold text-zinc-400 text-center mb-4">{t.otpSent} <span className="text-zinc-900 dark:text-zinc-200">{email}</span></p>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-zinc-400 uppercase tracking-widest ml-1">{t.otpLabel}</label>
                <input 
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="••••••"
                  maxLength={6}
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono text-3xl font-bold text-center tracking-[0.5em] pb-3"
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || otp.length < 6}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-blue-500/20"
                style={{ height: '56px' }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                {loading ? t.verifying : t.btnVerify}
              </button>
              <button 
                type="button" 
                onClick={() => setStep('email')}
                className="w-full text-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline transition-all"
              >
                {t.changeEmail}
              </button>
            </form>
          )}

          {message && (
            <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold animate-in zoom-in-95 duration-200 ${message.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
              {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
              {message.text}
            </div>
          )}

          {/* Service Status & Controls */}
          <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800 space-y-6">
            <div className="flex items-center justify-center gap-2">
              <span className={`w-2 h-2 rounded-full ${health === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : health === 'offline' ? 'bg-red-500' : 'bg-zinc-300 animate-pulse'}`} />
              <span className="text-[11px] font-bold text-zinc-400 tracking-wider">
                {health === 'online' ? t.statusOnline : health === 'offline' ? t.statusOffline : 'CHECKING SYSTEM STATUS'}
              </span>
            </div>

            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setLanguage(locale === 'en' ? 'zh-TW' : 'en')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-zinc-800 rounded-xl text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
              >
                <Globe className="w-4 h-4" />
                {locale === 'en' ? '繁體中文' : 'English'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
