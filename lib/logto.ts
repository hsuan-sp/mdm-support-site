// lib/logto.ts
import LogtoClient from "@logto/next/edge";

export const logtoConfig = {
  endpoint: process.env.LOGTO_ENDPOINT?.trim()!,
  appId: process.env.LOGTO_APP_ID?.trim()!,
  appSecret: process.env.LOGTO_APP_SECRET?.trim()!,
  baseUrl: process.env.LOGTO_BASE_URL?.trim()!,
  cookieSecret: process.env.LOGTO_COOKIE_SECRET?.trim()!,

  // ⚠️ 關鍵修正：必須加入 scopes，否則拿不到 email
  scopes: ["email", "profile", "offline_access"],

  cookieSecure: process.env.NODE_ENV === "production",
  cookieSameSite: "lax" as const,
  cookiePath: "/",
};

export const logtoClient = new LogtoClient(logtoConfig);