// API Route: GET /api/leaderboard
// Returns cached SWR leaderboard rankings, student platform breakdowns, and campus KPIs.

import { NextRequest, NextResponse } from 'next/server';
import { getFilteredLeaderboard } from '@/lib/server/cache-store';
import { LeaderboardTab, SortField, SortOrder } from '@/types/campus-cp';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const searchParams = request.nextUrl.searchParams;

  const tab = (searchParams.get('tab') || 'all') as LeaderboardTab;
  const branch = searchParams.get('branch') || undefined;
  const search = searchParams.get('search') || undefined;
  const sortBy = (searchParams.get('sortBy') || 'composite') as SortField;
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as SortOrder;

  try {
    const { students, kpis } = await getFilteredLeaderboard({
      tab,
      branch,
      search,
      sortBy,
      sortOrder,
    });

    const elapsed = Date.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        data: {
          students,
          kpis: {
            ...kpis,
            cacheLatencyMs: Math.max(kpis.cacheLatencyMs, elapsed),
          },
          activeFilter: {
            tab,
            branch,
            search,
            sortBy,
            sortOrder,
          },
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
          'X-Cache-Source': kpis.cacheSource,
          'X-Response-Time-Ms': `${elapsed}ms`,
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch leaderboard data';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
