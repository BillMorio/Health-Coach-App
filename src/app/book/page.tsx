'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, User, Mail, CheckCircle2, 
  ArrowRight, ChevronRight, Video, Shield, 
  Command, Activity, Sparkles, AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PublicBookingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', typeId: '' });
  const [types, setTypes] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTypes() {
      const { data } = await supabase
        .from('appointment_types')
        .select('*')
        .eq('active', true);
      if (data) setTypes(data);
    }
    fetchTypes();
  }, []);

  const handleFinalizeBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // 1. Strategic Enrollment (Check/Create Client)
      let clientId: string;
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('email', formData.email.toLowerCase())
        .single();

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert([{
            full_name: formData.name,
            email: formData.email.toLowerCase(),
            status: 'invited',
            coach_id: 'e0000000-0000-0000-0000-000000000000'
          }])
          .select()
          .single();
        
        if (clientError) throw clientError;
        clientId = newClient.id;
      }

      // 2. Schedule Session
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0);

      const { error: apptError } = await supabase
        .from('appointments')
        .insert([{
          client_id: clientId,
          coach_id: 'e0000000-0000-0000-0000-000000000000',
          appointment_type_id: formData.typeId,
          scheduled_at: tomorrow.toISOString(),
          duration_min: 30,
          status: 'pending'
        }]);

      if (apptError) throw apptError;
      
      setStep(3);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'System error during enrollment sequence.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-20">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
           <div className="flex items-center gap-3">
             <Command className="text-primary" size={24} />
             <span className="text-2xl font-black tracking-tighter uppercase italic">Sequenta Booking</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
             Secure Your <br />
             <span className="text-primary drop-shadow-[0_0_15px_rgba(163,230,53,0.2)]">Strategic Briefing.</span>
           </h1>
           <p className="text-zinc-500 max-w-lg text-sm font-medium uppercase tracking-widest font-mono">Precision health optimization starts with professional alignment.</p>
        </div>

        {/* Booking Container */}
        <div className="glass-panel max-w-2xl mx-auto overflow-hidden border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          {/* Progress Indicator */}
          <div className="grid grid-cols-3 h-1 bg-white/[0.02]">
            <div className={`transition-all duration-700 ${step >= 1 ? 'bg-primary' : ''}`} />
            <div className={`transition-all duration-700 ${step >= 2 ? 'bg-primary' : ''}`} />
            <div className={`transition-all duration-700 ${step >= 3 ? 'bg-primary' : ''}`} />
          </div>

          <div className="p-12 md:p-16">
            {step === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">I. Identity Verification</h2>
                  <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest leading-relaxed italic">Provide your professional identifiers to begin the sync.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-1 font-mono italic leading-none">Legal Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-800" size={16} />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/20 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-1 font-mono italic leading-none">Strategic Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-800" size={16} />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@strategic.com"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/20 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => formData.name && formData.email && setStep(2)}
                  className="btn-tactical w-full !h-14 text-sm shadow-[0_0_20px_rgba(163,230,53,0.1)] flex items-center justify-center gap-3"
                >
                  Continue Enrollment
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">II. Engagement Select</h2>
                  <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest leading-relaxed italic">Select your preferred briefing format.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {types.map((type) => (
                    <button 
                      key={type.id}
                      onClick={() => setFormData({ ...formData, typeId: type.id })}
                      className={`p-6 border text-left rounded-2xl transition-all flex items-center justify-between group ${formData.typeId === type.id ? 'bg-primary/5 border-primary/40' : 'bg-white/[0.01] border-white/5 hover:border-primary/20'}`}
                    >
                      <div className="space-y-1">
                        <p className={`text-base font-black uppercase italic tracking-tight ${formData.typeId === type.id ? 'text-primary' : 'text-white'}`}>{type.name}</p>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase font-mono tracking-widest">{type.duration_min} Min Performance Review</p>
                      </div>
                      <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all ${formData.typeId === type.id ? 'bg-primary border-primary text-black' : 'border-white/10 text-transparent'}`}>
                        <CheckCircle2 size={14} />
                      </div>
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-[10px] font-bold text-red-500 uppercase tracking-widest font-mono italic">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="btn-ghost flex-1 !h-14 text-[10px]">Adjust Identity</button>
                  <button 
                    onClick={handleFinalizeBooking}
                    disabled={!formData.typeId || isSubmitting}
                    className="btn-tactical flex-[2] !h-14 text-sm shadow-[0_0_20px_#A3E635] flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? 'Syncing Profile...' : 'Finalize Briefing'}
                    <Sparkles size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-10 animate-in zoom-in duration-700 py-10">
                <div className="h-24 w-24 rounded-full bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center text-primary shadow-[0_0_50px_rgba(163,230,53,0.2)]">
                  <CheckCircle2 size={48} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">Briefing Reserved.</h2>
                  <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">Your profile has been synchronized into the Sequenta Database. You will receive notification within 24 hours.</p>
                </div>
                <div className="pt-6 space-y-4">
                   <button onClick={() => window.location.href = '/'} className="btn-tactical w-full !h-14 text-sm shadow-[0_0_20px_-5px_#A3E635]">Open Member Portal</button>
                   <p className="text-[9px] font-bold font-mono text-zinc-700 uppercase tracking-widest italic">Default passkey detected as: 1234</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Brand Footer */}
        <div className="text-center opacity-30 pt-10">
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 font-mono italic underline decoration-zinc-800 underline-offset-8">Sequenta Professional Systems // LEAD_GEN_MODULE</p>
        </div>
      </div>
    </div>
  );
}
