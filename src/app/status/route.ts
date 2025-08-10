import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
    return NextResponse.json({
        ok: true,
        service: 'seo-playbook',
        time: new Date().toISOString(),
        commit: process.env.VERCEL_GIT_COMMIT_SHA || null,
    });
}


