// lib/logto.ts
import LogtoClient from "@logto/next";

export const logtoConfig = {
  endpoint: process.env.LOGTO_ENDPOINT!,
  appId: process.env.LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  baseUrl: process.env.LOGTO_BASE_URL!,
  cookieSecret: process.env.LOGTO_COOKIE_SECRET!,
  cookieSecure: process.env.NODE_ENV === "production",
  // 建議明確加上路徑與 SameSite 設定，防止跨域遺失 Cookie
  cookiePath: "/",
  scopes: ["email", "profile", "offline_access"], // 加上 offline_access 確保 session 持久
};

export const logtoClient = new LogtoClient(logtoConfig);