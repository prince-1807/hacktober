// API Route: POST /api/admin/change-password
// Allows authenticated moderators to update the admin passcode

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, setAdminPassword } from '@/lib/server/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !verifyAdminPassword(currentPassword)) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect.' },
        { status: 401 }
      );
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 4) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 4 characters long.' },
        { status: 400 }
      );
    }

    setAdminPassword(newPassword.trim());

    return NextResponse.json({
      success: true,
      message: 'Admin passcode updated successfully!',
      token: newPassword.trim(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to change password.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
