import { NextRequest, NextResponse } from "next/server";
import { logtoClient, logtoConfig } from "../../../lib/logto"; // 引入 config 檢查

export const runtime = "edge";

export default async function handler(req: NextRequest) {
    try {
        if (!logtoConfig.endpoint || !logtoConfig.appId) {
            console.error("❌ Logto 配置缺失");
            return NextResponse.json({ error: "Config Missing" }, { status: 500 });
        }

        // 產生 callback URL
        const callbackUrl = new URL("/api/logto/callback", req.url).toString();

        // 呼叫 SDK 產生登入處理器
        const handler = await logtoClient.handleSignIn({
            redirectUri: callbackUrl,
        });

        // 執行跳轉
        return await handler(req);

    } catch (error: any) {
        console.error("❌ Sign-In API Error:", error.message);
        return NextResponse.json(
            { error: "Sign-in Failed", detail: error.message },
            { status: 500 }
        );
    }
}