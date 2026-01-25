"use client"

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
// ✅ App Router 標準引用
import { useRouter, usePathname } from 'next/navigation'
import { useLanguage } from '@/hooks/useLanguage'
import { translations } from '@/locales'
import { X, ChevronRight, Moon, Sun, Globe, ExternalLink, User as UserIcon, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useUser } from '@/hooks/useLogtoUser'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const router = useRouter()
  const pathname = usePathname() // ✅ 取得目前路徑
  const { language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // ✅ 移除 recheck
  const { user, signIn, signOut } = useUser()
  
  const t = translations[language as keyof typeof translations] || translations['zh-TW']
  const isZh = language === 'zh-TW'
  const userCenterT = (translations[language as keyof typeof translations] as any)?.userCenter || (translations['zh-TW'] as any).userCenter

  useEffect(() => {
    setMounted(true)
  }, [])

  // 處理 Body 鎖定
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [isOpen])

  const navigate = (path: string) => {
    router.push(path)
    onClose()
  }

  const navigateExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // 避免 Hydration Mismatch 與 Portal 錯誤
  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-10000 lg:hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-[90vw] max-w-md bg-white dark:bg-zinc-900 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col overflow-hidden border-l border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-18 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <img src="/logo-square.png" alt="Logo" className="h-7 w-7 object-contain" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[1rem] font-black text-zinc-900 dark:text-white leading-tight">{isZh ? '極電資訊' : 'Superinfo'}</h2>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{isZh ? 'MDM 知識庫' : 'MDM Hub'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-90">
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          
          {/* 使用者狀態區 */}
          <div className="p-1 bg-zinc-50 dark:bg-zinc-800/30 rounded-3xl border border-zinc-100 dark:border-zinc-800/50">
            {user ? (
              <div className="flex flex-col p-2 space-y-2">
                <div className="flex items-center gap-4 p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {/* ✅ 修正 TS(18048) */}
                    {user.email ? user.email[0].toUpperCase() : <UserIcon className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-none">Active Session</span>
                    {/* ✅ 修正 TS(18048) */}
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate mt-1">{user.email ?? 'Unknown User'}</span>
                  </div>
                </div>
                <button onClick={() => signOut()} className="w-full flex items-center justify-center gap-2 px-5 py-3 text-red-600 dark:text-red-400 font-black text-[13px] hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all">
                  <LogOut className="w-4 h-4" />
                  {userCenterT.logout || '登出帳號'}
                </button>
              </div>
            ) : (
              <button onClick={() => signIn()} className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-blue-600 text-white rounded-2xl font-black text-[14px] hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                {isZh ? '登入帳號系統' : 'Sign In to Access'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 常用導航 */}
          <nav className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-4 mb-2">{isZh ? '常用導航' : 'Navigation'}</h3>
            {[
              { path: '/', label: isZh ? '網站首頁' : 'Home' },
              { path: '/guide', label: isZh ? '實戰指南' : 'Guides' },
              { path: '/glossary', label: isZh ? '專有名詞' : 'Glossary' },
              { path: '/changelog', label: isZh ? '版本更新' : 'Updates' }
            ].map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all duration-300 ${
                  pathname === link.path // ✅ 使用 pathname 判斷
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 translate-x-1' 
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 hover:translate-x-1'
                }`}
              >
                <span className="text-[15px]">{link.label}</span>
              </button>
            ))}
          </nav>

          {/* 常用連結 */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-4 mb-4">{t.resources?.label || '資源與服務'}</h3>
            {t.resources?.groups?.map((group: any, idx: number) => (
              <div key={idx} className="mb-6 last:mb-0">
                <h4 className="text-[11px] font-black text-zinc-500 px-4 mb-2">{group.title}</h4>
                <div className="space-y-1">
                  {group.items.map((item: any, itemIdx: number) => (
                    <button
                      key={itemIdx}
                      onClick={() => navigateExternal(item.link)}
                      className="w-full flex items-center justify-between px-5 py-3 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all"
                    >
                      <span>{item.text}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-300" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 系統設定 */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 pb-10 space-y-4">
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{isZh ? '介面風格' : 'Appearance'}</span>
                </div>
              </button>

              <button onClick={() => setLanguage(language === 'zh-TW' ? 'en' : 'zh-TW')} className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-700/50 rounded-xl text-zinc-500">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{isZh ? '語言切換' : 'Display Language'}</span>
                </div>
                <div className="px-3 py-1 bg-white dark:bg-zinc-700 border border-zinc-200 rounded-lg text-xs font-black">
                  {language === 'zh-TW' ? 'ENGLISH' : '繁體中文'}
                </div>
              </button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  )
}
export default MobileNav