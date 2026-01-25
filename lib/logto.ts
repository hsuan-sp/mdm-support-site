import LogtoClient from "@logto/next";

/**
 * Logto Configuration - Bare Minimum for Pages Router
 * 恢復最穩定的配置結構，確保 100% 登入成功。
 */
export const logtoConfig = {
  endpoint: process.env.LOGTO_ENDPOINT || "https://36dxrv.logto.app/",
  appId: process.env.LOGTO_APP_ID || "gkv7y7qb9hts3wib55g46",
  appSecret: process.env.LOGTO_APP_SECRET || "",
  baseUrl:
    process.env.LOGTO_BASE_URL || "https://mdm-docs-superinfo.netlify.app",
  cookieSecret:
    process.env.LOGTO_COOKIE_SECRET ||
    "complex_secret_for_logto_session_32_chars",
  cookieSecure: process.env.NODE_ENV === "production",
  scopes: ["email", "profile"], // 為了拿到 Email 必須保留
};

export const logtoClient = new LogtoClient(logtoConfig);
