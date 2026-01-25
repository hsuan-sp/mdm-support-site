import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { logtoClient } from "../../../lib/logto";

// ⚠️ 移除此行以通過 OpenNext 編譯
// export const runtime = "edge"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // 1. 將 Node.js 的請求封裝成真正的 NextRequest
        // 這一步能解決 TS 報錯，因為它帶有了 Logto 想要的 nextUrl 和 cookies
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        const fullUrl = `${protocol}://${host}${req.url}`;

        const nextReq = new NextRequest(fullUrl, {
            headers: new Headers(req.headers as any),
            method: req.method,
        });

        // 2. 獲取 Logto Context (這裡型別就對得上了)
        const context = await logtoClient.getLogtoContext(nextReq);

        // 3. 提取 Email
        const email =
            context.claims?.email ||
            (context as any).userInfo?.email ||
            null;

        if (context.isAuthenticated) {
            console.log(`>>> [API Debug] 使用者已登入: ${email}`);
        }

        const responseData = {
            isAuthenticated: context.isAuthenticated,
            email: email,
            sub: context.claims?.sub || null
        };

        // 4. 使用 NextResponse 生成 JSON 並轉回 NextApiResponse
        const nextRes = NextResponse.json(responseData);

        // 設定 Header
        res.status(nextRes.status);
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        res.setHeader("Pragma", "no-cache");

        // 將 JSON 內容傳回
        return res.json(responseData);

    } catch (error) {
        console.error(">>> [API Error] /api/logto/user 崩潰:", error);
        return res.status(200).json({ isAuthenticated: false, email: null });
    }
}