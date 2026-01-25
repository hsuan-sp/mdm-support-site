import 'nextra-theme-docs/style.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState, useMemo } from 'react'
import { LanguageProvider } from '../hooks/useLanguage'
import SecurityGuard from '../components/features/SecurityGuard'
import BackToTop from '../components/ui/BackToTop'
import Footer from '../components/layout/Footer'
import { isAuthorizedEmail } from '@/lib/auth'

const PROTECTED_PREFIXES = ['/guide', '/glossary']

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  
  const getLayout = (Component as any).getLayout || ((page: React.ReactNode) => page)

  const isProtected = useMemo(() => {
    if (router.pathname === '/' || router.pathname === '/unauthorized' || router.pathname === '/changelog') return false;
    return PROTECTED_PREFIXES.some(prefix => router.pathname.startsWith(prefix));
  }, [router.pathname])

  // 1. 執行身分檢查
  useEffect(() => {
    if (!isProtected) {
      setIsLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/logto/user')
        if (res.ok) {
          const authData = await res.json()
          const currentEmail = authData.claims?.email || authData.email || null
          
          setIsAuthenticated(authData.isAuthenticated ?? !!authData.claims?.sub)
          setUserEmail(currentEmail)
          
          console.log("[_app Debug] User Data:", authData)
        } else {
          setIsAuthenticated(false)
        }
      } catch (e) {
        // 忽略導航導致的中斷錯誤
        if (!(e instanceof TypeError)) {
          console.error("[Auth Error]:", e)
        }
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [isProtected, router.pathname])

  // 2. 授權跳轉邏輯：僅在此處控制路由，避免與 hooks 衝突
  useEffect(() => {
    if (!isLoading && isProtected) {
      if (!isAuthenticated) {
        window.location.href = '/api/logto/sign-in'
      } else if (userEmail !== null) {
        // 只有拿到 email 且判定不通過才跳轉
        if (!isAuthorizedEmail(userEmail)) {
          router.replace('/unauthorized')
        }
      }
    }
  }, [isLoading, isProtected, isAuthenticated, userEmail, router])

  // 3. 守衛渲染判斷
  // 修正：增加 userEmail !== null 檢查，防止加載瞬間的閃退
  const shouldShowGuard = isProtected && (
    isLoading || 
    !isAuthenticated || 
    (userEmail === null) || 
    !isAuthorizedEmail(userEmail)
  )

  if (shouldShowGuard) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-blue-600 bg-white dark:bg-black">
        🛡️ 安全守衛正在核對您的身分...
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