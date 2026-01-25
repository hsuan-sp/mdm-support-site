import 'nextra-theme-docs/style.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { LanguageProvider } from '../hooks/useLanguage'
import SecurityGuard from '../components/features/SecurityGuard'
import BackToTop from '../components/ui/BackToTop'
import Footer from '../components/layout/Footer'
import { isAuthorizedEmail } from '@/lib/auth'

// 標準 Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// 定義需要保護的路徑
const PROTECTED_PATHS = ['/guide', '/glossary']

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const getLayout = (Component as any).getLayout || ((page: React.ReactNode) => page)

  // 1. 路徑判定：確保首頁完全不被攔截
  const isProtected = useMemo(() => {
    return PROTECTED_PATHS.some(path => router.pathname.startsWith(path))
  }, [router.pathname])

  // 2. 呼叫 Logto 內建的 User API
  // 這是最穩定的獲取身分方式，不會噴 500。
  const { data: user, isLoading } = useSWR(isProtected ? '/api/logto/user' : null, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  })

  // 3. 核心授權守衛 (在前端判定 Email)
  useEffect(() => {
    if (!isProtected || isLoading) return;

    // 如果沒登入 (Logto user API 會回傳 isAuthenticated: false 或 401)
    if (!user || user.isAuthenticated === false) {
      window.location.href = '/api/logto/sign-in'
      return
    }

    // 登入成功了，核對 Email 網域
    const email = user.primaryEmail || user.email || "";
    if (!isAuthorizedEmail(email)) {
      router.replace('/unauthorized')
    }
  }, [isProtected, user, isLoading, router])

  // 渲染邏輯：受保護路徑的封鎖畫面
  if (isProtected && (isLoading || !user || !isAuthorizedEmail(user.primaryEmail || user.email || ""))) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-blue-600 bg-white dark:bg-black">
        🔒 安全核對中，請稍候...
      </div>
    )
  }

  return (
    <LanguageProvider>
      <SecurityGuard />
      {getLayout(<Component {...pageProps} />)}
      <Footer />
      <BackToTop />
    </LanguageProvider>
  )
}
