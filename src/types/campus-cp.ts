// Campus_CP Core TypeScript Interfaces and Types

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type Branch =
  | 'CSE'
  | 'IT'
  | 'ECE'
  | 'EE'
  | 'ME'
  | 'Civil'
  | 'Metallurgy'
  | 'Chemical'
  | 'Mining'
  | 'Production';

export type PlatformKey =
  | 'codeforces'
  | 'leetcode'
  | 'codechef'
  | 'geeksforgeeks'
  | 'hackerrank';

export interface PlatformScore {
  platform: 'CODEFORCES' | 'LEETCODE' | 'CODECHEF' | 'GEEKSFORGEEKS' | 'HACKERRANK';
  handle: string;
  rawRating: number;
  normalizedScore: number; // 0 - 1000 scale
  problemsSolved: number;
  badgeOrRank: string;
  lastFetchedAt: string;
}

export interface StudentProfile {
  id: string;
  registrationNo: string;
  name: string;
  branch: Branch | string;
  year: number; // 1 | 2 | 3 | 4
  gender: Gender;
  avatarUrl?: string;
  compositeRating: number; // 0 - 1000 weighted
  totalSolved: number;
  platforms: {
    codeforces: PlatformScore;
    leetcode: PlatformScore;
    codechef: PlatformScore;
    geeksforgeeks: PlatformScore;
    hackerrank: PlatformScore;
  };
  rankTier: string; // Grandmaster, Master, Candidate Master, Specialist, Pupil, Newbie
  rankBadgeColor: string;
  lastSyncedAt: string;
}

export type LeaderboardTab =
  | 'all'
  | 'year1'
  | 'year2'
  | 'year3'
  | 'year4'
  | 'girls';

export type SortField =
  | 'composite'
  | 'codeforces'
  | 'leetcode'
  | 'codechef'
  | 'geeksforgeeks'
  | 'hackerrank'
  | 'solved';

export type SortOrder = 'asc' | 'desc';

export interface LeaderboardKPIs {
  totalCoders: number;
  highestScore: number;
  topCoderName: string;
  topCoderBranch: string;
  totalProblemsSolved: number;
  cacheSource: 'REDIS_HIT' | 'IN_MEMORY_SWR' | 'FRESH_REVALIDATE';
  cacheLatencyMs: number;
  lastCacheUpdate: string;
}

export interface RegisterFormData {
  name: string;
  registrationNo: string;
  branch: string;
  year: number;
  gender: Gender;
  cfHandle: string;
  lcHandle: string;
  ccHandle: string;
  gfgHandle: string;
  hrHandle: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LeaderboardResponse {
  students: StudentProfile[];
  kpis: LeaderboardKPIs;
  activeFilter: {
    tab: LeaderboardTab;
    branch?: string;
    search?: string;
    sortBy: SortField;
    sortOrder: SortOrder;
  };
}
