'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, UserPlus, Filter, MoreVertical, Edit3, Trash2, Mail, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({ full_name: '', email: '', status: 'active' });

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('*, programs(title)')
      .order('full_name', { ascending: true });
    
    if (!error && data) {
      setClients(data);
    }
    setIsLoading(false);
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('clients')
      .insert([{ 
        ...newClient, 
        coach_id: 'e0000000-0000-0000-0000-000000000000'
      }])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      alert(`Error Finalizing Participant: ${error.message}`);
    } else if (data) {
      setClients([...clients, data[0]]);
      setShowAddModal(false);
      setNewClient({ full_name: '', email: '', status: 'active' });
    }
  };

  const filteredClients = clients.filter(c => 
    c.full_name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const router = useRouter();

  const handleRowClick = (id: string) => {
    router.push(`/coach/clients/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-white/5 pb-10">
        <div className="space-y-1">
          <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter">Client Portfolio</h1>
          <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.3em] font-bold italic">Managing Professional Coaching Engagement</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-tactical flex items-center gap-2 !h-12 !px-6 shadow-[0_0_20px_rgba(163,230,53,0.1)]"
        >
          <UserPlus size={18} />
          Add New Client
        </button>
      </div>

      <div className="glass-panel overflow-hidden border-white/5 bg-white/[0.01]">
        <div className="p-8 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
            <input 
              type="text" 
              placeholder="Search Client Name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/20 transition-all font-mono"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="btn-ghost !h-10 !px-4 flex items-center gap-2 text-[10px]">
              <Filter size={14} />
              Filter Results
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[500px]">
          {isLoading ? (
            <div className="p-20 text-center font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-800 animate-pulse font-bold">Synchronizing Client Portfolio Database...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="p-8 text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono">Client Details</th>
                  <th className="p-8 text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono">Assigned Program</th>
                  <th className="p-8 text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono text-center">Engagement Status</th>
                  <th className="p-8 text-[10px] font-bold uppercase tracking-widest text-zinc-700 font-mono text-right">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredClients.map((client) => (
                  <tr 
                    key={client.id} 
                    onClick={() => handleRowClick(client.id)}
                    className="group hover:bg-white/[0.01] transition-all cursor-pointer"
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-6">
                        <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center text-zinc-700 group-hover:text-primary group-hover:border-primary/20 transition-all italic font-black uppercase text-xs">
                          {client.full_name.charAt(0)}
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-white group-hover:text-primary transition-colors text-base uppercase italic tracking-tight">{client.full_name}</p>
                          <p className="text-[9px] text-zinc-700 font-mono italic font-bold uppercase tracking-widest flex items-center gap-1.5 leading-none mt-1"><Mail size={10} /> {client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono italic">{client.programs?.title || 'No Assigned Program'}</p>
                      <p className="text-[9px] text-zinc-800 font-mono mt-2 font-bold uppercase tracking-widest">Version: 1.2-A</p>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${client.status === 'active' ? 'bg-primary' : 'bg-zinc-800'} animate-pulse shadow-[0_0_8px_currentColor]`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${client.status === 'active' ? 'text-primary' : 'text-zinc-700'}`}>{client.status}</span>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex items-center justify-end gap-3 text-zinc-700">
                        <button 
                          onClick={(e) => { e.stopPropagation(); alert('Quick-Edit: Planned Feature for v1.5'); }}
                          className="h-8 w-8 rounded bg-white/5 border border-white/5 flex items-center justify-center hover:text-white transition-all focus:outline-none"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRowClick(client.id); }}
                          className="h-8 w-8 rounded bg-white/5 border border-white/5 flex items-center justify-center hover:text-primary transition-all shadow-none hover:shadow-[0_0_10px_rgba(163,230,53,0.1)] focus:outline-none"
                        >
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#050505]/80 backdrop-blur-md">
          <div className="glass-panel max-w-xl w-full p-12 space-y-10 animate-in fade-in zoom-in duration-500 border-primary/10">
            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Add New Member</h2>
            <form onSubmit={handleAddClient} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-1 font-mono">Full User Name</label>
                <input 
                  type="text" 
                  value={newClient.full_name}
                  onChange={(e) => setNewClient({ ...newClient, full_name: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 ml-1 font-mono">Email Address Identifier</label>
                <input 
                  type="email" 
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/20 transition-all font-medium"
                  required
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-ghost flex-1 !h-12 text-[10px]">Cancel</button>
                <button type="submit" className="btn-tactical flex-1 !h-12 text-xs shadow-[0_0_20px_-5px_#A3E635]">Finalize Participant</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
