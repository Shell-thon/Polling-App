"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center">
      <main className="mx-auto w-full max-w-4xl p-8">
        <section className="rounded-lg bg-white dark:bg-zinc-900 p-10 shadow">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">Polling App</h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Create, share and vote on polls in seconds. Built with Next.js, Tailwind and Supabase.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/polls">
              <Button>Browse Polls</Button>
            </Link>
            <Link href="/polls/create">
              <Button variant="outline">Create Poll</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="link">Sign up</Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-50">Fast Polls</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Create polls quickly with simple options and settings.</p>
            </div>
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-50">Shareable</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Share poll links to social media or copy to clipboard.</p>
            </div>
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-50">Secure</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Sign-in with Supabase auth to create and manage your polls.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
