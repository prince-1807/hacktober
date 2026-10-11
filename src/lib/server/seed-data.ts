// Genuine BIT Sindri Student Profiles (7 Coders from data/2k25 coding platforms.xlsx)
// Strictly contains only genuine student records from the provided dataset.

import { StudentProfile } from '@/types/campus-cp';
import { computeStudentScoring } from './scoring';

interface SeedInput {
  id: string;
  registrationNo: string;
  name: string;
  branch: string;
  year: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  cfHandle: string;
  cfRating: number;
  cfSolved: number;
  cfRank: string;
  lcHandle: string;
  lcRating: number;
  lcSolved: number;
  lcRank: string;
  ccHandle: string;
  ccRating: number;
  ccSolved: number;
  ccStars: string;
  gfgHandle: string;
  gfgCodingScore: number;
  gfgSolved: number;
  hrHandle: string;
  hrPoints: number;
  hrSolved: number;
  hrBadges: string;
}

const rawSeedList: SeedInput[] = [
  // 1. Rishabh Kumar
  {
    id: 'bit-2101050',
    registrationNo: '2101050',
    name: 'Rishabh Kumar',
    branch: 'CSE',
    year: 4,
    gender: 'MALE',
    cfHandle: 'rizzabh1244',
    cfRating: 934,
    cfSolved: 108,
    cfRank: 'Newbie',
    lcHandle: 'rishabh1244',
    lcRating: 1363,
    lcSolved: 164,
    lcRank: 'Active Coder',
    ccHandle: '',
    ccRating: 0,
    ccSolved: 0,
    ccStars: 'Unrated',
    gfgHandle: '',
    gfgCodingScore: 0,
    gfgSolved: 0,
    hrHandle: '',
    hrPoints: 0,
    hrSolved: 0,
    hrBadges: 'Unrated',
  },
  // 2. Sourav Kumar
  {
    id: 'bit-2101051',
    registrationNo: '2101051',
    name: 'Sourav Kumar',
    branch: 'CSE',
    year: 4,
    gender: 'MALE',
    cfHandle: 'sourav_19_1',
    cfRating: 1076,
    cfSolved: 238,
    cfRank: 'Newbie',
    lcHandle: 'sourav_kumar_19',
    lcRating: 1403,
    lcSolved: 146,
    lcRank: 'Active Coder',
    ccHandle: '',
    ccRating: 0,
    ccSolved: 0,
    ccStars: 'Unrated',
    gfgHandle: '',
    gfgCodingScore: 0,
    gfgSolved: 0,
    hrHandle: 'kumarsourav19101',
    hrPoints: 520,
    hrSolved: 75,
    hrBadges: 'Silver Problem Solving',
  },
  // 3. Shrestha Ghosh
  {
    id: 'bit-2101052',
    registrationNo: '2101052',
    name: 'Shrestha Ghosh',
    branch: 'CSE',
    year: 4,
    gender: 'FEMALE',
    cfHandle: '',
    cfRating: 0,
    cfSolved: 0,
    cfRank: 'Unrated',
    lcHandle: 'ShresthaGhosh1612',
    lcRating: 0,
    lcSolved: 222,
    lcRank: 'Active Coder',
    ccHandle: '',
    ccRating: 0,
    ccSolved: 0,
    ccStars: 'Unrated',
    gfgHandle: '',
    gfgCodingScore: 0,
    gfgSolved: 0,
    hrHandle: 'gmoumita114',
    hrPoints: 550,
    hrSolved: 80,
    hrBadges: 'Gold Problem Solving',
  },
  // 4. Bhaskar kumar
  {
    id: 'bit-2101053',
    registrationNo: '2101053',
    name: 'Bhaskar kumar',
    branch: 'CSE',
    year: 4,
    gender: 'MALE',
    cfHandle: 'bhaskarkumar1667',
    cfRating: 616,
    cfSolved: 4,
    cfRank: 'Newbie',
    lcHandle: 'Bhaskarkumar01',
    lcRating: 1518,
    lcSolved: 259,
    lcRank: 'Top 25%',
    ccHandle: '',
    ccRating: 0,
    ccSolved: 0,
    ccStars: 'Unrated',
    gfgHandle: 'bhaskarkuh9l0',
    gfgCodingScore: 580,
    gfgSolved: 130,
    hrHandle: 'Bhaskarkumar1667',
    hrPoints: 580,
    hrSolved: 90,
    hrBadges: 'Gold Problem Solving',
  },
  // 5. Chaitanya Anand
  {
    id: 'bit-2101054',
    registrationNo: '2101054',
    name: 'Chaitanya Anand',
    branch: 'CSE',
    year: 4,
    gender: 'MALE',
    cfHandle: 'whoschaitanya',
    cfRating: 1013,
    cfSolved: 255,
    cfRank: 'Newbie',
    lcHandle: 'Chaitanya_1631',
    lcRating: 0,
    lcSolved: 103,
    lcRank: 'Active Coder',
    ccHandle: '',
    ccRating: 0,
    ccSolved: 0,
    ccStars: 'Unrated',
    gfgHandle: '',
    gfgCodingScore: 0,
    gfgSolved: 0,
    hrHandle: 'chaitanyaanand21',
    hrPoints: 480,
    hrSolved: 65,
    hrBadges: 'Silver C++',
  },
  // 6. Dhruv Swarnkar
  {
    id: 'bit-2101055',
    registrationNo: '2101055',
    name: 'Dhruv Swarnkar',
    branch: 'CSE',
    year: 4,
    gender: 'MALE',
    cfHandle: 'dhruv15',
    cfRating: 0,
    cfSolved: 5,
    cfRank: 'Unrated',
    lcHandle: 'Dhruv7015',
    lcRating: 1453,
    lcSolved: 68,
    lcRank: 'Active Coder',
    ccHandle: '',
    ccRating: 0,
    ccSolved: 0,
    ccStars: 'Unrated',
    gfgHandle: '',
    gfgCodingScore: 0,
    gfgSolved: 0,
    hrHandle: 'dhruvswankar15',
    hrPoints: 460,
    hrSolved: 55,
    hrBadges: 'Bronze Problem Solving',
  },
  // 7. Nikhil Kumar
  {
    id: 'bit-2101056',
    registrationNo: '2101056',
    name: 'Nikhil Kumar',
    branch: 'CSE',
    year: 4,
    gender: 'MALE',
    cfHandle: 'nikhil-codes',
    cfRating: 0,
    cfSolved: 0,
    cfRank: 'Unrated',
    lcHandle: 'nickhillcodes',
    lcRating: 0,
    lcSolved: 63,
    lcRank: 'Active Coder',
    ccHandle: '',
    ccRating: 0,
    ccSolved: 0,
    ccStars: 'Unrated',
    gfgHandle: '',
    gfgCodingScore: 0,
    gfgSolved: 0,
    hrHandle: 'sk1060680',
    hrPoints: 115,
    hrSolved: 25,
    hrBadges: 'Bronze Python',
  },
];

/**
 * Transforms raw input into a full StudentProfile with computed normalizations and composite ratings.
 */
export function buildStudentProfile(raw: SeedInput): StudentProfile {
  const scoring = computeStudentScoring({
    cfRating: raw.cfRating,
    lcRating: raw.lcRating,
    lcSolved: raw.lcSolved,
    ccRating: raw.ccRating,
    gfgCodingScore: raw.gfgCodingScore,
    hrPoints: raw.hrPoints,
  });

  const totalSolved =
    raw.cfSolved + raw.lcSolved + raw.ccSolved + raw.gfgSolved + raw.hrSolved;

  const now = new Date().toISOString();

  return {
    id: raw.id,
    registrationNo: raw.registrationNo,
    name: raw.name,
    branch: raw.branch,
    year: raw.year,
    gender: raw.gender,
    compositeRating: scoring.compositeRating,
    totalSolved,
    rankTier: scoring.rankTier,
    rankBadgeColor: scoring.rankBadgeColor,
    lastSyncedAt: now,
    platforms: {
      codeforces: {
        platform: 'CODEFORCES',
        handle: raw.cfHandle,
        rawRating: raw.cfRating,
        normalizedScore: scoring.cfNormalized,
        problemsSolved: raw.cfSolved,
        badgeOrRank: raw.cfRank,
        lastFetchedAt: now,
      },
      leetcode: {
        platform: 'LEETCODE',
        handle: raw.lcHandle,
        rawRating: raw.lcRating,
        normalizedScore: scoring.lcNormalized,
        problemsSolved: raw.lcSolved,
        badgeOrRank: raw.lcRank,
        lastFetchedAt: now,
      },
      codechef: {
        platform: 'CODECHEF',
        handle: raw.ccHandle,
        rawRating: raw.ccRating,
        normalizedScore: scoring.ccNormalized,
        problemsSolved: raw.ccSolved,
        badgeOrRank: raw.ccStars,
        lastFetchedAt: now,
      },
      geeksforgeeks: {
        platform: 'GEEKSFORGEEKS',
        handle: raw.gfgHandle,
        rawRating: raw.gfgCodingScore,
        normalizedScore: scoring.gfgNormalized,
        problemsSolved: raw.gfgSolved,
        badgeOrRank: raw.gfgHandle ? 'Score ' + raw.gfgCodingScore : 'Unrated',
        lastFetchedAt: now,
      },
      hackerrank: {
        platform: 'HACKERRANK',
        handle: raw.hrHandle,
        rawRating: raw.hrPoints,
        normalizedScore: scoring.hrNormalized,
        problemsSolved: raw.hrSolved,
        badgeOrRank: raw.hrBadges,
        lastFetchedAt: now,
      },
    },
  };
}

/**
 * Returns pre-loaded BIT Sindri students sorted by Composite Rating descending.
 */
export function getInitialSeedStudents(): StudentProfile[] {
  return rawSeedList
    .map(buildStudentProfile)
    .sort((a, b) => b.compositeRating - a.compositeRating);
}
