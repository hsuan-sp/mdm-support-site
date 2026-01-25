import { NextRequest, NextResponse } from "next/server";
import { logtoClient } from "@/lib/logto";
import { getGlossaryData } from "@/lib/data";

// 指定使用 Edge Runtime
export const runtime = "edge";

export default async function handler(req: NextRequest) {
  // --- 診斷邏輯 (可選) ---
  // Edge Runtime 中無法使用 req.headers.cookie，需透過 req.cookies
  // console.log("Glossary Request Cookies:", req.cookies.getAll());

  try {
    // 1. 檢查身分 (Edge 模式)
    // 注意：這裡使用 getLogtoContext 來取代原本的 wrapper
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

    // 2. 獲取參數 (使用標準 URL API)
    // req.query 在 Edge Runtime 不存在，必須解析 URL
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang");

    // 3. 獲取數據
    // 呼叫改寫後的 lib/data.ts (現在它只會回傳記憶體中的 JSON，速度極快)
    const data = await getGlossaryData(lang === "en" ? "en" : "zh");

    // 4. 回傳回應
    const response = NextResponse.json(data);

    // 設定不快取
    response.headers.set("Cache-Control", "no-store, max-age=0");

    return response;

  } catch (error: any) {
    console.error("[Glossary API Error]:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}