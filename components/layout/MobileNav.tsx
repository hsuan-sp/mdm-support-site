"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '@/hooks/useLanguage'
import { translations } from '@/locales'
import { X, ChevronRight, Moon, Sun, Globe, ExternalLink } from 'lucide-react'
import { useTheme } from 'next-themes'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const t = translations[language as keyof typeof translations] || translations['zh-TW']
  const isZh = language === 'zh-TW'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const navigate = (path: string) => {
    router.push(path)
    onClose()
  }

  const navigateExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-white dark:bg-zinc-900 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <img src="/logo-square.png" alt="Logo" className="h-8 w-8" />
            <div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">
                {isZh ? '極電資訊' : 'Superinfo'}
              </h2>
              <p className="text-xs font-medium text-zinc-500">
                {isZh ? 'Apple MDM 知識庫' : 'Apple MDM Hub'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User Section */}
          <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <SignedIn>
              <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                <UserButton afterSignOutUrl="/" />
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  {isZh ? '已登入' : 'Signed In'}
                </span>
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">
                  {isZh ? '登入' : 'Sign In'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => navigate('/')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
                router.pathname === '/' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>{isZh ? '首頁' : 'Home'}</span>
              {router.pathname === '/' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
            </button>

            <button
              onClick={() => navigate('/guide')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
                router.pathname === '/guide' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>{isZh ? '指南' : 'Guide'}</span>
              {router.pathname === '/guide' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
            </button>

            <button
              onClick={() => navigate('/glossary')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
                router.pathname === '/glossary' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>{isZh ? '術語表' : 'Glossary'}</span>
              {router.pathname === '/glossary' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
            </button>

            <button
              onClick={() => navigate('/changelog')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
                router.pathname === '/changelog' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>{isZh ? '更新日誌' : 'Changelog'}</span>
              {router.pathname === '/changelog' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
            </button>
          </nav>

          {/* Resources Section */}
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 px-4 mb-3">
              {t.resources?.label || '資源與服務'}
            </h3>
            
            {t.resources?.groups.map((group, idx) => (
              <div key={idx} className="mb-6">
                <h4 className="text-sm font-bold text-zinc-600 dark:text-zinc-400 px-4 mb-2">
                  {group.title}
                </h4>
                <div className="space-y-1">
                  {group.items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={() => navigateExternal(item.link)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all group"
                    >
                      <span className="truncate pr-2">{item.text}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 px-4 mb-3">
              {isZh ? '設定' : 'Settings'}
            </h3>
            
            {/* Theme Toggle */}
            {mounted && (
              <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    {isZh ? '深色模式' : 'Dark Mode'}
                  </span>
                </div>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`relative w-12 h-6 rounded-full transition-all ${
                    theme === 'dark' ? 'bg-blue-600' : 'bg-zinc-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            )}

            {/* Language Toggle */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  {isZh ? '語言' : 'Language'}
                </span>
              </div>
              <button
                onClick={() => setLanguage(language === 'zh-TW' ? 'en' : 'zh-TW')}
                className="px-3 py-1.5 bg-white dark:bg-zinc-700 rounded-lg text-sm font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600 hover:border-blue-500 transition-all"
              >
                {language === 'zh-TW' ? 'EN' : '中文'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNav
