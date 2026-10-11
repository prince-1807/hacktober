// Campus_CP Unified Cache & Data Store
// Implements SWR Caching Layer via Redis (ioredis) with automatic, graceful fallback
// to High-Speed In-Memory Store so the application works out-of-the-box (<50ms latency).

import Redis from 'ioredis';
import {
  StudentProfile,
  LeaderboardKPIs,
  LeaderboardTab,
  SortField,
  SortOrder,
  RegisterFormData,
} from '@/types/campus-cp';
import { getInitialSeedStudents } from './seed-data';
import { fetchAllPlatformsConcurrently } from './scrapers';
import { computeStudentScoring } from './scoring';
import { env } from '../env';

// Global singleton in-memory container to persist across hot-reloads in Next.js development
declare global {
  // eslint-disable-next-line no-var
  var __campusCpMemoryStudents: StudentProfile[] | undefined;
  // eslint-disable-next-line no-var
  var __campusCpRedisClient: Redis | null | undefined;
  // eslint-disable-next-line no-var
  var __campusCpRedisConnected: boolean | undefined;
}

const REDIS_CACHE_KEY = 'campus_cp:leaderboard:v1';
const CACHE_TTL_SECONDS = 300; // 5 minutes fresh TTL

// Initialize or retrieve memory store
function getMemoryStudents(): StudentProfile[] {
  if (!globalThis.__campusCpMemoryStudents) {
    globalThis.__campusCpMemoryStudents = getInitialSeedStudents();
  }
  return globalThis.__campusCpMemoryStudents;
}

function setMemoryStudents(students: StudentProfile[]): void {
  globalThis.__campusCpMemoryStudents = students;
}

/**
 * Lazy, resilient Redis client factory that avoids blocking if Redis server is inactive.
 */
function getRedisClient(): Redis | null {
  if (globalThis.__campusCpRedisConnected === false) {
    return null;
  }

  if (globalThis.__campusCpRedisClient) {
    return globalThis.__campusCpRedisClient;
  }

  try {
    const client = new Redis(env.REDIS_URL, {
      connectTimeout: 800,
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      retryStrategy: () => null, // Do not endlessly retry on failure
    });

    client.on('error', () => {
      globalThis.__campusCpRedisConnected = false;
    });

    globalThis.__campusCpRedisClient = client;
    return client;
  } catch {
    globalThis.__campusCpRedisConnected = false;
    return null;
  }
}

/**
 * Calculates real-time KPIs from active students list.
 */
function calculateKPIs(
  students: StudentProfile[],
  cacheSource: 'REDIS_HIT' | 'IN_MEMORY_SWR' | 'FRESH_REVALIDATE',
  latencyMs: number
): LeaderboardKPIs {
  const totalCoders = students.length;
  let highestScore = 0;
  let topCoderName = 'Aman Kumar';
  let topCoderBranch = 'CSE';
  let totalProblemsSolved = 0;

  students.forEach((s) => {
    totalProblemsSolved += s.totalSolved;
    if (s.compositeRating > highestScore) {
      highestScore = s.compositeRating;
      topCoderName = s.name;
      topCoderBranch = s.branch;
    }
  });

  return {
    totalCoders,
    highestScore: Number(highestScore.toFixed(2)),
    topCoderName,
    topCoderBranch,
    totalProblemsSolved,
    cacheSource,
    cacheLatencyMs: latencyMs,
    lastCacheUpdate: new Date().toISOString(),
  };
}

/**
 * Fetches all student records with SWR Redis / in-memory cache lookup.
 */
export async function getAllStudentsWithCache(): Promise<{
  students: StudentProfile[];
  source: 'REDIS_HIT' | 'IN_MEMORY_SWR' | 'FRESH_REVALIDATE';
  latencyMs: number;
}> {
  const startTime = Date.now();
  const redis = getRedisClient();

  if (redis && globalThis.__campusCpRedisConnected !== false) {
    try {
      if (redis.status === 'wait') {
        await redis.connect();
      }
      const cached = await redis.get(REDIS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as StudentProfile[];
        const latencyMs = Math.max(1, Date.now() - startTime);
        return {
          students: parsed,
          source: 'REDIS_HIT',
          latencyMs,
        };
      }
    } catch {
      globalThis.__campusCpRedisConnected = false;
    }
  }

  // Fast In-Memory SWR store (<5ms)
  const memoryStudents = getMemoryStudents();
  const latencyMs = Math.max(1, Date.now() - startTime);

  // Background async populate to Redis if alive
  if (redis && globalThis.__campusCpRedisConnected) {
    redis
      .setex(REDIS_CACHE_KEY, CACHE_TTL_SECONDS, JSON.stringify(memoryStudents))
      .catch(() => {});
  }

  return {
    students: [...memoryStudents],
    source: 'IN_MEMORY_SWR',
    latencyMs,
  };
}

/**
 * Filter and sort leaderboard results according to active query parameters.
 */
export async function getFilteredLeaderboard(options: {
  tab?: LeaderboardTab;
  branch?: string;
  search?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}): Promise<{
  students: StudentProfile[];
  kpis: LeaderboardKPIs;
}> {
  const { tab = 'all', branch, search, sortBy = 'composite', sortOrder = 'desc' } = options;
  const { students: rawStudents, source, latencyMs } = await getAllStudentsWithCache();

  // 1. Tab filtering
  let filtered = rawStudents.filter((s) => {
    switch (tab) {
      case 'year1':
        return s.year === 1;
      case 'year2':
        return s.year === 2;
      case 'year3':
        return s.year === 3;
      case 'year4':
        return s.year === 4;
      case 'girls':
        return s.gender === 'FEMALE';
      case 'all':
      default:
        return true;
    }
  });

  // 2. Branch filtering
  if (branch && branch !== 'ALL' && branch.trim() !== '') {
    filtered = filtered.filter(
      (s) => s.branch.toLowerCase() === branch.toLowerCase()
    );
  }

  // 3. Search query filtering
  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.registrationNo.toLowerCase().includes(q) ||
        s.platforms.codeforces.handle.toLowerCase().includes(q) ||
        s.platforms.leetcode.handle.toLowerCase().includes(q) ||
        s.platforms.codechef.handle.toLowerCase().includes(q)
    );
  }

  // 4. Sorting
  filtered.sort((a, b) => {
    let valA = 0;
    let valB = 0;

    switch (sortBy) {
      case 'codeforces':
        valA = a.platforms.codeforces.rawRating;
        valB = b.platforms.codeforces.rawRating;
        break;
      case 'leetcode':
        valA = a.platforms.leetcode.rawRating;
        valB = b.platforms.leetcode.rawRating;
        break;
      case 'codechef':
        valA = a.platforms.codechef.rawRating;
        valB = b.platforms.codechef.rawRating;
        break;
      case 'geeksforgeeks':
        valA = a.platforms.geeksforgeeks.rawRating;
        valB = b.platforms.geeksforgeeks.rawRating;
        break;
      case 'hackerrank':
        valA = a.platforms.hackerrank.rawRating;
        valB = b.platforms.hackerrank.rawRating;
        break;
      case 'solved':
        valA = a.totalSolved;
        valB = b.totalSolved;
        break;
      case 'composite':
      default:
        valA = a.compositeRating;
        valB = b.compositeRating;
        break;
    }

    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const kpis = calculateKPIs(rawStudents, source, latencyMs);

  return {
    students: filtered,
    kpis,
  };
}

/**
 * Registers a new student and concurrently fetches initial platform ratings.
 */
export async function registerNewStudent(data: RegisterFormData): Promise<StudentProfile> {
  const currentList = getMemoryStudents();

  // Check duplicate registration
  const existing = currentList.find(
    (s) => s.registrationNo.trim() === data.registrationNo.trim()
  );
  if (existing) {
    throw new Error(`Student with Registration Number ${data.registrationNo} is already registered.`);
  }

  // Concurrently fetch external platforms
  const platformScores = await fetchAllPlatformsConcurrently({
    cfHandle: data.cfHandle,
    lcHandle: data.lcHandle,
    ccHandle: data.ccHandle,
    gfgHandle: data.gfgHandle,
    hrHandle: data.hrHandle,
  });

  const scoring = computeStudentScoring({
    cfRating: platformScores.codeforces.rawRating,
    lcRating: platformScores.leetcode.rawRating,
    lcSolved: platformScores.leetcode.problemsSolved,
    ccRating: platformScores.codechef.rawRating,
    gfgCodingScore: platformScores.geeksforgeeks.rawRating,
    hrPoints: platformScores.hackerrank.rawRating,
  });

  const totalSolved =
    platformScores.codeforces.problemsSolved +
    platformScores.leetcode.problemsSolved +
    platformScores.codechef.problemsSolved +
    platformScores.geeksforgeeks.problemsSolved +
    platformScores.hackerrank.problemsSolved;

  const newStudent: StudentProfile = {
    id: `bit-${data.registrationNo}`,
    registrationNo: data.registrationNo.trim(),
    name: data.name.trim(),
    branch: data.branch,
    year: Number(data.year),
    gender: data.gender,
    compositeRating: scoring.compositeRating,
    totalSolved,
    rankTier: scoring.rankTier,
    rankBadgeColor: scoring.rankBadgeColor,
    lastSyncedAt: new Date().toISOString(),
    platforms: platformScores,
  };

  // Add to in-memory store and re-sort by composite rating
  const updatedList = [newStudent, ...currentList].sort(
    (a, b) => b.compositeRating - a.compositeRating
  );
  setMemoryStudents(updatedList);

  // Invalidate Redis SWR cache
  const redis = getRedisClient();
  if (redis && globalThis.__campusCpRedisConnected) {
    redis.setex(REDIS_CACHE_KEY, CACHE_TTL_SECONDS, JSON.stringify(updatedList)).catch(() => {});
  }

  return newStudent;
}

/**
 * Triggers revalidation and rating sync across all students.
 */
export async function syncAllStudentRatings(): Promise<{
  updatedCount: number;
  timestamp: string;
}> {
  const currentList = getMemoryStudents();
  const updatedList: StudentProfile[] = [];

  for (const student of currentList) {
    // Refresh platform snapshots
    const platformScores = await fetchAllPlatformsConcurrently({
      cfHandle: student.platforms.codeforces.handle,
      lcHandle: student.platforms.leetcode.handle,
      ccHandle: student.platforms.codechef.handle,
      gfgHandle: student.platforms.geeksforgeeks.handle,
      hrHandle: student.platforms.hackerrank.handle,
    });

    const scoring = computeStudentScoring({
      cfRating: platformScores.codeforces.rawRating,
      lcRating: platformScores.leetcode.rawRating,
      lcSolved: platformScores.leetcode.problemsSolved,
      ccRating: platformScores.codechef.rawRating,
      gfgCodingScore: platformScores.geeksforgeeks.rawRating,
      hrPoints: platformScores.hackerrank.rawRating,
    });

    const totalSolved =
      platformScores.codeforces.problemsSolved +
      platformScores.leetcode.problemsSolved +
      platformScores.codechef.problemsSolved +
      platformScores.geeksforgeeks.problemsSolved +
      platformScores.hackerrank.problemsSolved;

    updatedList.push({
      ...student,
      compositeRating: scoring.compositeRating,
      totalSolved,
      rankTier: scoring.rankTier,
      rankBadgeColor: scoring.rankBadgeColor,
      lastSyncedAt: new Date().toISOString(),
      platforms: platformScores,
    });
  }

  updatedList.sort((a, b) => b.compositeRating - a.compositeRating);
  setMemoryStudents(updatedList);

  // Invalidate and update Redis cache
  const redis = getRedisClient();
  if (redis && globalThis.__campusCpRedisConnected) {
    redis.setex(REDIS_CACHE_KEY, CACHE_TTL_SECONDS, JSON.stringify(updatedList)).catch(() => {});
  }

  return {
    updatedCount: updatedList.length,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Deletes a student record by ID or registrationNo (Admin / Moderator action).
 */
export async function deleteStudentById(identifier: string): Promise<boolean> {
  const currentList = getMemoryStudents();
  const index = currentList.findIndex(
    (s) => s.id === identifier || s.registrationNo === identifier
  );

  if (index === -1) {
    return false;
  }

  const updatedList = currentList.filter(
    (s) => s.id !== identifier && s.registrationNo !== identifier
  );
  setMemoryStudents(updatedList);

  // If Prisma is connected, also delete from PostgreSQL
  try {
    const { prisma } = await import('./prisma');
    await prisma.student.deleteMany({
      where: {
        OR: [
          { id: identifier },
          { registrationNo: identifier },
        ],
      },
    });
  } catch {
    // Non-blocking fallback
  }

  // Update Redis cache
  const redis = getRedisClient();
  if (redis && globalThis.__campusCpRedisConnected) {
    redis.setex(REDIS_CACHE_KEY, CACHE_TTL_SECONDS, JSON.stringify(updatedList)).catch(() => {});
  }

  return true;
}

/**
 * Resets the leaderboard back to default seed data (Admin action).
 */
export async function resetLeaderboardToDefault(): Promise<number> {
  const seed = getInitialSeedStudents();
  setMemoryStudents(seed);

  const redis = getRedisClient();
  if (redis && globalThis.__campusCpRedisConnected) {
    redis.setex(REDIS_CACHE_KEY, CACHE_TTL_SECONDS, JSON.stringify(seed)).catch(() => {});
  }

  return seed.length;
}
