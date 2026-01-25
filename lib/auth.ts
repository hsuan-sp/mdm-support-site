// lib/auth.ts
export function isAuthorizedEmail(email: string | undefined | null): boolean {
  if (!email) return false;

  const normalizedEmail = email.toLowerCase().trim();

  // 1. 判定是否為教育網域 (包含 .edu.tw)
  const isEdu = normalizedEmail.endsWith('.edu.tw');

  // 2. 判定是否為官方網域 (精確匹配 @superinfo.com.tw)
  const isOfficial = normalizedEmail.endsWith('@superinfo.com.tw');

  console.log(`[Auth] Checking: ${normalizedEmail} | Result: ${isEdu || isOfficial}`);

  return isEdu || isOfficial;
}