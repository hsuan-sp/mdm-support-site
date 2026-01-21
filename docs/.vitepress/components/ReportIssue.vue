<script setup>
import { useData } from 'vitepress'
import { computed, ref } from 'vue'

const { page, lang } = useData()
const showDialog = ref(false)

const t = computed(() => {
    const isZh = lang.value === 'zh-TW' || lang.value === 'root'
    const pageTitle = page.value.title || 'Untitled'
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'Unknown URL'

    // Context Detection
    let category = isZh ? '一般頁面' : 'General'
    if (currentUrl.includes('/glossary/')) category = isZh ? '術語表' : 'Glossary'
    if (currentUrl.includes('/qa/')) category = isZh ? '問答庫' : 'Q&A'

    // Template Construction
    const bodyZh = `--- ISSUE REPORT ---
Page Info:
- Title: ${pageTitle}
- URL: ${currentUrl}
- Category: ${category}

Issue Type:
[ ] Content Error (Incorrect info)
[ ] Outdated Information (iOS 26/macOS Tahoe mismatch)
[ ] Translation Suggestion
[ ] Technical Bug
[ ] Broken Link/Image

Description:
(Please describe the issue here...)
`.trim()

    const bodyEn = `--- ISSUE REPORT ---
Page Info:
- Title: ${pageTitle}
- URL: ${currentUrl}
- Category: ${category}

Issue Type:
[ ] Content Error (Incorrect info)
[ ] Outdated Information (iOS 26/macOS Tahoe mismatch)
[ ] Translation Suggestion
[ ] Technical Bug
[ ] Broken Link/Image

Description:
(Please describe the issue here...)
`.trim()

    const subjectZh = `[問題回報] ${pageTitle}`
    const subjectEn = `[Issue Report] ${pageTitle}`

    const mailto = `mailto:hsuan@superinfo.com.tw?subject=${encodeURIComponent(isZh ? subjectZh : subjectEn)}&body=${encodeURIComponent(isZh ? bodyZh : bodyEn)}`

    return isZh ? {
        label: '回報頁面問題',
        title: '回報此頁面的錯誤或建議',
        email: 'hsuan@superinfo.com.tw',
        mailtoLink: mailto,
        dialogTitle: '回報問題',
        dialogDesc: '如無法自動開啟郵件程式，請複製以下資訊並寄送至技術團隊：',
        copyEmail: '複製 Email',
        copyTemplate: '複製模板',
        close: '關閉',
        template: bodyZh
    } : {
        label: 'Report Page Issue',
        title: 'Report errors or suggestions for this page',
        email: 'hsuan@superinfo.com.tw',
        mailtoLink: mailto,
        dialogTitle: 'Report Issue',
        dialogDesc: 'If mail client fails to open, please copy the info below and send to our team:',
        copyEmail: 'Copy Email',
        copyTemplate: 'Copy Template',
        close: 'Close',
        template: bodyEn
    }
})

const openReport = (e) => {
    // Attempt to open mailto
    const start = Date.now()
    window.location.href = t.value.mailtoLink

    // If window blur doesn't happen quickly, mailto might have failed to open a client
    setTimeout(() => {
        if (Date.now() - start < 2000) {
            showDialog.value = true
        }
    }, 500)
}

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
}
</script>

<template>
    <div class="report-issue-wrapper">
        <button class="report-link" @click="openReport" :title="t.title">
            {{ t.label }}
        </button>

        <!-- Fallback Dialog -->
        <Teleport to="body">
            <div v-if="showDialog" class="modal-overlay" @click.self="showDialog = false">
                <div class="modal-content">
                    <h3>{{ t.dialogTitle }}</h3>
                    <p class="desc">{{ t.dialogDesc }}</p>

                    <div class="field">
                        <label>Email:</label>
                        <div class="copy-box">
                            <code>{{ t.email }}</code>
                            <button @click="copyToClipboard(t.email)">{{ t.copyEmail }}</button>
                        </div>
                    </div>

                    <div class="field">
                        <label>Template:</label>
                        <div class="copy-box vertical">
                            <pre>{{ t.template }}</pre>
                            <button @click="copyToClipboard(t.template)">{{ t.copyTemplate }}</button>
                        </div>
                    </div>

                    <div class="actions">
                        <button class="close-btn" @click="showDialog = false">{{ t.close }}</button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.report-issue-wrapper {
    margin-top: 16px;
}

.report-link {
    display: inline-flex;
    align-items: center;
    font-size: 13px;
    color: var(--vp-c-text-2);
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    padding: 4px 12px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.report-link:hover {
    color: var(--vp-c-brand);
    border-color: var(--vp-c-brand);
    background-color: var(--vp-c-bg-soft);
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.modal-content {
    background: var(--vp-c-bg);
    padding: 24px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border: 1px solid var(--vp-c-divider);
}

h3 {
    margin: 0 0 12px;
    font-size: 18px;
    font-weight: 700;
}

.desc {
    font-size: 14px;
    color: var(--vp-c-text-2);
    margin-bottom: 20px;
    line-height: 1.5;
}

.field {
    margin-bottom: 16px;
}

.field label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--vp-c-text-3);
    margin-bottom: 4px;
    text-transform: uppercase;
}

.copy-box {
    display: flex;
    gap: 8px;
    align-items: center;
}

.copy-box.vertical {
    flex-direction: column;
    align-items: stretch;
}

code,
pre {
    background: var(--vp-c-bg-soft);
    padding: 8px 12px;
    border-radius: 6px;
    font-family: var(--vp-font-family-mono);
    font-size: 13px;
    border: 1px solid var(--vp-c-divider);
    flex-grow: 1;
    overflow-x: auto;
}

pre {
    white-space: pre-wrap;
    max-height: 150px;
    margin: 0 0 8px;
}

button:not(.report-link) {
    background: var(--vp-c-brand);
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
}

button:not(.report-link):hover {
    background: var(--vp-c-brand-2);
}

.actions {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
}

.close-btn {
    background: var(--vp-c-bg-soft) !important;
    color: var(--vp-c-text-1) !important;
    border: 1px solid var(--vp-c-divider) !important;
}
</style>
