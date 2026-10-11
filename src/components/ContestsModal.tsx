'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  X,
  ExternalLink,
  Clock,
  Sparkles,
  Radio,
  Filter,
  CheckCircle2,
  CalendarPlus,
  Loader2,
  Search,
} from 'lucide-react';
import { ContestItem, ContestPlatform } from '@/types/campus-cp';

interface ContestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLATFORM_COLORS: Record<
  ContestPlatform,
  { label: string; badgeBg: string; border: string; text: string; iconBg: string }
> = {
  CODEFORCES: {
    label: 'Codeforces',
    badgeBg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    iconBg: 'bg-red-500',
  },
  LEETCODE: {
    label: 'LeetCode',
    badgeBg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    iconBg: 'bg-amber-500',
  },
  CODECHEF: {
    label: 'CodeChef',
    badgeBg: 'bg-amber-700/10',
    border: 'border-amber-700/30',
    text: 'text-amber-300',
    iconBg: 'bg-amber-700',
  },
  ATCODER: {
    label: 'AtCoder',
    badgeBg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    iconBg: 'bg-blue-500',
  },
  GEEKSFORGEEKS: {
    label: 'GeeksforGeeks',
    badgeBg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-500',
  },
  HACKERRANK: {
    label: 'HackerRank',
    badgeBg: 'bg-emerald-600/10',
    border: 'border-emerald-600/30',
    text: 'text-emerald-300',
    iconBg: 'bg-emerald-600',
  },
};

export const ContestsModal: React.FC<ContestsModalProps> = ({ isOpen, onClose }) => {
  const [contests, setContests] = useState<ContestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch contests on open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchContests = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/contests');
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setContests(json.data);
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchContests();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered list
  const filteredContests = useMemo(() => {
    return contests.filter((c) => {
      const matchesPlatform =
        selectedPlatform === 'ALL' || c.platform === selectedPlatform;
      const matchesSearch =
        searchQuery.trim() === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.platform.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPlatform && matchesSearch;
    });
  }, [contests, selectedPlatform, searchQuery]);

  if (!isOpen) return null;

  // Format date helper in IST
  const formatDateTimeIST = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return isoString;
    }
  };

  // Relative time helper
  const getRelativeTime = (startIso: string, endIso: string) => {
    const now = Date.now();
    const start = new Date(startIso).getTime();
    const end = new Date(endIso).getTime();

    if (now >= start && now <= end) {
      return { text: 'LIVE NOW', isLive: true };
    }

    const diffMs = start - now;
    if (diffMs < 0) {
      return { text: 'Concluded', isLive: false };
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return { text: `Starts in ${diffDays}d ${diffHours % 24}h`, isLive: false };
    }
    if (diffHours > 0) {
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return { text: `Starts in ${diffHours}h ${diffMins}m`, isLive: false };
    }
    const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return { text: `Starts in ${diffMins} min`, isLive: false };
  };

  // Google Calendar Link generator
  const getGoogleCalendarUrl = (contest: ContestItem) => {
    const formatGoogleDate = (iso: string) => {
      return new Date(iso).toISOString().replace(/-|:|\.\d\d\d/g, '');
    };
    const start = formatGoogleDate(contest.startTime);
    const end = formatGoogleDate(contest.endTime);
    const details = encodeURIComponent(
      `Campus_CP Contest Alert: ${contest.title} on ${contest.platform}.\nLink: ${contest.url}`
    );
    const title = encodeURIComponent(`[${contest.platform}] ${contest.title}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${encodeURIComponent(
      contest.url
    )}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-carbon-surface border border-carbon-border rounded-2xl shadow-2xl flex flex-col text-carbon-text overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-carbon-border flex items-center justify-between bg-carbon-surface/90 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-hacktober-500/15 border border-hacktober-500/30 text-hacktober-500 shadow-orange-glow-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-1.5">
                  &lt;<span className="text-hacktober-500">Live &amp; Upcoming</span> Contests /&gt;
                </h2>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-hacktober-900/60 text-hacktober-300 border border-hacktober-700">
                  IST Timezone
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans">
                Real-time contest schedule aggregated across Codeforces, LeetCode, CodeChef, AtCoder &amp; GFG.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-carbon-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-carbon-border bg-carbon-card/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contest name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-carbon-surface border border-carbon-border text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-hacktober-500"
            />
          </div>

          {/* Platform filter pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedPlatform('ALL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all shrink-0 ${
                selectedPlatform === 'ALL'
                  ? 'bg-hacktober-500 text-white shadow-orange-glow-sm'
                  : 'bg-carbon-surface hover:bg-carbon-elevated text-zinc-400 border border-carbon-border'
              }`}
            >
              All Platforms ({contests.length})
            </button>
            {(['CODEFORCES', 'LEETCODE', 'CODECHEF', 'ATCODER', 'GEEKSFORGEEKS'] as ContestPlatform[]).map(
              (platform) => {
                const count = contests.filter((c) => c.platform === platform).length;
                const info = PLATFORM_COLORS[platform];
                const isActive = selectedPlatform === platform;
                return (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all shrink-0 flex items-center space-x-1 border ${
                      isActive
                        ? `${info.badgeBg} ${info.text} ${info.border} font-bold`
                        : 'bg-carbon-surface hover:bg-carbon-elevated text-zinc-400 border-carbon-border'
                    }`}
                  >
                    <span>{info.label}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Contest Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-zinc-400 font-mono text-xs">
              <Loader2 className="w-8 h-8 animate-spin text-hacktober-500" />
              <span>Fetching live contest schedules from platform APIs...</span>
            </div>
          ) : filteredContests.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 font-mono text-xs">
              No upcoming contests found matching your search.
            </div>
          ) : (
            filteredContests.map((contest) => {
              const platformInfo =
                PLATFORM_COLORS[contest.platform] || PLATFORM_COLORS.CODEFORCES;
              const rel = getRelativeTime(contest.startTime, contest.endTime);

              return (
                <div
                  key={contest.id}
                  className={`p-4 rounded-xl border transition-all duration-200 bg-carbon-card/80 hover:bg-carbon-card hover:border-hacktober-500/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                    rel.isLive
                      ? 'border-emerald-500/50 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]'
                      : 'border-carbon-border'
                  }`}
                >
                  {/* Left info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Platform Badge */}
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border flex items-center space-x-1.5 ${platformInfo.badgeBg} ${platformInfo.text} ${platformInfo.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${platformInfo.iconBg}`} />
                        <span>{platformInfo.label}</span>
                      </span>

                      {/* Status Badge */}
                      {rel.isLive ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/50 flex items-center space-x-1 animate-pulse">
                          <Radio className="w-3 h-3 shrink-0" />
                          <span>LIVE NOW</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-carbon-elevated border border-carbon-border flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-hacktober-400" />
                          <span>{rel.text}</span>
                        </span>
                      )}

                      {contest.difficulty && (
                        <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                          &bull; {contest.difficulty}
                        </span>
                      )}
                    </div>

                    {/* Contest Title */}
                    <h3 className="text-sm sm:text-base font-bold text-white hover:text-hacktober-400 transition-colors">
                      <a href={contest.url} target="_blank" rel="noopener noreferrer">
                        {contest.title}
                      </a>
                    </h3>

                    {/* Date and Duration */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 font-mono">
                      <span className="text-zinc-300">
                        🗓️ {formatDateTimeIST(contest.startTime)} (IST)
                      </span>
                      <span>⏱️ {contest.durationMinutes} minutes</span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-carbon-border">
                    <a
                      href={getGoogleCalendarUrl(contest)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Add to Google Calendar"
                      className="p-2 rounded-lg bg-carbon-surface hover:bg-carbon-elevated border border-carbon-border text-zinc-400 hover:text-white transition-colors"
                    >
                      <CalendarPlus className="w-4 h-4" />
                    </a>

                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3.5 py-2 rounded-lg font-mono text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm ${
                        rel.isLive
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                          : 'bg-hacktober-500 hover:bg-hacktober-600 text-white shadow-orange-glow-sm'
                      }`}
                    >
                      <span>{rel.isLive ? 'Enter Contest' : 'Register / View'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-carbon-border bg-carbon-card/50 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono gap-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-hacktober-500" />
            <span>Times are automatically rendered in Indian Standard Time (IST).</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-carbon-elevated hover:bg-zinc-800 text-zinc-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
