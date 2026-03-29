'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Video, MapPin, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      
      const { data: appts, error: apptsError } = await supabase
        .from('appointments')
        .select(`
          *,
          appointment_types (name, duration_min)
        `)
        .eq('client_id', user.id)
        .order('scheduled_at', { ascending: true });

      const { data: typesData, error: typesError } = await supabase
        .from('appointment_types')
        .select('*')
        .eq('active', true);

      if (appts) setAppointments(appts);
      if (typesData) setTypes(typesData);
      
      setIsLoading(false);
    }
    fetchData();
  }, [user]);

  const handleBook = async (typeId: string) => {
    if (!user?.id) return;
    setIsBooking(true);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const newAppt = {
      client_id: user.id,
      coach_id: 'e0000000-0000-0000-0000-000000000000',
      appointment_type_id: typeId,
      scheduled_at: tomorrow.toISOString(),
      duration_min: 30,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert([newAppt])
      .select(`
        *,
        appointment_types (name, duration_min)
      `);

    if (error) {
      console.error('Supabase Error:', error);
      alert(`Error Sealing Session: ${error.message}`);
    } else if (data) {
      setAppointments([...appointments, data[0]]);
    }
    setIsBooking(false);
  };

  const handleCancel = async (id: string) => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (!error) {
      setAppointments(appointments.filter(a => a.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
        Synchronizing Strategic Schedule...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">Strategic Schedule</h1>
          <p className="text-zinc-500 text-sm font-mono uppercase tracking-[0.2em] italic font-bold">Manage Your Sessions & Engagements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
            Upcoming Sessions
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <div key={appt.id} className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between group overflow-hidden relative border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-8">
                    <div className={`h-16 w-16 rounded-2xl border flex flex-col items-center justify-center font-mono transition-all ${appt.status === 'confirmed' ? 'bg-primary/10 border-primary shadow-[0_0_15px_-5px_rgba(163,230,53,0.3)] text-primary' : 'bg-white/5 border-white/5 text-zinc-600 group-hover:border-primary/20 group-hover:text-zinc-300'}`}>
                      <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{new Date(appt.scheduled_at).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-2xl font-black mt-1 leading-none">{new Date(appt.scheduled_at).getDate()}</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white uppercase italic tracking-tight group-hover:text-primary transition-colors">{appt.appointment_types?.name}</h3>
                      <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-zinc-500 italic font-bold">
                        <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="flex items-center gap-1.5"><Video size={12} className="text-primary" /> Remote Access</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 md:mt-0 flex items-center gap-8 text-right">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Status</p>
                       <p className={`text-xs font-black uppercase tracking-tight mt-1 ${appt.status === 'confirmed' ? 'text-primary' : 'text-orange-400 animate-pulse'}`}>
                         {appt.status}
                       </p>
                    </div>
                    <button 
                      onClick={() => handleCancel(appt.id)}
                      className="h-10 w-10 flex items-center justify-center rounded bg-white/5 border border-white/5 text-zinc-800 hover:text-red-500 hover:border-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-panel p-16 text-center text-zinc-700 italic font-mono text-[9px] uppercase tracking-[0.3em] font-bold border-white/5">
                No sessions scheduled.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Available Sessions</h2>
          <div className="glass-panel p-8 space-y-6 border-white/5 bg-white/[0.01]">
             {types.map((type) => (
                <div key={type.id} className="p-5 border border-white/5 rounded-2xl space-y-4 group hover:border-primary/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white uppercase italic tracking-tight group-hover:text-primary transition-colors">{type.name}</h4>
                      <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest font-bold">{type.duration_min} min Duration</p>
                    </div>
                    <Video size={16} className="text-zinc-800" />
                  </div>
                  <button 
                    onClick={() => handleBook(type.id)}
                    disabled={isBooking}
                    className="w-full h-10 bg-white/5 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest text-[#A3E635] hover:bg-[#A3E635]/10 hover:border-[#A3E635]/40 transition-all disabled:opacity-50"
                  >
                    Request Session
                  </button>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
