"use client"
import React from 'react'
import { useRouter } from 'nextra/hooks'
import { 
  User, Package, Smartphone, GraduationCap, Apple, Wrench, Monitor, HelpCircle, Book,
  ArrowRight, ChevronRight
} from 'lucide-react'
import { translations } from '@/locales'
import { useLanguage } from '@/hooks/useLanguage'

const iconMap: Record<string, any> = {
  User, Package, Smartphone, GraduationCap, Apple, Wrench, Monitor, HelpCircle, Book
}

// 精確還原截圖色彩
const cardStyles: Record<string, string> = {
  account: "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm",
  enrollment: "bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-transparent shadow-xl shadow-purple-500/10",
  apps: "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm",
  classroom: "bg-gradient-to-br from-[#84fab0] to-[#8fd3f4] text-zinc-900 border-transparent shadow-xl shadow-green-500/10",
  "digital-learning": "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm",
  hardware: "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm",
  mac: "bg-[#1d1d1f] text-white border-transparent shadow-xl shadow-black/20",
  "qa-education": "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm",
  glossary: "bg-gradient-to-br from-[#f6d365] to-[#fda085] text-white border-transparent shadow-xl shadow-orange-500/10"
}

const Home: React.FC = () => {
  const router = useRouter()
  const { language: locale } = useLanguage()
  const t = translations[locale as keyof typeof translations]?.home || translations['zh-TW'].home

  const handleRoute = (id: string) => {
    if (id === 'glossary') {
      router.push('/glossary')
    } else {
      router.push(`/guide#${id}`)
    }
  }

  return (
    <div className="relative isolate min-h-screen bg-white dark:bg-black overflow-x-hidden">
      {/* Hero Section - 完美還原截圖 2 */}
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20 text-center lg:px-8 lg:pt-48">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-[#ff6b00] mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          SUPERINFO APPLE MDM HUB
        </p>
        <h1 className="text-6xl font-black tracking-tight text-[#1d1d1f] dark:text-white sm:text-8xl leading-tight mb-8 animate-in fade-in slide-in-from-top-8 duration-1000 delay-100">
          {t.title}
        </h1>
        <div className="space-y-2 animate-in fade-in slide-in-from-top-12 duration-1000 delay-200">
          <p className="text-xl md:text-2xl font-bold text-zinc-500 dark:text-zinc-400">
            {t.intro1}
          </p>
          <p className="text-lg md:text-xl font-medium text-zinc-400 dark:text-zinc-500 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
            {t.intro2}
          </p>
        </div>

        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <button
            onClick={() => router.push('/guide')}
            className="w-full sm:w-auto rounded-2xl bg-[#0071e3] px-12 py-5 text-base font-bold text-white shadow-2xl shadow-blue-500/20 hover:bg-[#0077ed] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
          >
            {t.explore}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => router.push('/glossary')}
            className="text-base font-bold text-zinc-500 hover:text-[#0071e3] transition-colors flex items-center gap-1 group"
          >
            {t.searchGlossary} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Grid Section - 完美還原截圖 1 */}
      <div className="mx-auto max-w-7xl px-6 pb-40 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          {t.features.map((f: any) => {
            const Icon = iconMap[f.icon] || User
            const styleClass = cardStyles[f.id] || "bg-white dark:bg-zinc-900"
            const isWhiteCard = styleClass.includes('bg-white')
            
            return (
              <div 
                key={f.id} 
                onClick={() => handleRoute(f.id)}
                className={`group cursor-pointer relative flex flex-col justify-between rounded-[36px] p-10 border transition-all hover:shadow-2xl hover:-translate-y-2 duration-500 ${styleClass}`}
              >
                <div>
                  <div className={`mb-10 flex h-16 w-16 items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                    <Icon className="h-10 w-10 text-current opacity-90" strokeWidth={1.5} />
                  </div>
                  <p className={`text-[11px] font-black uppercase tracking-[0.2em] mb-3 opacity-60`}>
                    {f.title}
                  </p>
                  <h3 className={`text-3xl font-black mb-5 tracking-tight`}>
                    {f.subtitle}
                  </h3>
                  <p className={`text-[15px] leading-relaxed font-medium opacity-80`}>
                    {f.desc}
                  </p>
                </div>
                
                <div className="mt-8 flex justify-end">
                   {isWhiteCard && (
                     <div className="p-2 border rounded-full border-zinc-100 group-hover:border-blue-500/20 group-hover:bg-blue-50/50 transition-all">
                       <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-600" />
                     </div>
                   )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Home
