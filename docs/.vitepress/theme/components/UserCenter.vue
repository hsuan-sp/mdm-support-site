<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLayoutMode } from '../composables/useLayoutMode';
import { useData } from 'vitepress';

const { isMobileView, toggleLayout } = useLayoutMode();
const { isDark } = useData();

const user = ref<string | null>(null);
const isGuest = ref(false); // Track if it's the sample account
const isMenuOpen = ref(false);

onMounted(async () => {
  try {
    const res = await fetch('/auth/me');
    if (res.ok) {
        const data = await res.json();
        if (data.email) {
            user.value = data.email;
            isGuest.value = false;
        } else {
            throw new Error();
        }
    } else {
        throw new Error();
    }
  } catch (e) {
    // Guest/GitHub Pages Mode: Use sample account to keep UI consistent
    user.value = 'sample@edu.tw';
    isGuest.value = true;
  }
});

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
};

const logout = () => {
    if (isGuest.value) return; // Cannot logout from sample account
    if (confirm('確定要登出系統嗎？')) {
        location.href = '/auth/logout';
    }
};

const closeMenu = () => {
    isMenuOpen.value = false;
};
</script>

<template>
  <div class="user-center">
    <!-- Desktop Horizontal View -->
    <div class="desktop-actions">
        <!-- Layout Toggle -->
        <button @click="toggleLayout" class="action-btn" :title="isMobileView ? '切換至電腦版介面' : '切換至行動版介面'">
            <svg v-if="isMobileView" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
        </button>

        <!-- Dark Mode Toggle -->
        <button @click="toggleDarkMode" class="action-btn" :title="isDark ? '切換至淡色模式' : '切換至深色模式'">
            <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        </button>

        <div class="divider"></div>

        <div class="user-info" v-if="user">
            <span class="username">{{ (user || '').split('@')[0] }}</span>
            <button v-if="!isGuest" @click="logout" class="logout-link">登出</button>
        </div>
    </div>

    <!-- Mobile Integrated Menu Button -->
    <button class="mobile-menu-trigger" @click="isMenuOpen = !isMenuOpen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
    </button>

    <!-- Mobile Dropdown Panel -->
    <Transition name="fade">
        <div v-if="isMenuOpen" class="mobile-dropdown-overlay" @click="isMenuOpen = false">
            <div class="mobile-dropdown-card" @click.stop>
                <div class="dropdown-header">
                    <div class="user-detail no-avatar">
                        <div class="name">{{ user ? (user || '').split('@')[0] : '訪客' }}</div>
                        <div class="full-email">{{ user || '未登入系統' }}</div>
                    </div>
                </div>

                <div class="menu-items">
                    <!-- Layout Mode -->
                    <div class="menu-item" @click="toggleLayout(); isMenuOpen = false">
                        <div class="item-icon">
                            <svg v-if="isMobileView" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                        </div>
                        <div class="item-text">
                            <div class="label">版面模式</div>
                            <div class="sublabel">{{ isMobileView ? '目前為：行動版' : '目前為：電腦版' }}</div>
                        </div>
                        <div class="toggle-track" :class="{ active: isMobileView }">
                            <div class="toggle-thumb"></div>
                        </div>
                    </div>

                    <!-- Dark Mode -->
                    <div class="menu-item" @click="toggleDarkMode">
                        <div class="item-icon">
                            <svg v-if="isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        </div>
                        <div class="item-text">
                            <div class="label">外觀模式開關</div>
                            <div class="sublabel">{{ isDark ? '目前為：深色' : '目前為：淡色' }}</div>
                        </div>
                        <div class="toggle-track" :class="{ active: isDark }">
                            <div class="toggle-thumb"></div>
                        </div>
                    </div>
                </div>

                <div class="dropdown-footer">
                    <button v-if="!isGuest" class="logout-btn-full" @click="logout">登出帳號</button>
                    <button class="close-btn" @click="isMenuOpen = false">關閉選單</button>
                </div>
            </div>
        </div>
    </Transition>
  </div>
</template>

<style scoped>
.user-center {
    display: flex;
    align-items: center;
    margin-left: 20px;
    flex-shrink: 0;
    z-index: 100;
}

/* Desktop View */
.desktop-actions {
    display: none;
    align-items: center;
    gap: 16px;
}

@media (min-width: 960px) {
    .desktop-actions { display: flex; }
    .mobile-menu-trigger { display: none; }
}

.action-btn {
    background: none;
    border: none;
    color: var(--vp-c-text-2);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: all 0.2s;
}
.action-btn:hover { color: var(--vp-c-brand); background: var(--vp-c-bg-mute); }

.divider {
    width: 1px;
    height: 18px;
    background: var(--vp-c-divider);
}

.user-info { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.username { 
    color: var(--vp-c-text-1); 
    font-weight: 600; 
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.logout-link, .login-link { 
    color: var(--vp-c-brand); cursor: pointer; background: none; border: none; padding: 0; font-weight: 600;
    text-decoration: none;
}
.login-link:hover { text-decoration: underline; }

/* Mobile Trigger */
.mobile-menu-trigger {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--vp-c-brand);
    color: white;
    border: none;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
}

/* Mobile Dropdown */
.mobile-dropdown-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    padding: 20px;
}

.mobile-dropdown-card {
    width: 100%;
    background: var(--vp-c-bg);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
}

.dropdown-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--vp-c-divider);
}

.user-detail.no-avatar {
    padding-left: 4px;
}

.user-detail .name { font-size: 18px; font-weight: 700; color: var(--vp-c-text-1); line-height: 1.2; }
.user-detail .full-email { font-size: 13px; color: var(--vp-c-text-3); margin-top: 4px; }

.menu-items { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }

.menu-item {
    display: flex; align-items: center; gap: 16px;
    padding: 16px; background: var(--vp-c-bg-alt);
    border-radius: 12px; cursor: pointer;
    transition: background 0.2s;
}
.menu-item:hover { background: var(--vp-c-bg-mute); }

.item-icon { color: var(--vp-c-text-2); display: flex; align-items: center; }
.item-text { flex: 1; }
.item-text .label { font-size: 15px; font-weight: 600; color: var(--vp-c-text-1); }
.item-text .sublabel { font-size: 12px; color: var(--vp-c-text-3); }

/* Switch Toggle Style */
.toggle-track {
    width: 44px; height: 24px; border-radius: 12px;
    background: var(--vp-c-divider);
    position: relative; transition: background 0.3s;
}
.toggle-track.active { background: var(--vp-c-brand); }
.toggle-thumb {
    width: 20px; height: 20px; border-radius: 50%;
    background: white; position: absolute; top: 2px; left: 2px;
    transition: transform 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.toggle-track.active .toggle-thumb { transform: translateX(20px); }

.dropdown-footer { display: flex; flex-direction: column; gap: 12px; }
.logout-btn-full {
    width: 100%; padding: 14px; border-radius: 12px;
    background: #ff3b30; color: white !important; font-weight: 700; border: none;
    text-align: center; text-decoration: none; cursor: pointer;
}
.close-btn {
    width: 100%; padding: 14px; border-radius: 12px;
    background: var(--vp-c-bg-mute); color: var(--vp-c-text-1);
    font-weight: 600; border: none; cursor: pointer;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
