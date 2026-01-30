'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import Link from 'next/link';
import { createPoll } from '@/lib/pollsDb';
import { useAuthContext } from '@/context/AuthContext';

interface PollOption {
  id: string;
  text: string;
}

export default function CreatePollPage() {
  const { user, isLoading: authLoading } = useAuthContext();
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'settings'>('basic');
  const [author, setAuthor] = useState(() => {
    return user?.email || '';
  });
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [requireLogin, setRequireLogin] = useState(false);
  const [endDate, setEndDate] = useState('');

  const addOption = () => {
    const newId = Math.max(...options.map(o => parseInt(o.id)), 0) + 1;
    setOptions([...options, { id: newId.toString(), text: '' }]);
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(o => o.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(o => (o.id === id ? { ...o, text } : o)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!question.trim()) {
      alert('Please enter a poll question');
      return;
    }

    const filledOptions = options.filter(o => o.text.trim());
    if (filledOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createPoll(
        question.trim(),
        description.trim(),
        filledOptions.map(o => ({ text: o.text.trim() })),
        author?.trim() || 'Anonymous',
        {
          allowMultiple: !!allowMultiple,
          requireLogin: !!requireLogin,
          endDate: endDate || null,
        }
      );

      if (result.error) {
        alert(`Failed to create poll: ${result.error.message}`);
      } else {
        alert('Poll created successfully!');
        window.location.href = '/polls';
      }
    } catch (err) {
      console.error('Error creating poll:', err);
      alert('Failed to create poll');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
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
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>Create New Poll</CardTitle>
                <CardDescription>Ask a question and provide options for respondents</CardDescription>
              </div>
              <div className="ml-4">
                <div className="inline-flex rounded-md bg-zinc-100 dark:bg-zinc-900 p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('basic')}
                    className={`px-4 py-2 rounded-md ${activeTab === 'basic' ? 'bg-white dark:bg-zinc-800 shadow' : 'bg-transparent'}`}
                  >
                    Basic Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2 rounded-md ${activeTab === 'settings' ? 'bg-white dark:bg-zinc-800 shadow' : 'bg-transparent'}`}
                  >
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="question" className="text-sm font-medium">
                      Poll Question *
                    </label>
                    <Input
                      id="question"
                      placeholder="What would you like to ask?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description (optional)
                    </label>
                    <Input
                      id="description"
                      placeholder="Provide more context for your poll"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Options *</label>
                      <Button type="button" variant="outline" size="sm" onClick={addOption}>
                        + Add Option
                      </Button>
                    </div>
                    {options.map((option, index) => (
                      <div key={option.id} className="flex gap-2">
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option.text}
                          onChange={(e) => updateOption(option.id, e.target.value)}
                          disabled={isLoading}
                        />
                        {options.length > 2 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeOption(option.id)}
                            disabled={isLoading}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Poll Settings</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Configure additional options for your poll</p>
                  <div className="flex flex-col gap-3 pt-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={allowMultiple}
                        onChange={(e) => setAllowMultiple(e.target.checked)}
                      />
                      <span>Allow users to select multiple options</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={requireLogin}
                        onChange={(e) => setRequireLogin(e.target.checked)}
                      />
                      <span>Require users to be logged in to vote</span>
                    </label>

                    <div className="flex flex-col">
                      <label className="text-sm">Poll End Date (optional)</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 rounded-md border px-3 py-2"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">Author (optional)</label>
                      <input
                        type="text"
                        placeholder="Author's name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="mt-1 rounded-md border px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? 'Creating...' : 'Create Poll'}
                </Button>
                <Link href="/polls" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  }
