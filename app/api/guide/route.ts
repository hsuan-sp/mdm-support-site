import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/app/logto';
import { getQAData } from "@/lib/data";
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { isAuthenticated } = await getLogtoContext(logtoConfig);

    if (!isAuthenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang');

    const data = await getQAData(lang === "en" ? "en" : "zh");

    return NextResponse.json(data, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
}