"use client"

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { translations } from '@/locales'
import ReportIssue from '@/components/features/ReportIssue'

const Footer = () => {
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const isZh = language === 'zh-TW'

  // 防止 Hydration 錯誤，確保語系正確後才渲染
  useEffect(() => {
    setMounted(true)
  }, [])

  const t = isZh ? {
    company: "極電資訊有限公司",
    badges: "Apple 授權教育經銷商｜Apple 校園體驗中心｜軟硬體專業諮詢",
    slogan: "致力於給您最好的服務",
    copyright: "Copyright © 2026 極電資訊｜Apple 授權教育經銷商",
    info: "極電資訊有限公司 | 統一編號 23756990",
  } : {
    company: "Superinfo Computer Co., Ltd.",
    badges: "Apple Authorized Education Specialist｜Apple Campus Experience Center｜Hardware & Software Advisory",
    slogan: "Committed to excellence in service",
    copyright: "Copyright © 2026 Superinfo｜Apple Authorized Education Specialist",
    info: "Superinfo Computer Co., Ltd. | Tax ID 23756990",
  }

  // 渲染時保持容器結構，但內容等 mounted 後再顯示，避免 SEO 語系閃爍
  return (
    <footer className="w-full pt-16 flex flex-col items-center text-center space-y-8 mt-20 mb-10 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-[2.5rem] px-6 py-12 transition-colors duration-300">
      <div className="space-y-4 px-4">
        <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-widest uppercase">
          {mounted ? t.company : "Superinfo"}
        </h2>
        <p className="text-[12px] md:text-[14px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
          {mounted ? t.badges : "Apple Authorized Education Specialist"}
        </p>
      </div>
      
      <div>
        <a 
          href="https://www.superinfo.com.tw" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-sm font-black text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:scale-105 active:scale-95 transition-all"
        >
          {mounted ? t.slogan : "Superinfo Service"}
        </a>
      </div>

      <div className="w-12 h-px bg-zinc-200 dark:bg-zinc-800"></div>

      <div className="space-y-3 pb-4">
        <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-600 tracking-tighter">
          {mounted ? t.copyright : "Copyright © 2026 Superinfo"}
        </p>
        <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-600 tracking-tighter">
          {mounted ? t.info : ""}
        </p>
        <div className="pt-2 opacity-80 hover:opacity-100 transition-opacity">
          <ReportIssue />
        </div>
      </div>
    </footer>
  )
}

export default Footer