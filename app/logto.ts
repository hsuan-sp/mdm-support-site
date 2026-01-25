// app/logto.ts
import { LogtoNextConfig, UserScope } from '@logto/next';

export const logtoConfig: LogtoNextConfig = {
  appId: process.env.LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  endpoint: process.env.LOGTO_ENDPOINT!,
  baseUrl: process.env.LOGTO_BASE_URL!,
  cookieSecret: process.env.LOGTO_COOKIE_SECRET!, // 確保 > 32 字元
  cookieSecure: process.env.NODE_ENV === 'production',
  // 依照官方建議使用 UserScope 列舉
  scopes: [
    UserScope.Email,
    UserScope.Profile,
    'offline_access'
  ],
};