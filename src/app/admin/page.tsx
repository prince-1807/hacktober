'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  KeyRound,
  AlertTriangle,
  Loader2,
  Sparkles,
  ArrowLeft,
  Users,
  Trophy,
  CheckCircle,
  Cpu,
} from 'lucide-react';
import { RegisterModal } from '@/components/RegisterModal';
import { StudentProfile, LeaderboardKPIs } from '@/types/campus-cp';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Admin Data State
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [kpis, setKpis] = useState<LeaderboardKPIs | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState<{
    id: string;
    name: string;
    registrationNo: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Check persistent session on mount
  useEffect(() => {
    const saved = localStorage.getItem('campus_cp_admin_mode');
    if (saved === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Invalid administrator passcode.');
      }

      setIsAuthenticated(true);
      localStorage.setItem('campus_cp_admin_mode', 'true');
      showToast('Welcome to the Moderator Console!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      setAuthError(msg);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('campus_cp_admin_mode');
    showToast('Logged out of Moderator Console.');
  };

  // Fetch all students for admin view
  const fetchAdminData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedBranch && selectedBranch !== 'ALL') params.set('branch', selectedBranch);

      const res = await fetch(`/api/leaderboard?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStudents(json.data.students || []);
          if (json.data.kpis) setKpis(json.data.kpis);
        }
      }
    } catch {
      // Non-blocking
    }
  }, [searchQuery, selectedBranch]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated, fetchAdminData]);

  // Handle student deletion
  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/students/${encodeURIComponent(deleteCandidate.id)}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': 'admin2026' },
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`Record for ${deleteCandidate.name} was successfully removed.`);
        setDeleteCandidate(null);
        await fetchAdminData();
      } else {
        showToast(json.error || 'Failed to delete student.');
      }
    } catch {
      showToast('Error deleting student.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Sync ratings
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Ratings synced successfully!');
        await fetchAdminData();
      } else {
        showToast('Sync finished.');
      }
    } catch {
      showToast('Rating sync completed.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset database to initial seed data
  const handleReset = async () => {
    if (!window.confirm('Reset all leaderboard records to default student seed data?')) return;
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'x-admin-key': 'admin2026' },
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Leaderboard reset to default.');
        await fetchAdminData();
      }
    } catch {
      showToast('Reset failed.');
    }
  };

  // Login Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative font-sans text-carbon-text">
        {/* Background Ambient Orange Mesh Glows */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 -mt-32 w-[700px] h-[350px] bg-hacktober-500/25 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="w-full max-w-md bg-carbon-surface/90 border border-hacktober-500/40 rounded-2xl shadow-2xl p-7 backdrop-blur-md">
          <div className="flex items-center space-x-3 pb-4 border-b border-carbon-border">
            <div className="p-2.5 rounded-xl bg-hacktober-500/15 border border-hacktober-500/30 text-hacktober-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-1.5 font-mono">
                &lt;<span className="text-hacktober-500">Campus_CP</span> /&gt; Admin
              </h1>
              <p className="text-xs text-zinc-400">Moderator &amp; Record Control Panel</p>
            </div>
          </div>

          {authError && (
            <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center space-x-2 font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>Enter Moderator Passcode</span>
                <span className="text-[10px] text-hacktober-400 font-mono">Default: admin2026</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Passcode..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-carbon-card border border-carbon-border text-white text-xs font-mono placeholder-zinc-500 focus:outline-none focus:border-hacktober-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-2.5 rounded-lg bg-hacktober-500 hover:bg-hacktober-600 text-white text-xs font-mono font-semibold shadow-orange-glow-sm hover:shadow-orange-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Unlock Moderator Console</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-carbon-border text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-hacktober-400 font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Student Arena</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Console Screen
  return (
    <div className="min-h-screen flex flex-col relative text-carbon-text font-sans">
      {/* Background Ambient Orange Mesh Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 -mt-32 w-[850px] h-[400px] bg-hacktober-500/25 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-1/3 -left-40 w-[550px] h-[550px] bg-orange-600/20 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-10 -right-40 w-[600px] h-[600px] bg-amber-600/20 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Admin Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-carbon-border bg-carbon-surface/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-lg text-white">
                  &lt;<span className="text-hacktober-500">Campus_CP</span> /&gt;{' '}
                  <span className="text-amber-400 text-sm">Moderator Console</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Student Record Management &bull; Deletion &amp; Addition Privileges
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg bg-carbon-card hover:bg-carbon-elevated border border-carbon-border text-zinc-300 hover:text-white flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public View</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 border border-red-800/60 text-red-300 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Live Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-carbon-elevated border border-hacktober-500 text-white font-mono text-xs shadow-orange-glow">
            <Sparkles className="w-4 h-4 text-hacktober-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Admin KPI Overview */}
        {kpis && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-carbon-surface/90 border border-carbon-border shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Active Coders</span>
                <Users className="w-4 h-4 text-hacktober-500" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-white">{kpis.totalCoders}</div>
              <p className="mt-1 text-[11px] text-zinc-500">Registered across 10 branches</p>
            </div>

            <div className="p-4 rounded-xl bg-carbon-surface/90 border border-carbon-border shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Highest Rating</span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-hacktober-400">
                {kpis.highestScore.toFixed(2)}
              </div>
              <p className="mt-1 text-[11px] text-zinc-400 truncate">{kpis.topCoderName}</p>
            </div>

            <div className="p-4 rounded-xl bg-carbon-surface/90 border border-carbon-border shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Total Solved</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-white">
                {kpis.totalProblemsSolved.toLocaleString()}
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">Across CF, LC, CC, GFG &amp; HR</p>
            </div>

            <div className="p-4 rounded-xl bg-carbon-surface/90 border border-carbon-border shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Cache Latency</span>
                <Cpu className="w-4 h-4 text-sky-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
                &lt;{kpis.cacheLatencyMs}ms
              </div>
              <p className="mt-1 text-[11px] text-zinc-500 font-mono">{kpis.cacheSource}</p>
            </div>
          </section>
        )}

        {/* Action Controls & Filters */}
        <section className="p-4 rounded-xl bg-carbon-surface/90 border border-carbon-border shadow-lg backdrop-blur-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Coder Records Management</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {students.length} Records
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Moderator actions: Add student records or click Delete on any row below.
              </p>
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs">
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-hacktober-500 hover:bg-hacktober-600 text-white font-semibold shadow-orange-glow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Student</span>
              </button>

              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-carbon-card hover:bg-carbon-elevated border border-carbon-border text-zinc-300"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-hacktober-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync All'}</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-carbon-card hover:bg-carbon-elevated border border-carbon-border text-zinc-400 hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by name, reg no, or handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white text-xs font-mono placeholder-zinc-500 focus:outline-none focus:border-hacktober-500"
              />
            </div>

            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white text-xs font-sans focus:outline-none focus:border-hacktober-500"
            >
              <option value="ALL">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EE">EE</option>
              <option value="ME">ME</option>
              <option value="Civil">Civil</option>
              <option value="Metallurgy">Metallurgy</option>
              <option value="Chemical">Chemical</option>
              <option value="Mining">Mining</option>
              <option value="Production">Production</option>
            </select>
          </div>
        </section>

        {/* Admin Data Table with Explicit Delete Column */}
        <section className="overflow-x-auto rounded-xl border border-carbon-border bg-carbon-surface/90 shadow-2xl backdrop-blur-sm">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#121215] border-b border-carbon-border text-[11px] font-mono uppercase text-zinc-400">
              <tr>
                <th className="py-3 px-3 w-14 text-center">Rank</th>
                <th className="py-3 px-4">Student Name &amp; Academic Info</th>
                <th className="py-3 px-3 text-right">Composite Score</th>
                <th className="py-3 px-3">Codeforces</th>
                <th className="py-3 px-3">LeetCode</th>
                <th className="py-3 px-3">CodeChef</th>
                <th className="py-3 px-3 text-center">Total Solved</th>
                <th className="py-3 px-3 text-center text-red-400 font-bold">Admin Delete Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-border/60">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500 font-mono">
                    No student records found matching the search criteria.
                  </td>
                </tr>
              ) : (
                students.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-carbon-card/70 transition-colors">
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-zinc-400">
                      #{idx + 1}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{student.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        Reg: {student.registrationNo} &bull; {student.branch} &bull; Year {student.year}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono">
                      <span className="font-bold text-hacktober-400">{student.compositeRating.toFixed(2)}</span>
                      <div className="text-[10px] text-zinc-500">{student.rankTier}</div>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      <div className="text-zinc-200">@{student.platforms.codeforces.handle}</div>
                      <div className="text-[10px] text-zinc-500">
                        {student.platforms.codeforces.rawRating || 'Unrated'}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      <div className="text-zinc-200">@{student.platforms.leetcode.handle}</div>
                      <div className="text-[10px] text-zinc-500">
                        {student.platforms.leetcode.problemsSolved} Solved
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      <div className="text-zinc-200">@{student.platforms.codechef.handle}</div>
                      <div className="text-[10px] text-amber-400">{student.platforms.codechef.badgeOrRank}</div>
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono">
                      <span className="px-2 py-0.5 rounded bg-carbon-elevated border border-carbon-border text-zinc-300 font-semibold">
                        {student.totalSolved}
                      </span>
                    </td>

                    {/* Prominent Admin Delete Button */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() =>
                          setDeleteCandidate({
                            id: student.id,
                            name: student.name,
                            registrationNo: student.registrationNo,
                          })
                        }
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-800 text-red-300 hover:text-white border border-red-800/80 font-mono text-xs transition-all shadow-sm active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Record</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-carbon-surface border border-red-800/80 rounded-xl shadow-2xl p-6 text-carbon-text">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-red-950/60 text-red-400 border border-red-800">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Student Record</h3>
                <p className="text-xs text-zinc-400 font-mono">Irreversible Moderator Action</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to permanently delete the record for{' '}
              <strong className="text-white font-mono">{deleteCandidate.name}</strong> (Reg No:{' '}
              <span className="text-hacktober-400 font-mono">{deleteCandidate.registrationNo}</span>)?
              This will remove their profile and composite ratings from the leaderboard.
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
                onClick={confirmDelete}
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

      {/* Register Modal for Admin Addition */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={(name) => {
          showToast(`Student ${name} successfully registered.`);
          fetchAdminData();
        }}
      />
    </div>
  );
}
