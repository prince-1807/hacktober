'use client';

import React, { useState } from 'react';
import { KeyRound, X, AlertCircle, CheckCircle2, Loader2, Lock } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPassword: string) => void;
  currentSavedToken?: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentSavedToken = '',
}) => {
  const [currentPassword, setCurrentPassword] = useState(currentSavedToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.trim().length < 4) {
      setErrorMsg('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to update password.');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('campus_cp_admin_token', newPassword.trim());
      }
      onSuccess(newPassword.trim());
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating password.';
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
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Change Admin Passcode</h3>
              <p className="text-xs text-zinc-400 font-mono">
                Update moderator access credentials
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
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs font-mono">
          <div>
            <label className="block text-zinc-300 mb-1">Current Passcode</label>
            <input
              type="password"
              required
              placeholder="Current passcode..."
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setErrorMsg(null);
              }}
              className="w-full px-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white placeholder-zinc-500 focus:outline-none focus:border-hacktober-500"
            />
          </div>

          <div>
            <label className="block text-zinc-300 mb-1">New Passcode</label>
            <input
              type="password"
              required
              placeholder="New passcode (min 4 characters)..."
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrorMsg(null);
              }}
              className="w-full px-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white placeholder-zinc-500 focus:outline-none focus:border-hacktober-500"
            />
          </div>

          <div>
            <label className="block text-zinc-300 mb-1">Confirm New Passcode</label>
            <input
              type="password"
              required
              placeholder="Confirm new passcode..."
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrorMsg(null);
              }}
              className="w-full px-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white placeholder-zinc-500 focus:outline-none focus:border-hacktober-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-carbon-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md bg-carbon-card hover:bg-carbon-elevated text-zinc-400 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-hacktober-500 hover:bg-hacktober-600 text-white text-xs font-semibold shadow-orange-glow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Update Passcode</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
