"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'nextra/hooks'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { 
  User, 
  LogOut, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronDown,
  Mail,
  ExternalLink
} from 'lucide-react'

import { translations } from '@/locales'
import { useLanguage } from '@/hooks/useLanguage'
import ReportIssueDialog from '@/components/ui/ReportIssueDialog'

const UserCenter: React.FC = () => {
  const router = useRouter()
  const { language: locale } = useLanguage()
  const t = translations[locale as keyof typeof translations]?.userCenter || translations['zh-TW'].userCenter

  const { user, username, logout, isStaticPlatform } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)

  if (isStaticPlatform) return null

  const getReportData = () => {
    const isZh = locale === 'zh-TW'
    const pageTitle = typeof document !== 'undefined' ? document.title : 'MDM Support Page'
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'Unknown URL'
    
    let category = isZh ? '一般頁面' : 'General'
    if (currentUrl.includes('/glossary')) category = isZh ? '術語表' : 'Glossary'
    if (currentUrl.includes('/guide')) category = isZh ? '問答庫' : 'Q&A'

    const template = `=== PAGE ISSUE REPORT / 頁面問題回報 ===

[PAGE CONTEXT / 頁面資訊]
- Title / 標題: ${pageTitle}
- URL / 網址: ${currentUrl}
- Category / 類別: ${category}

[ISSUE TYPE / 問題類型]
(Please mark with [x] / 請在括號中填入 x)
[ ] Content Accuracy / 內容準確性
[ ] Outdated Info / 資訊過時
[ ] Translation / 翻譯建議
[ ] Technical Bug / 技術故障
[ ] Broken Link / 連結失效

[DESCRIPTION / 詳細描述]

Description:


=== END OF REPORT ===`

    const subject = `${isZh ? '[問題回報]' : '[Issue Report]'} ${pageTitle}`
    return {
      template,
      subject,
      mailto: `mailto:hsuan@superinfo.com.tw?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(template)}`
    }
  }

  const handleReportAction = () => {
    const data = getReportData()
    const start = Date.now()
    window.location.href = data.mailto

    setTimeout(() => {
      if (Date.now() - start < 2000) {
        setIsReportOpen(true)
      }
    }, 500)
    setIsOpen(false)
  }

  const reportData = getReportData()

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Report Issue Button (Desktop Only) */}
        <button 
          onClick={handleReportAction}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-[12px] font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-95 border border-red-100 dark:border-red-900/30 whitespace-nowrap"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {t.reportIssue}
        </button>

        {user ? (
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="group flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all active:scale-95"
            >
              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
                <User className="w-3 h-3" />
              </div>
              <span className="max-w-[40px] xs:max-w-[60px] md:max-w-[100px] text-zinc-700 dark:text-zinc-300 text-[11px] md:text-[13px] font-bold truncate">
                {username || user}
              </span>
              <ChevronDown className={`w-3 h-3 md:w-3.5 md:h-3.5 text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 md:w-64 bg-white dark:bg-zinc-900 rounded-[24px] md:rounded-[28px] border border-zinc-100 dark:border-zinc-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-300 origin-top-right p-2">
                  <div className="p-3 md:p-4 border-b border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 rounded-t-2xl mb-2">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t.currentUser}</p>
                    <p className="text-xs md:text-sm font-black text-zinc-800 dark:text-zinc-100 truncate">{username || user}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <button 
                      onClick={handleReportAction}
                      className="xl:hidden w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      {t.reportIssue}
                    </button>
                    
                    <button 
                      onClick={() => {
                        setIsOpen(false)
                        logout()
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.logout}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link 
            href="/login"
            className="flex items-center gap-1.5 px-3 md:px-4 py-1 md:py-1.5 bg-blue-600 text-white rounded-full text-[11px] md:text-[13px] font-bold hover:bg-blue-700 hover:shadow-xl shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 md:w-4 h-3.5 md:h-4" />
            <span>{t.login}</span>
          </Link>
        )}
      </div>

      <ReportIssueDialog 
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        template={reportData.template}
        email="hsuan@superinfo.com.tw"
        t={t}
      />
    </div>
  )
}

export default UserCenter
