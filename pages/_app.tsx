// pages/_app.tsx
import 'nextra-theme-docs/style.css'
import '../styles/globals.css'
import React from 'react'
import type { AppProps } from 'next/app'

// ⚠️ 修正 1：引入我們新建立的全域 UserProvider
import { UserProvider } from '@/hooks/useLogtoUser' 
import { LanguageProvider } from '../hooks/useLanguage'
import AuthGuard from '@/components/features/AuthGuard'

import SecurityGuard from '@/components/features/SecurityGuard'
import BackToTop from '@/components/ui/BackToTop'
import Footer from '@/components/layout/Footer'

export default function App({ Component, pageProps }: AppProps) {
  // 修正 getLayout 定義，確保型別安全
  const getLayout = (Component as any).getLayout || ((page: React.ReactNode) => page)

  return (
    /* ⚠️ 修正 2：UserProvider 必須包在最外層 */
    <UserProvider>
      <LanguageProvider>
        <AuthGuard>
          {/* 加入 Fragment (<>...</>) 解決 TypeScript 對 children 的判定問題 */}
          <>
            <SecurityGuard />
            {getLayout(<Component {...pageProps} />)}
            <Footer />
            <BackToTop />
          </>
        </AuthGuard>
      </LanguageProvider>
    </UserProvider>
  )
}