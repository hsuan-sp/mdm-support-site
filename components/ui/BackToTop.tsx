"use client"

import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 使用 throttle 的概念簡單優化滾動監聽
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const handleScroll = () => {
      if (timeoutId) return

      timeoutId = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
        
        // 只有在 scrollHeight > 0 的情況下計算百分比，避免除以零
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
        
        // 滾動超過 15% 就顯示，增加易用性
        setVisible(scrollPercentage > 15)
        timeoutId = null
      }, 100) // 每 100ms 檢查一次，平衡效能與靈敏度
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-500/40 flex items-center justify-center z-150 transition-all duration-500 transform ${
        visible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-16 opacity-0 scale-75 pointer-events-none'
      } hover:bg-blue-700 hover:scale-110 active:scale-90 group`}
      aria-label="Back to Top"
    >
      {/* 呼吸波紋動畫 */}
      <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25 group-hover:hidden" />
      
      {/* 內圈裝飾 */}
      <div className="absolute inset-1 rounded-full border border-white/20 pointer-events-none" />
      
      <ArrowUp className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-y-1.5 transition-transform duration-300" />
    </button>
  )
}

export default BackToTop