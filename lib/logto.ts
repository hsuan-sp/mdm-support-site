import { LogtoNextConfig, UserScope } from "@logto/next";

/**
 * Logto Configuration for v4 SDK (Pages Router)
 * 這個檔案只負責導出配置，不包含實例化邏輯，防止前端編譯衝突。
 */
export const logtoConfig: LogtoNextConfig = {
  endpoint: process.env.LOGTO_ENDPOINT || "https://36dxrv.logto.app/",
  appId: process.env.LOGTO_APP_ID || "gkv7y7qb9hts3wib55g46",
  appSecret: process.env.LOGTO_APP_SECRET || "",
  baseUrl:
    process.env.LOGTO_BASE_URL || "https://mdm-docs-superinfo.netlify.app",
  cookieSecret:
    process.env.LOGTO_COOKIE_SECRET ||
    "complex_secret_for_logto_session_32_chars",
  cookieSecure: process.env.NODE_ENV === "production",
  cookiePath: "/", // 關鍵：確保 Session 在全站共用
  scopes: [UserScope.Email, UserScope.Profile],
};
