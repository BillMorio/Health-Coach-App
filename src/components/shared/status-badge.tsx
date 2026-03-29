'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type StatusType = 'active' | 'invited' | 'pending' | 'completed' | 'paused' | 'cancelled' | 'confirmed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  confirmed: 'bg-green-500/10 text-green-500 border-green-500/20',
  invited: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  paused: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  completed: 'bg-[#9EF01A]/10 text-[#9EF01A] border-[#9EF01A]/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
      statusStyles[status] || statusStyles.pending,
      className
    )}>
      {status}
    </span>
  );
}
