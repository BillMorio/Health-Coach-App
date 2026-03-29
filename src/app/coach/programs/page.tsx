'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Edit3, Trash2, ChevronRight, Clock, Target, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProgram, setNewProgram] = useState({ title: '', description: '', duration_weeks: 12 });

  useEffect(() => {
    fetchPrograms();
  }, []);

  async function fetchPrograms() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setPrograms(data);
    }
    setIsLoading(false);
  }

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('programs')
      .insert([{ 
        ...newProgram, 
        coach_id: 'e0000000-0000-0000-0000-000000000000'
      }])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      alert(`Error Finalizing Program: ${error.message}`);
    } else if (data) {
      setPrograms([data[0], ...programs]);
      setShowAddModal(false);
      setNewProgram({ title: '', description: '', duration_weeks: 12 });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">Program Library</h1>
          <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.3em] italic font-bold">Designing Strategic Performance Plans</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-tactical flex items-center gap-2 !h-12 !px-6 shadow-[0_0_20px_rgba(163,230,53,0.1)]"
        >
          <Plus size={18} />
          Design New Program
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full p-20 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-800 animate-pulse font-bold">Synchronizing Program Library...</div>
        ) : (
          programs.map((program) => (
            <div key={program.id} className="glass-panel p-8 group flex flex-col justify-between hover:border-primary/20 transition-all border-white/5 bg-white/[0.01]">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center text-zinc-600 group-hover:text-primary transition-all shadow-[0_0_15px_rgba(163,230,53,0.05)]">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="h-8 w-8 rounded bg-white/5 border border-white/5 flex items-center justify-center text-zinc-800 hover:text-white transition-all hover:bg-white/10">
                      <Edit3 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter group-hover:text-primary transition-colors leading-tight">{program.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed font-medium mt-1 line-clamp-2 italic">{program.description}</p>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono">
                    <Clock size={12} className="text-primary" />
                    {program.duration_weeks}W Duration
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono">
                    <Target size={12} className="text-primary" />
                    Strategic Level
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-10 flex items-center justify-between border-t border-white/5">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="h-6 w-6 rounded-full bg-white/10 border border-[#050505] overflow-hidden opacity-50 transition-opacity group-hover:opacity-100" />
                   ))}
                   <div className="h-6 px-2 rounded-full bg-white/5 flex items-center justify-center text-[8px] font-black text-zinc-700 uppercase tracking-widest">+12 Users</div>
                </div>
                <button className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-3 transition-all italic">
                  Manage Plan Details <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
        
        {!isLoading && programs.length === 0 && (
          <div className="col-span-full glass-panel p-20 text-center space-y-6 border-white/5">
             <Activity className="mx-auto text-zinc-800" size={48} />
             <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-[0.4em] font-black">No Program Plans Found in Library.</p>
             <button onClick={() => setShowAddModal(true)} className="btn-ghost !h-12 mt-4 text-[10px]">Initiate Builder Process</button>
          </div>
        )}
      </div>

      {/* Add Program Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#050505]/80 backdrop-blur-md">
          <div className="glass-panel max-w-xl w-full p-12 space-y-10 animate-in fade-in zoom-in duration-500 border-primary/10">
            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Design New Program</h2>
            <form onSubmit={handleCreateProgram} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-1 font-mono">Program Title</label>
                <input 
                  type="text" 
                  value={newProgram.title}
                  onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium"
                  placeholder="e.g. Endurance Foundation"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-1 font-mono">Strategic Description</label>
                <textarea 
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium min-h-[120px] leading-relaxed"
                  placeholder="Describe the professional outcomes of this program..."
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-ghost flex-1 !h-12 text-[10px]">Close</button>
                <button type="submit" className="btn-tactical flex-1 !h-12 text-sm shadow-[0_0_20px_-5px_#A3E635]">Finalize Layout</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
