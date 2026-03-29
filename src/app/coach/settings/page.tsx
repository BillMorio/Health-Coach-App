'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Shield, Palette, Globe, Mail, Command, Bell, Lock } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    brand_name: '',
    primary_color: '#9EF01A',
    subdomain: ''
  });

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from('coach_profiles')
        .select('*')
        .eq('id', 'e0000000-0000-0000-0000-000000000000') // Updated STRATEGIC EXEC ID
        .single();

      if (!error && data) {
        setProfile(data);
        setFormData({
          brand_name: data.brand_name || '',
          primary_color: data.primary_color || '#9EF01A',
          subdomain: data.subdomain || ''
        });
      }
      setIsLoading(false);
    }
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const { error } = await supabase
      .from('coach_profiles')
      .update(formData)
      .eq('id', '00000000-0000-0000-0000-000000000000');

    if (!error) {
      setProfile({ ...profile, ...formData });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
        Accessing System Configuration Core...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-white/5 pb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter text-left">System Configuration</h1>
          <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.2em] italic text-left font-bold font-mono">Managing Brand Identity & Strategic Parameters</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="btn-tactical flex items-center gap-2 !h-12 !px-6 shadow-[0_0_20px_rgba(163,230,53,0.1)]"
        >
          {isSaving ? 'Syncing...' : 'Save Configuration'}
          <Save size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Section */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-800 underline underline-offset-8 decoration-zinc-900 mb-6">Configuration Modules</h2>
          <nav className="space-y-2">
            {[
              { name: 'Brand Identity', icon: Command, active: true },
              { name: 'Visual Interface', icon: Palette, active: false },
              { name: 'Network Sync', icon: Globe, active: false },
              { name: 'Alert Management', icon: Bell, active: false },
              { name: 'Encryption Core', icon: Lock, active: false },
            ].map(item => (
              <button 
                key={item.name}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${item.active ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_-5px_#A3E635]' : 'text-zinc-700 hover:text-zinc-300'}`}
              >
                <item.icon size={16} />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Section */}
        <div className="lg:col-span-3 space-y-10">
          <div className="glass-panel p-10 space-y-10 border-white/5 bg-white/[0.01]">
            <div className="space-y-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2 font-mono">
                <Shield size={14} className="text-primary" />
                Strategic Branding Meta
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-800 ml-1 font-mono leading-none">Global Brand Name</label>
                  <div className="relative">
                    <Command className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-800" size={16} />
                    <input 
                      type="text" 
                      value={formData.brand_name}
                      onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-800 ml-1 font-mono leading-none">Operational Path (Subdomain)</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-800" size={16} />
                    <input 
                      type="text" 
                      value={formData.subdomain}
                      onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium"
                      placeholder="e.g. sequenta-hub"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-800 ml-1 font-mono leading-none">Visual Primary Accent</label>
                <div className="flex items-center gap-6 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                  <input 
                    type="color" 
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="h-12 w-20 rounded-lg bg-transparent border-none focus:ring-0 cursor-pointer shadow-[0_0_15px_rgba(163,230,53,0.1)]"
                  />
                  <div className="space-y-1">
                    <p className="text-[10px] text-white font-mono font-bold uppercase tracking-widest leading-none">{formData.primary_color}</p>
                    <p className="text-[9px] text-zinc-700 font-mono uppercase font-black italic tracking-widest">Global Brand Glow Variable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 border border-dashed border-white/10 rounded-2xl flex items-center justify-between opacity-40">
            <div className="flex items-center gap-4 text-zinc-800">
               <Mail size={18} />
               <p className="text-[10px] font-bold uppercase italic tracking-widest">Contact technical support for core architectural modifications.</p>
            </div>
            <p className="text-[10px] font-bold text-zinc-900 font-mono uppercase tracking-[0.2em]">Instance_ID: S-7749-EXECUTIVE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
