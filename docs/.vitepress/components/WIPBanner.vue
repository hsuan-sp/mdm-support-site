<script setup>
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const { lang, page, title: siteTitle } = useData()

// Show banner only for English version
const showBanner = computed(() => lang.value === 'en-US')
const isCollapsed = ref(true) // Start collapsed as requested by user's preference for non-intrusive UI
const isMounted = ref(false)

onMounted(() => {
    isMounted.value = true
})

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
}

const createReportLink = () => {
    if (typeof window === 'undefined') return '#'

    const currentUrl = window.location.href
    const pageTitle = page.value.title || document.title
    const category = page.value.frontmatter.category || 'General Page'

    const subject = `[Issue Report] ${pageTitle}`

    // Use %0D%0A for universal line break compatibility (win/nix/mobile)
    const nl = '%0D%0A'

    const body = `=== PROFESSIONAL ISSUE REPORT / 頁面問題回報 ===${nl}${nl}` +
        `[PAGE CONTEXT / 頁面資訊]${nl}` +
        `- Title / 標題: ${pageTitle}${nl}` +
        `- URL / 網址: ${currentUrl}${nl}` +
        `- Category / 類別: ${category}${nl}${nl}` +
        `[ISSUE TYPE / 問題類型]${nl}` +
        `(Please mark with [x] / 請在括號中填入 x)${nl}` +
        `[ ] Content Accuracy / 內容準確性 (e.g. Incorrect technical info / 技術資訊錯誤)${nl}` +
        `[ ] Outdated Info / 資訊過時 (e.g. Does not match iOS 26 specifications / 已不符 2026 規格)${nl}` +
        `[ ] Translation / 翻譯建議 (e.g. Phrasing or Terminology / 術語或語句優化)${nl}` +
        `[ ] Technical Bug / 技術故障 (e.g. Layout or Function error / 頁面功能異常)${nl}` +
        `[ ] Broken Link / 連結失效 (e.g. Image or External link / 圖片或連結失效)${nl}${nl}` +
        `[DESCRIPTION & EXAMPLES / 詳細描述與範例]${nl}` +
        `(Please describe the issue below. Example: "The DDM section in acc-11 mentions iOS 25, but it should be iOS 26.")${nl}` +
        `(請在下方詳述問題。範例：「acc-11 中的 DDM 描述提到 iOS 25，應更正為 iOS 26。」)${nl}${nl}` +
        `Description:${nl}${nl}${nl}` +
        `=== END OF REPORT ===`

    return `mailto:hsuan@superinfo.com.tw?subject=${encodeURIComponent(subject)}&body=${body}` // body is already encoded partially, but let's be safe. Wait, manual encoding of newlines is safer.
}

// Open mail client
const handleReport = () => {
    window.location.href = createReportLink()
}
</script>

<template>
    <div v-if="showBanner" class="wip-wrapper">
        <!-- Expanded Banner: Stays in layout-top (document flow) -->
        <Transition name="fade-top">
            <div v-if="!isCollapsed" class="wip-banner" role="alert">
                <div class="wip-content">
                    <div class="wip-icon">🚧</div>
                    <div class="wip-text">
                        <strong>English Version Beta</strong>
                        <span class="desktop-text">Translation Complete. 2026 specs verified.</span>
                        <span class="mobile-text">Beta Version</span>
                    </div>

                    <button class="report-btn" @click="handleReport">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                        </svg>
                        Report Issue
                    </button>

                    <button class="collapse-btn" @click.stop="toggleCollapse" aria-label="Minimize notice">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m18 15-6-6-6 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </Transition>

        <!-- Minimized Badge: Teleported into the Topbar -->
        <Teleport to=".VPNavBarTitle" v-if="isMounted && isCollapsed">
            <div class="badge-group">
                <button class="wip-navbar-badge" @click.prevent.stop="toggleCollapse" aria-label="Expand notice">
                    <span class="badge-icon">🚧</span>
                    <span class="badge-label">Beta</span>
                    <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </button>
                <button class="wip-navbar-badge report-mini" @click.prevent.stop="handleReport"
                    aria-label="Quick Report">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
/* Main Banner Styles - Fixed to super-top when expanded */
.wip-banner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(90deg, #ff9500 0%, #ffcc00 100%);
    color: #1d1d1f;
    padding: 8px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    z-index: 3000;
    box-shadow: 0 4px 20px rgba(255, 149, 0, 0.15);
    backdrop-filter: blur(10px);
}

.wip-content {
    max-width: var(--vp-layout-max-width);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    position: relative;
    padding-right: 30px;
    /* Space for collapse button */
}

.wip-icon {
    font-size: 18px;
    flex-shrink: 0;
}

.wip-text {
    display: flex;
    align-items: center;
    gap: 10px;
}

.wip-text strong {
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #000;
}

.wip-text span {
    font-size: 13px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
}

.mobile-text {
    display: none;
}

/* Report Button */
.report-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background-color: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.report-btn:hover {
    background-color: #000;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Badge Group for Navbar */
.badge-group {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-left: 8px;
    z-index: 2100;
}

.wip-navbar-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #ff9500 0%, #ffcc00 100%);
    color: #1d1d1f;
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    cursor: pointer;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    height: 24px;
}

.wip-navbar-badge:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
}

.report-mini {
    padding: 4px 6px;
    background: rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: var(--vp-c-text-1);
}

.report-mini:hover {
    background: rgba(255, 59, 48, 0.1);
    color: #ff3b30;
    border-color: #ff3b30;
}

@media (max-width: 768px) {

    .badge-label,
    .chevron {
        display: none !important;
    }

    .wip-navbar-badge {
        padding: 4px;
        width: 30px;
        justify-content: center;
    }

    .badge-group {
        margin-left: 2px;
        gap: 2px;
    }
}

.collapse-btn {
    background: transparent;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.6);
    transition: all 0.2s ease;
    padding: 0;
    position: absolute;
    right: 0;
}

.collapse-btn:hover {
    background: rgba(0, 0, 0, 0.08);
    color: #000;
}

/* Transitions */
.fade-top-enter-active,
.fade-top-leave-active {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}

.fade-top-enter-from,
.fade-top-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

@media (max-width: 768px) {
    .wip-banner {
        padding: 10px 16px;
    }

    .desktop-text {
        display: none;
    }

    .mobile-text {
        display: inline;
    }

    .wip-content {
        justify-content: space-between;
        padding-right: 0;
        gap: 8px;
    }

    .collapse-btn {
        position: relative;
        right: auto;
    }

    .report-btn span {
        display: none;
        /* Hide text on mobile */
    }

    .report-btn {
        padding: 6px;
    }
}
</style>
