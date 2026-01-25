"use client"
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { Globe, ChevronDown, ExternalLink, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { translations } from '../../locales'
import UserCenter from '../features/UserCenter'
import MobileNav from './MobileNav'

// Logo 組件
export const Logo = () => {
  const { language } = useLanguage()
  const isZh = language === 'zh-TW'
  return (
    <div className="flex items-center gap-2 select-none group branding-logo-container">
      <img src="/logo-square.png" alt="Logo" className="h-5 md:h-6 w-auto transition-transform duration-500 group-hover:rotate-[360deg] shrink-0" />
      <div className="flex flex-col md:flex-row md:items-baseline md:gap-1.5 overflow-hidden">
        <span className="font-black text-zinc-900 dark:text-white whitespace-nowrap leading-tight" style={{ fontSize: 'clamp(11px, 2.5vw, 17px)' }}>
          {isZh ? '極電資訊' : 'Superinfo'}
        </span>
        <span className="font-medium text-zinc-700 dark:text-zinc-300 md:text-zinc-400 md:dark:text-zinc-500 whitespace-nowrap" style={{ fontSize: 'clamp(10px, 2vw, 14px)' }}>
          {isZh ? 'Apple MDM 知識庫' : 'Apple MDM Hub'}
        </span>
      </div>
    </div>
  )
}

// Navbar 右側功能區
export const NavbarExtra = () => {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  
  const t = translations[language as keyof typeof translations] || translations['zh-TW']

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* 手機版漢堡選單按鈕 */}
      <button 
        onClick={() => setIsMobileNavOpen(true)} 
        className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
      >
        <svg className="w-6 h-6 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* --- 桌面版專屬區塊 (lg:flex) --- */}
      <div className="hidden lg:flex items-center gap-2">
        
        {/* 1. 常用連結 (Resources Dropdown) - 恢復處 🚀 */}
        <div className="relative">
          <button
            onClick={() => setResourcesOpen(!resourcesOpen)}
            className="flex items-center gap-1.5 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all text-sm font-bold text-zinc-700 dark:text-zinc-300"
          >
            <span>{t.resources?.label || '資源'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
          </button>

          {resourcesOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setResourcesOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {t.resources?.groups.map((group: any, idx: number) => (
                  <div key={idx} className={`p-4 ${idx > 0 ? 'border-t border-zinc-100 dark:border-zinc-800' : ''}`}>
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-3">{group.title}</h3>
                    <div className="space-y-1">
                      {group.items.map((item: any, itemIdx: number) => (
                        <a
                          key={itemIdx}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all group"
                        >
                          <span className="flex-1 truncate">{item.text}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 2. 主題切換 */}
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-zinc-600" />}
          </button>
        )}

        {/* 3. 語言切換 (Language Toggle) - 恢復處 🚀 */}
        <button 
          onClick={() => setLanguage(language === 'zh-TW' ? 'en' : 'zh-TW')} 
          className="flex items-center gap-1.5 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all text-sm font-bold text-zinc-700 dark:text-zinc-300"
        >
          <Globe className="w-4 h-4" />
          <span>{language === 'zh-TW' ? 'EN' : '中文'}</span>
        </button>
      </div>

      {/* 4. 使用者中心 (頭貼與登入登出) */}
      <UserCenter />

      {/* 手機版導覽抽屜 */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </div>
  )
}