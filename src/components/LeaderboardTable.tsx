'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Crown,
  ExternalLink,
  ChevronDown,
  Info,
  Layers,
  Code,
  BookOpen,
  Award,
  Trash2,
  ShieldAlert,
} from 'lucide-react';
import {
  StudentProfile,
  LeaderboardTab,
  Branch,
  SortField,
  SortOrder,
} from '@/types/campus-cp';

interface LeaderboardTableProps {
  students: StudentProfile[];
  activeTab: LeaderboardTab;
  onTabChange: (tab: LeaderboardTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
  sortBy: SortField;
  onSortByChange: (sort: SortField) => void;
  sortOrder: SortOrder;
  onToggleSortOrder: () => void;
  isAdminMode?: boolean;
  onDeleteStudent?: (studentId: string, studentName: string) => void;
}

const TABS: { id: LeaderboardTab; label: string; icon?: React.ReactNode; badge?: string }[] = [
  { id: 'all', label: 'Overall Campus' },
  { id: 'year1', label: '1st Year', badge: '2024-28' },
  { id: 'year2', label: '2nd Year', badge: '2023-27' },
  { id: 'year3', label: '3rd Year', badge: '2022-26' },
  { id: 'year4', label: '4th Year', badge: '2021-25' },
  {
    id: 'girls',
    label: "Girls' Leaderboard",
    badge: 'Women in Tech',
  },
];

const BRANCH_OPTIONS = [
  { value: 'ALL', label: 'All Branches' },
  { value: 'CSE', label: 'Computer Science (CSE)' },
  { value: 'IT', label: 'Information Technology (IT)' },
  { value: 'ECE', label: 'Electronics & Comm (ECE)' },
  { value: 'EE', label: 'Electrical (EE)' },
  { value: 'ME', label: 'Mechanical (ME)' },
  { value: 'Civil', label: 'Civil Engineering' },
  { value: 'Metallurgy', label: 'Metallurgical Engineering' },
  { value: 'Chemical', label: 'Chemical Engineering' },
  { value: 'Mining', label: 'Mining Engineering' },
  { value: 'Production', label: 'Production Engineering' },
];

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  students,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  selectedBranch,
  onBranchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  isAdminMode = false,
  onDeleteStudent,
}) => {
  const [inspectStudent, setInspectStudent] = useState<StudentProfile | null>(null);

  return (
    <div className="space-y-4">
      {/* 6 Tabs Navigation */}
      <div className="flex items-center overflow-x-auto pb-2 border-b border-carbon-border scrollbar-none gap-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isGirlsTab = tab.id === 'girls';

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
                isActive
                  ? isGirlsTab
                    ? 'bg-amber-500/20 border border-amber-500/60 text-amber-300 shadow-gold-glow'
                    : 'bg-hacktober-500 text-white shadow-orange-glow-sm'
                  : isGirlsTab
                  ? 'bg-carbon-card hover:bg-carbon-elevated border border-amber-500/30 text-amber-300/80 hover:text-amber-200'
                  : 'bg-carbon-card hover:bg-carbon-elevated border border-carbon-border text-zinc-300 hover:text-white'
              }`}
            >
              {isGirlsTab && <Crown className="w-3.5 h-3.5 text-amber-400" />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-sans ${
                    isActive
                      ? isGirlsTab
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-black/40 text-hacktober-200'
                      : isGirlsTab
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-carbon-elevated text-zinc-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Controls Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-carbon-card p-3 rounded-lg border border-carbon-border">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coder name, reg no (e.g. 2101001), or handle..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md bg-carbon-surface border border-carbon-border text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-hacktober-500 font-mono"
          />
        </div>

        {/* Branch Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <div className="relative min-w-[170px]">
            <select
              value={selectedBranch}
              onChange={(e) => onBranchChange(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-md bg-carbon-surface border border-carbon-border text-white text-xs font-sans focus:outline-none focus:border-hacktober-500"
            >
              {BRANCH_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative min-w-[150px]">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortField)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-md bg-carbon-surface border border-carbon-border text-white text-xs font-sans focus:outline-none focus:border-hacktober-500"
            >
              <option value="composite">Sort: Composite Rating</option>
              <option value="codeforces">Sort: Codeforces</option>
              <option value="leetcode">Sort: LeetCode</option>
              <option value="codechef">Sort: CodeChef</option>
              <option value="geeksforgeeks">Sort: GFG Score</option>
              <option value="hackerrank">Sort: HackerRank</option>
              <option value="solved">Sort: Total Solved</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Order Toggle */}
          <button
            onClick={onToggleSortOrder}
            title={`Toggle Sort Order (${sortOrder.toUpperCase()})`}
            className="p-2 rounded-md bg-carbon-surface border border-carbon-border text-zinc-300 hover:text-white hover:border-hacktober-500 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border border-carbon-border bg-carbon-surface shadow-2xl">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#121215] border-b border-carbon-border text-[11px] font-mono uppercase text-zinc-400">
            <tr>
              <th className="py-3 px-3 w-14 text-center">Rank</th>
              <th className="py-3 px-4">BIT Sindri Coder</th>
              <th className="py-3 px-3 text-right">Composite Score</th>
              <th className="py-3 px-3">Codeforces</th>
              <th className="py-3 px-3">LeetCode</th>
              <th className="py-3 px-3">CodeChef</th>
              <th className="py-3 px-3">GeeksforGeeks</th>
              <th className="py-3 px-3">HackerRank</th>
              <th className="py-3 px-3 text-center">Solved</th>
              <th className="py-3 px-3 text-center">Details</th>
              {isAdminMode && (
                <th className="py-3 px-3 text-center text-red-400">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-carbon-border/60">
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdminMode ? 11 : 10}
                  className="py-12 text-center text-zinc-500 font-mono"
                >
                  No coders match the active filter criteria. Try clearing the search or branch filter.
                </td>
              </tr>
            ) : (
              students.map((student, index) => {
                const rank = index + 1;
                const isFemale = student.gender === 'FEMALE';

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-carbon-card/70 transition-colors group"
                  >
                    {/* Rank Badge */}
                    <td className="py-3.5 px-3 text-center font-mono">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/60 font-bold text-xs shadow-gold-glow">
                          🥇
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-400/20 text-zinc-200 border border-zinc-400/50 font-bold text-xs">
                          🥈
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/50 font-bold text-xs">
                          🥉
                        </span>
                      ) : (
                        <span className="text-zinc-500 font-bold">#{rank}</span>
                      )}
                    </td>

                    {/* Coder Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold font-mono text-xs border ${
                            isFemale
                              ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                              : 'bg-carbon-elevated text-hacktober-400 border-carbon-border'
                          }`}
                        >
                          {student.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-white group-hover:text-hacktober-400 transition-colors">
                              {student.name}
                            </span>
                            {isFemale && (
                              <span
                                title="Women in Tech Coder"
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/40"
                              >
                                👩‍💻 WIT
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-[11px] text-zinc-400 font-mono">
                            <span>Reg: {student.registrationNo}</span>
                            <span>&bull;</span>
                            <span className="text-zinc-300">{student.branch}</span>
                            <span>&bull;</span>
                            <span className="text-zinc-400">Yr {student.year}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Composite Score */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-base font-bold text-hacktober-400">
                          {student.compositeRating.toFixed(2)}
                        </span>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono border ${student.rankBadgeColor}`}
                        >
                          {student.rankTier}
                        </span>
                      </div>
                    </td>

                    {/* Codeforces */}
                    <td className="py-3.5 px-3 font-mono">
                      <div className="text-zinc-200 font-medium">
                        {student.platforms.codeforces.rawRating || '—'}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate max-w-[110px]">
                        {student.platforms.codeforces.badgeOrRank}
                      </div>
                    </td>

                    {/* LeetCode */}
                    <td className="py-3.5 px-3 font-mono">
                      <div className="text-zinc-200 font-medium">
                        {student.platforms.leetcode.rawRating || '—'}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {student.platforms.leetcode.badgeOrRank}
                      </div>
                    </td>

                    {/* CodeChef */}
                    <td className="py-3.5 px-3 font-mono">
                      <div className="text-zinc-200 font-medium">
                        {student.platforms.codechef.rawRating || '—'}
                      </div>
                      <div className="text-[10px] text-amber-400">
                        {student.platforms.codechef.badgeOrRank}
                      </div>
                    </td>

                    {/* GFG */}
                    <td className="py-3.5 px-3 font-mono">
                      <div className="text-zinc-200 font-medium">
                        {student.platforms.geeksforgeeks.rawRating || '—'}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {student.platforms.geeksforgeeks.problemsSolved} Solved
                      </div>
                    </td>

                    {/* HackerRank */}
                    <td className="py-3.5 px-3 font-mono">
                      <div className="text-zinc-200 font-medium">
                        {student.platforms.hackerrank.rawRating} pts
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate max-w-[100px]">
                        {student.platforms.hackerrank.badgeOrRank}
                      </div>
                    </td>

                    {/* Total Solved */}
                    <td className="py-3.5 px-3 text-center font-mono">
                      <span className="inline-flex px-2 py-1 rounded bg-carbon-elevated border border-carbon-border text-hacktober-300 font-semibold text-xs">
                        {student.totalSolved}
                      </span>
                    </td>

                    {/* Inspect Button */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => setInspectStudent(student)}
                        className="px-2.5 py-1 rounded bg-carbon-elevated hover:bg-hacktober-500 hover:text-white border border-carbon-border text-zinc-300 font-mono text-[11px] transition-colors"
                      >
                        Breakdown
                      </button>
                    </td>

                    {/* Admin Delete Action */}
                    {isAdminMode && (
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => onDeleteStudent?.(student.id, student.name)}
                          title={`Delete record for ${student.name}`}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-red-950/40 hover:bg-red-800 text-red-300 hover:text-white border border-red-800/60 font-mono text-[11px] transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Breakdown Modal */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-carbon-surface border border-carbon-border rounded-xl shadow-2xl p-6 text-carbon-text">
            <div className="flex items-center justify-between pb-3 border-b border-carbon-border">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-hacktober-500/10 text-hacktober-500">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {inspectStudent.name} ({inspectStudent.registrationNo})
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    {inspectStudent.branch} Engineering &bull; Year {inspectStudent.year}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectStudent(null)}
                className="text-zinc-400 hover:text-white text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Composite Banner */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-carbon-card border border-hacktober-500/30">
                <div>
                  <span className="text-[11px] font-mono text-zinc-400 uppercase">
                    Campus_CP Composite Score
                  </span>
                  <div className="text-2xl font-bold font-mono text-hacktober-400">
                    {inspectStudent.compositeRating.toFixed(2)}
                    <span className="text-xs text-zinc-500 font-normal ml-1">/ 1000</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 rounded text-xs font-mono border ${inspectStudent.rankBadgeColor}`}>
                    {inspectStudent.rankTier}
                  </span>
                </div>
              </div>

              {/* Normalized Scale Breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-hacktober-400" />
                  0–1000 Normalized Platform Scores &amp; Weights
                </h4>

                <div className="space-y-2 text-xs font-mono">
                  {/* CF */}
                  <div className="p-2 rounded bg-carbon-card border border-carbon-border flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">
                        Codeforces (35% Weight)
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Handle: @{inspectStudent.platforms.codeforces.handle} &bull; Raw Rating: {inspectStudent.platforms.codeforces.rawRating}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-hacktober-400 font-bold">
                        {inspectStudent.platforms.codeforces.normalizedScore.toFixed(1)} / 1000
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Contribution: +{(inspectStudent.platforms.codeforces.normalizedScore * 0.35).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* LC */}
                  <div className="p-2 rounded bg-carbon-card border border-carbon-border flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">
                        LeetCode (30% Weight)
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Handle: @{inspectStudent.platforms.leetcode.handle} &bull; Rating: {inspectStudent.platforms.leetcode.rawRating} ({inspectStudent.platforms.leetcode.problemsSolved} Solved)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-hacktober-400 font-bold">
                        {inspectStudent.platforms.leetcode.normalizedScore.toFixed(1)} / 1000
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Contribution: +{(inspectStudent.platforms.leetcode.normalizedScore * 0.30).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* CC */}
                  <div className="p-2 rounded bg-carbon-card border border-carbon-border flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">
                        CodeChef (20% Weight)
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Handle: @{inspectStudent.platforms.codechef.handle} &bull; Rating: {inspectStudent.platforms.codechef.rawRating} ({inspectStudent.platforms.codechef.badgeOrRank})
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-hacktober-400 font-bold">
                        {inspectStudent.platforms.codechef.normalizedScore.toFixed(1)} / 1000
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Contribution: +{(inspectStudent.platforms.codechef.normalizedScore * 0.20).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* GFG */}
                  <div className="p-2 rounded bg-carbon-card border border-carbon-border flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">
                        GeeksforGeeks (10% Weight)
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Handle: @{inspectStudent.platforms.geeksforgeeks.handle} &bull; Score: {inspectStudent.platforms.geeksforgeeks.rawRating}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-hacktober-400 font-bold">
                        {inspectStudent.platforms.geeksforgeeks.normalizedScore.toFixed(1)} / 1000
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Contribution: +{(inspectStudent.platforms.geeksforgeeks.normalizedScore * 0.10).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* HR */}
                  <div className="p-2 rounded bg-carbon-card border border-carbon-border flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">
                        HackerRank (5% Weight)
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Handle: @{inspectStudent.platforms.hackerrank.handle} &bull; Points: {inspectStudent.platforms.hackerrank.rawRating}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-hacktober-400 font-bold">
                        {inspectStudent.platforms.hackerrank.normalizedScore.toFixed(1)} / 1000
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Contribution: +{(inspectStudent.platforms.hackerrank.normalizedScore * 0.05).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-carbon-border flex justify-end">
              <button
                onClick={() => setInspectStudent(null)}
                className="px-4 py-1.5 rounded-md bg-carbon-elevated hover:bg-zinc-800 text-white font-mono text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
