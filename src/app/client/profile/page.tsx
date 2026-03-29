'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Save, FileText, Activity, Shield, Target } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    activity_level: '',
    dietary_restrictions: '',
    motivation: ''
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          activity_level: data.activity_level || '',
          dietary_restrictions: data.dietary_restrictions || '',
          motivation: data.motivation || ''
        });
      }
      setIsLoading(false);
    }
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSaving(true);

    const { error } = await supabase
      .from('clients')
      .update(formData)
      .eq('id', user.id);

    if (!error) {
      setProfile({ ...profile, ...formData });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
        Accessing Member Profile Data...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 font-sans">
      <div className="flex items-center gap-8 border-b border-white/5 pb-10">
        <div className="h-24 w-24 rounded-2xl bg-white/5 border border-white/10 p-1 group relative">
          <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <img src={user?.avatarUrl} alt="Avatar" className="h-full w-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#A3E635]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">Member_{user?.id?.split('-')[0]}</span>
          </div>
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">{formData.full_name}</h1>
          <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest font-black italic mt-1">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-10 space-y-10 border-white/5 bg-white/[0.01]">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              <Shield size={14} className="text-primary" />
              Core Identity Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-4 font-mono leading-none">Full Legal Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-800" size={16} />
                  <input 
                    type="text" 
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-4 font-mono leading-none">Global Activity Level</label>
                 <select 
                    value={formData.activity_level}
                    onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium appearance-none"
                 >
                   <option value="sedentary">Sedentary / Light</option>
                   <option value="moderate">Moderate / Active</option>
                   <option value="elite">Elite / High Intensity</option>
                 </select>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-4 font-mono leading-none">Dietary Constraints & Insights</label>
                <div className="relative">
                  <Activity className="absolute left-4 top-4 text-zinc-800" size={16} />
                  <textarea 
                    value={formData.dietary_restrictions}
                    onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
                    placeholder="Record any specific dietary requirements..."
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium min-h-[100px] leading-relaxed"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-4 font-mono leading-none">Core Purpose & Motivation</label>
                <div className="relative">
                  <Target className="absolute left-4 top-4 text-zinc-800" size={16} />
                  <textarea 
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    placeholder="What drives your strategic growth?"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium min-h-[100px] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-8 space-y-8 bg-white/[0.01]">
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-600 font-mono">Profile Status</h2>
              <p className="text-sm font-black text-white uppercase italic tracking-tight">Verified Member</p>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <FileText className="text-zinc-800 mt-1" size={16} />
                <p className="text-[10px] text-zinc-600 italic font-bold uppercase tracking-widest leading-relaxed">Account metadata remains confidential to management.</p>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isSaving}
                className="btn-tactical w-full flex items-center justify-center gap-3 relative disabled:opacity-50 !h-12 text-xs shadow-[0_0_20px_-5px_#A3E635]"
              >
                {isSaving ? 'Synchronizing...' : 'Save Member Profile'}
                <Save size={16} className={`${isSaving ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
