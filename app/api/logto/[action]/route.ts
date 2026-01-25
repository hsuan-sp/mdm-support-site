// app/api/logto/[action]/route.ts
import { handleAuth } from '@logto/next';
import { logtoConfig } from '@/app/logto'; // 引用你的 Logto 設定檔

export const GET = handleAuth(logtoConfig);
export const POST = handleAuth(logtoConfig);