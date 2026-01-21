<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as logsData } from '../../data/changelog.data'

const { lang } = useData()

// Detect language
const isEn = computed(() => lang.value === 'en-US' || lang.value === 'en')
const currentLogs = computed(() => isEn.value ? logsData.en : logsData.zh)

const getTypeLabel = (type) => {
    // Only used for aria-label or metadata if needed
    return type ? type.toUpperCase() : 'PATCH'
}

const getTypeClass = (type) => {
    return `tag-${type || 'patch'}`
}
</script>

<template>
    <div class="changelog-container">

        <div v-for="(log, index) in currentLogs" :key="index" class="version-entry" :id="log.version">
            <div class="version-header">
                <a :href="'#' + log.version" class="version-title">
                    <h2>{{ log.version }}</h2>
                </a>
                <span class="version-date">{{ log.date }}</span>
                <!-- Optional: Show type tag if critical -->
                <!-- <span class="version-type" :class="getTypeClass(log.type)">{{ getTypeLabel(log.type) }}</span> -->
            </div>

            <div class="version-body" v-html="log.content"></div>
        </div>

        <div v-if="currentLogs.length === 0" class="empty-state">
            <p v-if="!isEn">目前沒有更新紀錄。</p>
            <p v-else>No changelogs available.</p>
        </div>

    </div>
</template>

<style scoped>
.changelog-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px 0;
}

.version-entry {
    margin-bottom: 4rem;
    position: relative;
}

.version-header {
    display: flex;
    align-items: baseline;
    gap: 16px;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--vp-c-divider);
    padding-bottom: 0.5rem;
}

.version-title {
    text-decoration: none;
    color: inherit;
}

.version-title:hover {
    text-decoration: underline;
    color: var(--vp-c-brand);
}

.version-header h2 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    font-family: var(--vp-font-family-mono);
}

.version-date {
    font-family: var(--vp-font-family-mono);
    color: var(--vp-c-text-2);
    font-size: 0.9rem;
}

/* Content Styles (Keep a Changelog standard headers: h3 for 'Added', 'Fixed', etc) */
:deep(.version-body h3) {
    font-size: 1.1rem;
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--vp-c-text-1);
}

:deep(.version-body ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 0;
}

:deep(.version-body li) {
    margin-bottom: 0.5rem;
    line-height: 1.6;
    color: var(--vp-c-text-2);
}

/* Mobile responsive */
@media (max-width: 640px) {
    .version-header {
        flex-direction: column;
        gap: 4px;
        align-items: flex-start;
    }
}
</style>
