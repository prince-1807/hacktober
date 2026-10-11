// Database Seeder for Genuine Students (from data/genuine_students.json)
// Usage: node scripts/seed-database.mjs

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const jsonPath = path.join(__dirname, '..', 'data', 'genuine_students.json');

// Normalization formulas
function normalizeCF(rating) {
  if (!rating || rating <= 0) return 0;
  return Math.min(1000, Math.max(0, (rating / 2400) * 1000));
}

function normalizeLC(rating, solved) {
  if (!rating || rating <= 0) {
    return Math.min(600, (solved || 0) * 1.2);
  }
  return Math.min(1000, Math.max(0, ((rating - 1200) / 1600) * 1000));
}

function normalizeCC(rating) {
  if (!rating || rating <= 0) return 0;
  return Math.min(1000, Math.max(0, ((rating - 1000) / 1500) * 1000));
}

function normalizeGFG(score) {
  if (!score || score <= 0) return 0;
  return Math.min(1000, Math.max(0, (score / 2500) * 1000));
}

function normalizeHR(points) {
  if (!points || points <= 0) return 0;
  return Math.min(1000, Math.max(0, (points / 1000) * 1000));
}

function calcComposite(cf, lc, cc, gfg, hr) {
  const comp = 0.35 * cf + 0.30 * lc + 0.20 * cc + 0.10 * gfg + 0.05 * hr;
  return Number(Math.min(1000, Math.max(0, comp)).toFixed(2));
}

async function main() {
  console.log('--- Seeding Genuine BIT Sindri Students into PostgreSQL ---');
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: ${jsonPath} does not exist.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, 'utf8');
  const students = JSON.parse(raw);

  for (const s of students) {
    console.log(`Processing: ${s.name} (${s.registrationNo})...`);

    // Known ratings from platforms
    let cfRating = 0;
    let cfSolved = 0;
    let lcRating = 0;
    let lcSolved = 0;
    let ccRating = 0;
    let ccSolved = 0;
    let gfgScore = 0;
    let gfgSolved = 0;
    let hrPoints = 0;
    let hrSolved = 0;

    if (s.cfHandle === 'rizzabh1244') { cfRating = 934; cfSolved = 145; }
    else if (s.cfHandle === 'sourav_19_1') { cfRating = 1076; cfSolved = 170; }
    else if (s.cfHandle === 'bhaskarkumar1667') { cfRating = 616; cfSolved = 80; }
    else if (s.cfHandle === 'whoschaitanya') { cfRating = 1013; cfSolved = 150; }
    else if (s.cfHandle === 'dhruv15') { cfRating = 800; cfSolved = 40; }
    else if (s.cfHandle === 'nikhil-codes') { cfRating = 750; cfSolved = 35; }

    if (s.lcHandle === 'rishabh1244') { lcRating = 1363; lcSolved = 164; }
    else if (s.lcHandle === 'sourav_kumar_19') { lcRating = 1403; lcSolved = 146; }
    else if (s.lcHandle === 'ShresthaGhosh1612') { lcRating = 0; lcSolved = 222; }
    else if (s.lcHandle === 'Bhaskarkumar01') { lcRating = 1518; lcSolved = 259; }
    else if (s.lcHandle === 'Chaitanya_1631') { lcRating = 0; lcSolved = 103; }
    else if (s.lcHandle === 'Dhruv7015') { lcRating = 1453; lcSolved = 68; }
    else if (s.lcHandle === 'nickhillcodes') { lcRating = 0; lcSolved = 63; }

    if (s.gfgHandle) { gfgScore = 480; gfgSolved = 110; }
    if (s.hrHandle) { hrPoints = 500; hrSolved = 60; }

    const s_cf = normalizeCF(cfRating);
    const s_lc = normalizeLC(lcRating, lcSolved);
    const s_cc = normalizeCC(ccRating);
    const s_gfg = normalizeGFG(gfgScore);
    const s_hr = normalizeHR(hrPoints);

    const compositeRating = calcComposite(s_cf, s_lc, s_cc, s_gfg, s_hr);
    const totalSolved = cfSolved + lcSolved + ccSolved + gfgSolved + hrSolved;

    const upsertedStudent = await prisma.student.upsert({
      where: { registrationNo: s.registrationNo },
      update: {
        name: s.name,
        branch: s.branch,
        year: s.year,
        gender: s.gender,
        compositeRating,
        totalSolved,
      },
      create: {
        registrationNo: s.registrationNo,
        name: s.name,
        branch: s.branch,
        year: s.year,
        gender: s.gender,
        compositeRating,
        totalSolved,
      },
    });

    // Create Platform Handles
    const platformData = [
      { platform: 'CODEFORCES', handle: s.cfHandle || 'unrated', rating: cfRating, norm: s_cf, solved: cfSolved, badge: 'Newbie' },
      { platform: 'LEETCODE', handle: s.lcHandle || 'unrated', rating: lcRating, norm: s_lc, solved: lcSolved, badge: lcRating >= 1500 ? 'Top 25%' : 'Active' },
      { platform: 'CODECHEF', handle: s.ccHandle || 'unrated', rating: ccRating, norm: s_cc, solved: ccSolved, badge: '2★' },
      { platform: 'GEEKSFORGEEKS', handle: s.gfgHandle || 'unrated', rating: gfgScore, norm: s_gfg, solved: gfgSolved, badge: `Score ${gfgScore}` },
      { platform: 'HACKERRANK', handle: s.hrHandle || 'unrated', rating: hrPoints, norm: s_hr, solved: hrSolved, badge: 'Silver' },
    ];

    for (const p of platformData) {
      await prisma.platformHandle.upsert({
        where: {
          studentId_platform: {
            studentId: upsertedStudent.id,
            platform: p.platform,
          },
        },
        update: {
          handle: p.handle,
          rating: p.rating,
          normalizedScore: p.norm,
          problemsSolved: p.solved,
          badgesOrStars: p.badge,
        },
        create: {
          studentId: upsertedStudent.id,
          platform: p.platform,
          handle: p.handle,
          rating: p.rating,
          normalizedScore: p.norm,
          problemsSolved: p.solved,
          badgesOrStars: p.badge,
        },
      });
    }

    console.log(`  -> Inserted/Updated: ${s.name} (Composite: ${compositeRating})`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
