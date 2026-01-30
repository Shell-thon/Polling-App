'use client';

import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Poll, fetchPolls } from '@/lib/pollsDb';

export default function MyPollsPage() {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function loadPolls() {
      if (!user) return;
      const allPolls = await fetchPolls();
      // Filter to only user's polls
      const userPolls = allPolls.filter((p) => p.creator_id === user.id);
      setPolls(userPolls);
      setLoading(false);
    }
    loadPolls();
  }, [user]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Loading your polls...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/polls" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to All Polls
        </Link>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">My Polls</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">You have created {polls.length} poll(s)</p>
          </div>
          <Link href="/polls/create">
            <Button>Create New Poll</Button>
          </Link>
        </div>

        {polls.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-zinc-500 dark:text-zinc-400 mb-4">You haven't created any polls yet.</p>
                <Link href="/polls/create">
                  <Button>Create your first poll</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {polls.map((poll) => (
              <Card key={poll.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link href={`/polls/${poll.id}`}>
                        <CardTitle className="text-xl hover:text-blue-600 cursor-pointer">{poll.question}</CardTitle>
                      </Link>
                      {poll.description && <CardDescription>{poll.description}</CardDescription>}
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold text-zinc-900 dark:text-white">{poll.totalVotes} votes</p>
                      <p className="text-zinc-500 dark:text-zinc-400">{poll.options?.length || 0} options</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link href={`/polls/${poll.id}`}>
                      <Button variant="outline" size="sm">View Poll</Button>
                    </Link>
                    <Link href={`/polls/${poll.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
