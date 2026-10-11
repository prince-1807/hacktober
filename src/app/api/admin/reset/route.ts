// API Route: POST /api/admin/reset
// Resets leaderboard records back to default seed data.

import { NextRequest, NextResponse } from 'next/server';
import { resetLeaderboardToDefault } from '@/lib/server/cache-store';
import { verifyAdminPassword } from '@/lib/server/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const adminKey =
      request.headers.get('x-admin-key') ||
      request.nextUrl.searchParams.get('adminKey');

    if (!adminKey || !verifyAdminPassword(adminKey.trim())) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    const count = await resetLeaderboardToDefault();

    return NextResponse.json({
      success: true,
      data: { count },
      message: `Leaderboard reset successfully to ${count} initial coder profiles.`,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to reset leaderboard.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
