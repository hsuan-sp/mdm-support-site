"use client"

import React, { useEffect, useState } from 'react'
import { LogIn, LogOut, User as UserIcon } from 'lucide-react'
// ✅ 使用 @/ 別名更符合 Next.js 15 慣例
import { translations } from '@/locales'
import { useLanguage } from '@/hooks/useLanguage'
import { useUser } from '@/hooks/useLogtoUser'

const UserCenter: React.FC = () => {
  const { language: locale } = useLanguage()
  const { user, isLoading, signIn, signOut } = useUser()
  const [mounted, setMounted] = useState(false)

  const t = translations[locale as keyof typeof translations]?.userCenter || translations['zh-TW'].userCenter

  useEffect(() => {
    setMounted(true)
  }, [])

  // 1. 骨架屏狀態
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      </div>
    )
  }

  // 2. 取得大頭貼內容 (解決 undefined 問題)
  const getAvatarContent = () => {
    // 使用 Optional Chaining 確保 email 存在
    const email = user?.email
    if (email && email.length > 0) {
      return email[0].toUpperCase()
    }
    return <UserIcon className="w-4 h-4" />
  }

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {user ? (
        <div className="flex items-center gap-2 md:gap-3">
          {/* ✅ 解決 TS(18048): 使用 ?? 確保 split 呼叫時有預設字串 */}
          <span className="hidden xl:inline text-[11px] font-black text-zinc-400 uppercase tracking-tighter opacity-60">
            {(user.email ?? 'User').split('@')[0]}
          </span>
          
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-[12px] md:text-[13px] font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95 whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden md:inline">{t.logout || '登出'}</span>
          </button>
          
          <div 
            className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/30 cursor-help select-none ring-2 ring-offset-2 ring-transparent hover:ring-blue-500 transition-all"
            title={`已登入帳號：${user.email ?? 'Unknown'}`}
          >
            {getAvatarContent()}
          </div>
        </div>
      ) : (
        <button
          onClick={() => signIn()}
          className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2.5 bg-blue-600 text-white rounded-full text-[12px] md:text-[13px] font-black hover:bg-blue-700 hover:shadow-xl shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap group"
        >
          <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-0.5 transition-transform" />
          <span>{t.login}</span>
        </button>
      )}
    </div>
  )
}

export default UserCenter