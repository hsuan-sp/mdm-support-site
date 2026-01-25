"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@/hooks/useLogtoUser'
import { isAuthorizedEmail } from '@/lib/auth'
import AuthGate from '../ui/AuthGate'
import { ShieldCheck } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

const PUBLIC_ROUTES = ['/', '/404', '/unauthorized', '/api', '/_error', '/changelog']

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter()
  const { user, isLoading } = useUser()
  const [isAuthorized, setIsAuthorized] = useState(false)

  // 1. 檢查是否為公開路由
  const isPublicRoute = PUBLIC_ROUTES.some(path => 
    router.pathname === path || router.pathname.startsWith('/api') || router.asPath === '/'
  )

  useEffect(() => {
    if (isLoading) return

    // 如果是公開路由，直接放行
    if (isPublicRoute) {
      setIsAuthorized(true)
      return
    }

    // 如果未登入，這裡不處理跳轉，交由下方渲染邏輯顯示 AuthGate
    if (!user) {
      setIsAuthorized(false)
      return
    }

    /**
     * 修正後的 Email 提取邏輯
     * Logto 的 user 對象中，email 可能存在於不同的欄位
     * 優先順序：claims.email > primaryEmail > email
     */
    const email = (user as any).claims?.email || 
                  user.primaryEmail || 
                  (user as any).email || 
                  '';

    // 進行白名單檢查
    if (isAuthorizedEmail(email)) {
      setIsAuthorized(true)
    } else {
      setIsAuthorized(false)
      // 避免無限循環檢查
      if (router.pathname !== '/unauthorized') {
        console.warn('Unauthorized email detected:', email)
        router.replace('/unauthorized')
      }
    }
  }, [isLoading, user, isPublicRoute, router.pathname, router])

  // --- 渲染邏輯 ---

  // A. 公開路由：優先不檢查身分，實現秒開
  if (isPublicRoute) {
    return <>{children}</>
  }

  // B. 載入中：對受保護頁面顯示品牌加載畫面
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute inset-0 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40">
            <ShieldCheck className="w-7 h-7 text-white animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
        </div>
        <p className="text-zinc-400 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">
          Secure Authenticating
        </p>
      </div>
    )
  }

  // C. 已登入且通過白名單檢查
  if (user && isAuthorized) {
    return <>{children}</>
  }

  // D. 已登入但「未」通過白名單：由 useEffect 處理跳轉，此處返回空避免閃爍
  if (user && !isAuthorized) {
    return null
  }

  // E. 受保護路由 & 未登入：顯示 AuthGate
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthGate />
    </div>
  )
}

export default AuthGuard