"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '@/hooks/useLanguage'

const SecurityGuard: React.FC = () => {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 1. Language Auto-Redirect (Only once per session)
  useEffect(() => {
    if (typeof window === "undefined") return

    const checkLanguageRedirect = () => {
      const userLang = navigator.language || (navigator as any).userLanguage || ""
      const isChinese = userLang.toLowerCase().startsWith("zh")
      const hasRedirected = sessionStorage.getItem("lang-redirect-checked")

      if (!isChinese && language === 'zh-TW' && !hasRedirected) {
        sessionStorage.setItem("lang-redirect-checked", "true")
        setLanguage('en')
        console.log("🌐 Auto-switched language to English based on browser settings.")
      }
    }

    checkLanguageRedirect()
  }, [language, setLanguage])

  // 2. Security Event Listeners
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const isForbidden =
        e.keyCode === 123 || // F12
        ((e.ctrlKey || e.metaKey) && e.keyCode === 85) || // Ctrl+U
        ((e.ctrlKey || e.metaKey) && e.keyCode === 83) || // Ctrl+S
        ((e.ctrlKey || e.metaKey) && e.keyCode === 80) || // Ctrl+P
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.metaKey && e.altKey && e.keyCode === 73) // Mac Opt+Cmd+I

      if (isForbidden) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      const msg = "🔒 本站內容受技術保護，禁止複製或側錄。\n\n如需引用，請聯繫：hsuan@superinfo.com.tw"
      if (e.clipboardData) {
        e.clipboardData.setData("text/plain", msg)
      }
    }

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("copy", handleCopy)
    document.addEventListener("dragstart", handleDragStart)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("copy", handleCopy)
      document.removeEventListener("dragstart", handleDragStart)
    }
  }, [])

  // 3. DevTools & Crawler Detection
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') return // Don't annoy dev in localhost

    let devtoolsOpen = false
    const detectDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      
      if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true
          // Only log once to avoid spamming
          console.clear()
          console.log("%c⚠️ 警告 Warning", "color: red; font-size: 40px; font-weight: bold;")
          console.log("%c請勿在此貼上或執行任何代碼！\nDo not paste or run any code here!", "font-size: 16px;")
        }
      } else {
        devtoolsOpen = false
      }
    }

    const detectCrawler = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isSuspicious = 
        !navigator.webdriver && 
        /headless|phantom|selenium|puppeteer|chromium/i.test(userAgent)

      if (isSuspicious || navigator.webdriver) {
        console.warn("🤖 Automation Detected")
      }
    }

    const intervalId = setInterval(detectDevTools, 2000) // Reduced frequency for performance
    detectCrawler()

    return () => clearInterval(intervalId)
  }, [])

  // 4. Inject Global Styles (Cleanly)
  useEffect(() => {
    const styleId = 'security-guard-styles'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.innerHTML = `
        body {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
        /* Allow selection in inputs */
        input, textarea, [contenteditable="true"] {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
        /* Hide print */
        @media print {
          body { display: none !important; }
        }
      `
      document.head.appendChild(style)
    }
    return () => {
      const style = document.getElementById(styleId)
      if (style) style.remove()
    }
  }, [])

  if (!isMounted) return null

  // Geometric Watermark rendered via React Portal or simply fixed div
  // Using pure React JSX instead of dangerously injecting HTML string
  return (
    <div 
      id="geometric-watermark" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        userSelect: 'none',
        mixBlendMode: 'multiply' // Better blending
      }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexPattern" x="0" y="0" width="100" height="87" patternUnits="userSpaceOnUse">
            <path d="M50 0 L93.3 25 L93.3 62 L50 87 L6.7 62 L6.7 25 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-zinc-200 dark:text-zinc-800" opacity="0.3"/>
            <circle cx="50" cy="43.5" r="1.5" fill="currentColor" className="text-zinc-300 dark:text-zinc-700" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexPattern)" />
      </svg>
    </div>
  )
}

export default SecurityGuard