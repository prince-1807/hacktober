# CAMPUS_CP : A Campus-Wide CP Leaderboard

> **Hacktoberfest 2026** • Hackathon and Coding Club (HnCC), BIT Sindri

CAMPUS_CP is a high-performance web platform designed to consolidate, normalize, and showcase competitive programming (CP) performance across tech institutions in real time.

---

## 🚀 Problem Statement
At technical institutions, thousands of students actively solve data structures and algorithmic problems across isolated platforms (Codeforces, LeetCode, CodeChef, GeeksforGeeks, and HackerRank) without a unified digital hub to track peer progress, celebrate milestones, or foster healthy intra-college competition. Coding in silos leads to plateaued motivation, leaving campus-wide technical talent fragmented.

---

## 💡 Proposed Solution
`CAMPUS_CP` bridges individual effort into a thriving campus tech culture. 
* **Weighted Composite Rating Model:** Merges contest ratings, submission volumes, and problem difficulties across 5 platforms into a fair **0–1000 campus rating**.
* **6-Tier Segmented Leaderboards:** Instant filtering for 1st, 2nd, 3rd, 4th Year, an exclusive **Girls' Leaderboard** promoting STEM diversity, and an Overall Campus leaderboard.
* **Stale-While-Revalidate (SWR) Caching:** Delivers lightning-fast page loading (<50ms) while keeping stats fresh asynchronously via worker queues without hitting third-party rate limits.

---

## 🛠️ Tech Stack
* **Frontend:** Next.js (React), Tailwind CSS
* **Backend & API:** Node.js (Express) with REST endpoints, BullMQ background worker queue
* **Database & Cache:** PostgreSQL (persistent profiles/histories), Redis (fast cache layer)
* **Scraping & External APIs:** Codeforces Official REST API, LeetCode Public GraphQL endpoint, Axios + Cheerio for CodeChef and GFG DOM parsing

---

## 📊 Campus Score Formula
The composite rating is calculated using a weighted multi-platform distribution model:

$$\text{Campus Score} = (0.35 \times S_{\text{CF}}) + (0.30 \times S_{\text{LC}}) + (0.20 \times S_{\text{CC}}) + (0.10 \times S_{\text{GFG}}) + (0.05 \times S_{\text{HR}})$$

---

## 👥 Team Details — Divine Lords
* **Team Leader:** Bhaskar Kumar
* **Member 2:** Prince Kumar Singh (Cyber Security, 2K25)
* **Member 3:** Shivam Rana
* **Member 4:** Mandal Ritesh Kumar

---

## 📦 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/prince-1807/hacktober.git](https://github.com/prince-1807/hacktober.git)
   cd hacktober
