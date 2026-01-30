'use client';

import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from './ui/button';

export default function Header() {
  const { user, signOut: logout } = useAuthContext();

  return (
    <header className="w-full border-b bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold">ALX Polly</Link>
          <nav className="hidden sm:flex gap-4">
            <Link href="/polls" className="text-sm text-zinc-700 dark:text-zinc-200 hover:underline">My Polls</Link>
            <Link href="/polls/create" className="text-sm text-zinc-700 dark:text-zinc-200 hover:underline">Create Poll</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-zinc-700 dark:text-zinc-200">{(user as any).user_metadata?.name || (user as any).name || user.email}</span>
              <Button onClick={() => logout()} variant="outline">Sign out</Button>
            </>
          ) : (
            <>
              <Link href="/auth/login"><Button variant="outline">Sign in</Button></Link>
              <Link href="/auth/signup"><Button>Create account</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
