import { ContestItem } from '@/types/campus-cp';

interface CodeforcesApiContest {
  id: number;
  name: string;
  type: string;
  phase: string;
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds?: number;
  relativeTimeSeconds?: number;
}

/**
 * Calculates upcoming dates for recurring weekly contests relative to current time
 */
function getNextDayOfWeek(dayOfWeek: number, hourUTC: number, minuteUTC: number): Date {
  const now = new Date();
  const result = new Date(now);
  result.setUTCHours(hourUTC, minuteUTC, 0, 0);

  let daysAhead = (dayOfWeek - now.getUTCDay() + 7) % 7;
  // If today is the day but time has passed, jump to next week
  if (daysAhead === 0 && now.getTime() >= result.getTime()) {
    daysAhead = 7;
  }
  result.setUTCDate(now.getUTCDate() + daysAhead);
  return result;
}

/**
 * Generates regular recurring schedule for major coding platforms
 */
export function getScheduledContests(): ContestItem[] {
  const now = new Date();

  // LeetCode Weekly Contest (Every Sunday 02:30 UTC / 08:00 AM IST)
  const lcWeeklyStart = getNextDayOfWeek(0, 2, 30);
  const lcWeeklyEnd = new Date(lcWeeklyStart.getTime() + 90 * 60 * 1000);

  // LeetCode Biweekly Contest (Upcoming Saturday 14:30 UTC / 08:00 PM IST)
  const lcBiweeklyStart = getNextDayOfWeek(6, 14, 30);
  const lcBiweeklyEnd = new Date(lcBiweeklyStart.getTime() + 90 * 60 * 1000);

  // CodeChef Starters (Every Wednesday 14:30 UTC / 08:00 PM IST)
  const ccStartersStart = getNextDayOfWeek(3, 14, 30);
  const ccStartersEnd = new Date(ccStartersStart.getTime() + 120 * 60 * 1000);

  // AtCoder Beginner Contest (Every Saturday 12:00 UTC / 05:30 PM IST)
  const abcStart = getNextDayOfWeek(6, 12, 0);
  const abcEnd = new Date(abcStart.getTime() + 100 * 60 * 1000);

  // GeeksforGeeks Weekly Contest (Every Sunday 13:30 UTC / 07:00 PM IST)
  const gfgStart = getNextDayOfWeek(0, 13, 30);
  const gfgEnd = new Date(gfgStart.getTime() + 90 * 60 * 1000);

  // Codeforces Educational / Div 2 Fallback Contest (Upcoming Friday 14:35 UTC / 08:05 PM IST)
  const cfUpcomingStart = getNextDayOfWeek(5, 14, 35);
  const cfUpcomingEnd = new Date(cfUpcomingStart.getTime() + 120 * 60 * 1000);

  // HackerRank Campus Challenge (Upcoming Tuesday 12:30 UTC / 06:00 PM IST)
  const hrStart = getNextDayOfWeek(2, 12, 30);
  const hrEnd = new Date(hrStart.getTime() + 120 * 60 * 1000);

  const baseContests: ContestItem[] = [
    {
      id: `lc-weekly-${lcWeeklyStart.toISOString()}`,
      title: 'LeetCode Weekly Contest 419',
      platform: 'LEETCODE',
      startTime: lcWeeklyStart.toISOString(),
      endTime: lcWeeklyEnd.toISOString(),
      durationMinutes: 90,
      url: 'https://leetcode.com/contest/',
      status: now >= lcWeeklyStart && now <= lcWeeklyEnd ? 'LIVE' : 'UPCOMING',
      difficulty: 'Medium to Hard',
    },
    {
      id: `lc-biweekly-${lcBiweeklyStart.toISOString()}`,
      title: 'LeetCode Biweekly Contest 142',
      platform: 'LEETCODE',
      startTime: lcBiweeklyStart.toISOString(),
      endTime: lcBiweeklyEnd.toISOString(),
      durationMinutes: 90,
      url: 'https://leetcode.com/contest/',
      status: now >= lcBiweeklyStart && now <= lcBiweeklyEnd ? 'LIVE' : 'UPCOMING',
      difficulty: 'Medium to Hard',
    },
    {
      id: `cc-starters-${ccStartersStart.toISOString()}`,
      title: 'CodeChef Starters 156 (Rated for All Divisions)',
      platform: 'CODECHEF',
      startTime: ccStartersStart.toISOString(),
      endTime: ccStartersEnd.toISOString(),
      durationMinutes: 120,
      url: 'https://www.codechef.com/contests',
      status: now >= ccStartersStart && now <= ccStartersEnd ? 'LIVE' : 'UPCOMING',
      difficulty: 'Div 1, 2, 3 & 4',
    },
    {
      id: `atcoder-abc-${abcStart.toISOString()}`,
      title: 'AtCoder Beginner Contest 375 (ABC)',
      platform: 'ATCODER',
      startTime: abcStart.toISOString(),
      endTime: abcEnd.toISOString(),
      durationMinutes: 100,
      url: 'https://atcoder.jp/contests/',
      status: now >= abcStart && now <= abcEnd ? 'LIVE' : 'UPCOMING',
      difficulty: 'Beginner to Advanced',
    },
    {
      id: `gfg-weekly-${gfgStart.toISOString()}`,
      title: 'GeeksforGeeks Weekly Coding Contest 176',
      platform: 'GEEKSFORGEEKS',
      startTime: gfgStart.toISOString(),
      endTime: gfgEnd.toISOString(),
      durationMinutes: 90,
      url: 'https://practice.geeksforgeeks.org/events/rec/gfg-weekly-coding-contest',
      status: now >= gfgStart && now <= gfgEnd ? 'LIVE' : 'UPCOMING',
      difficulty: 'DSA & Algorithms',
    },
    {
      id: `cf-div2-fallback-${cfUpcomingStart.toISOString()}`,
      title: 'Codeforces Round 978 (Div. 2)',
      platform: 'CODEFORCES',
      startTime: cfUpcomingStart.toISOString(),
      endTime: cfUpcomingEnd.toISOString(),
      durationMinutes: 120,
      url: 'https://codeforces.com/contests',
      status: now >= cfUpcomingStart && now <= cfUpcomingEnd ? 'LIVE' : 'UPCOMING',
      difficulty: 'Rated for Div. 2',
    },
    {
      id: `hr-campus-${hrStart.toISOString()}`,
      title: 'HackerRank Campus CodeFest 2026',
      platform: 'HACKERRANK',
      startTime: hrStart.toISOString(),
      endTime: hrEnd.toISOString(),
      durationMinutes: 120,
      url: 'https://www.hackerrank.com/contests',
      status: now >= hrStart && now <= hrEnd ? 'LIVE' : 'UPCOMING',
      difficulty: 'Problem Solving & C++',
    },
  ];

  return baseContests;
}

/**
 * Fetches real-time upcoming Codeforces contests and combines with platform schedules
 */
export async function getLiveAndUpcomingContests(): Promise<ContestItem[]> {
  const scheduled = getScheduledContests();
  let liveCfContests: ContestItem[] = [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://codeforces.com/api/contest.list?gym=false', {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'OK' && Array.isArray(data.result)) {
        const upcoming = (data.result as CodeforcesApiContest[])
          .filter((c) => c.phase === 'BEFORE' || c.phase === 'CODING')
          .slice(0, 5);

        const now = new Date();

        liveCfContests = upcoming.map((c) => {
          const startTime = c.startTimeSeconds
            ? new Date(c.startTimeSeconds * 1000).toISOString()
            : new Date(Date.now() + Math.abs(c.relativeTimeSeconds || 3600) * 1000).toISOString();
          const durationMinutes = Math.round(c.durationSeconds / 60);
          const endTime = new Date(
            new Date(startTime).getTime() + durationMinutes * 60 * 1000
          ).toISOString();

          return {
            id: `cf-${c.id}`,
            title: c.name,
            platform: 'CODEFORCES',
            startTime,
            endTime,
            durationMinutes,
            url: `https://codeforces.com/contests/${c.id}`,
            status: c.phase === 'CODING' ? 'LIVE' : 'UPCOMING',
            difficulty: c.type || 'Rated Contest',
          };
        });
      }
    }
  } catch {
    // If Codeforces API is slow or times out, scheduled fallback is seamlessly used
  }

  // Merge, remove fallback duplicate if live CF returned
  let allContests = scheduled;
  if (liveCfContests.length > 0) {
    allContests = scheduled.filter((c) => c.platform !== 'CODEFORCES').concat(liveCfContests);
  }

  // Sort by startTime ascending
  allContests.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return allContests;
}
