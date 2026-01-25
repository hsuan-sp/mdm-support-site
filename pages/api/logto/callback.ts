import { NextRequest, NextResponse } from "next/server";
import { logtoClient } from "../../../lib/logto";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
    try {
        // ⚠️ 這裡直接傳入 req.url，不經過任何 Next.js 路由轉換
        const handler = await logtoClient.handleSignInCallback(req.url);
        return await handler(req);
    } catch (error: any) {
        console.error("❌ Callback 失敗:", error.message);
        // 如果失敗，嘗試清除 Cookie 並導回首頁，強制重新開始
        const res = NextResponse.redirect(new URL("/", req.url));
        return res;
    }
}