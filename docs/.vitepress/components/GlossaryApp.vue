<script setup lang="ts">
import { ref, computed } from "vue";
import { glossaryData, type Term } from "../../data/glossary";

const searchQuery = ref("");
const selectedCategory = ref("All");

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
];

const filteredTerms = computed(() => {
  return glossaryData.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.definition.includes(searchQuery.value) ||
      item.analogy.includes(searchQuery.value);
    const matchesCategory =
      selectedCategory.value === "All" ||
      item.category === selectedCategory.value;

    return matchesSearch && matchesCategory;
  });
});

const getCategoryColor = (cat: string) => {
  const map: Record<string, string> = {
    Core: "bg-blue-100 text-blue-800",
    Enrollment: "bg-green-100 text-green-800",
    Apple: "bg-gray-100 text-gray-800",
    Security: "bg-red-100 text-red-800",
    Network: "bg-purple-100 text-purple-800",
    Hardware: "bg-orange-100 text-orange-800",
    Apps: "bg-pink-100 text-pink-800",
    Other: "bg-gray-100 text-gray-600",
  };
  return map[cat] || "bg-gray-100 text-gray-800";
};
</script>

<template>
  <div class="glossary-app">
    <!-- Search & Filter Header -->
    <div class="controls">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜尋術語、定義或關鍵字..."
          class="search-input"
        />
      </div>

      <div class="category-pills">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="['pill', { active: selectedCategory === cat }]"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Results Grid -->
    <div class="term-grid">
      <div
        v-for="(item, index) in filteredTerms"
        :key="index"
        class="term-card glass-panel"
      >
        <div class="card-header">
          <h3 class="term-title">{{ item.term }}</h3>
          <span :class="['tag', getCategoryColor(item.category)]">{{
            item.category
          }}</span>
        </div>

        <div class="card-body">
          <div class="section definition">
            <span class="label">定義</span>
            <p>{{ item.definition }}</p>
          </div>

          <div class="section analogy">
            <span class="label">白話文</span>
            <p>{{ item.analogy }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredTerms.length === 0" class="no-results">
      <p>找不到符合的術語。</p>
    </div>
  </div>
</template>

<style scoped>
.glossary-app {
  padding: 2rem 0;
}

/* Controls */
.controls {
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  backdrop-filter: blur(10px);
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px rgba(var(--vp-c-brand-1), 0.1);
  background: #fff;
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.pill {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid transparent;
  background: rgba(0, 0, 0, 0.05);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.pill:hover {
  background: rgba(0, 0, 0, 0.1);
}

.pill.active {
  background: var(--vp-c-brand-1);
  color: white;
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-1), 0.3);
}

/* Grid */
.term-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Card */
.glass-panel {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s, box-shadow 0.2s;
}

.glass-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.8);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.term-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}

.tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-weight: 600;
  white-space: nowrap;
}

.section {
  margin-top: 1rem;
}

.label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.definition p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.analogy {
  background: rgba(var(--vp-c-brand-1), 0.05);
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 3px solid var(--vp-c-brand-1);
}

.analogy p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-2);
}

/* Dark Mode Overrides */
:global(.dark) .search-input {
  background: rgba(30, 30, 30, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
  color: white;
}

:global(.dark) .search-input:focus {
  background: rgba(30, 30, 30, 0.9);
}

:global(.dark) .pill {
  color: var(--vp-c-text-1);
  background: rgba(255, 255, 255, 0.1);
}
:global(.dark) .pill.active {
  background: var(--vp-c-brand-1);
  color: white;
}

:global(.dark) .glass-panel {
  background: rgba(30, 30, 30, 0.4);
  border-color: rgba(255, 255, 255, 0.1);
}
:global(.dark) .glass-panel:hover {
  background: rgba(40, 40, 40, 0.6);
}

:global(.dark) .bg-blue-100 {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
}
:global(.dark) .bg-green-100 {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
}
:global(.dark) .bg-gray-100 {
  background: rgba(107, 114, 128, 0.2);
  color: #d1d5db;
}
:global(.dark) .bg-red-100 {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}
:global(.dark) .bg-purple-100 {
  background: rgba(168, 85, 247, 0.2);
  color: #d8b4fe;
}
:global(.dark) .bg-orange-100 {
  background: rgba(249, 115, 22, 0.2);
  color: #fdba74;
}
:global(.dark) .bg-pink-100 {
  background: rgba(236, 72, 153, 0.2);
  color: #f9a8d4;
}
</style>
