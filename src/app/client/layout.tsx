'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Target, 
  BarChart3, 
  FormInput, 
  Calendar,
  User,
  LogOut,
  Command
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/client', icon: LayoutDashboard },
    { name: 'My Program', href: '/client/program', icon: Target },
    { name: 'Progress', href: '/client/progress', icon: BarChart3 },
    { name: 'Check-in', href: '/client/checkin', icon: FormInput },
    { name: 'Appointments', href: '/client/appointments', icon: Calendar },
    { name: 'Profile', href: '/client/profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-100 font-sans">
      {/* Strategic Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-white/[0.01] backdrop-blur-xl flex flex-col sticky top-0 h-screen z-20">
        <div className="p-8 border-b border-white/5 space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Command className="text-primary" size={20} />
            <h1 className="text-xl font-bold tracking-tighter text-white uppercase italic">Sequenta</h1>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 font-mono">Member: {user?.name.split(' ')[0]}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_-5px_rgba(163,230,53,0.3)]' 
                    : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-100 border border-transparent'
                }`}
              >
                <Icon size={18} className={`${isActive ? 'text-primary' : 'text-zinc-600 group-hover:text-zinc-100'}`} />
                <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_#A3E635]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-600 hover:text-red-400 transition-colors uppercase text-[10px] font-bold tracking-widest"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 border-b border-white/5 bg-white/[0.01] backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono italic">
              View_{navItems.find(i => i.href === pathname)?.name.replace(' ', '_').toUpperCase() || 'MAIN_WORKSPACE'}
            </h2>
            <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-[0.3em]">Status: Active</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right sr-only md:not-sr-only">
              <p className="text-sm font-bold text-white italic">{user?.name}</p>
              <p className="text-[10px] text-primary uppercase font-bold tracking-widest bg-primary/10 px-2 rounded">{user?.role}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden ring-1 ring-white/5 hover:ring-primary/40 transition-all cursor-pointer">
              <img src={user?.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            </div>
          </div>
        </header>

        <div className="p-10 flex-1 overflow-auto">
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
