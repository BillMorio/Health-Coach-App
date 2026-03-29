'use client';

import React, { useState, useEffect } from 'react';
import { Target, Activity, Clock, ChevronRight, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';

export default function ProgramPage() {
  const { user } = useAuth();
  const [program, setProgram] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProgramData() {
      if (!user?.id) return;

      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select(`
          program_id,
          programs (*)
        `)
        .eq('id', user.id)
        .single();

      if (clientError || !clientData?.programs) {
        setIsLoading(false);
        return;
      }

      setProgram(clientData.programs);

      const { data: blocksData, error: blocksError } = await supabase
        .from('program_blocks')
        .select('*')
        .order('position', { ascending: true });

      if (!blocksError && blocksData) {
        setBlocks(blocksData);
      }
      
      setIsLoading(false);
    }

    fetchProgramData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-2 border-primary border-t-transparent animate-spin rounded-full mx-auto shadow-[0_0_15px_rgba(163,230,53,0.2)]" />
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-600 font-bold">Initialising Program View...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="glass-panel p-16 text-center max-w-2xl mx-auto mt-10 border-white/5">
        <BookOpen className="mx-auto text-zinc-800 mb-8" size={64} />
        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">No Assigned Program</h2>
        <p className="text-zinc-500 mt-4 leading-relaxed font-medium">Your coach has not assigned a strategic program to your profile yet. Please contact management for access.</p>
        <button className="btn-tactical mt-10 shadow-[0_0_20px_rgba(163,230,53,0.15)]">Request Program Access</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 font-sans">
      {/* Program Hero */}
      <div className="glass-panel p-10 relative overflow-hidden group border-white/5">
        <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-bl-full -mr-10 -mt-10 blur-2xl group-hover:scale-110 transition-transform" />
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="h-24 w-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary relative shadow-[0_0_20px_rgba(163,230,53,0.1)]">
            <BookOpen size={40} />
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">{program.title}</h1>
              <p className="text-zinc-500 text-sm max-w-xl font-medium leading-relaxed">{program.description}</p>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Clock size={12} className="text-primary" />
                {program.duration_weeks} Weeks
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Activity size={12} className="text-primary" />
                Strategic Level
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Blocks */}
      <div className="space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
          Program Modules
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {blocks.length > 0 ? (
            blocks.map((block, i) => (
              <div key={block.id} className="glass-panel p-6 flex items-center justify-between group cursor-pointer hover:border-primary/20 border-white/5">
                <div className="flex items-center gap-6">
                  <div className="h-10 w-10 rounded bg-white/5 border border-white/10 flex items-center justify-center text-zinc-600 font-mono text-xs font-bold group-hover:text-primary transition-colors">
                    0{i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase italic tracking-tight">{block.block_type} Module</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase mt-1 tracking-widest font-mono">Status: Ready</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <ChevronRight size={18} className="text-zinc-800 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          ) : (
            <div className="glass-panel p-12 text-center text-zinc-700 italic text-[10px] font-mono uppercase tracking-[0.3em] font-bold">
              Loading Program Modules...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
