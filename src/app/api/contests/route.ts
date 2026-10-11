import { NextRequest, NextResponse } from 'next/server';
import { getLiveAndUpcomingContests } from '@/lib/server/contests-data';
import { ContestPlatform } from '@/types/campus-cp';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platformFilter = searchParams.get('platform')?.toUpperCase();

    const contests = await getLiveAndUpcomingContests();

    let filtered = contests;
    if (platformFilter && platformFilter !== 'ALL') {
      filtered = contests.filter((c) => c.platform === (platformFilter as ContestPlatform));
    }

    return NextResponse.json(
      {
        success: true,
        count: filtered.length,
        data: filtered,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch contest listings.',
      },
      { status: 500 }
    );
  }
}
