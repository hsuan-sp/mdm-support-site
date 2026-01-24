import React from 'react'
import Footer from './components/layout/Footer'
import { Logo, NavbarExtra } from './components/layout/NavbarItems'

/**
 * Superinfo Apple MDM Hub - Theme Configuration
 * Optimized for Nextra 3.x
 */

const config = {
  logo: <Logo />,
  logoLink: '/',
  project: { link: null },
  chat: { link: null },
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
    toggleButton: true,
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
