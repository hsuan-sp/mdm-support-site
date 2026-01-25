"use client"
import React, { useEffect, useState, PropsWithChildren } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@/hooks/useLogtoUser'
import { isAuthorizedEmail } from '@/lib/auth'
import AuthGate from '../ui/AuthGate'
import { ShieldCheck, AlertCircle } from 'lucide-react'

// 定義不需要檢查的公開路徑
const PUBLIC_ROUTES = ['/', '/404', '/unauthorized', '/changelog']

const AuthGuard = ({ children }: PropsWithChildren) => {
  const router = useRouter()
  const { user, isLoading, isSignedIn } = useUser()
  
  // 1. 判定是否為公開路由 (排除 API 和靜態資源)
  const isPublic = PUBLIC_ROUTES.includes(router.pathname) || router.pathname.startsWith('/api')

  // 2. 處理「授權失敗」的自動跳轉
  useEffect(() => {
    // 只有在載入完成、不是公開頁面、且已登入的情況下，才檢查 email 授權
    if (!isLoading && !isPublic && isSignedIn && user?.email) {
      if (!isAuthorizedEmail(user.email)) {
        console.warn("[Guard] 郵件未獲授權，執行重定向");
        router.replace('/unauthorized');
      }
    }
  }, [isLoading, isSignedIn, user, isPublic, router.pathname, router])

  // --- 渲染判定邏輯 ---

  // A. 公開路由：直接渲染內容
  if (isPublic) {
    return <>{children}</>
  }

  // B. 全域載入中：顯示品牌 Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
        <div className="relative">
          <div className="absolute inset-0 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <ShieldCheck className="relative w-12 h-12 text-blue-600 animate-bounce mb-4" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">
          Security Identity Verifying
        </p>
      </div>
    )
  }

  // C. 未登入：渲染 AuthGate
  if (!isSignedIn) {
    return (
      <div className="min-h-screen">
        <AuthGate />
      </div>
    )
  }

  // D. 已登入但「郵件網域不符」：顯示警告 (等待 useEffect 跳轉)
  if (user?.email && !isAuthorizedEmail(user.email)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-2xl font-black mb-2">訪問受限</h2>
        <p className="text-zinc-500 font-bold max-w-xs">
          帳號 <span className="text-blue-600">{user.email}</span> 不在授權白名單內。
        </p>
      </div>
    )
  }

  // E. 最終通過
  return <>{children}</>
}

export default AuthGuard