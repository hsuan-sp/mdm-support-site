import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/app/logto';
import { getGlossaryData } from "@/lib/data";
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { isAuthenticated } = await getLogtoContext(logtoConfig);

    // 1. 檢查身分
    if (!isAuthenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. 獲取參數
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang');

    // 3. 獲取數據
    const data = await getGlossaryData(lang === "en" ? "en" : "zh");

    // 4. 回傳回應
    return NextResponse.json(data, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
}