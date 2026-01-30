-- Migration: create polls table for Polling App
-- Run this in Supabase SQL editor (Query) or via psql

create extension if not exists "pgcrypto";

create table if not exists public.polls (
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

create index if not exists idx_polls_created_by on public.polls(created_by);
create index if not exists idx_polls_created_at on public.polls(created_at);

-- Example insert (optional seed)
-- insert into public.polls (question, description, author, options, total_votes)
-- values (
--   'Which color do you prefer?',
--   'Pick one',
--   'Seeder',
--   '[{"id":"1","text":"Red","votes":0},{"id":"2","text":"Blue","votes":0}]',
--   0
-- );
