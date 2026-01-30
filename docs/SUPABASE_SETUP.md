Supabase Setup for Polling App
==============================

1) Copy `.env.local.template` to `.env.local` and add values:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# If your project exposes a publishable key with a different name, you may also set:
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_...

Important: use the Supabase ANON public key (NOT a service_role key). The client needs `NEXT_PUBLIC_SUPABASE_ANON_KEY` to perform auth and DB operations.
```

2) Create the `polls` table in Supabase SQL editor:

```sql
create extension if not exists "pgcrypto";

create table if not exists polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  description text,
  author text,
  created_by uuid,
  options jsonb not null,
  total_votes int default 0,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

If you see errors in the browser or console like "Could not find the table 'public.polls' in the schema cache", run `sql/create_polls_table.sql` from the repository in the Supabase SQL editor to create the `polls` table and indexes.
```

3) Recommended indexes:

```sql
create index if not exists idx_polls_created_by on polls(created_by);
create index if not exists idx_polls_created_at on polls(created_at);
```

4) Optional: seed an example poll (replace generated uuids):

```sql
insert into polls (question, description, author, options, total_votes)
values (
  'Which color do you prefer?',
  'Quick 2-option poll',
  'Example Author',
  '[{"id":"00000000-0000-0000-0000-000000000001","text":"Red","votes":0},{"id":"00000000-0000-0000-0000-000000000002","text":"Blue","votes":0}]',
  0
);
```

5) Run the app:

```bash
npm run dev
```

Notes
-----
- The app expects `.env.local` to be present before client-side Supabase calls run.
- Migrate any `useAuth` callers to `useAuthContext()` in `context/AuthContext.tsx`.
