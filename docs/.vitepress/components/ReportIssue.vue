<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

// Compute mailto link with automatic context
const mailtoLink = computed(() => {
    const recipient = 'hsuan@superinfo.com.tw'
    const subject = encodeURIComponent(`[Issue Report] ${page.value.title}`)
    // Using window.location.href properly in SSG environment
    const url = typeof window !== 'undefined' ? window.location.href : 'Unknown URL'
    const body = encodeURIComponent(`\n\nAffected Page: ${url}\n\nDescription of issue:\n`)
    return `mailto:${recipient}?subject=${subject}&body=${body}`
})
</script>

<template>
    <a :href="mailtoLink" class="report-btn" title="Report an Issue" aria-label="Report an issue via Email">
        <div class="icon-wrapper">🐞</div>
        <span class="tooltip">Report Issue</span>
    </a>
</template>

<style scoped>
.report-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #ff3b30 0%, #d70015 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(215, 0, 21, 0.4);
    z-index: 1000;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.report-btn:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 8px 25px rgba(215, 0, 21, 0.5);
    background: linear-gradient(135deg, #ff4d42 0%, #e60017 100%);
}

.report-btn:active {
    transform: scale(0.95);
}

.icon-wrapper {
    font-size: 26px;
    line-height: 1;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
}

/* Tooltip implementation */
.tooltip {
    position: absolute;
    right: 70px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.2s ease;
    pointer-events: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.report-btn:hover .tooltip {
    opacity: 1;
    transform: translateX(0);
}

@media (max-width: 768px) {
    .report-btn {
        width: 48px;
        height: 48px;
        bottom: 20px;
        right: 16px;
    }

    .icon-wrapper {
        font-size: 22px;
    }

    .tooltip {
        display: none;
        /* Hide tooltip on mobile to avoid blocking */
    }
}
</style>
