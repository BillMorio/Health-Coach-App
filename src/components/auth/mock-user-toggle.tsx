'use client';

import { useAuth } from '@/context/auth-context';
import { User, ShieldCheck } from 'lucide-react';

export function MockUserToggle() {
  const { role, switchRole } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#1A1A1A] p-1 shadow-lg">
      <button
        onClick={() => switchRole('coach')}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          role === 'coach' 
            ? 'bg-[#9EF01A] text-black' 
            : 'text-gray-400 hover:text-white'
        }`}
        title="Switch to Coach View"
      >
        <ShieldCheck size={18} />
      </button>
      <button
        onClick={() => switchRole('client')}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          role === 'client' 
            ? 'bg-[#9EF01A] text-black' 
            : 'text-gray-400 hover:text-white'
        }`}
        title="Switch to Client View"
      >
        <User size={18} />
      </button>
      <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {role} MVP
      </span>
    </div>
  );
}
