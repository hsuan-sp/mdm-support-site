"use client"
import React from 'react'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { LogIn } from 'lucide-react'
import { translations } from '@/locales'
import { useLanguage } from '@/hooks/useLanguage'

const UserCenter: React.FC = () => {
  const { language: locale } = useLanguage()
  const t = translations[locale as keyof typeof translations]?.userCenter || translations['zh-TW'].userCenter

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <SignedIn>
        <div className="flex items-center">
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 md:w-9 md:h-9"
              }
            }}
          />
        </div>
      </SignedIn>
      
      <SignedOut>
        <SignInButton mode="modal">
          <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-full text-[12px] md:text-[13px] font-bold hover:bg-blue-700 hover:shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap">
            <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>{t.login}</span>
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  )
}

export default UserCenter
