import React from 'react'
import type { DocsThemeConfig } from 'nextra-theme-docs'
import Footer from './components/layout/Footer'
import { Logo, NavbarExtra } from './components/layout/NavbarItems'

/**
 * Superinfo Apple MDM Hub - Theme Configuration
 * Nextra 3.x Standard Configuration
 */

const config = {
  logo: <Logo />,
  logoLink: '/',
  project: {}, // No project link
  chat: {}, // No chat link
  docsRepositoryBase: 'https://github.com/hsuan-sp/mdm-support-site/tree/main',
  gitTimestamp: null,
  useNextSeoProps() {
    return { titleTemplate: '%s – 極電資訊' }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    </>
  ),
  navbar: {
    extraContent: <NavbarExtra />,
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: false, // 隱藏 Nextra 預設的 hamburger，使用自訂 MobileNav
  },
  footer: {
    component: null
  },
  toc: { float: true, title: '本頁目錄' },
  search: { component: null },
  nextThemes: { defaultTheme: 'light' },
  themeSwitch: {
    component: null  // 禁用 Nextra 預設深色模式切換，使用自訂的
  },
  primaryHue: 214,
  primarySaturation: 95
}

export default config
