<script setup lang="ts">
import { ref, computed } from "vue";
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
  if (!searchQuery.value && activeSection.value === "All") {
    return props.data;
  }

  return props.data
    .map((section) => {
      // If section doesn't match filter, filter its items
      if (
        activeSection.value !== "All" &&
        section.title !== activeSection.value
      ) {
        return { ...section, items: [] };
      }

      const filteredItems = section.items.filter((item) => {
        const q = searchQuery.value.toLowerCase();
        return (
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
        );
      });

      return { ...section, items: filteredItems };
    })
    .filter((section) => section.items.length > 0);
});

// Accordion Logic
const openItems = ref<Set<string>>(new Set());

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
</script>

<template>
  <div class="qa-app">
    <!-- Controls -->
    <div class="controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋問題..."
        class="search-input"
      />

      <div class="section-pills">
        <button
          v-for="s in sections"
          :key="s"
          @click="activeSection = s"
          :class="['pill', { active: activeSection === s }]"
        >
          {{ s }}
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
        <h2 class="section-title">{{ section.title }}</h2>

        <div class="qa-list">
          <div
            v-for="item in section.items"
            :key="item.id"
            class="qa-item glass-panel"
            :class="{ open: openItems.has(item.id) }"
          >
            <div class="qa-header" @click="toggleItem(item.id)">
              <div class="qa-title-wrapper">
                <span v-if="item.important" class="badge-important">重要</span>
                <h3 class="qa-question">{{ item.question }}</h3>
              </div>
              <span class="icon">{{ openItems.has(item.id) ? "−" : "+" }}</span>
            </div>

            <div v-show="openItems.has(item.id)" class="qa-body">
              <div class="tags">
                <span v-for="tag in item.tags" :key="tag" class="tag"
                  >#{{ tag }}</span
                >
              </div>
              <div
                class="markdown-body"
                v-html="renderMarkdown(item.answer)"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredSections.length === 0" class="no-results">
        無符合結果
      </div>
    </div>
  </div>
</template>

<style scoped>
.qa-app {
  padding: 2rem 0;
}

.controls {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-input {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  backdrop-filter: blur(10px);
}

.section-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pill {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.05);
  font-size: 0.9rem;
  transition: all 0.2s;
}

.pill.active {
  background: var(--vp-c-brand-1);
  color: white;
}

.section-title {
  margin: 2rem 0 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  border: none;
}

.qa-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
}

.glass-panel:hover {
  background: rgba(255, 255, 255, 0.8);
}

.qa-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.qa-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.badge-important {
  background: #ff3b30;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-weight: bold;
}

.qa-question {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.icon {
  font-size: 1.5rem;
  color: var(--vp-c-text-2);
}

.qa-body {
  padding: 0 1.5rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
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
  border-radius: 10px;
}

/* Markdown Styles inside Accordion */
.markdown-body {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
}

.markdown-body :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.markdown-body :deep(strong) {
  font-weight: 700;
  color: var(--vp-c-text-1);
}
</style>
