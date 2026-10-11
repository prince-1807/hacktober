// API Route: DELETE /api/students/[id]
// Allows authorized administrators and moderators to remove student records.

import { NextRequest, NextResponse } from 'next/server';
import { deleteStudentById } from '@/lib/server/cache-store';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

const VALID_ADMIN_KEYS = new Set([
  'admin2026',
  'bit_admin',
  'moderator2026',
  env.SYNC_TOKEN,
]);

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminKey =
      request.headers.get('x-admin-key') ||
      request.nextUrl.searchParams.get('adminKey');

    if (!adminKey || !VALID_ADMIN_KEYS.has(adminKey.trim())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: Valid admin or moderator key is required to delete records.',
        },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Student identifier is required.' },
        { status: 400 }
      );
    }

    const deleted = await deleteStudentById(id.trim());

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Student with identifier "${id}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Student record successfully removed by administrator.`,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to delete student record.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
