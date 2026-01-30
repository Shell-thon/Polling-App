# Polling App - Project Scaffold

This document outlines the structure of the polling app scaffold.
````markdown
# Polling App - Project Scaffold

A lightweight scaffold for a polling app built with Next.js (App Router), Tailwind CSS, and Supabase for auth/data.

## Folder Structure (high level)

```
├── app/
│   ├── auth/                # Login & Signup pages wired to AuthContext
│   ├── polls/               # List, create, and detail pages for polls
│   ├── layout.tsx           # Root layout (wraps AuthProvider)
│   └── page.tsx             # Home / landing page
├── components/              # Reusable UI components (Button, Input, Card)
├── context/                 # `AuthContext` and auth helpers
├── lib/                     # `supabaseClient.ts`, `pollsDb.ts` (Supabase helpers)
├── hooks/                   # `usePolls.ts` (poll helpers, optional)
├── types/                   # TypeScript interfaces
├── public/                  # Static assets
├── package.json
└── README-SCAFFOLD.md
```

## Features & Patterns

### 1. Authentication (`app/auth/`)
- **Login Page** (`login/page.tsx`)
- **Signup Page** (`signup/page.tsx`)
- **Context**: `AuthContext` with `useAuthContext()` is the canonical auth API; it replaces prior `useAuth()` hook patterns.

### 2. Polls (`app/polls/`)
- **Polls List** (`page.tsx`): Display all polls (uses `lib/pollsDb.ts`)
- **Create Poll** (`create/page.tsx`): Create polls — saved to Supabase
- **Poll Detail** (`[id]/page.tsx`): View and vote, now backed by Supabase

### 3. Components
- Shadcn-style components (Button, Input, Card) are used across the app. They integrate Tailwind variants and dark mode styles.

## Next Steps / Migration Notes

1. **Auth wiring**
   - Ensure `context/AuthContext.tsx` is configured to use `lib/supabaseClient.ts`.

2. **Data layer**
   - `lib/pollsDb.ts` exposes `fetchPolls`, `fetchPoll`, `createPoll`, `votePoll` for Supabase operations. Prefer these to localStorage.

3. **Remove old hooks**
   - If you have `hooks/useAuth.ts` files or references, migrate to `useAuthContext()` and remove the old file.

4. **Middleware**
   - Server-side middleware (`middleware.ts`) is used to protect routes such as `/polls/create`.

## Styling

Tailwind CSS is used with a dark-mode-first approach. Components include `dark:` variants.

## Notes

- This scaffold is already wired for Supabase (client creation guarded for missing env vars). Fill `.env.local` with your Supabase values before running.

````
- User interface
