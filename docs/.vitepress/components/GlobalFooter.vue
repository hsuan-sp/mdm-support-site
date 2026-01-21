<script setup>
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'

const { page, lang } = useData()

const t = computed(() => {
  const isZh = lang.value === 'zh-TW' || lang.value === 'root'
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'Unknown URL'
  const pageTitle = page.value.title || 'Unknown Page'

  // Detect Context
  let context = 'General'
  if (currentUrl.includes('/glossary/')) context = 'Glossary'
  if (currentUrl.includes('/qa/')) context = 'Q&A'

  // Construct Body
  const bodyZh = `
頁面詳細資訊 (Page Details):
- 標題: ${pageTitle}
- 網址: ${currentUrl}
- 類別: ${context}

問題類型 (請保留其中一項項目並填寫描述):
[ ] 內容準確性 - 資訊不正確或具誤導性
[ ] 資訊過時 - 內容已不符合最新版本 (iOS 26/macOS Tahoe)
[ ] 翻譯建議 - 術語或語句翻譯欠佳
[ ] 技術故障 - 佈局或功能顯示異常
[ ] 連結失效 - 圖片或外部連結失效
[ ] 其他建議

詳細描述 (Description):
(請在此處描述您遇到的具體問題...)
  `.trim()

  const bodyEn = `
Page Details:
- Title: ${pageTitle}
- URL: ${currentUrl}
- Category: ${context}

Issue Type (Please keep one):
[ ] Content Accuracy - Information is incorrect or misleading
[ ] Outdated Info - Content does not match iOS 26/macOS Tahoe
[ ] Translation - Terminology or phrasing issues
[ ] Technical Bug - Layout or functional errors
[ ] Broken Link/Image
[ ] Suggestion

Description:
(Please describe the issue...)
  `.trim()

  const subjectPrefix = isZh ? '[問題回報]' : '[Issue Report]'
  const subject = encodeURIComponent(`${subjectPrefix} ${pageTitle}`)
  const body = encodeURIComponent(isZh ? bodyZh : bodyEn)
  const mailto = `mailto:hsuan@superinfo.com.tw?subject=${subject}&body=${body}`

  return isZh ? {
    company: '極電資訊有限公司',
    badges: 'Apple 授權教育經銷商｜Apple 校園體驗中心｜軟硬體專業諮詢',
    slogan: '致力於給您最好的服務',
    copyright: 'Copyright ©2026 極電資訊｜Apple 授權教育經銷商',
    info: '極電資訊有限公司 | 統一編號 23756990',
    reportLabel: '回報頁面問題',
    reportTitle: '透過電子郵件回報此頁面的錯誤或建議',
    mailtoLink: mailto
  } : {
    company: 'Superinfo Computer Co., Ltd.',
    badges: 'Apple Authorized Education Specialist｜Apple Campus Experience Center｜Hardware & Software Advisory',
    slogan: 'Committed to excellence in service',
    copyright: 'Copyright © 2026 Superinfo｜Apple Authorized Education Specialist',
    info: 'Superinfo Computer Co., Ltd. | Tax ID 23756990',
    reportLabel: 'Report Page Issue',
    reportTitle: 'Report error or suggestion via Email',
    mailtoLink: mailto
  }
})
</script>

<template>
  <footer class="global-footer" role="contentinfo">
    <!-- Top Promo Section -->
    <div class="footer-promo">
      <h2 class="company-name">{{ t.company }}</h2>
      <p class="service-badges">{{ t.badges }}</p>
      <a href="https://www.superinfo.com.tw" target="_blank" class="slogan-link"
        title="Visit Superinfo Official Website">
        <p class="slogan">{{ t.slogan }}</p>
      </a>
    </div>

    <div class="divider" role="presentation"></div>

    <!-- Bottom Copyright Section -->
    <div class="footer-copyright">
      <p>{{ t.copyright }}</p>
      <p>{{ t.info }}</p>

      <div class="report-issue-container">
        <a :href="t.mailtoLink" class="report-link" :title="t.reportTitle">
          {{ t.reportLabel }}
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.global-footer {
  background: var(--vp-c-bg-alt);
  padding: 80px 24px 60px;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  /* Softer border */
  margin-top: 80px;
}

:global(.dark) .global-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: var(--vp-c-bg);
  /* Blend with background in dark mode */
}

/* Typography */
.company-name {
  font-size: 20px;
  /* Reduced from 28px for elegance */
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
}

.service-badges {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0 0 24px;
  font-weight: 400;
}

.slogan-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  transition: all 0.2s ease;
}

.slogan {
  font-size: 14px;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  margin: 0;
}

.slogan-link:hover {
  background: var(--vp-c-brand-soft);
  transform: translateY(-1px);
}

/* Subtle Divider */
.divider {
  height: 1px;
  width: 60px;
  background: var(--vp-c-divider);
  margin: 40px auto;
}

/* Copyright */
.footer-copyright p {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin: 4px 0;
  font-weight: 400;
}

/* Responsive */
@media (min-width: 768px) {
  .global-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

/* Report Issue Link Styles */
.report-issue-container {
  margin-top: 16px;
}

.report-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  border: 1px solid var(--vp-c-divider);
  padding: 4px 12px;
  border-radius: 16px;
  transition: all 0.2s ease;
  background-color: var(--vp-c-bg);
}

.report-link:hover {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-soft);
}

.report-link .icon {
  font-size: 14px;
}
</style>
