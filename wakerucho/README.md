# WakeruCho

A Vite + React dashboard for WakeruCho with Supabase integration ready.

## Required setup for Supabase

You need these values from your Supabase project:

1. Project URL
   - Go to Supabase Dashboard
   - Open Project Settings > API
   - Copy the "Project URL"

2. Anonymous public key
   - In the same API screen, copy the "anon public" key

3. Optional service role key
   - Only needed if you later want server-side admin access
   - Do not expose this in the browser

Create a .env file in the project root:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Use the example file as a template:

```bash
cp .env.example .env
```

## Project structure

```text
wakerucho/
├── public/
│   ├── WakeruCho-Logo.png
│   └── favicon.ico
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   ├── lib/
│   │   └── supabase.js
│   └── services/
│       └── userService.js
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Important files

- src/lib/supabase.js
  - Creates the client and reads the environment values
- src/services/userService.js
  - Example service for fetching user profile data
- .env.example
  - Template for your local environment file

## Supabase database setup

After creating the project:

1. Open Supabase SQL editor
2. Create a profiles table if you want user profile data
3. Example schema:

```sql
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);
```

## Run the project

```bash
npm install
npm run dev
```

## Notes

- Keep .env outside of Git.
- Do not commit real Supabase secrets.
- The client is safe to use in browser code with the anon key.
- If you later want auth pages, enable Authentication in Supabase and create the related tables.
