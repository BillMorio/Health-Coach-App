'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Video, CheckCircle2, XCircle, ChevronRight, User, AlertCircle, Trash2, CheckSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppt, setNewAppt] = useState({ client_id: '', type_id: '', scheduled_at: '' });
  const [clients, setClients] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    
    // 1. Fetch Appointments
    const { data: appts, error: apptsError } = await supabase
      .from('appointments')
      .select('*, clients(full_name), appointment_types(name)')
      .order('scheduled_at', { ascending: true });
    
    if (!apptsError && appts) setAppointments(appts);

    // 2. Fetch Clients & Types for the modal
    const { data: clientsData } = await supabase.from('clients').select('id, full_name');
    const { data: typesData } = await supabase.from('appointment_types').select('id, name');
    
    if (clientsData) setClients(clientsData);
    if (typesData) setTypes(typesData);
    
    setIsLoading(false);
  }

  const handleCreateAppt = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        client_id: newAppt.client_id,
        appointment_type_id: newAppt.type_id,
        scheduled_at: newAppt.scheduled_at,
        coach_id: 'e0000000-0000-0000-0000-000000000000', // Updated Strategic ID
        duration_min: 30,
        status: 'confirmed'
      }])
      .select('*, clients(full_name), appointment_types(name)');

    if (error) {
      console.error('Supabase Error:', error);
      alert(`Error Sealing Engagement: ${error.message}`);
    } else if (data) {
      setAppointments([...appointments, data[0]]);
      setShowAddModal(false);
      setNewAppt({ client_id: '', type_id: '', scheduled_at: '' });
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (!error) {
      setAppointments(appointments.filter(a => a.id !== id));
    }
  };

  const nextAppt = appointments.length > 0 ? appointments[0] : null;

  const handleSyncLinks = () => {
    const link = "https://meet.google.com/sequenta-strategic-session";
    navigator.clipboard.writeText(link);
    alert(`Strategic Links Synchronized. Global Meet Link Copied: ${link}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-white/5 pb-10">
        <div className="space-y-1">
          <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter text-left">Management Schedule</h1>
          <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.3em] font-bold italic text-left">Coordinating Global Professional Engagements</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-tactical flex items-center gap-2 !h-12 !px-6 shadow-[0_0_20px_rgba(163,230,53,0.1)]"
        >
          <Plus size={18} />
          Add Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 underline underline-offset-8 decoration-zinc-800">Upcoming Engagements</h2>
          <div className="glass-panel overflow-hidden border-white/5 bg-white/[0.01] min-h-[500px]">
            {isLoading ? (
               <div className="p-20 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-800 animate-pulse font-bold tracking-widest leading-relaxed">Parsing Management Stream...</div>
            ) : (
              <div className="divide-y divide-white/5 font-sans">
                {appointments.map((appt) => (
                  <div key={appt.id} className="p-8 flex flex-col md:flex-row items-center justify-between group hover:bg-white/[0.01] transition-all border-white/5">
                    <div className="flex items-center gap-10">
                      <div className={`h-16 w-16 rounded-2xl border flex flex-col items-center justify-center font-mono transition-all ${appt.status === 'confirmed' ? 'bg-primary/10 border-primary shadow-[0_0_15px_-5px_rgba(163,230,53,0.3)] text-primary' : 'bg-white/5 border-white/5 text-zinc-700 group-hover:border-primary/20 group-hover:text-zinc-300'}`}>
                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{new Date(appt.scheduled_at).toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-2xl font-black mt-1 leading-none">{new Date(appt.scheduled_at).getDate()}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-white uppercase italic tracking-widest flex items-center gap-2 group-hover:text-primary transition-colors leading-none">
                          <User size={14} className="text-primary" />
                          {appt.clients?.full_name}
                        </p>
                        <p className="text-xl font-bold text-white uppercase italic tracking-tight">{appt.appointment_types?.name}</p>
                        <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-800 italic font-bold leading-none">
                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="flex items-center gap-1.5"><Video size={12} className="text-primary" /> Remote Link</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 md:mt-0 flex items-center gap-8 text-right">
                       <div className="space-y-1">
                         <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest leading-none font-mono">Status_Update</p>
                         <div className="flex items-center gap-3 mt-2 justify-end">
                           <button 
                             onClick={() => handleUpdateStatus(appt.id, 'confirmed')}
                             className={`p-1.5 rounded-lg border transition-all ${appt.status === 'confirmed' ? 'border-primary text-primary bg-primary/10 shadow-[0_0_10px_rgba(163,230,53,0.1)]' : 'border-white/5 text-zinc-800 hover:text-white hover:border-white/20'}`}
                           >
                             <CheckSquare size={16} />
                           </button>
                           <button 
                             onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                             className={`p-1.5 rounded-lg border transition-all ${appt.status === 'cancelled' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-white/5 text-zinc-800 hover:text-red-400 hover:border-red-400/20'}`}
                           >
                             <XCircle size={16} />
                           </button>
                           <button 
                             onClick={() => handleDelete(appt.id)}
                             className="p-1.5 rounded-lg border border-white/5 text-zinc-800 hover:text-red-500 hover:border-red-500/20 transition-all ml-2"
                           >
                             <Trash2 size={16} />
                           </button>
                         </div>
                       </div>
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div className="p-20 text-center space-y-4">
                     <Calendar className="mx-auto text-zinc-800" size={48} />
                     <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-[0.4em] font-black">No Active Professional Sessions.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 underline underline-offset-8 decoration-zinc-800">Strategic Insights</h2>
          <div className="glass-panel p-10 space-y-10 border-white/5 bg-white/[0.01]">
            <div className="space-y-8 text-left">
               <div className="space-y-1.5 border-b border-white/5 pb-8">
                 <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest leading-none font-mono italic underline decoration-white/10 underline-offset-8">Next Client Lead</p>
                 <p className="text-xl font-black text-white uppercase tracking-tight italic mt-2">
                   {nextAppt ? `${nextAppt.clients?.full_name} • ${new Date(nextAppt.scheduled_at).getHours()}:00 UTC` : 'No Imminent Leads'}
                 </p>
               </div>
               
               <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-4">
                 <AlertCircle size={20} className="text-primary mt-0.5 shadow-[0_0_8px_rgba(163,230,53,0.2)]" />
                 <p className="text-[11px] text-zinc-500 leading-relaxed font-bold uppercase tracking-wide italic">Executive Management must verify connectivity links 10 minutes prior to session onset.</p>
               </div>
            </div>
            <button onClick={handleSyncLinks} className="btn-ghost w-full !h-12 text-[10px] uppercase font-black tracking-[0.2em] hover:text-primary transition-all">Synchronize All Links</button>
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#050505]/80 backdrop-blur-md">
          <div className="glass-panel max-w-xl w-full p-12 space-y-10 animate-in fade-in zoom-in duration-500 border-primary/10">
            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">New Strategic Session</h2>
            <form onSubmit={handleCreateAppt} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-1 font-mono">Select Member Profile</label>
                <select 
                  value={newAppt.client_id}
                  onChange={(e) => setNewAppt({ ...newAppt, client_id: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium appearance-none"
                  required
                >
                  <option value="">Select Member...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-1 font-mono">Engagement Type</label>
                <select 
                  value={newAppt.type_id}
                  onChange={(e) => setNewAppt({ ...newAppt, type_id: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium appearance-none"
                  required
                >
                  <option value="">Select Session Type...</option>
                  {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-1 font-mono">Scheduled Deployment</label>
                <input 
                  type="datetime-local" 
                  value={newAppt.scheduled_at}
                  onChange={(e) => setNewAppt({ ...newAppt, scheduled_at: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium"
                  required
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-ghost flex-1 !h-12 text-[10px]">Cancel</button>
                <button type="submit" className="btn-tactical flex-1 !h-12 text-sm shadow-[0_0_20px_-5px_#A3E635]">Seal Engagement</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
