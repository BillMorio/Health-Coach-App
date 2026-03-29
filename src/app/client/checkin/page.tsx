'use client';

import React, { useState, useEffect } from 'react';
import { FormInput, Send, CheckCircle2, ChevronRight, MessageSquare, Activity, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';

export default function CheckinPage() {
  const { user } = useAuth();
  const [form, setForm] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any>({
    mood: 'great',
    sleep: '7',
    energy: 'high',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;

      const { data: formData } = await supabase
        .from('checkin_forms')
        .select('*')
        .limit(1)
        .single();
      
      const { data: subsData } = await supabase
        .from('checkin_submissions')
        .select('*')
        .eq('client_id', user.id)
        .order('submitted_at', { ascending: false });

      if (formData) setForm(formData);
      if (subsData) setSubmissions(subsData);
      
      setIsLoading(false);
    }
    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSubmitting(true);

    const submission = {
      client_id: user.id,
      form_id: form?.id || null,
      answers: answers,
      metrics: { mood: answers.mood, sleep: answers.sleep, energy: answers.energy },
      submitted_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('checkin_submissions')
      .insert([submission])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      alert(`Error Sending Strategic Update: ${error.message}`);
    } else if (data) {
      setSubmissions([data[0], ...submissions]);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
      setAnswers({ mood: 'great', sleep: '7', energy: 'high', notes: '' });
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('checkin_submissions')
      .delete()
      .eq('id', id);

    if (!error) {
      setSubmissions(submissions.filter(s => s.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
        Loading Feedback Module...
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-10 space-y-8 animate-in fade-in zoom-in duration-500 font-sans">
        <div className="glass-panel p-16 text-center border-primary/20 bg-primary/5">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-10 shadow-[0_0_30px_rgba(163,230,53,0.3)]">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">Submission Successful</h1>
          <p className="text-zinc-400 mt-4 leading-relaxed italic max-w-sm mx-auto font-medium">Your check-in has been received. Your coach will review your progress and provide feedback shortly.</p>
          <button 
            onClick={() => setIsSuccess(false)}
            className="btn-tactical mt-10 shadow-[0_0_20px_rgba(163,230,53,0.1)]"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 font-sans">
      <div className="space-y-1">
        <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">Strategic Check-in</h1>
        <p className="text-zinc-500 text-sm font-mono uppercase tracking-[0.2em] italic font-bold">Regular Review & Feedback Submission</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <form onSubmit={handleSubmit} className="glass-panel p-10 space-y-8 border-white/5 bg-white/[0.01]">
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                  <Activity size={14} className="text-primary" />
                  Subjective Energy & Wellbeing
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['high', 'moderate', 'low'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAnswers({ ...answers, energy: option })}
                      className={`h-12 border rounded-xl uppercase text-[10px] font-black tracking-widest transition-all ${
                        answers.energy === option 
                          ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_-5px_rgba(163,230,53,0.3)]' 
                          : 'bg-white/5 border-white/5 text-zinc-700 hover:text-zinc-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Recovery Sleep (Hours)</label>
                <input 
                  type="range" 
                  min="4" 
                  max="12" 
                  step="0.5"
                  value={answers.sleep}
                  onChange={(e) => setAnswers({ ...answers, sleep: e.target.value })}
                  className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] font-mono font-bold text-zinc-700 px-1 uppercase tracking-widest">
                  <span>04h</span>
                  <span className="text-primary font-black scale-125">{answers.sleep}h</span>
                  <span>12h</span>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                  <MessageSquare size={14} className="text-primary" />
                  Performance Summary & Notes
                </label>
                <textarea 
                  value={answers.notes}
                  onChange={(e) => setAnswers({ ...answers, notes: e.target.value })}
                  placeholder="Record your progress highlights or challenges from this week..."
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-6 text-sm text-white placeholder:text-zinc-800 min-h-[150px] focus:outline-none focus:border-primary/20 transition-all font-medium leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-tactical w-full flex items-center justify-center gap-3 relative disabled:opacity-50 !h-14 text-sm shadow-[0_0_20px_-5px_#A3E635]"
              >
                {isSubmitting ? 'Submitting...' : 'Send Strategic Update'}
                <Send size={18} className={`${isSubmitting ? 'animate-bounce' : ''}`} />
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Submission History</h2>
          <div className="glass-panel border-white/5 overflow-hidden">
            <div className="divide-y divide-white/5">
              {submissions.map((sub) => (
                <div key={sub.id} className="p-5 flex items-center justify-between group hover:bg-white/[0.02] transition-colors overflow-hidden relative">
                   {sub.reviewed_at && <div className="absolute top-0 right-0 h-10 w-10 bg-primary/10 rounded-bl-full pointer-events-none" />}
                   <div className="flex items-center gap-4">
                      <div className={`h-8 w-8 rounded bg-white/5 flex items-center justify-center text-zinc-700 font-mono text-[10px] uppercase font-bold group-hover:text-primary transition-all`}>
                         {new Date(sub.submitted_at).getDate()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white uppercase italic tracking-tight leading-none">{new Date(sub.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        <p className={`text-[9px] font-bold uppercase mt-1 tracking-widest ${sub.reviewed_at ? 'text-primary' : 'text-zinc-600'}`}>
                          {sub.reviewed_at ? 'Reviewed' : 'Pending Review'}
                        </p>
                      </div>
                   </div>
                   {!sub.reviewed_at && (
                     <button 
                       onClick={() => handleDelete(sub.id)}
                       className="h-8 w-8 rounded bg-white/5 flex items-center justify-center text-zinc-800 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                     >
                       <Trash2 size={12} />
                     </button>
                   )}
                </div>
              ))}
              {submissions.length === 0 && (
                <div className="p-10 text-center text-zinc-700 italic font-mono text-[9px] uppercase tracking-widest font-bold">No History Found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
