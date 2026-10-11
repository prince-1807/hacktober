'use client';

import React from 'react';
import { Terminal, RefreshCw, UserPlus, ShieldCheck, ShieldAlert, LogOut } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
  onSyncRatings: () => void;
  isSyncing: boolean;
  cacheSource?: 'REDIS_HIT' | 'IN_MEMORY_SWR' | 'FRESH_REVALIDATE';
  cacheLatencyMs?: number;
  isAdminMode: boolean;
  onOpenAdminAuth: () => void;
  onExitAdminMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRegister,
  onSyncRatings,
  isSyncing,
  cacheSource = 'IN_MEMORY_SWR',
  cacheLatencyMs = 4,
  isAdminMode,
  onOpenAdminAuth,
  onExitAdminMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-carbon-border bg-carbon-surface/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-hacktober-500/10 border border-hacktober-500/30 text-hacktober-500 shadow-orange-glow-sm">
            <Terminal className="w-5 h-5 text-hacktober-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-lg tracking-wider text-white">
                &lt;<span className="text-hacktober-500">Campus_CP</span> /&gt;
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-hacktober-900/60 text-hacktober-300 border border-hacktober-700">
                v1.0 • BIT Sindri
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans tracking-tight hidden md:block">
              Unified CP Hub &amp; Real-Time Campus Leaderboard
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Live Cache Status Badge */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-md bg-carbon-card border border-carbon-border font-mono text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-zinc-300">
              {cacheSource === 'REDIS_HIT' ? 'REDIS SWR HIT' : 'IN-MEMORY SWR'}
            </span>
            <span className="text-hacktober-400 font-semibold">
              &lt;{cacheLatencyMs}ms
            </span>
          </div>

          {/* User vs Moderator Mode Toggle */}
          {isAdminMode ? (
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs shadow-gold-glow">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-semibold hidden sm:inline">Moderator Mode</span>
              <button
                onClick={onExitAdminMode}
                title="Exit Moderator Mode"
                className="ml-1 p-1 rounded hover:bg-amber-500/20 text-zinc-300 hover:text-white"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminAuth}
              title="Switch to Moderator / Admin Mode"
              className="flex items-center space-x-1.5 px-2.5 py-2 rounded-lg bg-carbon-card hover:bg-carbon-elevated border border-carbon-border text-zinc-300 hover:text-white transition-all text-xs font-mono font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-hacktober-400" />
              <span className="hidden sm:inline">Moderator</span>
            </button>
          )}

          {/* Sync Ratings Button */}
          <button
            onClick={onSyncRatings}
            disabled={isSyncing}
            title="Revalidate external platform ratings"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-carbon-card hover:bg-carbon-elevated border border-carbon-border hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-mono font-medium disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-hacktober-400 ${
                isSyncing ? 'animate-spin text-hacktober-500' : ''
              }`}
            />
            <span className="hidden sm:inline">
              {isSyncing ? 'Syncing...' : 'Sync'}
            </span>
          </button>

          {/* Register Coder CTA */}
          <button
            onClick={onOpenRegister}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-hacktober-500 hover:bg-hacktober-600 text-white font-sans text-xs sm:text-sm font-semibold tracking-wide shadow-orange-glow-sm hover:shadow-orange-glow transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isAdminMode ? '+ Add Record' : 'Register Coder'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
