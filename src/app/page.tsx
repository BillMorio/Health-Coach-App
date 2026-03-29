'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Shield, User, ArrowRight, Activity, Command, Lock, Mail, ChevronRight, AlertCircle, LogOut } from 'lucide-react';

export default function LandingPage() {
  const { login, user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || 'Access Denied.');
    }
    setIsSubmitting(false);
  };

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-6">
        <div className="max-w-xl w-full glass-panel p-12 space-y-10 text-center animate-in zoom-in duration-500 border-primary/20">
          <div className="h-20 w-20 rounded-full bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center text-primary shadow-[0_0_20px_rgba(163,230,53,0.1)]">
            <Activity size={32} />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase italic">Active Session Detected</h1>
            <p className="text-zinc-500 text-sm font-medium">You are currently identified as <span className="text-white font-black">{user.name}</span>.</p>
          </div>
          <div className="flex gap-4 pt-6">
             <button onClick={() => window.location.href = `/${user.role}`} className="btn-tactical flex-1 !h-12 text-sm shadow-[0_0_15px_#A3E635]">Enter Dashboard</button>
             <button onClick={logout} className="btn-ghost flex-1 !h-12 text-zinc-700 hover:text-red-500 flex items-center justify-center gap-2 group">
                <LogOut size={16} />
                Terminate
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-6">
      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Command className="text-primary" size={32} />
            <span className="text-4xl font-black tracking-tighter text-white uppercase italic">Sequenta</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic text-white uppercase tracking-tighter leading-[0.9]">
            Strategic <br />
            <span className="text-primary drop-shadow-[0_0_15px_rgba(163,230,53,0.3)]">Performance</span> Core.
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed pt-4">
            Sequenta is the executive platform for health coaching, engineered for precision, professional clarity, and elite results.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-6">
          <button 
            onClick={() => setShowModal(true)}
            className="btn-tactical flex items-center gap-3 px-8 text-lg"
          >
            Access Portal
            <ArrowRight size={20} />
          </button>
          <button onClick={() => window.location.href = '/book'} className="btn-ghost px-8 text-[11px] font-bold uppercase tracking-[0.2em] font-mono group">
            Schedule Briefing
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          {['Precision', 'Clarity', 'Strategy', 'Elite'].map((tag) => (
            <div key={tag} className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 font-mono">
              // {tag}_Mode
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Sign-In Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#050505]/90 backdrop-blur-xl">
          <div className="glass-panel max-w-xl w-full p-12 space-y-10 animate-in fade-in zoom-in duration-500 border-primary/10">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest font-mono italic">Secure Authentication Mode</div>
               <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-tight">Identity Verification Required</h2>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-[10px] font-bold text-red-500 uppercase tracking-widest font-mono italic">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              <div className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-1 font-mono group-focus-within:text-primary transition-colors italic leading-none">Management Identifier (Email)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-primary transition-colors" size={16} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="executive@management.com"
                      className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium placeholder:text-zinc-800"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-1 font-mono group-focus-within:text-primary transition-colors italic leading-none">Security Passkey</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-primary transition-colors" size={16} />
                    <input 
                      type="password" 
                      value={password}
                      autoComplete="off"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Strategic Key (1234)"
                      className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium placeholder:text-zinc-800"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  type="submit" 
                  className="btn-tactical w-full !h-14 text-sm shadow-[0_0_20px_-5px_#A3E635] flex items-center justify-center gap-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Syncing Profile...' : 'Authorize Access'}
                  <div className="h-4 w-px bg-white/20 mx-2" />
                  <ChevronRight size={18} />
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-800 hover:text-zinc-400 transition-colors font-mono italic"
                >
                  Terminate Authorization Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
