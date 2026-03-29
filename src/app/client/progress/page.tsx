'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Plus, Activity, Calendar, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function ProgressPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [weight, setWeight] = useState('');

  useEffect(() => {
    async function fetchProgressData() {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('progress_entries')
        .select('*')
        .eq('client_id', user.id)
        .order('recorded_at', { ascending: true });

      if (!error && data) {
        setEntries(data);
      }
      setIsLoading(false);
    }
    fetchProgressData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !user?.id) return;

    const newEntry = {
      client_id: user.id,
      metric_key: 'weight',
      metric_label: 'Body Weight',
      value: parseFloat(weight),
      unit: 'kg',
      recorded_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('progress_entries')
      .insert([newEntry])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      alert(`Error Recording Progress: ${error.message}`);
    } else if (data) {
      setEntries([...entries, data[0]]);
      setWeight('');
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('progress_entries')
      .delete()
      .eq('id', id);

    if (!error) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const chartData = entries
    .filter(e => e.metric_key === 'weight')
    .map(e => ({
      date: new Date(e.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: e.value
    }));

  return (
    <div className="max-w-6xl mx-auto space-y-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">Strategic Progress</h1>
          <p className="text-zinc-500 text-sm font-mono uppercase tracking-[0.2em] italic tracking-widest leading-relaxed">Tracking Performance Metrics & Trends</p>
        </div>
        <form onSubmit={handleSubmit} className="glass-panel p-4 flex items-center gap-4 border-primary/20 bg-primary/5">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">Record Weight</p>
            <div className="flex items-center gap-2 mt-1">
              <input 
                type="number" 
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="00.0"
                className="bg-transparent border-none text-white font-black text-xl w-16 focus:ring-0 placeholder:text-primary/20"
              />
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono">kg</span>
            </div>
          </div>
          <button type="submit" className="h-10 w-10 rounded-lg bg-primary text-black flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.3)] hover:scale-105 transition-transform">
            <Plus size={20} strokeWidth={3} />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 h-[400px] border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                <TrendingUp size={14} className="text-primary" />
                Weight Trend (kg)
              </h2>
            </div>
            
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A3E635" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#A3E635" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10} 
                    fontFamily="Geist Mono"
                    tick={{fontWeight: 'bold'}}
                  />
                  <YAxis 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dx={-10} 
                    hide
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontFamily: 'Geist Mono',
                      fontWeight: 'bold',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#A3E635' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#A3E635" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                    dot={{ fill: '#A3E635', strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, strokeWidth: 0, fill: '#A3E635', className: 'shadow-[0_0_15px_#A3E635]' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
            Historical Data
          </h2>
          <div className="glass-panel overflow-hidden border-white/5 bg-white/[0.01]">
            <div className="divide-y divide-white/5">
              {entries.slice().reverse().map((entry, i) => (
                <div key={entry.id} className="p-4 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded bg-white/5 flex items-center justify-center text-zinc-700 font-mono text-[10px] font-bold group-hover:text-primary transition-all">
                      {new Date(entry.recorded_at).getDate()}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase italic tracking-tight">{entry.value} {entry.unit}</p>
                      <p className="text-[10px] text-zinc-600 font-mono uppercase mt-0.5 font-bold tracking-[0.2em]">{new Date(entry.recorded_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(entry.id)}
                    className="h-8 w-8 rounded bg-white/5 border border-white/5 flex items-center justify-center text-zinc-800 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {entries.length === 0 && !isLoading && (
                <div className="p-10 text-center text-zinc-700 italic font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                  No Historical Records Found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
