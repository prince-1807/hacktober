// API Route: POST /api/admin/auth
// Authenticates moderator and administrator access.

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword } from '@/lib/server/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passcode } = body;

    if (!passcode || !verifyAdminPassword(String(passcode).trim())) {
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
      token: String(passcode).trim(),
      message: 'Moderator access granted.',
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Authentication failed.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
