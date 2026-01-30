'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchPoll, votePoll, Poll } from '@/lib/pollsDb';
import { useAuthContext } from '@/context/AuthContext';

export default function PollDetailPage() {
  const params = useParams();
  const pollId = params.id as string;
  const { user } = useAuthContext();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadPoll() {
      const data = await fetchPoll(pollId);
      setPoll(data);
      setIsLoading(false);
    }
    loadPoll();
  }, [pollId]);

  const handleVote = async () => {
    if (!poll) return;

    // Check end date
    if (poll.settings?.endDate) {
      const end = new Date(poll.settings.endDate);
      if (Date.now() > end.getTime()) {
        alert('This poll has ended.');
        return;
      }
    }

    // Require login if setting enabled
    if (poll.settings?.requireLogin && !user) {
      alert('Please sign in to vote.');
      window.location.href = '/auth/login';
      return;
    }

    // Determine selected option(s)
    const selected = poll.settings?.allowMultiple ? selectedOptionIds : selectedOptionIds.slice(0, 1);
    if (!selected || selected.length === 0) {
      alert('Please select an option');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await votePoll(poll.id, selected);
      if (result.error) {
        alert(`Failed to submit vote: ${result.error.message}`);
      } else {
        alert('Vote submitted — thank you!');
        // Reload poll data
        const updated = await fetchPoll(pollId);
        setPoll(updated);
        setSelectedOptionIds([]);
      }
    } catch (err) {
      console.error('Failed to submit vote', err);
      alert('Failed to submit vote');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Loading poll...</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Poll not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/polls" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Polls
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{poll.question}</CardTitle>
            {poll.description && <CardDescription>{poll.description}</CardDescription>}
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Created by: {poll.author ?? 'Anonymous'}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {poll.options.map((option) => {
                const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                const checked = selectedOptionIds.includes(option.id);
                return (
                  <div key={option.id} className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900">
                      <input
                        type={poll.settings?.allowMultiple ? 'checkbox' : 'radio'}
                        name="poll-option"
                        value={option.id}
                        checked={checked}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (poll.settings?.allowMultiple) {
                            setSelectedOptionIds((prev) =>
                              prev.includes(val) ? prev.filter((p) => p !== val) : [...prev, val]
                            );
                          } else {
                            setSelectedOptionIds([val]);
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <span className="flex-1">{option.text}</span>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {option.votes} votes
                      </span>
                    </label>
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleVote}
                disabled={selectedOptionIds.length === 0 || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting vote...' : 'Vote'}
              </Button>

              <div className="flex gap-2 items-center">
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => alert('Link copied'))}>
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(poll?.question || '')}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`;
                    window.open(tweet, '_blank');
                  }}
                >
                  Share
                </Button>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
              Total votes: {poll?.totalVotes}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
