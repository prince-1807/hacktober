'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Bug, RotateCcw } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-carbon-bg text-carbon-text font-mono">
      <div className="w-full max-w-2xl bg-carbon-surface border border-carbon-border rounded-xl shadow-2xl overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#121215] border-b border-carbon-border">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-xs text-zinc-400 font-mono ml-2">
              online_judge://sandbox/verdict_tracer.cpp
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-zinc-500">
            <Bug className="w-3.5 h-3.5 text-red-400" />
            <span>SIGSEGV (Signal 11)</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Main Verdict Tag */}
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h1 className="text-base sm:text-lg font-bold tracking-tight">
              404 — Verdict: SEGMENTATION FAULT (Page Not Found)
            </h1>
          </div>

          {/* Online Judge Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-carbon-card border border-carbon-border text-[11px]">
            <div>
              <span className="text-zinc-500 block">Time Limit:</span>
              <span className="text-emerald-400 font-bold">0.00 ms</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Memory Peak:</span>
              <span className="text-hacktober-400 font-bold">404 KB</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Exit Code:</span>
              <span className="text-red-400 font-bold">139 (SIGSEGV)</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Test Case:</span>
              <span className="text-amber-400 font-bold">0 / 1 Passed</span>
            </div>
          </div>

          {/* Checker Log Snippet */}
          <div className="p-4 rounded-lg bg-[#0c0c0e] border border-red-900/40 text-[11px] leading-relaxed text-zinc-300 font-mono">
            <div className="text-red-400 font-bold mb-2">
              [CHECKER LOG]: Route pointer dereferenced NULL. Address 0x00000404 out of bounds.
            </div>
            <p className="text-zinc-400">
              #0 0x00007f3c in CampusCP::Router::resolve_node (uri=UNKNOWN_ROUTE)<br />
              #1 0x00007f12 in NextJS::AppRouter::dispatch (path=&quot;*&quot;)<br />
              #2 0x00007e99 in main () at /bit_sindri/arena/judge.cpp:42<br />
            </p>
            <div className="mt-3 text-hacktober-400">
              &gt;&gt; Suggested Fix: Verify route URL or return to the main &lt;Campus_CP /&gt; arena leaderboard.
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-zinc-500">
              BIRSA INSTITUTE OF TECHNOLOGY, SINDRI &bull; ONLINE JUDGE
            </span>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-hacktober-500 hover:bg-hacktober-600 text-white font-sans text-xs font-semibold shadow-orange-glow-sm hover:shadow-orange-glow transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Return to &lt;Campus_CP /&gt; Arena</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
