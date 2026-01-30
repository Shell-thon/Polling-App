"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchPolls, Poll } from '@/lib/pollsDb';

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPolls() {
      const data = await fetchPolls();
      setPolls(data);
      setIsLoading(false);
    }
    loadPolls();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Polls</h1>
          <Link href="/polls/create">
            <Button>Create New Poll</Button>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-center text-zinc-600 dark:text-zinc-400">Loading polls...</p>
        ) : polls.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-zinc-600 dark:text-zinc-400 mb-4">
                No polls found. Start by creating one!
              </p>
              <div className="flex justify-center">
                <Link href="/polls/create">
                  <Button>Create First Poll</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {polls.map((poll) => (
              <Link key={poll.id} href={`/polls/${poll.id}`} className="no-underline">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>{poll.question}</CardTitle>
                    {poll.description && <CardDescription>{poll.description}</CardDescription>}
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Created by: {poll.author ?? 'Anonymous'}</p>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{poll.totalVotes} votes</p>
                    <div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
