'use client';

import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.user_metadata?.name || user.email || 'User';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/polls" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Polls
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">My Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">{userName}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
              </div>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Account Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-zinc-500 dark:text-zinc-400">Email</dt>
                  <dd className="text-sm font-medium text-zinc-900 dark:text-white">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-zinc-500 dark:text-zinc-400">User ID</dt>
                  <dd className="text-sm font-medium text-zinc-900 dark:text-white font-mono text-xs">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-sm text-zinc-500 dark:text-zinc-400">Account Created</dt>
                  <dd className="text-sm font-medium text-zinc-900 dark:text-white">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Actions</h3>
              <div className="space-y-2">
                <Link href="/settings">
                  <Button className="w-full">Account Settings</Button>
                </Link>
                <Link href="/polls/my">
                  <Button variant="outline" className="w-full">My Polls</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
