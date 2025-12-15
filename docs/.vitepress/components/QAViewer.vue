<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { allQAData, glossaryData } from "../../data/all-data";
import type { QAItem, QASection } from "../types";
import MarkdownIt from "markdown-it";

const props = defineProps<{
  data: QASection[];
}>();

const md = new MarkdownIt();
const searchQuery = ref("");
const activeSection = ref("All");

// Extract all unique tags
const allTags = computed(() => {
  const tags = new Set<string>();
  props.data.forEach((section) => {
    section.items.forEach((item) => {
      item.tags.forEach((tag) => tags.add(tag));
    });
  });
  return Array.from(tags);
});

const sections = computed(() => ["All", ...props.data.map((s) => s.title)]);

const filteredSections = computed(() => {
  // 1. Local Page Logic (No Search)
  if (!searchQuery.value) {
    if (activeSection.value === "All") {
      return props.data;
    }
    return props.data
      .map((section) => {
        if (section.title !== activeSection.value) {
          return { ...section, items: [] };
        }
        return section;
      })
      .filter((section) => section.items.length > 0);
  }

  // 2. Global Search Logic
  const q = searchQuery.value.toLowerCase();
  const results: QASection[] = [];

  // Search Q&A
  const qaMatches: QAItem[] = [];
  allQAData.forEach((file) => {
    file.sections.forEach((section) => {
      section.items.forEach((item) => {
        if (
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          // Add source file name to key for context if needed, or just push
          // Cloning item to add contextual tag if beneficial, purely optional
           qaMatches.push({
             ...item,
             tags: [...item.tags, file.source] // Add source as a tag for context
           });
        }
      });
    });
  });

  if (qaMatches.length > 0) {
    results.push({
      title: "問答指南搜尋結果",
      items: qaMatches,
    });
  }

  // Search Glossary
  const glossaryMatches = glossaryData
    .filter((term) => {
      return (
        term.term.toLowerCase().includes(q) ||
        term.definition.toLowerCase().includes(q) ||
        term.analogy.toLowerCase().includes(q)
      );
    })
    .map((term) => ({
      id: `glossary-${term.term}`,
      question: term.term, // Map Term -> Question
      answer: `**定義**：${term.definition}\n\n**白話文**：${term.analogy}`, // Map Def -> Answer
      tags: [term.category, "術語表"],
      important: false,
    } as QAItem));

  if (glossaryMatches.length > 0) {
    results.push({
      title: "術語表搜尋結果",
      items: glossaryMatches,
    });
  }

  return results;
});

// Accordion Logic
const openItems = ref<Set<string>>(new Set());
const visibleItems = ref<Set<string>>(new Set()); // Fix: Reactive visibility tracking

const toggleItem = (id: string) => {
  if (openItems.value.has(id)) {
    openItems.value.delete(id);
  } else {
    openItems.value.add(id);
  }
};

const renderMarkdown = (text: string) => {
  return md.render(text);
};

// Smooth card reveal animation on scroll
onMounted(async () => {
  await nextTick();
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Use data-id attribute to track visibility reactively
          const id = entry.target.getAttribute('data-id');
          if (id) {
            visibleItems.value.add(id);
            // Once visible, we can stop observing it to save performance
            observer.unobserve(entry.target);
          }
        }
      });
    },
    { threshold: 0.05, rootMargin: '50px' }
  );

  document.querySelectorAll('.qa-item').forEach((el) => {
    observer.observe(el);
  });
});
</script>

<template>
  <div class="qa-app">
    <!-- Controls -->
    <div class="controls">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜尋常見問題與錯誤代碼..."
          class="search-input"
        />
      </div>

      <div class="section-pills">
        <button
          v-for="s in sections"
          :key="s"
          @click="activeSection = s"
          :class="['pill', { active: activeSection === s }]"
        >
          {{ s === 'All' ? '全部' : s }}
        </button>
      </div>
    </div>

    <!-- Results -->
    <div class="qa-content">
      <div
        v-for="section in filteredSections"
        :key="section.title"
        class="qa-section"
      >
        <div class="section-header">
          <h2 class="section-title">{{ section.title }}</h2>
          <div class="section-line"></div>
        </div>

        <div class="qa-list">
          <div
            v-for="item in section.items"
            :key="item.id"
            class="qa-item glass-panel"
            :class="{ 
              'open': openItems.has(item.id),
              'item-visible': visibleItems.has(item.id) 
            }"
            :data-id="item.id"
          >
            <div 
              class="qa-header" 
              @click="toggleItem(item.id)"
              :aria-expanded="openItems.has(item.id)"
              role="button"
            >
              <div class="header-left">
                <h3 class="qa-question">{{ item.question }}</h3>
                <span v-if="item.important" class="badge-important">重要</span>
              </div>
              <span class="expand-icon" :class="{ rotated: openItems.has(item.id) }">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </div>

            <div class="qa-content-wrapper" :class="{ 'is-open': openItems.has(item.id) }">
              <div class="qa-body">
                <div v-if="item.tags && item.tags.length" class="qa-tags">
                  <span v-for="tag in item.tags" :key="tag" class="qa-tag">{{ tag }}</span>
                </div>
                <div class="qa-answer markdown-body" v-html="renderMarkdown(item.answer)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredSections.length === 0" class="no-results">
        <div class="empty-state-icon">🧐</div>
        <p>找不到相關結果，試試其他關鍵字？</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main Layout */
.qa-app {
  padding: 0 0 60px;
  max-width: 1000px;
  margin: 0 auto;
}

/* Controls */
.controls {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
  font-size: 18px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 52px;
  border-radius: 16px;
  border: 1px solid rgba(128, 128, 128, 0.15);
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-size: 17px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 4px rgba(var(--vp-c-brand-1), 0.15);
}

.section-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pill {
  padding: 8px 16px;
  border-radius: 99px;
  background: var(--vp-c-bg-alt);
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(128, 128, 128, 0.1);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill:hover {
  background: var(--vp-c-bg-mute);
  transform: translateY(-1px);
}

.pill.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-1), 0.25);
}

/* Sections */
.qa-section {
  margin-bottom: 60px;
}

.section-header {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--vp-c-text-1) 0%, var(--vp-c-text-2) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  line-height: 1.2;
}

.section-line {
  height: 1px;
  flex: 1;
  background: linear-gradient(90deg, rgba(128,128,128,0.2), transparent);
}

.qa-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* --- Liquid Glass & Floating Aesthetics --- */

.qa-container {
  position: relative;
  /* overflow: hidden; Removed to allow sticky headers or tooltips if any */
  z-index: 1;
}

/* Background Orbs Effect */
.qa-container::before {
  content: '';
  position: fixed;
  top: 10%;
  left: -5%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0,122,255,0.12), transparent 70%);
  filter: blur(80px);
  z-index: -1;
  animation: floatOrb 20s ease-in-out infinite alternate;
  pointer-events: none;
}

.qa-container::after {
  content: '';
  position: fixed;
  bottom: 20%;
  right: -5%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255,45,85,0.08), transparent 70%);
  filter: blur(60px);
  z-index: -1;
  animation: floatOrb 15s ease-in-out infinite alternate-reverse;
  pointer-events: none;
}

@keyframes floatOrb {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(50px, 30px) scale(1.1); }
}

/* Glass Panel - Pure & Clean */
.glass-panel {
  background: rgba(var(--vp-c-bg-alt-rgb, 255,255,255), 0.65);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(128, 128, 128, 0.15);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  opacity: 0;
  transform: translateY(20px);
  position: relative;
  will-change: transform, opacity, box-shadow;
}

.glass-panel::before {
  display: none; /* Remove old gradient overlay */
}

.glass-panel.item-visible {
  opacity: 1;
  transform: translateY(0);
}

.glass-panel:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08); /* Floating elevation */
  border-color: rgba(var(--vp-c-brand-rgb, 0,122,255), 0.3);
  background: rgba(var(--vp-c-bg-rgb, 255,255,255), 0.8);
  z-index: 5;
}

/* Dark Mode Support for Glass */
@media (prefers-color-scheme: dark) {
  .glass-panel {
    background: rgba(30, 30, 30, 0.5);
    border-color: rgba(255, 255, 255, 0.1);
  }
  .glass-panel:hover {
    background: rgba(40, 40, 40, 0.7);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.glass-panel:hover::before {
  opacity: 1;
}

.qa-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 1rem;
}

.qa-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.badge-important {
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.2);
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.qa-question {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  flex: 1;
}

.icon {
  font-size: 1.5rem;
  color: var(--vp-c-text-2);
  transition: transform 0.3s ease;
}

.qa-item.open .icon {
  transform: rotate(180deg);
  color: var(--vp-c-brand-1);
}

/* Smooth expansion animation using CSS Grid */
.qa-content-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.qa-content-wrapper.is-open {
  grid-template-rows: 1fr;
}

.qa-body {
  overflow: hidden;
  padding: 0 1.5rem;
  /* FIX: Removed opacity:0/visibility:hidden to prevent disappearing content */
  opacity: 1; 
  transition: opacity 0.3s ease;
}

/* Optional: Slight fade out when closed for smoothness */
.qa-content-wrapper:not(.is-open) .qa-body {
  opacity: 0.5;
  padding-bottom: 0;
}

.qa-content-wrapper.is-open .qa-body {
  padding-bottom: 1.5rem;
  opacity: 1;
}

.qa-tags {
  margin-bottom: 0.8rem;
  padding-top: 1rem;
}

.qa-tag {
  color: var(--vp-c-brand);
  font-size: 0.85rem;
  margin-right: 0.5rem;
  font-weight: 600;
  background: rgba(var(--vp-c-brand-rgb), 0.1);
  padding: 2px 8px;
  border-radius: 6px;
}

.qa-answer {
  line-height: 1.7;
  color: var(--vp-c-text-1);
}

.tags {
  margin: 1rem 0;
  display: flex;
  gap: 0.5rem;
}

.tag {
  color: var(--vp-c-brand-1);
  font-size: 0.85rem;
  background: rgba(var(--vp-c-brand-1), 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-weight: 600;
}

/* Markdown Styles inside Accordion */
.markdown-body {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--vp-c-text-1);
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin-top: 1.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-brand-3);
}

.markdown-body :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-body :deep(strong) {
  font-weight: 700;
  color: var(--vp-c-brand-2);
}

/* Dark Mode Overrides */
:global(.dark) .search-input,
:global(.dark) .pill,
:global(.dark) .glass-panel {
  background: var(--vp-c-bg-alt);
  border-color: rgba(255, 255, 255, 0.1);
}

:global(.dark) .qa-body {
  background: rgba(255, 255, 255, 0.02);
}
</style>
