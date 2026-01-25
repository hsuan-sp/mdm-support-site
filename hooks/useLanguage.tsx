"use client"
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react'
import { translations } from "@/locales"; // 👈 匯入你的翻譯檔

type Language = 'zh-TW' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations['zh-TW'] // 👈 提供一個方便的 t 函式給全域使用
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: PropsWithChildren) => {
  const [language, setLanguageState] = useState<Language>('zh-TW')

  useEffect(() => {
    const saved = localStorage.getItem('preferred-language') as Language
    if (saved && (saved === 'zh-TW' || saved === 'en')) {
      setLanguageState(saved)
    }
  }, [])

  // ✅ 核心邏輯：自動切換雙語標題
  useEffect(() => {
    // 1. 決定標題後綴 (切換：Superinfo MDM Hub / 極電資訊 MDM 資料庫)
    const suffix = language === 'en' ? 'Superinfo MDM Hub' : '極電資訊 MDM 資料庫';
    
    // 2. 決定當前頁面的前綴 (例如：術語表 / Glossary)
    // 這裡我們抓取當前 URL 路徑來匹配你的 pageTitles 鍵值
    const path = window.location.pathname.replace('/', '') || 'index';
    const pageTitle = translations[language].pageTitles[path as keyof typeof translations['en']['pageTitles']] 
                     || translations[language].pageTitles.index;

    // 3. 設定最終標題：不寫在一起，而是根據語言完全替換
    document.title = `${pageTitle} - ${suffix}`;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang)
    }
  }

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}