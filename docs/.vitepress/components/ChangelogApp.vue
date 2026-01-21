<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as logsData } from '../../data/changelog.data'

const { lang } = useData()

// Detect language from global state
const isEn = computed(() => lang.value === 'en-US' || lang.value === 'en')
const currentLogs = computed(() => isEn.value ? logsData.en : logsData.zh)

const getTypeColor = (type) => {
    switch (type) {
        case 'major': return 'var(--vp-c-brand)';
        case 'minor': return 'var(--vp-c-green)';
        case 'patch': return 'var(--vp-c-text-2)';
        default: return 'var(--vp-c-text-2)';
    }
}
</script>

<template>
    <div class="changelog-container">
        <div class="changelog-header">
            <h1 v-if="!isEn">版本更新日誌 (Changelog)</h1>
            <h1 v-else>Changelog</h1>
            <!-- Language is handled globally, no local switch needed -->
        </div>

        <div v-for="(log, index) in currentLogs" :key="index" class="version-block">
            <div class="version-meta">
                <div class="version-number" :style="{ color: getTypeColor(log.type) }">{{ log.version }}</div>
                <div class="version-date">{{ log.date }}</div>
            </div>

            <div class="version-content" v-html="log.content"></div>
        </div>

        <hr class="divider" />

        <!-- Guidelines Section (Hardcoded or loaded? Hardcoded for simplicity as per user request to keep it professional) -->
        <div v-if="!isEn" class="guidelines">
            <h2>維護者日誌撰寫規範 (Maintainer Guidelines)</h2>

            <h3>1. 記錄原則</h3>
            <ul>
                <li><strong>重大變更 (Major Changes)</strong>: 當進行網站架構重構、核心版本升級或政策性變更時，必須記錄。</li>
                <li><strong>內容增減 (Content Modifications)</strong>: 新增文章系列、刪除過時內容或整併章節時，必須記錄。</li>
                <li><strong>豁免項目 (Exclusions)</strong>: 單一文章的錯字修正、翻譯優化、或不影響功能的樣式微調，無須在此記錄。</li>
            </ul>

            <h3>2. 版本控制標準 (Semantic Versioning)</h3>
            <ul>
                <li><strong>Major (x.0.0)</strong>: 架構重寫或不相容的變更。</li>
                <li><strong>Minor (1.x.0)</strong>: 新增功能模組或大量內容更新。</li>
                <li><strong>Patch (1.0.x)</strong>: 緊急修復 (Hotfix) 或重要錯誤修正。</li>
            </ul>

            <h3>3. 撰寫風格</h3>
            <ul>
                <li><strong>嚴肅專業</strong>: 禁止使用表情符號 (Emojis) 或非正式用語。</li>
                <li><strong>數據導向</strong>: 應包含具體的統計數字或受影響的範圍。</li>
                <li><strong>雙語對照</strong>: 所有日誌必須同步提供中英文版本。</li>
            </ul>
        </div>

        <div v-else class="guidelines">
            <h2>Maintainer Guidelines</h2>

            <h3>1. Logging Principles</h3>
            <ul>
                <li><strong>Major Changes</strong>: Must log when re-architecting the site, upgrading core versions, or
                    implementing policy changes.</li>
                <li><strong>Content Modifications</strong>: Must log when adding article series, deleting obsolete
                    content, or merging sections.</li>
                <li><strong>Exclusions</strong>: Do not log single-article typo fixes, translation polishing, or minor
                    style tweaks that do not affect functionality.</li>
            </ul>

            <h3>2. Versioning Standards (Semantic Versioning)</h3>
            <ul>
                <li><strong>Major (x.0.0)</strong>: Architecture rewrite or incompatible changes.</li>
                <li><strong>Minor (1.x.0)</strong>: New feature modules or bulk content updates.</li>
                <li><strong>Patch (1.0.x)</strong>: Critical hotfixes or significant bug corrections.</li>
            </ul>

            <h3>3. Writing Style</h3>
            <ul>
                <li><strong>Professional Tone</strong>: No emojis or informal language.</li>
                <li><strong>Data-Driven</strong>: Include specific statistics or scope of impact where applicable.</li>
                <li><strong>Bilingual</strong>: All log entries must be provided in both Traditional Chinese and
                    English.</li>
            </ul>
        </div>

    </div>
</template>

<style scoped>
.changelog-header {
    margin-bottom: 40px;
    border-bottom: 1px solid var(--vp-c-divider);
    padding-bottom: 20px;
}

.version-block {
    margin-bottom: 60px;
    border-left: 3px solid var(--vp-c-divider);
    padding-left: 24px;
    transition: all 0.3s;
}

.version-block:hover {
    border-left-color: var(--vp-c-brand);
}

.version-meta {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 16px;
}

.version-number {
    font-family: var(--vp-font-family-mono);
    font-size: 20px;
    font-weight: 700;
    color: var(--vp-c-text-1);
}

.version-date {
    font-size: 14px;
    color: var(--vp-c-text-3);
    font-family: var(--vp-font-family-mono);
}

/* Styles for injected HTML content */
:deep(.version-content h3) {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--vp-c-text-1);
}

:deep(.version-content h4) {
    margin: 24px 0 12px 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--vp-c-text-1);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--vp-c-divider);
    padding-bottom: 6px;
    display: inline-block;
}

:deep(.version-content ul) {
    padding-left: 18px;
    margin: 0;
}

:deep(.version-content li) {
    margin-bottom: 8px;
    line-height: 1.6;
    color: var(--vp-c-text-2);
    font-size: 15px;
}

:deep(.version-content p) {
    color: var(--vp-c-text-2);
    line-height: 1.6;
    margin-bottom: 16px;
}

:deep(.status-grid) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

:deep(.status-item) {
    background: var(--vp-c-bg-soft);
    padding: 12px 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
}

:deep(.status-item .label) {
    font-size: 12px;
    color: var(--vp-c-text-3);
    margin-bottom: 4px;
    font-weight: 500;
}

:deep(.status-item .value) {
    font-size: 18px;
    font-weight: 700;
    color: var(--vp-c-brand);
    font-family: var(--vp-font-family-mono);
}

.divider {
    margin: 60px 0;
    border: none;
    border-top: 1px solid var(--vp-c-divider);
}

.guidelines {
    background: var(--vp-c-bg-soft);
    padding: 30px;
    border-radius: 8px;
}

.guidelines h2 {
    margin-top: 0;
    font-size: 20px;
    border-bottom: 1px solid var(--vp-c-divider);
    padding-bottom: 12px;
    margin-bottom: 20px;
}

.guidelines h3 {
    font-size: 16px;
    margin-top: 24px;
    margin-bottom: 12px;
}
</style>
