<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRoute } from "vitepress";
import { allQAData } from "../../data/all-data";
import type { QAItem } from "../../types";
import MarkdownIt from "markdown-it";

const route = useRoute();

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true // 確保單次換行也會生效
});

// Helper to count items per chapter
const getChapterCount = (source: string) => {
  const module = allQAData.find(m => m.source === source);
  if (!module) return 0;
  return module.sections.reduce((total, section) => total + section.items.length, 0);
};

// State
const searchQuery = ref("");
const activeSource = ref(allQAData[0].source);
const isSidebarOpen = ref(false);
const fontScale = ref(1); // 使用比例來控制全域大小
const isSidebarCollapsed = ref(false); // 側邊欄是否收合

const handleHashChange = () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    // 直接從數據源比對鏈結標記（如果需要更精確的比對可以擴充路徑屬性）
    const target = allQAData.find(m => m.source.toLowerCase().includes(hash));
    if (target) {
        activeSource.value = target.source;
        searchQuery.value = '';
    }
};

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return null;
  const query = searchQuery.value.trim().toLowerCase();
  const results: { source: string, items: QAItem[] }[] = [];
  allQAData.forEach(file => {
    const matches: QAItem[] = [];
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
  const lines = text.split('\n');
  const minIndent = lines.filter(l => l.trim()).reduce((min, line) => {
    const match = line.match(/^\s*/);
    return Math.min(min, match ? match[0].length : min);
  }, Infinity);
  
  // 保持原始結構，僅處理縮排
  let cleaned = lines.map(line => line.slice(minIndent)).join('\n').trim();
  
  // 優化排版：僅針對 Markdown 解析必須的「列表前置空行」做補強
  // 這樣您在內文中「有沒有空行」就會直接反映在畫面上
  let processed = cleaned
    .replace(/([^\n])\n(\s*[-*+])/g, '$1\n\n$2')
    .replace(/([^\n])\n(\s*\d+\.)/g, '$1\n\n$2');
  
  return md.render(processed);
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

// Persistence
watch(fontScale, (val) => {
  localStorage.setItem('mdm-qa-font-scale', val.toString());
});

onMounted(() => {
  const savedScale = localStorage.getItem('mdm-qa-font-scale');
  if (savedScale) fontScale.value = parseFloat(savedScale);

  const savedCollapsed = localStorage.getItem('mdm-qa-sidebar-collapsed');
  if (savedCollapsed) isSidebarCollapsed.value = savedCollapsed === 'true';
});

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  localStorage.setItem('mdm-qa-sidebar-collapsed', isSidebarCollapsed.value.toString());
};
</script>

<template>
  <div class="guide-app" :style="{ '--app-scale': fontScale }" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <div class="app-layout">
      <!-- 重新設計的側邊欄：加入統計數字 -->
      <aside class="app-sidebar">
        <!-- 收合按鈕 -->
        <button class="collapse-toggle" @click="toggleSidebar" :title="isSidebarCollapsed ? '展開側邊欄' : '收合側邊欄'">
          <svg v-if="isSidebarCollapsed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
        </button>
        <div class="sidebar-top">
            <div class="search-section">
                <input v-model="searchQuery" type="text" placeholder="🔍 搜尋問答..." class="search-input" />
            </div>
            <nav class="nav-menu">
                <button 
                    v-for="module in allQAData" :key="module.source"
                    @click="switchModule(module.source)"
                    :class="['nav-item', { active: activeSource === module.source && !searchQuery }]"
                >
                    <span class="nav-text">{{ module.source }}</span>
                    <span class="nav-count">{{ getChapterCount(module.source) }}</span>
                </button>
            </nav>
        </div>

        <div class="sidebar-bottom">
            <div class="font-controls">
                <span class="ctrl-label">字體大小調整</span>
                <div class="btn-group">
                    <button @click="fontScale = 0.9" :class="{active: fontScale === 0.9}">小</button>
                    <button @click="fontScale = 1.0" :class="{active: fontScale === 1.0}">中</button>
                    <button @click="fontScale = 1.2" :class="{active: fontScale === 1.2}">大</button>
                </div>
            </div>
        </div>
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
          <span class="nav-text">{{ m.source }}</span>
          <span class="nav-count">{{ getChapterCount(m.source) }}</span>
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
    padding: 0 20px 40px;
    color: var(--vp-c-text-1);
    line-height: 1.6;
}

/* 佈局：電腦版固定側邊欄 */
.app-layout { 
    display: grid; 
    grid-template-columns: 260px 1fr; 
    gap: 40px; 
    align-items: start;
    padding-top: 20px;
    transition: grid-template-columns 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.guide-app.sidebar-collapsed .app-layout {
    grid-template-columns: 20px 1fr;
    gap: 20px;
}

@media (max-width: 900px) { 
    .app-layout { grid-template-columns: 1fr !important; gap: 20px; } 
    .app-sidebar { display: none !important; } 
    .guide-app.sidebar-collapsed .app-layout { grid-template-columns: 1fr !important; }
}

/* 側邊欄視覺與固定邏輯 */
.app-sidebar { 
    position: sticky; 
    top: 80px; 
    height: calc(100vh - 120px); 
    display: flex; 
    flex-direction: column;
    transition: transform 0.4s, opacity 0.3s;
}

.guide-app.sidebar-collapsed .app-sidebar {
    transform: translateX(-240px);
    opacity: 0.2;
}

.guide-app.sidebar-collapsed .app-sidebar:hover {
    opacity: 1;
}

/* 收合按鈕 */
.collapse-toggle {
    position: absolute;
    right: -12px;
    top: 10px;
    width: 24px;
    height: 24px;
    background: var(--vp-c-bg-alt);
    border: 1px solid var(--vp-c-divider);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1000;
    color: var(--vp-c-text-3);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.3s;
}

.collapse-toggle:hover {
    color: var(--vp-c-brand-1);
    transform: scale(1.1);
    background: var(--vp-c-bg);
}

.guide-app.sidebar-collapsed .collapse-toggle {
    right: -32px;
}

.sidebar-top { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.nav-menu { flex: 1; overflow-y: auto; margin: 10px 0; padding-right: 8px; }

/* 滾動條樣式 */
.nav-menu::-webkit-scrollbar { width: 4px; }
.nav-menu::-webkit-scrollbar-thumb { background: var(--vp-c-divider); border-radius: 4px; }

.sidebar-bottom { 
    padding-top: 20px; 
    border-top: 1px solid var(--vp-c-divider); 
}

.search-input { 
    width: 100%; 
    padding: 12px; 
    border-radius: 10px; 
    border: 1px solid var(--vp-c-divider); 
    margin-bottom: 5px; 
    background: var(--vp-c-bg-soft); 
    font-size: 0.9em;
}

.nav-item { 
    display: flex; justify-content: space-between; align-items: center;
    width: 100%; text-align: left; padding: 12px 16px; border: none; 
    background: transparent; cursor: pointer; border-radius: 12px; margin-bottom: 4px;
    font-size: 0.9em; color: var(--vp-c-text-2); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.nav-item:hover { background: var(--vp-c-bg-mute); color: var(--vp-c-text-1); transform: translateX(4px); }
.nav-item.active { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); font-weight: 700; }

.nav-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 10px;
}

.nav-count {
    font-size: 11px;
    background: var(--vp-c-bg-alt);
    padding: 2px 8px;
    border-radius: 10px;
    min-width: 28px;
    text-align: center;
    border: 1px solid var(--vp-c-divider);
    color: var(--vp-c-text-3);
    transition: all 0.2s;
}
.nav-item.active .nav-count {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
    background: white;
}

/* 側邊欄字體控制 */
.font-controls { display: flex; flex-direction: column; gap: 8px; }
.ctrl-label { font-size: 0.75em; color: var(--vp-c-text-3); font-weight: 600; text-transform: uppercase; }
.btn-group { display: flex; gap: 2px; background: var(--vp-c-bg-soft); padding: 3px; border-radius: 8px; border: 1px solid var(--vp-c-divider); }
.btn-group button { 
    flex: 1; padding: 6px; border: none; background: transparent; border-radius: 6px; 
    cursor: pointer; font-size: 0.8em; transition: 0.2s; color: var(--vp-c-text-2);
}
.btn-group button.active { background: var(--vp-c-bg); color: var(--vp-c-brand-1); box-shadow: 0 2px 6px rgba(0,0,0,0.06); font-weight: 700; }

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
.qa-content { padding: 0 24px 24px; border-top: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); }
.markdown-body { 
    font-size: 1.05em; line-height: 1.8; color: var(--vp-c-text-1); 
    padding-top: 24px;
}
.markdown-body :deep(p) { margin-bottom: 1.5em; }
.markdown-body :deep(ul), .markdown-body :deep(ol) { margin-bottom: 1.5em; padding-left: 1.5em; }
.markdown-body :deep(li) { margin-bottom: 0.8em; }
.markdown-body :deep(li:last-child) { margin-bottom: 0; }
.markdown-body :deep(strong) { color: var(--vp-c-brand-1); font-weight: 800; }
.markdown-body :deep(blockquote) { 
    margin: 1.5em 0; padding: 12px 20px; 
    border-left: 4px solid var(--vp-c-brand-1); 
    background: var(--vp-c-bg-alt); 
    border-radius: 4px;
}
.markdown-body :deep(blockquote p) { margin-bottom: 0; }

.tags { margin-top: 15px; display: flex; gap: 8px; flex-wrap: wrap; }
.tag { font-size: 0.8em; color: var(--vp-c-text-3); font-style: italic; }

.section-label { font-size: 1.5em; margin: 40px 0 20px; padding-bottom: 10px; border-bottom: 2px solid var(--vp-c-divider); font-weight: 800; line-height: 1.4; }
.title-text { font-size: 2em; margin: 0 0 30px 0; font-weight: 800; line-height: 1.2; }

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
.m-nav-item { 
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px; border-bottom: 1px solid var(--vp-c-divider); 
}
.m-nav-item.active { color: var(--vp-c-brand-1); font-weight: 700; background: var(--vp-c-brand-soft); }
.m-nav-item .nav-count { font-size: 12px; }
</style>
