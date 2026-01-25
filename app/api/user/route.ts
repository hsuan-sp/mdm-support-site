import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/app/logto';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    // 使用官方建議的 getLogtoContext
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig, { fetchUserInfo: true });

    return NextResponse.json({
        isAuthenticated,
        user: claims ? {
            sub: claims.sub,
            email: claims.email,
            name: claims.name,
        } : null
    });
}