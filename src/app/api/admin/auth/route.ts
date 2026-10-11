// API Route: POST /api/admin/auth
// Authenticates moderator and administrator access.

import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

const VALID_PASSCODES = new Set([
  'admin2026',
  'bit_admin',
  'moderator2026',
  env.SYNC_TOKEN,
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passcode } = body;

    if (!passcode || !VALID_PASSCODES.has(String(passcode).trim())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid administrator passcode. Please try again.',
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      token: 'admin2026',
      message: 'Moderator access granted.',
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Authentication failed.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
