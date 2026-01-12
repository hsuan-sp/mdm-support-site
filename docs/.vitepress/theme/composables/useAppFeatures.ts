import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';

export function useAppFeatures(storageKeyPrefix: string) {
  const fontScale = ref(1.0);
  const isSidebarCollapsed = ref(false);

  // Persistence keys
  const SCALE_KEY = `${storageKeyPrefix}-font-scale`;
  const SIDEBAR_KEY = `${storageKeyPrefix}-sidebar-collapsed`;

  onMounted(() => {
    // 1. Restore state
    const savedScale = localStorage.getItem(SCALE_KEY);
    if (savedScale) fontScale.value = parseFloat(savedScale);

    const savedCollapsed = localStorage.getItem(SIDEBAR_KEY);
    if (savedCollapsed) isSidebarCollapsed.value = savedCollapsed === 'true';

    // 2. Add global body class for background styling
    document.body.classList.add('is-app');
  });

  onUnmounted(() => {
    document.body.classList.remove('is-app');
  });

  // Watchers for persistence
  watch(fontScale, (val) => {
    localStorage.setItem(SCALE_KEY, val.toString());
  });

  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
    localStorage.setItem(SIDEBAR_KEY, isSidebarCollapsed.value.toString());
  };

  return {
    fontScale,
    isSidebarCollapsed,
    toggleSidebar
  };
}
