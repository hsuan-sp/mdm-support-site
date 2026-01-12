import { ref, computed } from 'vue';

const user = ref<string | null>(null);
const isGuest = ref(true);
const isChecking = ref(false);

export function useAuth() {
  const checkAuth = async () => {
    // Prevent double-checking if already verified? 
    // For now, simple check. Optimizations can be added later.
    isChecking.value = true;
    try {
      const res = await fetch('/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.email) {
          user.value = data.email;
          isGuest.value = false;
        } else {
          throw new Error('No email in response');
        }
      } else {
        throw new Error('Auth check failed');
      }
    } catch (e) {
      console.log('Auth check: Guest mode');
      // Default to Guest
      user.value = 'guest@edu.tw';
      isGuest.value = true;
    } finally {
      isChecking.value = false;
    }
  };

  const logout = () => {
    if (isGuest.value) return;
    if (confirm('確定要登出系統嗎？')) {
      location.href = '/auth/logout';
    }
  };

  const username = computed(() => {
    if (!user.value) return '訪客';
    return user.value.split('@')[0];
  });

  return {
    user,
    isGuest,
    isChecking,
    username,
    checkAuth,
    logout
  };
}
