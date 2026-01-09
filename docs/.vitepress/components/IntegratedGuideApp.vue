<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRoute } from "vitepress";
import { allQAData } from "../../data/all-data";
import type { QAItem } from "../types";
import MarkdownIt from "markdown-it";

const route = useRoute();

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true // 確保單次換行也會生效
});

// State
const searchQuery = ref("");
const activeSource = ref(allQAData[0].source);
const isSidebarOpen = ref(false);
const fontScale = ref(1); // 使用比例來控制全域大小

const handleHashChange = () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const hashMap: Record<string, string> = {
        'account': '帳號與伺服器', 'enrollment': '裝置註冊', 'apps': 'App 管理',
        'classroom': '課堂管理', 'digital': '數位精進', 'hardware': '硬體排除',
        'mac': 'Mac 管理', 'education': '教育實戰'
    };
    if (hashMap[hash]) {
        activeSource.value = hashMap[hash];
        searchQuery.value = '';
    }
};

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return null;
  const query = searchQuery.value.trim().toLowerCase();
  const results: { source: string, items: QAItem[] }[] = [];
  allQAData.forEach(file => {
    const matches = [];
    file.sections.forEach(s => s.items.forEach(i => {
      if ((i.question + i.answer).toLowerCase().includes(query)) matches.push({...i, tags: [...i.tags, file.source]});
    }));
    if (matches.length) results.push({ source: file.source, items: matches });
  });
  return results;
});

const currentModule = computed(() => allQAData.find(d => d.source === activeSource.value));
const openItems = ref(new Set<string>());

const toggleItem = (id: string) => {
  const next = new Set(openItems.value);
  next.has(id) ? next.delete(id) : next.add(id);
  openItems.value = next;
};

const renderMarkdown = (text: string) => {
  if (!text) return "";
  // 保持原始換行，僅移除模板字串造成的全局縮排
  const lines = text.split('\n');
  const minIndent = lines.filter(l => l.trim()).reduce((min, line) => {
    const match = line.match(/^\s*/);
    return Math.min(min, match ? match[0].length : min);
  }, Infinity);
  const cleaned = lines.map(line => line.slice(minIndent)).join('\n');
  return md.render(cleaned);
};

onMounted(() => {
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
});

const switchModule = (source: string) => {
  activeSource.value = source;
  searchQuery.value = '';
  isSidebarOpen.value = false;
  openItems.value.clear();
};
</script>

<template>
  <div class="guide-app" :style="{ '--app-scale': fontScale }">
    <!-- 頂部頁首 -->
    <header class="page-header">
        <h1>MDM 實戰指南</h1>
        <p>優質教育場域管理指南，全方位問題解答。</p>
        
        <!-- 字體控制與工具列 -->
        <div class="toolbar">
            <div class="font-controls">
                <span>字體調整：</span>
                <button @click="fontScale = 0.9" :class="{active: fontScale === 0.9}">小</button>
                <button @click="fontScale = 1.0" :class="{active: fontScale === 1.0}">中</button>
                <button @click="fontScale = 1.2" :class="{active: fontScale === 1.2}">大</button>
            </div>
        </div>
    </header>

    <div class="app-layout">
      <!-- 簡化後的側邊欄 -->
      <aside class="app-sidebar">
        <div class="search-section">
            <input v-model="searchQuery" type="text" placeholder="🔍 搜尋問答..." class="search-input" />
        </div>
        <nav class="nav-menu">
            <button 
                v-for="module in allQAData" :key="module.source"
                @click="switchModule(module.source)"
                :class="['nav-item', { active: activeSource === module.source && !searchQuery }]"
            >
                {{ module.source }}
            </button>
        </nav>
      </aside>

      <!-- 主要内容 -->
      <main class="app-content">
        <!-- 搜尋模式 -->
        <div v-if="searchQuery" class="result-container">
            <h2 class="title-text">搜尋結果：{{ searchQuery }}</h2>
            <div v-for="group in searchResults" :key="group.source" class="module-group">
                <h3 class="group-label">{{ group.source }}</h3>
                <div v-for="item in group.items" :key="item.id" class="qa-item" :class="{ open: openItems.has(item.id) }">
                    <div class="qa-trigger" @click="toggleItem(item.id)">
                        <span v-if="item.important" class="imp-tag">重要</span>
                        <span class="q-text">{{ item.question }}</span>
                        <span class="arrow">▼</span>
                    </div>
                    <div v-if="openItems.has(item.id)" class="qa-content">
                        <div class="markdown-body" v-html="renderMarkdown(item.answer)"></div>
                        <div class="tags"><span v-for="t in item.tags" :key="t" class="tag">#{{ t }}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 模組瀏覽模式 -->
        <div v-else class="module-view">
            <h2 class="title-text">{{ currentModule?.source }}</h2>
            <div v-for="section in currentModule?.sections" :key="section.title" class="section-block">
                <h3 class="section-label">{{ section.title }}</h3>
                <div v-for="item in section.items" :key="item.id" class="qa-item" :class="{ open: openItems.has(item.id) }">
                    <div class="qa-trigger" @click="toggleItem(item.id)">
                        <div class="q-main">
                          <span v-if="item.important" class="imp-tag">重要</span>
                          <span class="q-text">{{ item.question }}</span>
                        </div>
                        <span class="arrow">▼</span>
                    </div>
                    <div v-if="openItems.has(item.id)" class="qa-content">
                        <div class="markdown-body" v-html="renderMarkdown(item.answer)"></div>
                        <div class="tags"><span v-for="t in item.tags" :key="t" class="tag">#{{ t }}</span></div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>

    <!-- 行動版選單 -->
    <button class="mobile-menu-btn" @click="isSidebarOpen = !isSidebarOpen">
      {{ isSidebarOpen ? '關閉' : '章節選單' }}
    </button>
    <div v-if="isSidebarOpen" class="mobile-nav-overlay" @click="isSidebarOpen = false">
      <div class="mobile-nav-content" @click.stop>
        <div class="mobile-search"><input v-model="searchQuery" type="text" placeholder="搜尋..." /></div>
        <div v-for="m in allQAData" :key="m.source" @click="switchModule(m.source)" class="m-nav-item" :class="{active: activeSource === m.source}">
          {{ m.source }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 全域比例控制 */
.guide-app {
    --base-size: calc(16px * var(--app-scale));
    font-size: var(--base-size);
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    color: var(--vp-c-text-1);
    line-height: 1.6;
}

.page-header { text-align: center; margin-bottom: 40px; }
.page-header h1 { font-size: 2.5em; font-weight: 800; color: var(--vp-c-brand-1); margin-bottom: 0.5em; }

/* 工具列 */
.toolbar {
    display: flex;
    justify-content: center;
    background: var(--vp-c-bg-soft);
    padding: 10px 20px;
    border-radius: 50px;
    margin: 20px auto;
    width: fit-content;
    border: 1px solid var(--vp-c-divider);
}
.font-controls { display: flex; align-items: center; gap: 10px; font-size: 0.9em; }
.font-controls button {
    padding: 4px 12px;
    border: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg);
    border-radius: 4px;
    cursor: pointer;
}
.font-controls button.active { background: var(--vp-c-brand-1); color: white; border-color: var(--vp-c-brand-1); }

/* 佈局 */
.app-layout { display: grid; grid-template-columns: 240px 1fr; gap: 40px; }
@media (max-width: 900px) { .app-layout { grid-template-columns: 1fr; } .app-sidebar { display: none; } }

/* 側邊欄 */
.app-sidebar { position: sticky; top: 100px; height: fit-content; }
.search-input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--vp-c-divider); margin-bottom: 20px; background: var(--vp-c-bg-soft); }
.nav-item { 
    display: block; width: 100%; text-align: left; padding: 12px; border: none; 
    background: transparent; cursor: pointer; border-radius: 8px; margin-bottom: 4px;
    font-size: 0.95em; color: var(--vp-c-text-2); transition: 0.2s;
}
.nav-item.active { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); font-weight: 700; }

/* 問答卡片 */
.qa-item { border: 1px solid var(--vp-c-divider); border-radius: 12px; margin-bottom: 15px; overflow: hidden; background: var(--vp-c-bg-alt); transition: 0.3s; }
.qa-item.open { border-color: var(--vp-c-brand-1); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.qa-trigger { padding: 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; }
.q-main { display: flex; align-items: flex-start; gap: 10px; flex: 1; }
.q-text { font-size: 1.1em; font-weight: 700; line-height: 1.4; color: var(--vp-c-text-1); }
.imp-tag { font-size: 0.7em; background: #ff3b30; color: white; padding: 2px 6px; border-radius: 4px; flex-shrink: 0; }
.arrow { color: var(--vp-c-text-3); transition: 0.3s; }
.qa-item.open .arrow { transform: rotate(180deg); color: var(--vp-c-brand-1); }

/* 內容樣式 */
.qa-content { padding: 0 20px 20px; border-top: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); }
.markdown-body { 
    font-size: 1em; line-height: 1.8; color: var(--vp-c-text-1); 
    padding-top: 20px;
    /* 核心修復：強制尊重原始換行 */
    white-space: normal;
}
.markdown-body :deep(p) { margin-bottom: 1.2em; }
.markdown-body :deep(li) { margin-bottom: 0.5em; }
.markdown-body :deep(strong) { color: var(--vp-c-brand-1); font-weight: 800; }

.tags { margin-top: 15px; display: flex; gap: 8px; flex-wrap: wrap; }
.tag { font-size: 0.8em; color: var(--vp-c-text-3); font-style: italic; }

.section-label { font-size: 1.5em; margin: 40px 0 20px; padding-bottom: 10px; border-bottom: 2px solid var(--vp-c-divider); font-weight: 800; }
.title-text { font-size: 2em; margin-bottom: 30px; font-weight: 800; }

/* 行動版 */
.mobile-menu-btn { 
    position: fixed; bottom: 20px; right: 20px; z-index: 100; padding: 12px 24px;
    background: var(--vp-c-brand-1); color: white; border-radius: 50px; border: none; font-weight: 700;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: none;
}
@media (max-width: 900px) { .mobile-menu-btn { display: block; } }

.mobile-nav-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99; backdrop-filter: blur(4px); }
.mobile-nav-content { width: 80%; max-width: 300px; height: 100%; background: var(--vp-c-bg); padding: 40px 20px; }
.mobile-search input { width: 100%; padding: 12px; margin-bottom: 30px; border-radius: 8px; border: 1px solid var(--vp-c-divider); }
.m-nav-item { padding: 15px; border-bottom: 1px solid var(--vp-c-divider); }
.m-nav-item.active { color: var(--vp-c-brand-1); font-weight: 700; }
</style>
