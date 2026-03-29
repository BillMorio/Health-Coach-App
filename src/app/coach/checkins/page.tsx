'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, Search, MessageSquare, Clock, Filter, ChevronRight, User, Activity, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CheckinsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('checkin_submissions')
      .select('*, clients(full_name, email)')
      .order('submitted_at', { ascending: false });
    
    if (!error && data) {
      setSubmissions(data);
    }
    setIsLoading(false);
  }

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || !response) return;
    setIsSubmitting(true);

    const { error } = await supabase
      .from('checkin_submissions')
      .update({ 
        coach_response: response,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', selectedSubmission.id);

    if (error) {
      console.error('Supabase Error:', error);
      alert(`Error Dispatching Feedback: ${error.message}`);
    } else {
      setSubmissions(submissions.map(s => 
        s.id === selectedSubmission.id 
          ? { ...s, coach_response: response, reviewed_at: new Date().toISOString() } 
          : s
      ));
      setSelectedSubmission(null);
      setResponse('');
    }
    setIsSubmitting(false);
  };

  const filteredSubmissions = submissions.filter(s => 
    s.clients?.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter text-left">Feedback Center</h1>
          <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.2em] italic text-left font-bold font-mono">Reviewing Client Updates & Progress Reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel overflow-hidden border-white/5 bg-white/[0.01]">
            <div className="p-8 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                <input 
                  type="text" 
                  placeholder="Find Client Submission..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/20 transition-all font-mono"
                />
              </div>
            </div>

            <div className="divide-y divide-white/5 min-h-[500px]">
              {isLoading ? (
                <div className="p-20 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-800 animate-pulse font-bold tracking-widest">Parsing Member Updates...</div>
              ) : (
                filteredSubmissions.map((sub) => (
                  <div 
                    key={sub.id} 
                    onClick={() => setSelectedSubmission(sub)}
                    className={`p-8 flex items-center justify-between hover:bg-white/[0.01] transition-all cursor-pointer group ${selectedSubmission?.id === sub.id ? 'bg-white/[0.02] border-l-2 border-primary shadow-[0_0_20px_rgba(163,230,53,0.05)]' : ''}`}
                  >
                    <div className="flex items-center gap-8">
                      <div className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all ${sub.reviewed_at ? 'bg-white/5 border-white/5 text-zinc-700' : 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(163,230,53,0.1)]'}`}>
                        {sub.reviewed_at ? <CheckSquare size={20} /> : <AlertCircle size={20} />}
                      </div>
                      <div className="space-y-1.5">
                        <p className="font-black text-white group-hover:text-primary transition-colors text-xl uppercase italic tracking-tighter leading-tight">{sub.clients?.full_name}</p>
                        <div className="flex items-center gap-4 text-[10px] font-bold font-mono tracking-widest uppercase text-zinc-700">
                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-zinc-800" /> {new Date(sub.submitted_at).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1.5 italic">Standard Review</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 text-right">
                       <div className="hidden md:block space-y-1">
                         <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest leading-none">Review Status</p>
                         <p className={`text-[10px] font-black uppercase tracking-tight mt-1 ${sub.reviewed_at ? 'text-zinc-700' : 'text-primary animate-pulse'}`}>{sub.reviewed_at ? 'Completed' : 'Pending'}</p>
                       </div>
                       <ChevronRight size={18} className="text-zinc-800 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))
              )}
              {!isLoading && filteredSubmissions.length === 0 && (
                <div className="p-20 text-center text-zinc-800 italic font-mono text-[10px] uppercase tracking-[0.4em] font-black">Feedback Center Queue is Empty.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 underline underline-offset-8 decoration-zinc-800">Submission Details</h2>
          <div className="glass-panel p-10 space-y-10 border-white/5 bg-white/[0.01] sticky top-32 transition-all">
            {selectedSubmission ? (
              <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-6">
                  <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                     <div className="h-12 w-12 rounded-full bg-white/5 overflow-hidden border border-white/5">
                        <img src={selectedSubmission.clients?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=member'} alt="Avatar" className="h-full w-full object-cover" />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest font-mono">Member Profile</p>
                       <p className="text-2xl font-black text-white uppercase italic tracking-tighter">{selectedSubmission.clients?.full_name}</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5 space-y-1.5">
                      <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-widest font-bold">Energy Level</p>
                      <p className="text-sm font-black text-primary uppercase italic">{selectedSubmission.metrics?.energy || 'Standard'}</p>
                    </div>
                    <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5 space-y-1.5">
                      <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-widest font-bold">Recovery Sleep</p>
                      <p className="text-sm font-black text-white uppercase italic">{selectedSubmission.metrics?.sleep || '00'}h Average</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest flex items-center gap-2 font-mono leading-none"><MessageSquare size={12} className="text-primary" /> Member Summary</p>
                    <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5 italic text-sm text-zinc-400 leading-relaxed font-medium">
                      "{selectedSubmission.answers?.notes || 'No briefing notes provided.'}"
                    </div>
                  </div>
                </div>

                <form onSubmit={handleReview} className="space-y-6 pt-10 border-t border-white/5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono">Executive Feedback</label>
                  <textarea 
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Provide professional feedback and program adjustments..."
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-sm text-white placeholder:text-zinc-800 min-h-[150px] focus:outline-none focus:border-primary/20 transition-all font-medium leading-relaxed"
                    required
                  />
                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setSelectedSubmission(null)}
                      className="btn-ghost flex-1 !h-12 text-[10px]"
                    >
                      Close
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="btn-tactical flex-1 !h-12 shadow-[0_0_20px_-5px_#A3E635] disabled:opacity-50 text-xs"
                    >
                      {isSubmitting ? 'Syncing...' : 'Dispatch Feedback'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-20 text-center space-y-6">
                <Activity size={48} className="text-zinc-800 mx-auto" />
                <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-[0.4em] font-black leading-relaxed">Select a member submission from the queue to provide feedback.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
