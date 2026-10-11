// Campus_CP Rating Normalization & Composite Formula Engine

export interface PlatformScoresInput {
  cfRating: number;
  lcRating: number;
  lcSolved: number;
  ccRating: number;
  gfgCodingScore: number;
  hrPoints: number;
}

export interface NormalizedScoresOutput {
  cfNormalized: number;
  lcNormalized: number;
  ccNormalized: number;
  gfgNormalized: number;
  hrNormalized: number;
  compositeRating: number;
  rankTier: string;
  rankBadgeColor: string;
}

/**
 * Normalizes Codeforces rating (0 - 2400 benchmark scale).
 * Formula: min(1000, max(0, (rating / 2400) * 1000))
 */
export function normalizeCodeforces(rating: number): number {
  if (!rating || rating <= 0) return 0;
  const normalized = (rating / 2400) * 1000;
  return Number(Math.min(1000, Math.max(0, normalized)).toFixed(2));
}

/**
 * Normalizes LeetCode rating (1200 - 2800 benchmark scale).
 * If unrated (rating <= 0), falls back to min(600, problemsSolved * 1.2).
 * Formula: min(1000, max(0, ((rating - 1200) / 1600) * 1000))
 */
export function normalizeLeetCode(rating: number, problemsSolved: number = 0): number {
  if (!rating || rating <= 0) {
    const fallback = Math.min(600, (problemsSolved || 0) * 1.2);
    return Number(Math.max(0, fallback).toFixed(2));
  }
  const normalized = ((rating - 1200) / 1600) * 1000;
  return Number(Math.min(1000, Math.max(0, normalized)).toFixed(2));
}

/**
 * Normalizes CodeChef rating (1000 - 2500 benchmark scale).
 * Formula: min(1000, max(0, ((rating - 1000) / 1500) * 1000))
 */
export function normalizeCodeChef(rating: number): number {
  if (!rating || rating <= 0) return 0;
  const normalized = ((rating - 1000) / 1500) * 1000;
  return Number(Math.min(1000, Math.max(0, normalized)).toFixed(2));
}

/**
 * Normalizes GeeksforGeeks coding score (0 - 2500 benchmark scale).
 * Formula: min(1000, max(0, (codingScore / 2500) * 1000))
 */
export function normalizeGeeksforGeeks(codingScore: number): number {
  if (!codingScore || codingScore <= 0) return 0;
  const normalized = (codingScore / 2500) * 1000;
  return Number(Math.min(1000, Math.max(0, normalized)).toFixed(2));
}

/**
 * Normalizes HackerRank badge points (0 - 1000 benchmark scale).
 * Formula: min(1000, max(0, (badgesOrPoints / 1000) * 1000))
 */
export function normalizeHackerRank(badgesOrPoints: number): number {
  if (!badgesOrPoints || badgesOrPoints <= 0) return 0;
  const normalized = (badgesOrPoints / 1000) * 1000;
  return Number(Math.min(1000, Math.max(0, normalized)).toFixed(2));
}

/**
 * Computes the unified Campus_CP Composite Rating.
 * Composite Rating = 0.35 * S_CF + 0.30 * S_LC + 0.20 * S_CC + 0.10 * S_GFG + 0.05 * S_HR
 * Capped at 1000 and rounded to 2 decimal places.
 */
export function calculateCompositeRating(
  cfNorm: number,
  lcNorm: number,
  ccNorm: number,
  gfgNorm: number,
  hrNorm: number
): number {
  const composite =
    0.35 * cfNorm +
    0.30 * lcNorm +
    0.20 * ccNorm +
    0.10 * gfgNorm +
    0.05 * hrNorm;

  const bounded = Math.min(1000, Math.max(0, composite));
  return Number(bounded.toFixed(2));
}

/**
 * Resolves the competitive programming rank tier based on Composite Rating.
 */
export function getRankTier(compositeScore: number): {
  tier: string;
  badgeColor: string;
} {
  if (compositeScore >= 750) {
    return { tier: 'Campus Grandmaster', badgeColor: 'text-[#FF6B00] border-[#FF6B00] bg-[#FF6B00]/10' };
  }
  if (compositeScore >= 600) {
    return { tier: 'Master', badgeColor: 'text-orange-400 border-orange-500/50 bg-orange-500/10' };
  }
  if (compositeScore >= 450) {
    return { tier: 'Candidate Master', badgeColor: 'text-amber-400 border-amber-500/50 bg-amber-500/10' };
  }
  if (compositeScore >= 300) {
    return { tier: 'Specialist', badgeColor: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10' };
  }
  if (compositeScore >= 150) {
    return { tier: 'Pupil', badgeColor: 'text-sky-400 border-sky-500/50 bg-sky-500/10' };
  }
  return { tier: 'Newbie', badgeColor: 'text-zinc-400 border-zinc-600 bg-zinc-800/40' };
}

/**
 * Full calculation pipeline for raw scores to normalized and composite metrics.
 */
export function computeStudentScoring(scores: PlatformScoresInput): NormalizedScoresOutput {
  const cfNormalized = normalizeCodeforces(scores.cfRating);
  const lcNormalized = normalizeLeetCode(scores.lcRating, scores.lcSolved);
  const ccNormalized = normalizeCodeChef(scores.ccRating);
  const gfgNormalized = normalizeGeeksforGeeks(scores.gfgCodingScore);
  const hrNormalized = normalizeHackerRank(scores.hrPoints);

  const compositeRating = calculateCompositeRating(
    cfNormalized,
    lcNormalized,
    ccNormalized,
    gfgNormalized,
    hrNormalized
  );

  const { tier, badgeColor } = getRankTier(compositeRating);

  return {
    cfNormalized,
    lcNormalized,
    ccNormalized,
    gfgNormalized,
    hrNormalized,
    compositeRating,
    rankTier: tier,
    rankBadgeColor: badgeColor,
  };
}
