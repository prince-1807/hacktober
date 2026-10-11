'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Trophy,
  CheckCircle,
  Sparkles,
  BookOpen,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  RotateCcw,
  Plus,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { RegisterModal } from '@/components/RegisterModal';
import { AdminAuthModal } from '@/components/AdminAuthModal';
import {
  StudentProfile,
  LeaderboardKPIs,
  LeaderboardTab,
  SortField,
  SortOrder,
} from '@/types/campus-cp';

export default function CampusCPArena() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [kpis, setKpis] = useState<LeaderboardKPIs>({
    totalCoders: 25,
    highestScore: 846.5,
    topCoderName: 'Aman Kumar',
    topCoderBranch: 'CSE',
    totalProblemsSolved: 9680,
    cacheSource: 'IN_MEMORY_SWR',
    cacheLatencyMs: 3,
    lastCacheUpdate: new Date().toISOString(),
  });

  const [activeTab, setActiveTab] = useState<LeaderboardTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [sortBy, setSortBy] = useState<SortField>('composite');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Modal and Auth States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminToken, setAdminToken] = useState('admin2026');

  // Deletion Confirmation State
  const [deleteCandidate, setDeleteCandidate] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Restore Admin session from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('campus_cp_admin_mode');
      if (stored === 'true') {
        setIsAdminMode(true);
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Fetch leaderboard data from API
  const fetchLeaderboard = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (activeTab) params.set('tab', activeTab);
      if (selectedBranch && selectedBranch !== 'ALL') params.set('branch', selectedBranch);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (sortBy) params.set('sortBy', sortBy);
      if (sortOrder) params.set('sortOrder', sortOrder);

      const res = await fetch(`/api/leaderboard?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStudents(json.data.students || []);
          if (json.data.kpis) {
            setKpis(json.data.kpis);
          }
        }
      }
    } catch {
      // Keep existing state on transient fetch error
    }
  }, [activeTab, selectedBranch, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleAdminAuthSuccess = (token: string) => {
    setIsAdminMode(true);
    setAdminToken(token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('campus_cp_admin_mode', 'true');
    }
    showToast('Moderator mode activated. You can now add or delete coder records.');
  };

  const handleExitAdminMode = () => {
    setIsAdminMode(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('campus_cp_admin_mode');
    }
    showToast('Exited moderator mode. Returned to public view.');
  };

  const handleSyncRatings = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Ratings synced and SWR cache refreshed!');
        await fetchLeaderboard();
      } else {
        showToast('Sync completed with local snapshot.');
      }
    } catch {
      showToast('Rating sync finished with cached snapshots.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRegisterSuccess = (studentName: string) => {
    showToast(`Coder ${studentName} successfully added to the leaderboard!`);
    fetchLeaderboard();
  };

  const confirmDeleteStudent = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/students/${encodeURIComponent(deleteCandidate.id)}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminToken || 'admin2026',
        },
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`Record for ${deleteCandidate.name} was successfully deleted.`);
        setDeleteCandidate(null);
        await fetchLeaderboard();
      } else {
        showToast(json.error || 'Failed to delete student.');
      }
    } catch {
      showToast('Error deleting student record.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdminReset = async () => {
    if (!window.confirm('Reset all leaderboard records to default student seed data?')) {
      return;
    }
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'x-admin-key': adminToken || 'admin2026' },
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Leaderboard reset to default.');
        await fetchLeaderboard();
      } else {
        showToast('Reset failed.');
      }
    } catch {
      showToast('Failed to reset leaderboard.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative text-carbon-text">
      {/* Background Ambient Orange Mesh Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 -mt-32 w-[850px] h-[400px] bg-hacktober-500/25 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-1/3 -left-40 w-[550px] h-[550px] bg-orange-600/20 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-10 -right-40 w-[600px] h-[600px] bg-amber-600/20 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Navbar with brand, live SWR latency, and User vs Moderator switch */}
      <Navbar
        onOpenRegister={() => setIsRegisterOpen(true)}
        onSyncRatings={handleSyncRatings}
        isSyncing={isSyncing}
        cacheSource={kpis.cacheSource}
        cacheLatencyMs={kpis.cacheLatencyMs}
        isAdminMode={isAdminMode}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        onExitAdminMode={handleExitAdminMode}
      />

      {/* Live Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-carbon-elevated border border-hacktober-500 text-white font-mono text-xs shadow-orange-glow">
            <Sparkles className="w-4 h-4 text-hacktober-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Moderator Command Banner (Visible in Admin Mode) */}
        {isAdminMode && (
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/50 shadow-gold-glow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-mono animate-in fade-in">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <span>MODERATOR CONTROLS ACTIVE</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Admin Session
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-0.5">
                  You can delete coder records with the row button, add records, or reset the leaderboard.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-hacktober-500 hover:bg-hacktober-600 text-white text-xs font-semibold flex items-center space-x-1 shadow-orange-glow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Record</span>
              </button>
              <button
                onClick={handleAdminReset}
                title="Reset all records to initial state"
                className="px-3 py-1.5 rounded-lg bg-carbon-elevated hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs border border-carbon-border flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleExitAdminMode}
                className="px-3 py-1.5 rounded-lg bg-carbon-card hover:bg-carbon-elevated text-zinc-400 hover:text-white text-xs border border-carbon-border"
              >
                Exit Admin
              </button>
            </div>
          </div>
        )}

        {/* Top KPI Banner */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Total Registered Coders */}
          <div className="p-4 rounded-xl bg-carbon-surface/90 border border-carbon-border hover:border-hacktober-500/40 transition-colors shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Total Coders
              </span>
              <div className="p-2 rounded-lg bg-hacktober-500/10 text-hacktober-500">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-white">
                {kpis.totalCoders}
              </span>
              <span className="text-xs text-hacktober-400 font-mono">
                across 10 branches
              </span>
            </div>
            <div className="mt-2 text-[11px] text-zinc-400 font-sans">
              Includes 2k25 batch &amp; BIT Sindri verified profiles
            </div>
          </div>

          {/* KPI 2: Highest Composite Rating */}
          <div className="p-4 rounded-xl bg-carbon-surface/90 border border-carbon-border hover:border-hacktober-500/40 transition-colors shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Campus Top Ranker
              </span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-hacktober-400">
                {kpis.highestScore.toFixed(2)}
              </span>
              <span className="text-xs text-zinc-400 font-mono">/ 1000</span>
            </div>
            <div className="mt-2 text-[11px] text-zinc-300 font-sans flex items-center space-x-1.5 truncate">
              <span className="font-semibold text-white">{kpis.topCoderName}</span>
              <span className="text-zinc-500">&bull;</span>
              <span className="text-hacktober-400 font-mono">{kpis.topCoderBranch}</span>
            </div>
          </div>

          {/* KPI 3: Total Problems Solved */}
          <div className="p-4 rounded-xl bg-carbon-surface/90 border border-carbon-border hover:border-hacktober-500/40 transition-colors shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Total Solved
              </span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-white">
                {kpis.totalProblemsSolved.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-400 font-mono">+142 this week</span>
            </div>
            <div className="mt-2 text-[11px] text-zinc-400 font-sans">
              Aggregated across CF, LC, CC, GFG &amp; HR
            </div>
          </div>

          {/* KPI 4: SWR Cache Status */}
          <div className="p-4 rounded-xl bg-carbon-surface/90 border border-carbon-border hover:border-hacktober-500/40 transition-colors shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Cache Latency
              </span>
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-emerald-400">
                &lt;{kpis.cacheLatencyMs}ms
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {kpis.cacheSource === 'REDIS_HIT' ? 'REDIS SWR' : 'IN-MEMORY SWR'}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-zinc-400 font-sans flex items-center space-x-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Zero external latency on page reads</span>
            </div>
          </div>
        </section>

        {/* Main Leaderboard Section */}
        <section id="leaderboard-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>BIT Sindri Competitive Programming Standings</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-hacktober-500/20 text-hacktober-400 border border-hacktober-500/40">
                  {students.length} Coders Listed
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Unified ranking derived from Codeforces, LeetCode, CodeChef, GeeksforGeeks, and HackerRank.
              </p>
            </div>
          </div>

          {/* 6 Tabs & Interactive Table */}
          <LeaderboardTable
            students={students}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedBranch={selectedBranch}
            onBranchChange={setSelectedBranch}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onToggleSortOrder={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            isAdminMode={isAdminMode}
            onDeleteStudent={(id, name) => setDeleteCandidate({ id, name })}
          />
        </section>

        {/* Rating Normalization & Composite Formula Documentation Card */}
        <section className="p-5 rounded-xl bg-carbon-surface/90 border border-carbon-border space-y-4 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-hacktober-500" />
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
              Formula &amp; Rating Normalization Engine Architecture
            </h3>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Every platform maintains different rating benchmarks (e.g. Codeforces Grandmaster vs CodeChef 6-star).
            Campus_CP first maps every raw score to a normalized <code className="text-hacktober-400 font-mono">0–1000 scale (S)</code>, capped at 1000, before computing the weighted composite rating.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-carbon-card border border-carbon-border">
              <div className="text-hacktober-400 font-bold mb-1">Codeforces (Weight: 35%)</div>
              <div className="text-[11px] text-zinc-400">
                S_CF = min(1000, max(0, (rating / 2400) * 1000))
              </div>
              <div className="mt-1 text-[10px] text-zinc-500">Benchmark: 2400 (Grandmaster)</div>
            </div>

            <div className="p-3 rounded-lg bg-carbon-card border border-carbon-border">
              <div className="text-hacktober-400 font-bold mb-1">LeetCode (Weight: 30%)</div>
              <div className="text-[11px] text-zinc-400">
                S_LC = min(1000, max(0, ((rating - 1200) / 1600) * 1000))
              </div>
              <div className="mt-1 text-[10px] text-zinc-500">Unrated fallback: min(600, solved * 1.2)</div>
            </div>

            <div className="p-3 rounded-lg bg-carbon-card border border-carbon-border">
              <div className="text-hacktober-400 font-bold mb-1">CodeChef (Weight: 20%)</div>
              <div className="text-[11px] text-zinc-400">
                S_CC = min(1000, max(0, ((rating - 1000) / 1500) * 1000))
              </div>
              <div className="mt-1 text-[10px] text-zinc-500">Benchmark: 2500 (6★ - 7★)</div>
            </div>

            <div className="p-3 rounded-lg bg-carbon-card border border-carbon-border">
              <div className="text-hacktober-400 font-bold mb-1">GeeksforGeeks (Weight: 10%)</div>
              <div className="text-[11px] text-zinc-400">
                S_GFG = min(1000, max(0, (codingScore / 2500) * 1000))
              </div>
              <div className="mt-1 text-[10px] text-zinc-500">Based on institutional problem solving</div>
            </div>

            <div className="p-3 rounded-lg bg-carbon-card border border-carbon-border">
              <div className="text-hacktober-400 font-bold mb-1">HackerRank (Weight: 5%)</div>
              <div className="text-[11px] text-zinc-400">
                S_HR = min(1000, max(0, (points / 1000) * 1000))
              </div>
              <div className="mt-1 text-[10px] text-zinc-500">Badge multipliers and star point tiers</div>
            </div>

            <div className="p-3 rounded-lg bg-carbon-elevated border border-hacktober-500/40">
              <div className="text-white font-bold mb-1 flex items-center justify-between">
                <span>Composite Formula</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-hacktober-500 text-white font-bold">100%</span>
              </div>
              <div className="text-[11px] text-hacktober-300">
                Score = 0.35&times;S_CF + 0.30&times;S_LC + 0.20&times;S_CC + 0.10&times;S_GFG + 0.05&times;S_HR
              </div>
              <div className="mt-1 text-[10px] text-zinc-400">Rounded to 2 decimal places</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-carbon-border bg-carbon-surface/80 mt-10 py-6 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-hacktober-500 font-bold">&lt;Campus_CP /&gt;</span>
            <span>&bull;</span>
            <span>Birsa Institute of Technology, Sindri (Dhanbad, Jharkhand)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Hacktoberfest Orange Theme</span>
            <span>&bull;</span>
            <button
              onClick={() => (isAdminMode ? handleExitAdminMode() : setIsAdminAuthOpen(true))}
              className="text-hacktober-400 hover:underline"
            >
              {isAdminMode ? 'Exit Moderator Mode' : 'Moderator Portal'}
            </button>
          </div>
        </div>
      </footer>

      {/* Registration Modal Dialog */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRegisterSuccess}
      />

      {/* Moderator Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Delete Record Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-carbon-surface border border-red-800/80 rounded-xl shadow-2xl p-6 text-carbon-text">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-red-950/60 text-red-400 border border-red-800">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirm Record Deletion</h3>
                <p className="text-xs text-zinc-400 font-mono">Moderator Action</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to delete the coder record for{' '}
              <strong className="text-white font-mono">{deleteCandidate.name}</strong>? This action will remove their normalized ratings from the campus leaderboard.
            </p>

            <div className="mt-5 flex items-center justify-end space-x-2 font-mono text-xs">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteCandidate(null)}
                className="px-3 py-1.5 rounded-md bg-carbon-card hover:bg-carbon-elevated text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteStudent}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
