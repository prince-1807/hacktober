// API Route: POST /api/sync
// Triggers asynchronous revalidation and fresh SWR snapshot of all student platform ratings.

import { NextResponse } from 'next/server';
import { syncAllStudentRatings } from '@/lib/server/cache-store';

export const dynamic = 'force-dynamic';

export async function POST() {
  const startTime = Date.now();
  try {
    const result = await syncAllStudentRatings();
    const elapsed = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        updatedCount: result.updatedCount,
        latencyMs: elapsed,
        timestamp: result.timestamp,
      },
      message: `Revalidated ratings for ${result.updatedCount} students in ${elapsed}ms. SWR cache refreshed!`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Sync failed unexpectedly.';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
