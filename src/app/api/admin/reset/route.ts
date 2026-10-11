// API Route: POST /api/admin/reset
// Resets leaderboard records back to default seed data.

import { NextRequest, NextResponse } from 'next/server';
import { resetLeaderboardToDefault } from '@/lib/server/cache-store';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

const VALID_ADMIN_KEYS = new Set([
  'admin2026',
  'bit_admin',
  'moderator2026',
  env.SYNC_TOKEN,
]);

export async function POST(request: NextRequest) {
  try {
    const adminKey =
      request.headers.get('x-admin-key') ||
      request.nextUrl.searchParams.get('adminKey');

    if (!adminKey || !VALID_ADMIN_KEYS.has(adminKey.trim())) {
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
