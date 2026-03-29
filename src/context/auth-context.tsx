'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type UserRole = 'coach' | 'client';

interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  avatarUrl?: string;
  coachId?: string; // For clients
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// STRATEGIC HEX UUIDS (Constants for Seed/Hardcodes)
export const STRATEGIC_COACH_ID = 'e0000000-0000-0000-0000-000000000000';

const COACH_DATA: User = {
  id: STRATEGIC_COACH_ID,
  role: 'coach',
  name: 'Management Executive',
  email: 'bill@healthcoach.com',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bill',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('sequenta_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setRole(parsed.role);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // 1. Check Password (Mock Strategy)
    if (password !== '1234') {
      return { success: false, error: 'Invalid Strategic Passkey.' };
    }

    // 2. Check Coach
    if (email.toLowerCase() === 'bill@healthcoach.com') {
      localStorage.setItem('sequenta_user', JSON.stringify(COACH_DATA));
      setUser(COACH_DATA);
      setRole('coach');
      router.push('/coach');
      return { success: true };
    }

    // 3. Check Client Portfolio
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !data) {
      return { success: false, error: 'Member Profile Not Found in Management Database.' };
    }

    const clientUser: User = {
      id: data.id,
      role: 'client',
      name: data.full_name,
      email: data.email,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.full_name}`,
      coachId: data.coach_id
    };

    localStorage.setItem('sequenta_user', JSON.stringify(clientUser));
    setUser(clientUser);
    setRole('client');
    router.push('/client');
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('sequenta_user');
    setRole(null);
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
