# 🎯 Setup Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    SETUP OVERVIEW (20 min)                  │
└─────────────────────────────────────────────────────────────┘

Step 1: SUPABASE (5 min)
┌──────────────────────┐
│  1. supabase.com     │
│  2. Create project   │──→ Get: URL, anon key, service key
│  3. Run migration    │
└──────────────────────┘
         ↓
         ↓
Step 2: GITHUB (3 min)
┌──────────────────────┐
│  1. settings/tokens  │
│  2. Generate token   │──→ Get: ghp_xxxxx token
│  3. Scopes: read:*   │
└──────────────────────┘
         ↓
         ↓
Step 3: LOCAL TEST (5 min)
┌──────────────────────┐
│  1. Create .env      │
│  2. npm install      │──→ Test: localhost:3000
│  3. npm run dev      │
│  4. Run test search  │
└──────────────────────┘
         ↓
         ↓
Step 4: DEPLOY (5 min)
┌──────────────────────┐
│  1. Push to GitHub   │
│  2. Import to Vercel │──→ Live: your-app.vercel.app
│  3. Add env vars     │
│  4. Deploy           │
└──────────────────────┘
         ↓
         ↓
    🎉 DONE! 🎉
```

---

## Environment Variables Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  4 REQUIRED VARIABLES                        │
└─────────────────────────────────────────────────────────────┘

From Supabase (Step 1):
┌──────────────────────────────────────────┐
│ NEXT_PUBLIC_SUPABASE_URL                 │ ← Project Settings → API
│ NEXT_PUBLIC_SUPABASE_ANON_KEY            │ ← Project Settings → API
│ SUPABASE_SERVICE_ROLE_KEY                │ ← Project Settings → API (Reveal)
└──────────────────────────────────────────┘

From GitHub (Step 2):
┌──────────────────────────────────────────┐
│ GITHUB_TOKEN                             │ ← settings/tokens → Generate
└──────────────────────────────────────────┘

Used in:
┌──────────────────────────────────────────┐
│ LOCAL: .env.local file                   │
│ VERCEL: Environment Variables settings   │
└──────────────────────────────────────────┘
```

---

## Database Migration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    MIGRATION PROCESS                         │
└─────────────────────────────────────────────────────────────┘

1. Open Supabase SQL Editor
        ↓
2. Copy migration file contents
   (supabase/migrations/001_initial_schema.sql)
        ↓
3. Paste into editor
        ↓
4. Click "Run"
        ↓
5. Verify success
        ↓
┌──────────────────────────────────────────┐
│ ✅ Creates 4 tables:                     │
│    • candidates                          │
│    • repositories                        │
│    • saved_searches                      │
│    • search_history                      │
└──────────────────────────────────────────┘
```

---

## Search Flow (Runtime)

```
┌─────────────────────────────────────────────────────────────┐
│                      USER SEARCHES                           │
└─────────────────────────────────────────────────────────────┘

User enters keywords: "PPO, gymnasium"
        ↓
Frontend → API Route (/api/search)
        ↓
API builds GitHub query
        ↓
GitHub GraphQL API
        ↓
Fetch up to 100 users + their repos
        ↓
Score each candidate (keyword + stars)
        ↓
Save to Supabase (upsert, no duplicates)
        ↓
Return top 50 to frontend
        ↓
Display candidate cards
        ↓
┌──────────────────────────────────────────┐
│ ✅ Results in 2-5 seconds                │
│ ✅ All saved to database                 │
│ ✅ Deduplicated automatically            │
└──────────────────────────────────────────┘
```

---

## Troubleshooting Decision Tree

```
┌─────────────────────────────────────────────────────────────┐
│                    SOMETHING BROKE?                          │
└─────────────────────────────────────────────────────────────┘

Error mentions "environment variable"
        ↓
   Check .env.local (local) or Vercel settings (prod)
        ↓
   All 4 variables present? → Re-deploy
        ↓
   ✅ Fixed

───────────────────────────────────────────

Error: "relation 'candidates' does not exist"
        ↓
   Go to Supabase SQL Editor
        ↓
   Re-run migration SQL
        ↓
   Check Table Editor for 4 tables
        ↓
   ✅ Fixed

───────────────────────────────────────────

Error: "401 Bad credentials"
        ↓
   GitHub token expired or wrong scopes?
        ↓
   Generate new token with read:user + public_repo
        ↓
   Update GITHUB_TOKEN in env vars
        ↓
   ✅ Fixed

───────────────────────────────────────────

Search returns 0 results
        ↓
   Try simpler keywords ("Python", "React")
        ↓
   Check browser console (F12) for errors
        ↓
   Verify GitHub token scopes are correct
        ↓
   ✅ Fixed

───────────────────────────────────────────

Still broken?
        ↓
   Check TROUBLESHOOTING.md
        ↓
   Look for exact error message
        ↓
   Follow specific fix
```

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    APP STRUCTURE                             │
└─────────────────────────────────────────────────────────────┘

Frontend (Next.js)
├── app/page.tsx              → Search UI
├── app/api/search/route.ts   → Search API endpoint
├── components/
│   ├── hedra-primitives.tsx  → UI components (buttons, cards)
│   └── ui/                   → Base components (shadcn)
└── app/globals.css           → Hedra design system

Backend Logic
├── lib/github/
│   ├── client.ts             → GitHub API calls
│   └── queries.ts            → GraphQL query builders
├── lib/db/
│   ├── client.ts             → Supabase connection
│   ├── queries.ts            → Database operations
│   └── schema.ts             → TypeScript types
└── lib/scoring/
    └── simple-scorer.ts      → Scoring algorithm

Database (Supabase)
├── candidates                → Main user table
├── repositories              → User's repos
├── saved_searches            → Reusable searches
└── search_history            → Analytics
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   DATA FLOW (SEARCH)                         │
└─────────────────────────────────────────────────────────────┘

        [User UI]
           ↓
    Keywords + Modality
           ↓
    [API Route: /api/search]
           ↓
    Build GraphQL query
           ↓
    ┌──────────────┐
    │ GitHub API   │ ← Fetch users (paginated)
    └──────────────┘
           ↓
    Get user + top 20 repos
           ↓
    [Scoring Engine]
           ↓
    Keyword match (70%) + Stars (30%)
           ↓
    Sort by score (desc)
           ↓
    ┌──────────────┐
    │ Supabase DB  │ ← Upsert candidates + repos
    └──────────────┘
           ↓
    Return top 50 results
           ↓
        [User UI]
           ↓
    Display cards with:
    • Avatar, name, score
    • Bio, languages
    • Top repositories
```

---

## Success Metrics Flowchart

```
┌─────────────────────────────────────────────────────────────┐
│                  IS IT WORKING?                              │
└─────────────────────────────────────────────────────────────┘

Can you visit the app?
    NO  → Check Vercel deployment logs
    YES ↓

Does search button respond?
    NO  → Check browser console (F12)
    YES ↓

Do results appear in 2-5 seconds?
    NO  → Check GitHub API rate limit
    YES ↓

Are scores between 0.0-1.0?
    NO  → Check scoring algorithm
    YES ↓

Do candidates save to Supabase?
    NO  → Check database connection
    YES ↓

┌──────────────────────────────────────────┐
│ ✅ EVERYTHING IS WORKING!                │
│ 🎉 Start sourcing candidates!            │
└──────────────────────────────────────────┘
```

---

## Deployment Checklist

```
PRE-DEPLOYMENT
├── ☐ Node.js 18+ installed
├── ☐ GitHub account ready
├── ☐ Supabase project created
├── ☐ Migration SQL executed
├── ☐ 4 env variables saved
└── ☐ GitHub token generated

LOCAL TEST
├── ☐ .env.local created
├── ☐ npm install completed
├── ☐ npm run dev starts
├── ☐ Test search succeeds
└── ☐ Results appear <5sec

PRODUCTION
├── ☐ Code pushed to GitHub
├── ☐ Vercel project created
├── ☐ 4 env vars added to Vercel
├── ☐ Build completes
├── ☐ Production URL accessible
└── ☐ Test search succeeds

POST-DEPLOYMENT
├── ☐ Save production URL
├── ☐ Save Supabase dashboard URL
├── ☐ Test different search terms
├── ☐ Verify database is populating
└── ☐ Bookmark for daily use
```

---

## Quick Reference: Time Estimates

| Task | Time | Difficulty |
|------|------|------------|
| Supabase setup | 5 min | Easy |
| GitHub token | 3 min | Easy |
| Local testing | 5 min | Easy |
| Vercel deploy | 5 min | Easy |
| First bug fix | 10 min | Medium |
| **Total (smooth)** | **20 min** | **Easy** |
| **Total (with issues)** | **45 min** | **Medium** |

---

## Platform URLs (Bookmark These)

```
📍 Your App (after deploy)
   https://agi-sourcing-engine-xxxxx.vercel.app

📍 Supabase Dashboard
   https://supabase.com/dashboard/project/xxxxx

📍 Vercel Dashboard
   https://vercel.com/yourname/agi-sourcing-engine

📍 GitHub Repo
   https://github.com/yourname/agi-sourcing-engine

📍 GitHub Token Settings
   https://github.com/settings/tokens
```

---

## Visual: What Success Looks Like

```
┌─────────────────────────────────────────────────────────────┐
│  AGI Talent Sourcing Engine                      [Avatar]   │
│  Find deeply technical GitHub talent...                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Keywords: [PPO, gymnasium, reward modeling          ]       │
│ Modality: [RL Gym ▼]                                        │
│ [Search Candidates]                                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 47 candidates found in 2.3s                                  │
│ Average score: 0.68                                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ [🖼️] John Doe              @johndoe          [0.89] ★       │
│      PhD student working on RL algorithms...                 │
│      [Python] [C++] [PyTorch]                               │
│                                                              │
│      📦 Top Repositories:                                    │
│      • rl-baselines-zoo ⭐ 4.2K                            │
│      • gymnasium-extensions ⭐ 890                          │
└─────────────────────────────────────────────────────────────┘
```

That's what working looks like! 🚀
