"use client"

import React from 'react'
import { SearchX } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface EmptyStateProps {
  icon?: React.ReactNode // ✅ 允許傳入 Lucide Icon 或 Emoji
  title?: string
  description?: string
  actionText?: string
  onClear?: () => void
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onClear
}) => {
  // ✅ 改用專案統一的 useLanguage 獲取語系
  const { language: locale } = useLanguage()
  
  const defaultText = {
    title: locale === 'en' ? 'No results found' : '找不到相關結果',
    desc: locale === 'en' 
      ? 'Please try using different keywords or check your spelling.' 
      : '請嘗試使用不同的關鍵字，或者檢查拼字是否正確。'
  }

  return (
    <div className="text-center py-20 px-6 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-4xl border border-zinc-200/50 dark:border-white/5 mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-[28px] flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
          {icon || <SearchX className="w-10 h-10" />}
        </div>
      </div>
      
      <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-3 tracking-tight">
        {title || defaultText.title}
      </h3>
      
      <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto leading-relaxed font-medium text-sm md:text-base">
        {description || defaultText.desc}
      </p>
      
      {actionText && (
        <button 
          onClick={onClear}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default EmptyState