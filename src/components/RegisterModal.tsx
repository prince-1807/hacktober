'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Branch, Gender, RegisterFormData } from '@/types/campus-cp';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (studentName: string) => void;
}

const BRANCHES: Branch[] = [
  'CSE',
  'IT',
  'ECE',
  'EE',
  'ME',
  'Civil',
  'Metallurgy',
  'Chemical',
  'Mining',
  'Production',
];

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    registrationNo: '',
    branch: 'CSE',
    year: 1,
    gender: 'MALE',
    cfHandle: '',
    lcHandle: '',
    ccHandle: '',
    gfgHandle: '',
    hrHandle: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value, 10) : value,
    }));
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Registration failed. Please check inputs.');
      }

      // Reset form & notify parent
      setFormData({
        name: '',
        registrationNo: '',
        branch: 'CSE',
        year: 1,
        gender: 'MALE',
        cfHandle: '',
        lcHandle: '',
        ccHandle: '',
        gfgHandle: '',
        hrHandle: '',
      });
      onSuccess(json.data?.name || 'Coder');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown network error.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-carbon-surface border border-carbon-border rounded-xl shadow-2xl p-6 sm:p-7 text-carbon-text">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-carbon-border">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-hacktober-500/10 border border-hacktober-500/30 text-hacktober-500">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Register for Campus_CP Arena
                <Sparkles className="w-4 h-4 text-hacktober-400" />
              </h3>
              <p className="text-xs text-zinc-400">
                BIT Sindri Central Leaderboard &bull; Instant Composite Score Calculation
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

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs font-sans">
          {/* Section 1: Student Information */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-hacktober-400 font-semibold mb-3">
              1. Student Academic Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Full Name <span className="text-hacktober-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Aman Kumar"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white placeholder-zinc-500 focus:outline-none focus:border-hacktober-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Registration Number <span className="text-hacktober-500">*</span>
                </label>
                <input
                  type="text"
                  name="registrationNo"
                  required
                  placeholder="e.g. 2301045"
                  value={formData.registrationNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white placeholder-zinc-500 focus:outline-none focus:border-hacktober-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Branch <span className="text-hacktober-500">*</span>
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white focus:outline-none focus:border-hacktober-500 font-sans text-xs"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b} Engineering
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Academic Year <span className="text-hacktober-500">*</span>
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white focus:outline-none focus:border-hacktober-500 font-sans text-xs"
                >
                  <option value={1}>1st Year (Batch 2024-28)</option>
                  <option value={2}>2nd Year (Batch 2023-27)</option>
                  <option value={3}>3rd Year (Batch 2022-26)</option>
                  <option value={4}>4th Year (Batch 2021-25)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-medium mb-1">
                  Gender (Used for Girls' Leaderboard View) <span className="text-hacktober-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['MALE', 'FEMALE', 'OTHER'] as Gender[]).map((g) => (
                    <label
                      key={g}
                      className={`flex items-center justify-center py-2 px-3 rounded-md border cursor-pointer font-mono text-xs transition-colors ${
                        formData.gender === g
                          ? 'border-hacktober-500 bg-hacktober-500/10 text-white font-bold'
                          : 'border-carbon-border bg-carbon-card text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span>{g === 'FEMALE' ? 'Female 👩‍💻' : g === 'MALE' ? 'Male 👨‍💻' : 'Other'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Platform Handles */}
          <div className="pt-2 border-t border-carbon-border">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-hacktober-400 font-semibold mb-3">
              2. Competitive Platform Handles
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Codeforces Handle (Weight: 35%)
                </label>
                <input
                  type="text"
                  name="cfHandle"
                  placeholder="e.g. tourist"
                  value={formData.cfHandle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white placeholder-zinc-500 focus:outline-none focus:border-hacktober-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  LeetCode Handle (Weight: 30%)
                </label>
                <input
                  type="text"
                  name="lcHandle"
                  placeholder="e.g. neetcode"
                  value={formData.lcHandle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white placeholder-zinc-500 focus:outline-none focus:border-hacktober-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  CodeChef Handle (Weight: 20%)
                </label>
                <input
                  type="text"
                  name="ccHandle"
                  placeholder="e.g. chef_sindri"
                  value={formData.ccHandle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white placeholder-zinc-500 focus:outline-none focus:border-hacktober-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  GeeksforGeeks Handle (Weight: 10%)
                </label>
                <input
                  type="text"
                  name="gfgHandle"
                  placeholder="e.g. gfg_coder"
                  value={formData.gfgHandle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white placeholder-zinc-500 focus:outline-none focus:border-hacktober-500 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-medium mb-1">
                  HackerRank Handle (Weight: 5%)
                </label>
                <input
                  type="text"
                  name="hrHandle"
                  placeholder="e.g. hackerrank_id"
                  value={formData.hrHandle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-carbon-card border border-carbon-border text-white placeholder-zinc-500 focus:outline-none focus:border-hacktober-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Formula summary note & Student Notice */}
          <div className="p-2.5 rounded bg-carbon-card border border-carbon-border font-mono text-[11px] text-zinc-400 space-y-1">
            <div>
              <span className="text-hacktober-400 font-semibold">Live Score Formula: </span>
              Composite = 0.35&times;S_CF + 0.30&times;S_LC + 0.20&times;S_CC + 0.10&times;S_GFG + 0.05&times;S_HR
            </div>
            <div className="text-[10px] text-zinc-500 pt-0.5 border-t border-carbon-border/50">
              &bull; Official Student Registration: You are submitting your verified CP profile.
              Students cannot delete or remove records; record deletions are handled exclusively by campus moderators.
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-carbon-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-md bg-carbon-card hover:bg-carbon-elevated text-zinc-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-5 py-2 rounded-md bg-hacktober-500 hover:bg-hacktober-600 text-white text-xs font-semibold shadow-orange-glow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fetching &amp; Normalizing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit &amp; Calculate Rating</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
