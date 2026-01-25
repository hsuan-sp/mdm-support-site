import { NextRequest, NextResponse } from "next/server";
import { logtoClient } from "@/lib/logto";
import { getQAData } from "@/lib/data";

// 指定使用 Edge Runtime
export const runtime = "edge";

export default async function handler(req: NextRequest) {
  // --- Debug Start (Optional) ---
  // console.log("Guide Request Cookies:", req.cookies.getAll());
  // --- Debug End ---

  try {
    // 1. 檢查身分 (Edge 模式)
    // 這裡不使用 withLogtoApiRoute，而是直接獲取 Context
    const context = await logtoClient.getLogtoContext(req);

    if (!context.isAuthenticated) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Sign-in session not found or expired",
        },
        { status: 401 }
      );
    }

    // 2. 獲取參數 (使用標準 Web API)
    // req.query 無法使用，改用 URL 解析
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang");

    // 3. 獲取數據
    // 呼叫重構後的 lib/data.ts (回傳預先生成的 JSON)
    const data = await getQAData(lang === "en" ? "en" : "zh");

    // 4. 回傳回應
    const response = NextResponse.json(data);

    // 設定不快取，確保權限或資料變動時能即時反應
    response.headers.set("Cache-Control", "no-store, max-age=0");

    return response;

  } catch (error: any) {
    console.error("[Guide API Error]:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}