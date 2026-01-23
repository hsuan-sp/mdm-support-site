"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '@/hooks/useLanguage'

const SecurityGuard: React.FC = () => {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      console.warn("⚠️ 本站原創內容，未經授權禁止複製或側錄。")
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const isForbidden =
        e.keyCode === 123 || // F12
        ((e.ctrlKey || e.metaKey) && e.keyCode === 85) || // Ctrl+U
        ((e.ctrlKey || e.metaKey) && e.keyCode === 83) || // Ctrl+S
        ((e.ctrlKey || e.metaKey) && e.keyCode === 80) || // Ctrl+P
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C
        (e.metaKey && e.altKey && e.keyCode === 73) // Mac Opt+Cmd+I

      if (isForbidden) {
        e.preventDefault()
        console.error("🛡️ 系統已攔截受限操作 (Security InterceptED)")
      }
    }

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      const msg = "🔒 本站內容受技術保護，禁止複製或側錄。"
      if (e.clipboardData) {
        e.clipboardData.setData("text/plain", msg)
      }
      console.error("🛡️ 複製操作已被攔截")
    }

    // Dynamic Language Detection
    if (typeof window !== "undefined") {
      const userLang = navigator.language || (navigator as any).userLanguage || ""
      const isChinese = userLang.toLowerCase().startsWith("zh")
      const hasRedirected = sessionStorage.getItem("lang-redirect-checked")

      if (!isChinese && language === 'zh-TW' && !hasRedirected) {
        sessionStorage.setItem("lang-redirect-checked", "true")
        setLanguage('en')
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("copy", handleCopy)
    
    document.body.style.userSelect = "none"
    document.body.style.webkitUserSelect = "none"

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("copy", handleCopy)
      document.body.style.userSelect = "auto"
      document.body.style.webkitUserSelect = "auto"
    }
  }, [router, language, setLanguage])

  return null
}

export default SecurityGuard
