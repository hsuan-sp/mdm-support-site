"use client"
import React, { useEffect, PropsWithChildren } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useLogtoUser'
import { isAuthorizedEmail } from '@/lib/auth'
import { ShieldCheck, AlertCircle } from 'lucide-react'

// 1. 將 /404 改為 /not-found 以符合 Next.js 慣例
const PUBLIC_ROUTES = ['/', '/not-found', '/unauthorized', '/changelog']

const AuthGuard = ({ children }: PropsWithChildren) => {
  const router = useRouter()
  const pathname = usePathname() 
  const { user, isLoading, isAuthenticated } = useUser()
  
  const isPublic = PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/api')

  useEffect(() => {
    // 2. 處理「未登入」：不再渲染 AuthGate，而是直接靜默跳轉到 API 登入端點
    if (!isLoading && !isPublic && !isAuthenticated) {
      console.log("[Guard] 未登入，直接執行 Logto 跳轉");
      // 確保將當前 pathname 帶入，以便登入後 Logto 能導向回正確頁面
      window.location.href = `/api/logto/sign-in?redirect=${encodeURIComponent(pathname)}`;
      return;
    }

    // 3. 處理「授權失敗」：郵件不符合白名單
    if (!isLoading && !isPublic && isAuthenticated && user?.email) {
      if (!isAuthorizedEmail(user.email)) {
        console.warn("[Guard] 郵件未獲授權，重定向至 unauthorized");
        router.replace('/unauthorized');
      }
    }
  }, [isLoading, isAuthenticated, user, isPublic, pathname, router])

  // --- 渲染邏輯 ---

  // 公開路由或已通過驗證：直接渲染
  if (isPublic || (isAuthenticated && user?.email && isAuthorizedEmail(user.email))) {
    return <>{children}</>
  }

  // 載入中或是正在跳轉的過渡狀態：顯示 Loading
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      <div className="relative">
        <div className="absolute inset-0 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
        <ShieldCheck className="relative w-12 h-12 text-blue-600 animate-bounce mb-4" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">
        {isAuthenticated ? "Verifying Authority" : "Redirecting to Security Login"}
      </p>
    </div>
  )
}

export default AuthGuard