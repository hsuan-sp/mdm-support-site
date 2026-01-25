"use client"
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react'

type Language = 'zh-TW' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 使用 PropsWithChildren 來自動包含 children 定義
export const LanguageProvider = ({ children }: PropsWithChildren) => {
  // 預設 zh-TW
  const [language, setLanguageState] = useState<Language>('zh-TW')

  useEffect(() => {
    // 掛載後才讀取 localStorage，這是 Next.js CSR 的最佳實踐
    const saved = localStorage.getItem('preferred-language') as Language
    if (saved && (saved === 'zh-TW' || saved === 'en')) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}