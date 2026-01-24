"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@/hooks/useLogtoUser'
import AuthGate from '../ui/AuthGate'
import GlobalLoader from '../ui/GlobalLoader'

interface AuthGuardProps {
  children: React.ReactNode
}

const PUBLIC_ROUTES = ['/', '/404', '/unauthorized', '/api', '/_error']

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter()
  const { user, isLoading, isSignedIn } = useUser()
  const [isAuthorized, setIsAuthorized] = useState(false)

  // 檢查是否為公開路由
  const isPublicRoute = PUBLIC_ROUTES.some(path => 
    router.pathname === path || router.pathname.startsWith('/api')
  )

  useEffect(() => {
    if (isLoading) return

    // 如果是公開路由，直接放行
    if (isPublicRoute) {
      setIsAuthorized(true)
      return
    }

    // 如果未登入，顯示 AuthGate (由下方渲染邏輯處理)
    if (!user) {
      setIsAuthorized(false)
      return
    }

    // 嚴格 Email 白名單檢查
    const email = user.primaryEmail || (user as any).email || user.username || ''
    const isEdu = /\.edu\.tw$/i.test(email)
    const isOfficial = email.endsWith('@superinfo.com.tw')

    if (isEdu || isOfficial) {
      setIsAuthorized(true)
    } else {
      setIsAuthorized(false)
      // 非法網域，強制踢到 Unauthorized 頁面
      console.warn('Unauthorized domain detected via Global Guard:', email)
      router.replace('/unauthorized')
    }
  }, [isLoading, user, isPublicRoute, router.pathname])

  // 1. 載入中：顯示全域 Loader，不渲染任何內容
  if (isLoading) {
    return <GlobalLoader /> // 或者返回 null
  }

  // 2. 公開路由：直接渲染內容
  if (isPublicRoute) {
    return <>{children}</>
  }

  // 3. 受保護路由 & 未登入：顯示 AuthGate
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AuthGate />
      </div>
    )
  }

  // 4. 受保護路由 & 已登入 & 已授權：渲染內容
  if (isAuthorized) {
    return <>{children}</>
  }

  // 5. 受保護路由 & 已登入 & 未授權 (跳轉中)：不渲染內容
  return null
}

export default AuthGuard
