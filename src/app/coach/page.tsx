'use client';

import React, { useState, useEffect } from 'react';
import { Users, Activity, CheckSquare, Calendar, TrendingUp, Search, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CoachDashboard() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [appointments, setAppointments] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      // Fetch Clients
      const { data: clientsData } = await supabase
        .from('clients')
        .select('*, programs(title)');
      if (clientsData) setClients(clientsData);

      // Fetch Upcoming Appointments
      const { data: apptsData } = await supabase
        .from('appointments')
        .select('*, clients(full_name)')
        .order('scheduled_at', { ascending: true })
        .limit(3);
      if (apptsData) setAppointments(apptsData);

      setIsLoading(false);
    }
    fetchData();
  }, []);

  const stats = [
    { name: 'Active Members', value: clients.filter(c => c.status === 'active').length.toString().padStart(2, '0'), icon: Users, change: `+${clients.length} Total`, type: 'primary' },
    { name: 'Total Programs', value: '01', icon: Activity, change: 'Stable', type: 'secondary' },
    { name: 'New Reviews', value: '00', icon: CheckSquare, change: '0 24h', type: 'primary' },
    { name: 'Upcoming Sessions', value: appointments.length.toString().padStart(2, '0'), icon: Calendar, change: 'Live', type: 'secondary' },
  ];

  const filteredClients = clients.filter(c => 
    c.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#A3E635]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 font-mono italic">Strategic Hub • Active Session</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white uppercase italic tracking-tighter">{user?.name}</h1>
          <p className="text-zinc-600 max-w-lg leading-relaxed mt-2 uppercase tracking-[0.2em] font-mono font-bold text-[10px]">Executive Coaching Management Hub.</p>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/coach/programs')} className="btn-tactical flex items-center gap-2 !h-12 !px-6 shadow-[0_0_20px_rgba(163,230,53,0.1)]">
            <PlusCircle size={18} />
            Create Program
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-panel p-8 group overflow-hidden relative border-white/5">
              <div className={`absolute top-0 right-0 h-32 w-32 ${stat.type === 'primary' ? 'bg-primary/5' : 'bg-secondary/5'} rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-110 pointer-events-none blur-xl`} />
              <div className="flex items-center justify-between mb-8">
                <div className={`h-12 w-12 rounded-lg ${stat.type === 'primary' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary/10 text-secondary border-secondary/20'} border flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono whitespace-nowrap">METRIC_{i+1}</div>
              </div>
              <div className="space-y-1">
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] font-mono">{stat.name}</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-white tracking-tighter italic">{stat.value}</span>
                  <span className={`text-[10px] font-bold font-mono tracking-widest ${stat.type === 'primary' ? 'text-primary' : 'text-zinc-700'}`}>{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 underline underline-offset-8 decoration-zinc-800">Client Portfolio Overview</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find Member..."
                className="h-10 pl-10 pr-4 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-zinc-800 focus:outline-none focus:border-primary/20 transition-all w-64"
              />
            </div>
          </div>

          <div className="glass-panel overflow-hidden min-h-[400px] border-white/5 bg-white/[0.01]">
            {isLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-[10px] font-bold font-mono uppercase tracking-[0.5em] text-zinc-800 animate-pulse">Synchronizing Database...</div>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono">Profile Name</th>
                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono">Active Program</th>
                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono text-center">Engagement</th>
                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono text-right">Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredClients.map((client) => (
                    <tr 
                      key={client.id} 
                      onClick={() => router.push(`/coach/clients/${client.id}`)}
                      className="group hover:bg-white/[0.01] transition-colors cursor-pointer"
                    >
                      <td className="p-6">
                         <p className="font-bold text-white group-hover:text-primary transition-colors italic uppercase tracking-tight text-sm leading-none">{client.full_name}</p>
                         <p className="text-[9px] text-zinc-700 font-mono mt-1.5 font-bold uppercase tracking-widest">ID_{client.id.split('-')[0]}</p>
                      </td>
                      <td className="p-6 text-xs text-zinc-500 font-bold uppercase tracking-widest font-mono italic">{client.programs?.title || 'No Assigned Program'}</td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full ${client.status === 'active' ? 'bg-primary shadow-[0_0_8px_#A3E635]' : 'bg-orange-500 shadow-[0_0_8px_currentColor]'} animate-pulse`} />
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${client.status === 'active' ? 'text-primary' : 'text-orange-500'}`}>{client.status}</span>
                        </div>
                      </td>
                      <td className="p-6 text-[10px] font-mono text-zinc-700 text-right font-bold uppercase tracking-widest">
                        {new Date(client.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {filteredClients.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-20 text-center text-zinc-800 italic font-mono text-[10px] font-bold uppercase tracking-[0.3em]">No Member Profiles matching your criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 underline underline-offset-8 decoration-zinc-800">Management Feedback</h2>
          <div className="glass-panel p-8 space-y-10 border-white/5 bg-white/[0.01]">
            <div className="space-y-8 text-left">
              {appointments.length > 0 ? (
                appointments.map((appt, i) => (
                  <div key={i} onClick={() => router.push('/coach/appointments')} className="flex gap-6 group cursor-pointer">
                    <div className="text-[9px] font-bold font-mono text-zinc-700 w-16 pt-1 tracking-widest uppercase">{new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="flex-1 pb-6 border-l border-white/5 pl-6 relative">
                      <div className="absolute top-2 -left-[4px] h-2 w-2 rounded-full bg-primary/20 group-hover:bg-primary transition-all shadow-[0_0_10px_rgba(163,230,53,0.1)] group-hover:shadow-[0_0_15px_#A3E635]" />
                      <p className="text-xs font-black text-white uppercase italic tracking-tight group-hover:text-primary transition-colors leading-none">Session Scheduled</p>
                      <p className="text-[9px] text-zinc-700 font-mono mt-2 font-bold uppercase tracking-widest italic">{appt.clients?.full_name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-10 text-[9px] font-bold font-mono uppercase tracking-widest text-zinc-800 italic text-center">No Active Engagement Feedback.</p>
              )}
            </div>
            <button onClick={() => router.push('/coach/checkins')} className="btn-ghost w-full !h-12 text-[10px]">View Feedback Hub</button>
          </div>
        </div>
      </div>
    </div>
  );
}
