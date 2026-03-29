'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Calendar, CheckSquare, Activity, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('today');
  const [program, setProgram] = useState<any>(null);

  useEffect(() => {
    async function fetchProgram() {
      if (user?.id) {
        const { data, error } = await supabase
          .from('clients')
          .select('programs (*)')
          .eq('id', user.id)
          .single();
        
        if (!error && data?.programs) {
          setProgram(data.programs);
        }
      }
    }
    fetchProgram();
  }, [user]);

  const router = useRouter();

  const handleTaskClick = (task: string) => {
    alert(`Strategic Task Intelligence: Detail view for "${task}" is coming in the Portfolio Expansion Pack v2.0.`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-10 px-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_#A3E635]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono italic">Profile Active • Day 04</span>
          </div>
          <h1 className="text-4xl font-black italic tracking-tight text-white uppercase italic">Welcome, {user?.name.split(' ')[0]}</h1>
          <p className="text-zinc-400 max-w-md font-medium uppercase tracking-tight">Your current program ({program?.title || 'Loading...'}) is optimized for peak performance.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="glass-panel px-4 py-2 flex items-center gap-3 border-primary/20 bg-primary/5">
            <Target className="text-primary" size={18} />
            <div className="text-left font-mono">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 leading-none italic">Streak</p>
              <p className="text-sm font-bold text-white leading-tight">04 Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              <Activity size={14} className="text-primary" />
              Daily Schedule
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 font-sans">
            {[
              { title: 'Strength Training', meta: 'Lower Body Focus (A)', time: '09:00 - 10:30', status: 'pending' },
              { title: 'Nutrition Plan', meta: 'High Protein • 2,400 kcal', time: 'Ongoing', status: 'completed' },
              { title: 'Recovery Mobility', meta: 'Thoracic & Hip Focus', time: '20 min', status: 'pending' },
            ].map((item, index) => (
              <div 
                key={index} 
                onClick={() => handleTaskClick(item.title)}
                className={`glass-panel p-6 flex items-center justify-between group cursor-pointer border-white/5 hover:border-primary/20 transition-all ${item.status === 'completed' ? 'opacity-60 grayscale-[0.5]' : ''}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`h-12 w-12 rounded-lg border flex items-center justify-center transition-all ${item.status === 'completed' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-white/5 border-white/10 text-zinc-400 group-hover:border-primary/30 group-hover:text-primary'}`}>
                    {item.status === 'completed' ? <CheckSquare size={20} /> : <Calendar size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase italic tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider mt-1">{item.meta}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 font-mono">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">{item.time}</span>
                  <ChevronRight size={16} className="text-zinc-800 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono">
            Performance Metrics
          </h2>
          
          <div className="glass-panel p-8 space-y-8 bg-white/[0.01] border-white/5">
            <div className="space-y-6">
              {[
                { label: 'Macros', value: 85, color: 'bg-primary' },
                { label: 'Steps', value: 65, color: 'bg-emerald-400' },
                { label: 'Recovery', value: 92, color: 'bg-teal-400' },
              ].map((stat, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest font-mono italic">
                    <span className="text-zinc-600">{stat.label}</span>
                    <span className="text-white">{stat.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.color} transition-all duration-1000 shadow-[0_0_8px_rgba(163,230,53,0.3)]`} 
                      style={{ width: `${stat.value}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10">
              <button 
                onClick={() => router.push('/client/progress')}
                className="btn-tactical w-full flex items-center justify-center gap-3 !h-12 shadow-[0_0_15px_rgba(163,230,53,0.1)]"
              >
                Log Performance Trend
                <Activity size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
