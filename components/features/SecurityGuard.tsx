"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '@/hooks/useLanguage'

const SecurityGuard: React.FC = () => {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    // Anti-Copy Protection
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      console.warn("⚠️ 本站原創內容，未經授權禁止複製或側錄。")
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
        console.error("🛡️ 系統已攔截受限操作 (Security Intercepted)")
        return false
      }
    }

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      const msg = "🔒 本站內容受技術保護，禁止複製或側錄。\n\n如需引用，請聯繫：hsuan@superinfo.com.tw"
      if (e.clipboardData) {
        e.clipboardData.setData("text/plain", msg)
      }
      console.error("🛡️ 複製操作已被攔截")
      return false
    }

    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement
      // Allow selection in input fields
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return true
      }
      e.preventDefault()
      return false
    }

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // DevTools Detection
    let devtoolsOpen = false
    const detectDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      
      if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true
          console.clear()
          console.log("%c⚠️ 警告 Warning", "color: red; font-size: 40px; font-weight: bold;")
          console.log("%c請勿在此貼上或執行任何代碼！\nDo not paste or run any code here!", "font-size: 16px;")
          console.log("%c這可能導致您的帳號被盜用。\nThis could compromise your account.", "font-size: 14px; color: orange;")
        }
      } else {
        devtoolsOpen = false
      }
    }

    // Anti-Crawler: Detect headless browsers and bots
    const detectCrawler = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isSuspicious = 
        !navigator.webdriver && 
        /headless|phantom|selenium|puppeteer|chromium/i.test(userAgent)

      if (isSuspicious || navigator.webdriver) {
        console.error("🤖 自動化工具已被偵測 (Automation Detected)")
        // Optional: redirect or block access
        // window.location.href = '/'
      }
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

    // Apply protections
    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("copy", handleCopy)
    document.addEventListener("selectstart", handleSelectStart as EventListener)
    document.addEventListener("dragstart", handleDragStart)
    
    // DevTools & Crawler detection
    const devToolsInterval = setInterval(detectDevTools, 1000)
    detectCrawler()
    
    // Disable text selection globally
    document.body.style.userSelect = "none"
    document.body.style.webkitUserSelect = "none"
    ;(document.body.style as any).MozUserSelect = "none"
    ;(document.body.style as any).msUserSelect = "none"

    // Add elegant geometric pattern watermark (non-intrusive)
    const watermark = document.createElement('div')
    watermark.id = 'geometric-watermark'
    watermark.innerHTML = `
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; opacity: 0.4;">
        <defs>
          <pattern id="hexPattern" x="0" y="0" width="100" height="87" patternUnits="userSpaceOnUse">
            <path d="M50 0 L93.3 25 L93.3 62 L50 87 L6.7 62 L6.7 25 Z" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="0.5" 
                  opacity="0.15"/>
            <circle cx="50" cy="43.5" r="2" fill="currentColor" opacity="0.08"/>
          </pattern>
          <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: rgb(59, 130, 246); stop-opacity: 0.03"/>
            <stop offset="100%" style="stop-color: rgb(147, 51, 234); stop-opacity: 0.02"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexPattern)" class="dark:text-white text-zinc-900" />
      </svg>
    `
    watermark.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 1;
      user-select: none;
    `
    document.body.appendChild(watermark)

    return () => {
      try {
        // Safer cleanup with explicit checks
        document.removeEventListener("contextmenu", handleContextMenu)
        document.removeEventListener("keydown", handleKeyDown)
        document.removeEventListener("copy", handleCopy)
        document.removeEventListener("selectstart", handleSelectStart as EventListener)
        document.removeEventListener("dragstart", handleDragStart)
        
        if (devToolsInterval) {
          clearInterval(devToolsInterval)
        }
        
        // Restore user-select
        if (document.body) {
          document.body.style.userSelect = "auto"
          document.body.style.webkitUserSelect = "auto"
          ;(document.body.style as any).MozUserSelect = "auto"
          ;(document.body.style as any).msUserSelect = "auto"
        }
        
        // Remove watermark safely
        const watermarkEl = document.getElementById('geometric-watermark')
        if (watermarkEl && watermarkEl.parentNode) {
          watermarkEl.parentNode.removeChild(watermarkEl)
        }
      } catch (error) {
        console.error('SecurityGuard cleanup error:', error)
      }
    }
  }, [router, language, setLanguage])

  return null
}

export default SecurityGuard
