"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchPolls, Poll } from '@/lib/pollsDb';

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  useEffect(() => {
    async function loadPolls() {
      const data = await fetchPolls();
      setPolls(data);
      setIsLoading(false);
    }
    loadPolls();
  }, []);

  useEffect(() => {
    let results = polls;

    // Filter by search term
    if (searchTerm) {
      results = results.filter(
        (poll) =>
          poll.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          poll.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'popular') {
      results.sort((a, b) => b.totalVotes - a.totalVotes);
    } else {
      results.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    setFilteredPolls(results);
  }, [polls, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Polls</h1>
          <Link href="/polls/create">
            <Button>Create New Poll</Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-3">
          <Input
            type="text"
            placeholder="Search polls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('recent')}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                sortBy === 'recent'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                sortBy === 'popular'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              Popular
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-zinc-600 dark:text-zinc-400">Loading polls...</p>
        ) : filteredPolls.length === 0 ? (
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
            {filteredPolls.map((poll) => (
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
