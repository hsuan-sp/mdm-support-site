"use client"
import React, { useEffect, useState } from 'react'
// 使用別名 UserIcon 避免與資料變數 user 混淆
import { LogIn, LogOut, User as UserIcon } from 'lucide-react'
import { translations } from '../../locales'
import { useLanguage } from '../../hooks/useLanguage'
import { useUser } from '../../hooks/useLogtoUser'

const UserCenter: React.FC = () => {
  const { language: locale } = useLanguage()
  const { user, isLoading, signIn, signOut } = useUser()
  
  // 💡 關鍵：解決 Next.js 15 的 Hydration 錯誤
  const [mounted, setMounted] = useState(false)

  const t = translations[locale as keyof typeof translations]?.userCenter || translations['zh-TW'].userCenter

  useEffect(() => {
    setMounted(true)
  }, [])

  // 1. 載入中或是尚未在瀏覽器掛載時，顯示骨架屏 (Skeleton)
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      </div>
    )
  }

  // 2. 取得大頭貼內容
  const getAvatarContent = () => {
    if (user?.email && user.email.length > 0) {
      return user.email[0].toUpperCase()
    }
    return <UserIcon className="w-4 h-4" />
  }

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {user ? (
        <div className="flex items-center gap-2 md:gap-3">
          {/* 在桌機版顯示當前 Email 的一部分或是全部，增加儀表板感 */}
          <span className="hidden xl:inline text-[11px] font-black text-zinc-400 uppercase tracking-tighter opacity-60">
            {user.email.split('@')[0]}
          </span>
          
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-[12px] md:text-[13px] font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95 whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden md:inline">{t.logout || '登出'}</span>
          </button>
          
          <div 
            className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/30 cursor-help select-none ring-2 ring-offset-2 ring-transparent hover:ring-blue-500 transition-all"
            title={`已登入帳號：${user.email}`}
          >
            {getAvatarContent()}
          </div>
        </div>
      ) : (
        <button
          onClick={signIn}
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