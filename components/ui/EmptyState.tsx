import React from 'react'
import { useRouter } from 'next/router'

interface EmptyStateProps {
  icon?: string
  title?: string
  description?: string
  actionText?: string
  onClear?: () => void
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🔍',
  title,
  description,
  actionText,
  onClear
}) => {
  const { locale } = useRouter()
  
  const t = {
    title: locale === 'en' ? 'No results found' : '找不到相關結果',
    desc: locale === 'en' 
      ? 'Please try using different keywords or check your spelling.' 
      : '請嘗試使用不同的關鍵字，或者檢查拼字是否正確。'
  }

  return (
    <div className="text-center py-20 px-6 bg-gray-50 dark:bg-zinc-900 rounded-[24px] border border-dashed border-gray-200 dark:border-zinc-800 mt-10">
      <div className="text-5xl mb-5">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title || t.title}</h3>
      <p className="text-gray-500 dark:text-zinc-400 mb-6">{description || t.desc}</p>
      {actionText && (
        <button 
          onClick={onClear}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default EmptyState
