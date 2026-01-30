'use client';

import { useAuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';

export function ProfileDropdown() {
  const { user, signOut, isLoading } = useAuthContext();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || !user) {
    return null;
  }

  const userName = user.user_metadata?.name || user.email || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.push('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
      >
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
          {userInitial}
        </div>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{userName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg z-10">
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{userName}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
          </div>

          <nav className="py-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              My Profile
            </Link>
            <Link
              href="/polls/my"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              My Polls
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Settings
            </Link>
          </nav>

          <div className="border-t border-zinc-200 dark:border-zinc-800 p-2">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
