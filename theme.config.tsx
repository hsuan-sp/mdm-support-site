import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import UserCenter from './components/features/UserCenter'
import { useLanguage } from './hooks/useLanguage'
import { translations } from './locales'
import { Globe, ChevronDown, ExternalLink, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

/**
 * Superinfo Apple MDM Hub - Theme Configuration
 * Optimized for Nextra 3.x
 */

// 1. 品牌 Logo 組件 - 強化文字顯示與保護
const Logo = () => {
  const { language } = useLanguage()
  const isZh = language === 'zh-TW'
  return (
    <div className="flex items-center gap-2 select-none group branding-logo-container">
      <img src="/logo-square.png" alt="Logo" className="h-6 w-auto transition-transform duration-500 group-hover:rotate-[360deg] shrink-0" />
      <div className="flex flex-col md:flex-row md:items-baseline md:gap-1.5 overflow-hidden">
        <span className="font-black text-[15px] md:text-[17px] text-zinc-900 dark:text-white whitespace-nowrap">
          {isZh ? '極電資訊' : 'Superinfo'}
        </span>
        <span className="hidden sm:inline font-medium text-[12px] md:text-[14px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
          {isZh ? 'Apple MDM 知識庫' : 'Apple MDM Hub'}
        </span>
      </div>
    </div>
  )
}

// 2. 導覽列翻譯腳本 - 修正路徑匹配，徹底排除 Logo
const NavTranslator = () => {
  const { language } = useLanguage()
  
  useEffect(() => {
    const timer = setTimeout(() => {
      // 僅針對導覽選單中的 a 標籤
      const navLinks = document.querySelectorAll('.nextra-nav-container a')
      const navMap: Record<string, Record<string, string>> = {
        'zh-TW': {
          '/guide': '指南',
          '/glossary': '術語表',
          '/changelog': '更新日誌'
        },
        'en': {
          '/guide': 'Guide',
          '/glossary': 'Glossary',
          '/changelog': 'Changelog'
        }
      }

      navLinks.forEach((link: any) => {
        const href = link.getAttribute('href')
        
        // 絕對保護：排除 Logo 連結 (href="/" 或包含 logo 容器)
        if (href === '/' || link.querySelector('.branding-logo-container') || link.querySelector('img')) return

        if (href && navMap[language][href]) {
          const span = link.querySelector('span')
          if (span) {
            span.textContent = navMap[language][href]
          } else if (link.childNodes.length > 0) {
            link.childNodes.forEach((node: any) => {
              if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = navMap[language][href]
              }
            })
          }
        }
      })
    }, 200)
    return () => clearTimeout(timer)
  }, [language])

  return null
}

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="p-2 w-10 h-10" />
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 md:p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800 transition-all text-zinc-500 hover:text-blue-600 dark:hover:text-amber-400 border border-zinc-200 dark:border-zinc-800 shadow-sm"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
    </button>
  )
}

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage()
  return (
    <button 
      onClick={() => setLanguage(language === 'zh-TW' ? 'en' : 'zh-TW')}
      className="flex items-center gap-1 md:gap-1.5 px-3 py-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-[11px] md:text-sm font-black text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
    >
      <Globe className="w-4 h-4" />
      <span>{language === 'zh-TW' ? '繁中' : 'EN'}</span>
    </button>
  )
}

const ResourcesDropdown = () => {
  const { language } = useLanguage()
  return (
    <div className="relative group/res hidden lg:block">
      <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-xs font-black text-zinc-500 border border-zinc-100 dark:border-zinc-800">
        <span>{language === 'zh-TW' ? '資源與服務' : 'Resources'}</span>
        <ChevronDown className="w-3 h-3 transition-transform group-hover/res:rotate-180" />
      </button>
      <div className="absolute right-0 top-full mt-2 w-[280px] origin-top-right bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/res:opacity-100 group-hover/res:scale-100 group-hover/res:pointer-events-auto transition-all duration-300 z-50 p-2">
        <div className="p-3 border-b border-zinc-50 dark:border-zinc-800">
           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{language === 'zh-TW' ? '常用連結' : 'QUICK LINKS'}</p>
        </div>
        <div className="py-1">
          <a href="https://www.superinfo.com.tw" target="_blank" className="flex items-center justify-between px-3 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 rounded-xl transition-colors">
            <span>{language === 'zh-TW' ? '極電資訊官網' : 'Official Site'}</span> <ExternalLink className="w-3 h-3 opacity-40" />
          </a>
          <a href="https://mdm.edu.tw" target="_blank" className="flex items-center justify-between px-3 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 rounded-xl transition-colors">
            <span>{language === 'zh-TW' ? '教育部 MDM 平台' : 'MOE MDM Portal'}</span> <ExternalLink className="w-3 h-3 opacity-40" />
          </a>
        </div>
      </div>
    </div>
  )
}

// 3. 完美版 Footer 組件 - 確保 100% 渲染且內容正確
const Footer = () => {
  const { language } = useLanguage()
  const t = translations[language as keyof typeof translations]?.footer || translations['zh-TW'].footer

  return (
    <div className="w-full py-16 flex flex-col items-center text-center space-y-6 mt-12 mb-8 bg-transparent">
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-widest uppercase">{t.company}</h2>
        <p className="text-[12px] md:text-[14px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em] px-4 max-w-2xl mx-auto leading-relaxed">
          {t.badges}
        </p>
      </div>
      <div className="pt-2">
        <a 
          href="https://www.superinfo.com.tw" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[15px] md:text-[17px] font-black text-blue-600 hover:text-blue-500 transition-all border-b-2 border-transparent hover:border-blue-500 pb-1"
        >
          {t.slogan}
        </a>
      </div>
      <div className="space-y-1.5 pt-10 border-t border-zinc-100 dark:border-zinc-800 w-full max-w-lg mx-auto">
        <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-600">{t.copyright}</p>
        <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-600">{t.info}</p>
      </div>
    </div>
  )
}

const config = {
  logo: <Logo />,
  logoLink: '/',
  project: { link: null },
  chat: { link: null },
  docsRepositoryBase: 'https://github.com/hsuan-sp/mdm-support-site/tree/main',
  useNextSeoProps() {
    return { titleTemplate: '%s – 極電資訊' }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    </>
  ),
  navbar: {
    extraContent: (
      <div className="flex items-center gap-1 md:gap-2">
        <NavTranslator />
        <ThemeToggle />
        <ResourcesDropdown />
        <LanguageSwitcher />
        <UserCenter />
      </div>
    ),
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  footer: {
    text: <Footer />
  },
  toc: { float: true, title: '本頁目錄' },
  search: { component: null },
  nextThemes: { defaultTheme: 'light' }
}

export default config
