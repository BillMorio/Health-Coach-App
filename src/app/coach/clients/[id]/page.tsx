'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  User, Mail, Calendar, Activity, ChevronLeft, 
  ExternalLink, ArrowUpRight, TrendingUp, Clock, 
  FileText, Shield, AlertCircle, CheckSquare
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ClientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, [id]);

  async function fetchClientData() {
    setIsLoading(true);
    
    // 1. Fetch Client Profile
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('*, programs(title, description, duration_weeks)')
      .eq('id', id)
      .single();
    
    if (clientError) {
      alert(`Error Fetching Profile: ${clientError.message}`);
      router.push('/coach/clients');
      return;
    }
    setClient(clientData);

    // 2. Fetch Progress Entries
    const { data: progressData } = await supabase
      .from('progress_entries')
      .select('*')
      .eq('client_id', id)
      .order('recorded_at', { ascending: false })
      .limit(10);
    
    if (progressData) setProgress(progressData);

    // 3. Fetch Recent Check-ins
    const { data: checkinData } = await supabase
      .from('checkin_submissions')
      .select('*')
      .eq('client_id', id)
      .order('submitted_at', { ascending: false })
      .limit(5);

    if (checkinData) setCheckins(checkinData);
    
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-800 animate-pulse font-bold">
        Accessing Strategic Intelligence...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 font-sans">
      {/* Header / Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <button 
            onClick={() => router.push('/coach/clients')}
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-700 hover:text-primary transition-all font-mono italic"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-all" />
            Back to Portfolio
          </button>
          <div className="space-y-1">
            <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">{client.full_name}</h1>
            <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.3em] font-bold italic">Strategic Member Intelligence • ID_{client.id.split('-')[0]}</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className={`px-6 py-3 rounded-xl border flex items-center gap-3 ${client.status === 'active' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/5 text-zinc-700'}`}>
              <span className={`h-2 w-2 rounded-full ${client.status === 'active' ? 'bg-primary animate-pulse' : 'bg-zinc-800'}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{client.status} Engagement</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
        {/* Profile Sidebar */}
        <div className="space-y-10">
          <div className="glass-panel p-10 space-y-10 border-white/5 bg-white/[0.01]">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono italic underline decoration-zinc-800 underline-offset-8">Member Identity</h3>
              <div className="space-y-6 pt-4">
                 <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-700 group-hover:text-primary transition-all group-hover:border-primary/20">
                       <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-800 font-mono">Email Identifier</p>
                      <p className="text-sm font-bold text-white uppercase italic tracking-tight">{client.email}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-700 group-hover:text-secondary transition-all group-hover:border-secondary/20">
                       <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-800 font-mono">Enrolled On</p>
                      <p className="text-sm font-bold text-white uppercase italic tracking-tight">{new Date(client.created_at).toLocaleDateString()}</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-white/5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono italic underline decoration-zinc-800 underline-offset-8">Active Blueprint</h3>
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 space-y-3 group hover:border-primary/40 transition-all cursor-pointer">
                 <p className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-primary transition-all">{client.programs?.title || 'No Assigned Program'}</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 font-mono leading-relaxed italic">{client.programs?.duration_weeks || 12} Week Strategic Cycle</p>
              </div>
            </div>
            
            <button className="btn-ghost w-full !h-12 text-[10px] uppercase font-bold tracking-[0.2em] font-mono">Modify Engagement Status</button>
          </div>
        </div>

        {/* Intelligence Data */}
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Performance Trends */}
            <div className="glass-panel p-10 space-y-10 border-white/5 bg-white/[0.01]">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono italic underline decoration-zinc-800 underline-offset-8">Trend Analysis</h3>
                <TrendingUp size={16} className="text-primary" />
              </div>
              <div className="space-y-6 min-h-[250px] flex flex-col justify-center">
                 {progress.length > 0 ? (
                   <div className="space-y-6">
                      {progress.map((entry, i) => (
                        <div key={entry.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                             <div className="text-[9px] font-bold text-zinc-800 font-mono whitespace-nowrap">{new Date(entry.recorded_at).toLocaleDateString()}</div>
                             <p className="text-sm font-black text-white uppercase italic tracking-tight group-hover:text-primary transition-all">{entry.metric_label}</p>
                          </div>
                          <p className="text-sm font-black text-white tabular-nums group-hover:text-primary transition-all">{entry.value} <span className="text-[9px] text-zinc-800 uppercase font-mono">{entry.unit}</span></p>
                        </div>
                      ))}
                   </div>
                 ) : (
                   <div className="text-center space-y-4 py-10 opacity-40">
                      <Activity className="mx-auto text-zinc-700" size={32} />
                      <p className="text-[9px] font-bold font-mono uppercase tracking-widest">No Intelligence Data Stream Available.</p>
                   </div>
                 )}
              </div>
            </div>

            {/* Recent Assessments */}
            <div className="glass-panel p-10 space-y-10 border-white/5 bg-white/[0.01]">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono italic underline decoration-zinc-800 underline-offset-8">Feedback Stream</h3>
                <CheckSquare size={16} className="text-primary" />
              </div>
              <div className="space-y-6 min-h-[250px]">
                 {checkins.length > 0 ? (
                   <div className="space-y-4">
                      {checkins.map((sub, i) => (
                        <div key={sub.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer">
                           <div className="space-y-1.5">
                             <p className="text-xs font-black text-white uppercase italic tracking-tight group-hover:text-primary transition-all">Weekly Update</p>
                             <div className="flex items-center gap-3 text-[9px] font-bold text-zinc-800 font-mono uppercase tracking-widest">
                               <Clock size={10} />
                               {new Date(sub.submitted_at).toLocaleDateString()}
                             </div>
                           </div>
                           <ChevronLeft size={14} className="text-zinc-800 rotate-180 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                   </div>
                 ) : (
                   <div className="text-center space-y-4 py-10 opacity-40">
                      <FileText className="mx-auto text-zinc-700" size={32} />
                      <p className="text-[9px] font-bold font-mono uppercase tracking-widest">No Assessment Logs Detected.</p>
                   </div>
                 )}
              </div>
            </div>
          </div>

          <div className="glass-panel p-10 space-y-10 border-orange-500/10 bg-orange-500/[0.01]">
             <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                   <AlertCircle size={20} />
                </div>
                <div>
                   <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">Strategic Action Required</h3>
                   <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest font-mono mt-1">Global program reassessment suggested every quarterly cycle.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <button className="btn-ghost flex-1 !h-12 text-[10px] font-bold uppercase tracking-[0.2em] font-mono">Review Analytics</button>
                <button className="btn-tactical flex-1 !h-12 text-xs !bg-orange-500/20 !border-orange-500/30 !text-orange-500 shadow-none hover:!bg-orange-500/30">Trigger Red-Alert Check</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
