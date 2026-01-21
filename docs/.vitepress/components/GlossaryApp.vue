<script setup lang="ts">
import { ref, computed, onMounted, nextTick, shallowRef } from "vue";
import { useData } from 'vitepress';
// @ts-ignore
import { data as rawLoaderData } from "../../data/all-data.data";

const { lang } = useData();
const isMounted = ref(false);

// Use shallowRef to avoid deep reactivity overhead on huge static data
const rawData = shallowRef(rawLoaderData);

// Selected data based on current language
const langData = computed(() => {
  const d = rawData.value;
  return lang.value === 'en-US' ? d?.en : d?.zh;
});
const glossaryData = computed(() => langData.value?.glossaryData || []);

import { useLayoutMode } from '../theme/composables/useLayoutMode';
import { useAppFeatures } from '../theme/composables/useAppFeatures';
import { useKeyboardShortcuts } from '../theme/composables/useKeyboardShortcuts';
import AppSidebar from './AppSidebar.vue';
import MobileDrawer from '../theme/components/MobileDrawer.vue';
import EmptyState from '../theme/components/EmptyState.vue';

// UI Translations
const t = computed(() => {
  const translations = {
    'zh-TW': {
      sidebarTitle: "術語庫分類",
      searchPlaceholder: "搜尋術語... (按 / 聚焦)",
      categoryLabel: "分類",
      allLabel: "全部顯示",
      allChips: "全部",
      sortAZ: "A-Z",
      sortZA: "Z-A",
      sortBtnAZ: "排序 A-Z",
      sortBtnZA: "排序 Z-A",
      allCategories: "所有分類",
      totalTerms: "共 {n} 個術語",
      analogyLabel: "白話文 / 比喻",
      emptyState: "沒有找到符合「{q}」的術語",
      clearSearch: "清除搜尋條件",
      mobileBtn: "篩選與搜尋",
      drawerTitle: "篩選與搜尋",
      drawerCategoryTitle: "分類選擇",
      fontScaleTitle: "字體大小調整",
      fontSmall: "小",
      fontMedium: "中",
      fontLarge: "大",
      categories: {
        Core: "核心概念",
        Enrollment: "裝置註冊",
        Apple: "Apple 服務",
        Security: "資訊安全",
        Network: "網路配置",
        Hardware: "硬體管理",
        Apps: "App 管理",
        Other: "其他",
        Education: "教育場域",
        macOS: "macOS 管理",
        Jamf: "Jamf 專區"
      },
      alertMsg: ""
    },
    'en-US': {
      sidebarTitle: "Glossary Categories",
      searchPlaceholder: "Search terms... (Press / to focus)",
      categoryLabel: "Category",
      allLabel: "Show All",
      allChips: "All",
      sortAZ: "A-Z",
      sortZA: "Z-A",
      sortBtnAZ: "Sort A-Z",
      sortBtnZA: "Sort Z-A",
      allCategories: "All Categories",
      totalTerms: "{n} terms found",
      analogyLabel: "Plain English Analogy",
      emptyState: "No terms found for \"{q}\"",
      clearSearch: "Clear Search",
      mobileBtn: "Filter & Search",
      drawerTitle: "Filter & Search",
      drawerCategoryTitle: "Category Selection",
      fontScaleTitle: "Font Size Adjustment",
      fontSmall: "S",
      fontMedium: "M",
      fontLarge: "L",
      categories: {
        Core: "Core Concepts",
        Enrollment: "Enrollment",
        Apple: "Apple Services",
        Security: "Security",
        Network: "Networking",
        Hardware: "Hardware",
        Apps: "App Management",
        Other: "Other",
        Education: "Education",
        macOS: "macOS",
        Jamf: "Jamf"
      },
      alertMsg: "Section 1-8 translated. Full content coming soon."
    }
  };
  return translations[lang.value as keyof typeof translations] || translations['zh-TW'];
});

const { isMobileView } = useLayoutMode();
const { fontScale, isSidebarCollapsed, toggleSidebar } = useAppFeatures('mdm-glossary');
type CategoryType = "Core" | "Enrollment" | "Apple" | "Security" | "Network" | "Hardware" | "Apps" | "Other" | "Education" | "macOS" | "Jamf";

const searchQuery = ref("");
const selectedCategory = ref<CategoryType | "All">("All");
const sortOrder = ref<'asc' | 'desc'>('asc');
const isControlsExpanded = ref(false);

const categories = [
  "All",
  "Core",
  "Enrollment",
  "Apple",
  "Security",
  "Network",
  "Hardware",
  "Apps",
  "Other",
  "Education",
  "macOS",
  "Jamf",
] as const;

const filteredTerms = computed(() => {
  let filtered = glossaryData.value.filter((item: any) => {
    const queries = searchQuery.value.trim().toLowerCase().split(/\s+/);

    const matchesSearch = queries.every(q => {
      return item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.analogy.toLowerCase().includes(q);
    });

    const currentCategory = selectedCategory.value;
    const matchesCategory =
      currentCategory === "All" ||
      (Array.isArray(item.category)
        ? item.category.includes(currentCategory as any)
        : item.category === currentCategory);

    return matchesSearch && matchesCategory;
  });

  return filtered.sort((a: any, b: any) => {
    const termA = a.term.replace(/\s*\([^)]*\)/g, '').toUpperCase();
    const termB = b.term.replace(/\s*\([^)]*\)/g, '').toUpperCase();

    if (sortOrder.value === 'asc') {
      return termA.localeCompare(termB);
    } else {
      return termB.localeCompare(termA);
    }
  });
});

const getCategoryColor = (cat: string) => {
  return `badge-${cat.toLowerCase()}`;
};

const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

useKeyboardShortcuts({
  onSearchFocus: () => {
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    searchInput?.focus();
  },
  onEscape: () => {
    if (searchQuery.value) {
      searchQuery.value = '';
    } else if (isControlsExpanded.value) {
      isControlsExpanded.value = false;
    }
  }
});

onMounted(async () => {
  isMounted.value = true;
  await nextTick();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.term-card').forEach((el) => {
    observer.observe(el);
  });
});

const getCategoryCount = (cat: string) => {
  if (cat === 'All') return glossaryData.value.length;
  return glossaryData.value.filter((item: any) =>
    Array.isArray(item.category)
      ? item.category.includes(cat as any)
      : item.category === cat
  ).length;
};

const clearSearch = () => {
  searchQuery.value = '';
  selectedCategory.value = 'All';
};

const getCategoryName = (cat: string) => {
  if (cat === 'All') return t.value.allLabel;
  return (t.value.categories as any)[cat] || cat;
};

const getCategoryChipName = (cat: string) => {
  if (cat === 'All') return t.value.allChips;
  return (t.value.categories as any)[cat] || cat;
};
</script>

<template>
  <div class="glossary-app" :class="{ 'is-mobile-device': isMobileView, 'sidebar-collapsed': isSidebarCollapsed }"
    :style="{ '--app-scale': fontScale }">
    <div v-if="isMounted" class="app-layout">
      <AppSidebar :title="t.sidebarTitle" :is-open="!isSidebarCollapsed" class="desktop-only" @toggle="toggleSidebar"
        @update:scale="val => fontScale = val">
        <div v-if="lang === 'en-US'" class="wip-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ t.alertMsg }}</span>
        </div>

        <template #search>
          <div class="search-section">
            <div class="search-box">
              <span class="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input v-model="searchQuery" type="text" :placeholder="t.searchPlaceholder" class="search-input" />
            </div>
          </div>
        </template>

        <template #nav-items>
          <div class="categories-header">
            <span>{{ t.categoryLabel }}</span>
            <button @click="toggleSort" class="sort-btn" :title="sortOrder === 'asc' ? t.sortAZ : t.sortZA">
              {{ sortOrder === 'asc' ? t.sortAZ : t.sortZA }}
            </button>
          </div>

          <div class="categories-list">
            <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat"
              :class="['cat-item', { active: selectedCategory === cat }]">
              {{ getCategoryName(cat) }}
              <span class="cat-count" v-if="getCategoryCount(cat) > 0">{{ getCategoryCount(cat) }}</span>
            </button>
          </div>
        </template>
      </AppSidebar>

      <main class="app-content">
        <header class="content-header">
          <div class="view-status-bar">
            <span class="status-label">{{ selectedCategory === 'All' ? t.allCategories :
              getCategoryName(selectedCategory)
              }}</span>
            <span class="status-count">{{ t.totalTerms.replace('{n}', String(filteredTerms.length)) }}</span>
          </div>
        </header>
        <TransitionGroup name="list" tag="div" class="terms-grid">
          <article v-for="(item, index) in filteredTerms" :key="item.term" class="term-card"
            :style="{ '--delay': (index as any) % 10 }">
            <div class="term-card-content">
              <div class="card-main">
                <header class="card-header">
                  <h3 class="term-title">{{ item.term }}</h3>
                  <div class="term-badges">
                    <span v-for="cat in (Array.isArray(item.category) ? item.category : [item.category])" :key="cat"
                      :class="['badge', getCategoryColor(cat)]">
                      {{ getCategoryName(cat) }}
                    </span>
                  </div>
                </header>
                <div class="term-definition markdown-body" v-html="item.definition"></div>
              </div>
              <section v-if="item.analogy" class="analogy-wrapper">
                <div class="analogy-icon" aria-hidden="true">💡</div>
                <div class="analogy-content">
                  <span class="analogy-label">{{ t.analogyLabel }}</span>
                  <div class="analogy-text markdown-body" v-html="item.analogy"></div>
                </div>
              </section>
            </div>
          </article>
        </TransitionGroup>

        <EmptyState v-if="filteredTerms.length === 0" icon="🧐" :description="t.emptyState.replace('{q}', searchQuery)"
          :action-text="t.clearSearch" @clear="clearSearch" />
      </main>
    </div>

    <MobileDrawer v-if="isMounted" :is-open="isControlsExpanded" :title="t.drawerTitle"
      @close="isControlsExpanded = false">
      <div class="search-box mobile-search-box">
        <span class="search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input v-model="searchQuery" type="text" :placeholder="t.searchPlaceholder" class="search-input"
          :aria-label="t.searchPlaceholder" />
      </div>

      <div class="categories-wrapper">
        <div class="categories-header">
          <span>{{ t.drawerCategoryTitle }}</span>
          <button @click="toggleSort" class="sort-btn">
            {{ sortOrder === 'asc' ? t.sortBtnAZ : t.sortBtnZA }}
          </button>
        </div>
        <div class="categories-chips">
          <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat; isControlsExpanded = false"
            :class="['cat-chip', { active: selectedCategory === cat }]">
            {{ getCategoryChipName(cat) }}
          </button>
        </div>
      </div>

      <div class="font-controls-mobile">
        <div class="categories-header"><span>{{ t.fontScaleTitle }}</span></div>
        <div class="btn-group-mobile">
          <button @click="fontScale = 0.9" :class="{ active: fontScale === 0.9 }">{{ t.fontSmall }}</button>
          <button @click="fontScale = 1.0" :class="{ active: fontScale === 1.0 }">{{ t.fontMedium }}</button>
          <button @click="fontScale = 1.2" :class="{ active: fontScale === 1.2 }">{{ t.fontLarge }}</button>
        </div>
      </div>
    </MobileDrawer>

    <button v-if="isMounted" class="mobile-floating-btn" @click="isControlsExpanded = true" v-show="!isControlsExpanded"
      :aria-label="t.mobileBtn">
      <span class="icon" aria-hidden="true">🔍</span>
      <span class="label">{{ t.mobileBtn }}</span>
    </button>

    <div v-if="!isMounted" class="app-loading-placeholder">
    </div>
  </div>
</template>

<style scoped>
.app-loading-placeholder {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  margin: 40px;
  border-radius: 24px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 0.3;
  }

  100% {
    opacity: 0.6;
  }
}

.mobile-floating-btn {
  position: fixed;
  bottom: 32px;
  left: 24px;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 15px;
  box-shadow: 0 8px 20px rgba(0, 113, 227, 0.3);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

@media (min-width: 901px) {
  .mobile-floating-btn {
    display: none;
  }
}

.categories-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.glossary-app {
  --base-size: calc(16px * var(--app-scale, 1));
  font-size: var(--base-size);
  width: 100%;
}

.app-layout {
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 24px 100px;
  position: relative;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
}

.content-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.view-status-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 14px;
  color: var(--vp-c-text-3);
  font-weight: 700;
}

.status-label {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 2px 10px;
  border-radius: 6px;
}

.cat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  width: 100%;
  border: none;
  background: transparent;
}

.cat-item.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.cat-count {
  font-size: 11px;
  background: var(--vp-c-bg-alt);
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
}

.terms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 400px), 1fr));
  gap: 32px;
}

.term-card-content {
  background: var(--vp-c-bg-elv, #ffffff);
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-main {
  padding: 32px;
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.term-title {
  font-size: 22px;
  font-weight: 800;
  margin: 0;
}

.analogy-wrapper {
  background: var(--vp-c-bg-soft);
  padding: 24px 32px;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  gap: 16px;
}

.analogy-label {
  display: block;
  font-weight: 800;
  font-size: 11px;
  color: var(--vp-c-brand-1);
  text-transform: uppercase;
  margin-bottom: 6px;
}

.badge {
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 700;
  text-transform: uppercase;
}

.badge-core {
  background: rgba(0, 113, 227, 0.1);
  color: #0071e3;
}

.badge-enrollment {
  background: rgba(52, 199, 89, 0.1);
  color: #28cd41;
}

.badge-apple {
  background: rgba(0, 0, 0, 0.05);
  color: #1d1d1f;
}

.badge-security {
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
}

.badge-network {
  background: rgba(88, 86, 214, 0.1);
  color: #5856d6;
}

.badge-hardware {
  background: rgba(255, 149, 0, 0.1);
  color: #ff9500;
}

.badge-apps {
  background: rgba(255, 45, 85, 0.1);
  color: #ff2d55;
}

.badge-education {
  background: rgba(255, 204, 0, 0.1);
  color: #cca300;
}

@media (max-width: 900px) {
  .app-layout {
    display: block;
    padding-top: 10px;
  }

  .desktop-only {
    display: none !important;
  }
}
</style>
