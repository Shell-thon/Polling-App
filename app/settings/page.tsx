'use client';

import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, isLoading, signOut } = useAuthContext();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Loading settings...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    // Placeholder - in production, this would call a server action to delete the user
    alert('Account deletion is not yet implemented. Contact support for account deletion.');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/profile" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Profile
        </Link>

        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your polling preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Email notifications</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Get notified when someone votes on your polls</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>Control how your data is used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Public profile</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Allow others to see your profile and polls</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Password</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Last changed: Never</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Change Password
                </Button>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <p className="font-medium text-zinc-900 dark:text-white mb-2">Active sessions</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">1 active session</p>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign out all devices
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger zone */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/30 rounded-lg">
                <div>
                  <p className="font-medium text-red-600">Delete account</p>
                  <p className="text-sm text-red-600/80">Permanently delete your account and all associated data</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete Account
                </Button>
              </div>

              {showDeleteConfirm && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg">
                  <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-3">
                    Are you sure? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
