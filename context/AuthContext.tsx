'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import supabase from '@/lib/supabaseClient';

interface UserProfile {
  id: string;
  email?: string;
  user_metadata?: any;
}

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any } | null>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any } | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase not configured');
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        if (mounted) {
          setUser(session?.user ? { id: session.user.id, email: session.user.email ?? undefined, user_metadata: session.user.user_metadata } : null);
          setIsLoading(false);
        }
      } catch (e) {
        console.error('supabase getSession error', e);
        if (mounted) setIsLoading(false);
      }

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email ?? undefined, user_metadata: session.user.user_metadata });
        } else {
          setUser(null);
        }
      });

      return () => {
        mounted = false;
        if (listener && typeof listener.subscription?.unsubscribe === 'function') {
          listener.subscription.unsubscribe();
        }
      };
    }

    init();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase not configured' };
    const res = await supabase.auth.signInWithPassword({ email, password });
    console.debug('signIn response', res);
    if (res.error) {
      return { error: res.error };
    }
    // res.data may contain session and user depending on settings
    const session = res.data?.session;
    const user = res.data?.user ?? session?.user;
    if (user) setUser({ id: user.id, email: user.email ?? undefined, user_metadata: user.user_metadata });
    // If we received a session with access/refresh tokens, set cookies so server middleware can see them
    if (typeof window !== 'undefined' && session) {
      try {
        const access = session.access_token;
        const refresh = session.refresh_token;
        if (access) document.cookie = `sb-auth-token=${access}; path=/`;
        if (refresh) document.cookie = `sb-refresh-token=${refresh}; path=/`;
      } catch (e) {
        console.warn('Failed to set auth cookies', e);
      }
    }
    return res;
  };

  const signUp = async (email: string, password: string, name?: string) => {
    if (!supabase) return { error: 'Supabase not configured' };
    const res = await supabase.auth.signUp({ email, password }, { data: { name } });
    console.debug('signUp response', res);
    if (res.error) {
      return { error: res.error };
    }
    const session = res.data?.session;
    const user = res.data?.user ?? session?.user;
    if (user) setUser({ id: user.id, email: user.email ?? undefined, user_metadata: user.user_metadata });
    if (typeof window !== 'undefined' && session) {
      try {
        const access = session.access_token;
        const refresh = session.refresh_token;
        if (access) document.cookie = `sb-auth-token=${access}; path=/`;
        if (refresh) document.cookie = `sb-refresh-token=${refresh}; path=/`;
      } catch (e) {
        console.warn('Failed to set auth cookies', e);
      }
    }
    return res;
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    // Clear cookies
    if (typeof document !== 'undefined') {
      document.cookie = 'sb-auth-token=; Max-Age=0; path=/';
      document.cookie = 'sb-refresh-token=; Max-Age=0; path=/';
    }
  };

  const value = useMemo(() => ({ user, isLoading, signIn, signUp, signOut }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

