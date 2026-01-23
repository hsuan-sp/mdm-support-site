import { ref, computed } from "vue";

const user = ref<string | null>(null);
const isGuest = ref(true);
const isChecking = ref(false);

/**
 * 環境檢查：判斷是否為靜態平台 (如 GitHub Pages)
 */
const isStaticPlatform = computed(() => {
  if (typeof window === "undefined") return false;
  return (
    window.location.hostname.endsWith(".github.io") ||
    (window.location.hostname.includes("localhost") === false &&
      window.location.hostname.includes("vercel.app") === false)
  );
});

/**
 * 身分驗證 Hook (useAuth)
 *
 * 負責處理全域的使用者登入狀態、權限確認與登出邏輯。
 */
export function useAuth() {
  /**
   * 執行身分檢查
   */
  const checkAuth = async () => {
    // 如果是靜態平台，不執行登入邏輯
    if (isStaticPlatform.value) {
      user.value = "public@superinfo.com.tw";
      isGuest.value = false; // 在靜態模式下設為非訪客以顯示內容
      return;
    }

    isChecking.value = true;
    try {
      const res = await fetch("/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.email) {
          user.value = data.email;
          isGuest.value = false;
        } else {
          throw new Error("回應中無電子郵件資料");
        }
      } else {
        throw new Error("身分驗證失敗");
      }
    } catch (e) {
      console.log("身分驗證：進入訪客模式");
      user.value = "guest@edu.tw";
      isGuest.value = true;
    } finally {
      isChecking.value = false;
    }
  };

  /**
   * 登出系統
   */
  const logout = () => {
    if (isStaticPlatform.value) return;
    if (isGuest.value) return;
    if (confirm("確定要登出系統嗎？")) {
      location.href = "/auth/logout";
    }
  };

  /**
   * 使用者名稱
   */
  const username = computed(() => {
    if (isStaticPlatform.value) return "Public Preview";
    if (!user.value) return "訪客";
    return user.value.split("@")[0];
  });

  return {
    user,
    isGuest,
    isChecking,
    isStaticPlatform,
    username,
    checkAuth,
    logout,
  };
}
