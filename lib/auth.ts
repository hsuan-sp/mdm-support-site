/**
 * 統一的 Email 網域校驗邏輯
 * 確保與 AuthGuard 的正則表達式完全一致
 */
export function isAuthorizedEmail(email: string | undefined | null): boolean {
  if (!email) {
    console.log("[Auth Debug] No email provided to validation");
    return false;
  }

  // 1. 標準化處理：轉小寫、去空格
  const normalizedEmail = email.toLowerCase().trim();

  // 2. 判斷邏輯
  // 支援 .edu.tw 以及 superinfo.com.tw
  const isEdu = normalizedEmail.endsWith('.edu.tw');
  const isOfficial = normalizedEmail.endsWith('@superinfo.com.tw');

  // 3. 特別偵錯：在瀏覽器 F12 Console 可以看到到底是哪個 Email 在跑
  console.log(`[Auth Debug] Testing Email: "${normalizedEmail}"`);
  console.log(`[Auth Debug] Is Edu: ${isEdu}, Is Official: ${isOfficial}`);

  return isEdu || isOfficial;
}