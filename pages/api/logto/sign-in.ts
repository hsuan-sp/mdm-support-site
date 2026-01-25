import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { logtoClient, logtoConfig } from "../../../lib/logto";

// ⚠️ 絕對要移除這行，它是 OpenNext 報錯的元兇
// export const runtime = "edge"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!logtoConfig.endpoint || !logtoConfig.appId) {
            return res.status(500).json({ error: "Config Missing" });
        }

        // 1. 手動將 Node.js 的 req 轉成 Web 標準 Request 物件，讓原本的邏輯繼續跑
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        const fullUrl = `${protocol}://${host}${req.url}`;

        const webReq = new Request(fullUrl, {
            headers: new Headers(req.headers as any),
            method: req.method,
        });

        // 2. 你的原始邏輯 (產生 callback URL)
        const callbackUrl = new URL("/api/logto/callback", fullUrl).toString();

        // 3. 呼叫 SDK 產生登入處理器
        const logtoHandler = await logtoClient.handleSignIn({
            redirectUri: callbackUrl,
        });

        // 4. 執行處理並拿到 NextResponse
        const nextResponse = await logtoHandler(webReq);

        // 5. 💡 關鍵：將 NextResponse 的結果轉回 Pages Router 的 res
        // 這樣做既不用改寫原本的跳轉邏輯，也能通過 OpenNext 編譯
        res.status(nextResponse.status);
        nextResponse.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        const body = await nextResponse.text();
        return res.send(body);

    } catch (error: any) {
        console.error("❌ Sign-In API Error:", error.message);
        return res.status(500).json({ error: "Sign-in Failed", detail: error.message });
    }
}