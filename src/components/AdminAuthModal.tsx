'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, X, KeyRound, AlertCircle, Loader2 } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Invalid passcode.');
      }

      onSuccess(passcode);
      setPasscode('');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-carbon-surface border border-hacktober-500/40 rounded-xl shadow-2xl p-6 text-carbon-text">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-carbon-border">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-hacktober-500/15 border border-hacktober-500/30 text-hacktober-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Moderator Access</h3>
              <p className="text-xs text-zinc-400 font-mono">
                Administrator &amp; Record Control Panel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-3 p-2.5 rounded bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center space-x-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>Admin Passcode</span>
              <span className="text-[10px] text-hacktober-400 font-mono">
                Hint: admin2026
              </span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter passcode..."
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full pl-9 pr-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white text-xs font-mono placeholder-zinc-500 focus:outline-none focus:border-hacktober-500"
              />
            </div>
          </div>

          <div className="p-2.5 rounded bg-carbon-card border border-carbon-border text-[11px] text-zinc-400 space-y-1">
            <div className="font-semibold text-zinc-300 flex items-center gap-1">
              <Lock className="w-3 h-3 text-hacktober-400" />
              <span>Moderator Permissions:</span>
            </div>
            <p>&bull; Delete coder records from leaderboard</p>
            <p>&bull; Register / add new coders instantly</p>
            <p>&bull; Reset or trigger full rating synchronization</p>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md bg-carbon-card hover:bg-carbon-elevated text-zinc-400 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-hacktober-500 hover:bg-hacktober-600 text-white text-xs font-mono font-semibold shadow-orange-glow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Unlock Moderator Mode</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
