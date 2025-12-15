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
const visibleItems = ref<Set<string>>(new Set());



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

// Smooth card reveal animation
onMounted(async () => {
  await nextTick();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-id');
          if (id) {
            visibleItems.value.add(id);
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
  <div class="qa-layout">
    <!-- Sidebar Navigation (Desktop) / Horizontal Scroll (Mobile) -->
    <aside class="qa-sidebar">
      <div class="sidebar-header">
        <span class="sidebar-title">分類導覽</span>
      </div>
      <nav class="sidebar-nav">
        <button
          v-for="s in sections"
          :key="s"
          @click="activeSection = s"
          class="nav-item"
          :class="{ active: activeSection === s }"
        >
          <span class="nav-text">{{ s === 'All' ? '全部主題' : s.split('：')[1]?.split('(')[0] || s }}</span>
          <span class="nav-indicator" v-if="activeSection === s"></span>
        </button>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="qa-main">
      <!-- Hero Search Header -->
      <div class="hero-search">
        <h1 class="page-title">需要什麼協助？</h1>
        <div class="search-container">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜尋關鍵字，例如『帳號鎖定』或『VPP』..."
              class="search-input"
            />
          </div>
        </div>
      </div>

      <!-- Results Grid -->
      <div class="qa-content-area">
        <div
          v-for="section in filteredSections"
          :key="section.title"
          class="qa-section-group"
        >
          <div class="section-header-modern">
            <h2 class="modern-title">{{ section.title }}</h2>
          </div>

          <div class="qa-list-modern">
            <div
              v-for="item in section.items"
              :key="item.id"
              class="qa-card"
              :class="{ 
                'is-expanded': openItems.has(item.id),
                'is-visible': visibleItems.has(item.id) 
              }"
              :data-id="item.id"
            >
              <div 
                class="card-header" 
                @click="toggleItem(item.id)"
                role="button"
                :aria-expanded="openItems.has(item.id)"
              >
                <div class="header-content">
                  <div class="question-row">
                    <span v-if="item.important" class="status-dot important" title="重要"></span>
                    <h3 class="question-text">{{ item.question }}</h3>
                  </div>
                  <div class="tags-row" v-if="!openItems.has(item.id) && item.tags.length">
                    <span class="mini-tag" v-for="t in item.tags.slice(0,3)" :key="t">{{ t }}</span>
                  </div>
                </div>
                
                <div class="toggle-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9L12 15L18 9" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </div>

              <div class="card-body-wrapper" :style="{ maxHeight: openItems.has(item.id) ? '2000px' : '0' }">
                <div class="card-body">
                  <div class="answer-content markdown-body" v-html="renderMarkdown(item.answer)"></div>
                  <div class="card-footer" v-if="item.tags.length">
                    <span class="footer-label">相關標籤：</span>
                    <div class="footer-tags">
                      <span v-for="tag in item.tags" :key="tag" class="footer-tag">{{ tag }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="filteredSections.length === 0" class="empty-state">
           <div class="empty-icon">🔍</div>
           <p class="empty-text">找不到符合的結果</p>
           <button class="clear-search" @click="searchQuery = ''">清除搜尋</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* --- Layout --- */
.qa-layout {
  display: flex;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  align-items: flex-start;
}

/* --- Sidebar --- */
.qa-sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 100px;
  background: var(--vp-c-bg-alt);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(128,128,128,0.08);
}

.sidebar-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(128,128,128,0.1);
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: 12px;
  text-align: left;
  font-size: 15px;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
  background: transparent;
  border: none; /* Reset button borders */
  cursor: pointer;
}

.nav-item:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.nav-item.active {
  background: var(--vp-c-brand-1);
  color: white;
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-1), 0.2);
}

.nav-indicator {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
}

/* --- Main Content --- */
.qa-main {
  flex: 1;
  min-width: 0; /* Prevent flex overflow */
}

/* --- Hero Search --- */
.hero-search {
  margin-bottom: 60px;
  text-align: center;
  padding: 40px 0;
}

.page-title {
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 32px;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--vp-c-text-1) 30%, var(--vp-c-text-2) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 20px;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 60px;
  padding: 0 24px 0 56px;
  font-size: 17px;
  border-radius: 99px; /* Pill shape */
  border: 1px solid rgba(128,128,128,0.15);
  background: var(--vp-c-bg);
  box-shadow: 0 8px 32px rgba(0,0,0,0.04);
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  color: var(--vp-c-text-1);
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 12px 40px rgba(var(--vp-c-brand-1), 0.12);
  transform: translateY(-2px);
}

/* --- Section Headers --- */
.section-header-modern {
  margin-bottom: 24px;
  position: relative;
  border-bottom: 1px solid rgba(128,128,128,0.1);
  padding-bottom: 12px;
}

.modern-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
  letter-spacing: -0.01em;
}

/* --- Card Design Refined --- */
.qa-section-group {
  margin-bottom: 60px;
}

.qa-card {
  background: var(--vp-c-bg-alt);
  border: 1px solid rgba(128,128,128,0.1);
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  opacity: 0;
  transform: translateY(20px);
  position: relative;
}

.qa-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.qa-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  border-color: rgba(128,128,128,0.2);
}

.qa-card.is-expanded {
  background: var(--vp-c-bg);
  box-shadow: 0 12px 32px rgba(0,0,0,0.06);
  border-color: var(--vp-c-brand-1);
  transform: scale(1.005);
  z-index: 10;
}

.card-header {
  padding: 20px 24px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.question-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

/* Status Dot for Urgent items */
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-dot.important {
  background: #ff3b30;
  box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.15);
}

.question-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
  line-height: 1.4;
}

.tags-row {
  display: flex;
  gap: 8px;
  margin-left: 20px; /* Align with text */
}

.mini-tag {
  font-size: 12px;
  color: var(--vp-c-text-3);
  background: rgba(128,128,128,0.08);
  padding: 2px 8px;
  border-radius: 6px;
}

.toggle-icon {
  color: var(--vp-c-text-3);
  transition: transform 0.4s ease;
}

.qa-card.is-expanded .toggle-icon {
  transform: rotate(180deg);
  color: var(--vp-c-brand-1);
}

/* --- Card Body --- */
.card-body-wrapper {
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-body {
  padding: 0 24px 32px;
  border-top: 1px solid rgba(128,128,128,0.05);
}

.answer-content {
  padding-top: 24px;
  /* Removed 'opacity' transition trick to avoid visual bugs */
}

.card-footer {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px dashed rgba(128,128,128,0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.footer-label {
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.footer-tag {
  font-size: 13px;
  color: var(--vp-c-brand-1);
  background: rgba(var(--vp-c-brand-1), 0.08);
  padding: 4px 12px;
  border-radius: 20px;
}

/* --- Mobile / Responsive --- */
@media (max-width: 960px) {
  .qa-layout {
    flex-direction: column;
    padding: 20px 20px 60px;
  }
  
  .qa-sidebar {
    width: 100%;
    position: static;
    margin-bottom: 40px;
    padding: 0;
    border: none;
    background: transparent;
  }
  
  .sidebar-header {
    display: none;
  }
  
  .sidebar-nav {
    display: flex;
    overflow-x: auto;
    gap: 12px;
    padding-bottom: 12px; /* Scrollbar space */
    scrollbar-width: none; /* Firefox */
  }
  
  .sidebar-nav::-webkit-scrollbar {
    display: none;
  }
  
  .nav-item {
    width: auto;
    white-space: nowrap;
    background: var(--vp-c-bg-alt);
    border: 1px solid rgba(128,128,128,0.1);
    border-radius: 99px;
    padding: 8px 20px;
  }
  
  .nav-indicator { display: none; }
  
  .nav-item.active {
    background: var(--vp-c-brand-1);
    color: white;
  }

  .page-title {
    font-size: 32px;
  }
  
  .question-text {
    font-size: 16px;
  }
}
</style>
