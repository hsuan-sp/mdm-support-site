/**
 * 統一的 Email 網域校驗邏輯
 * 確保與 AuthGuard 的正則表達式完全一致
 */
export function isAuthorizedEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase();
  const isEdu = /\.edu\.tw$/i.test(normalizedEmail);
  const isOfficial = /@superinfo\.com\.tw$/i.test(normalizedEmail);
  return isEdu || isOfficial;
}
