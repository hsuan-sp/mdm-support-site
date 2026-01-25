import { NextRequest, NextResponse } from "next/server";
import { logtoClient } from "../../../lib/logto";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
    try {
        const context = await logtoClient.getLogtoContext(req);

        // ⚠️ 強化 Email 提取：嘗試從不同的標籤中抓取
        const email =
            context.claims?.email ||
            (context as any).userInfo?.email ||
            null;

        // 偵錯日誌：這會印在您的 VS Code 終端機
        if (context.isAuthenticated) {
            console.log(`>>> [API Debug] 使用者已登入: ${email}`);
        }

        const responseData = {
            isAuthenticated: context.isAuthenticated,
            email: email, // 這裡如果是 null，前端頭貼就會變問號
            sub: context.claims?.sub || null
        };

        const response = NextResponse.json(responseData);

        // 強制不快取，確保登入/登出切換順利
        response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
        response.headers.set("Pragma", "no-cache");

        return response;

    } catch (error) {
        console.error(">>> [API Error] /api/logto/user 崩潰:", error);
        return NextResponse.json({ isAuthenticated: false, email: null }, { status: 200 });
    }
}