# 🚀 Quick Start Guide - AGI Sourcing Engine

## What You Have

A complete, working GitHub talent sourcing tool:
- ✅ Frontend UI with search interface
- ✅ GitHub API integration (GraphQL)
- ✅ Smart scoring algorithm
- ✅ Supabase database with full schema
- ✅ All TypeScript types and components

## 5-Minute Setup

### Step 1: Get Your API Keys (2 minutes)

**Supabase** (database):
1. Go to supabase.com → Sign up
2. Create new project (name it anything)
3. Wait 2 minutes for provisioning
4. Go to Settings → API
5. Copy these 3 values:
   - URL: `https://xxxxx.supabase.co`
   - anon key: `eyJxxx...`
   - service_role key: `eyJxxx...`

**GitHub** (API access):
1. Go to github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `read:user`, `public_repo`
4. Copy token: `ghp_xxx...`

### Step 2: Configure Environment (1 minute)

Create `.env.local` file in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
GITHUB_TOKEN=your-github-token-here
```

### Step 3: Run Database Migration (1 minute)

1. Open Supabase dashboard → SQL Editor
2. Copy entire content of `supabase/migrations/001_initial_schema.sql`
3. Paste and click "Run"
4. Should see "Success"

### Step 4: Install & Run (1 minute)

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## First Search

Try this:
- **Keywords**: `PPO, gymnasium, reward modeling`
- **Modality**: RL Gym
- Click **Search**

You should see 20-50 ranked GitHub profiles in ~2 seconds.

## What Works Right Now

✅ **Search GitHub** by keywords
✅ **Score candidates** (keyword match + stars)
✅ **Save to database** (auto-deduplication)
✅ **View results** with avatars, bios, repos
✅ **Click to GitHub** profile

## Deploy to Vercel (10 minutes)

1. Push code to GitHub
2. Go to vercel.com → New Project
3. Import your repo
4. Add same 4 environment variables
5. Deploy

Live in ~2 minutes at `your-project.vercel.app`

## Architecture

```
User enters "PPO RL"
    ↓
API builds GitHub query: "PPO OR RL language:Python"
    ↓
GitHub returns 50 users with repos
    ↓
Score each: keywords (70%) + stars (30%)
    ↓
Save to Supabase (upsert)
    ↓
Return ranked results to UI
```

## File Structure

```
app/
  api/search/route.ts      ← Main API endpoint
  page.tsx                 ← Search UI
lib/
  github/client.ts         ← GitHub API calls
  scoring/simple-scorer.ts ← Scoring algorithm
  db/queries.ts            ← Database operations
  constants.ts             ← Modalities & keywords
components/ui/             ← Button, Card, Badge, Input
supabase/migrations/       ← Database schema
```

## Troubleshooting

**Port 3000 already in use**:
```bash
killall -9 node
npm run dev
```

**Environment variables not loading**:
- Restart dev server after editing `.env.local`
- Check file is named `.env.local` not `.env`

**Database errors**:
- Check migration ran successfully
- Verify Supabase keys in `.env.local`

**No search results**:
- GitHub token might be invalid
- Try broader keywords

## Next Steps

1. ✅ Run your first search
2. Test with different keywords/modalities
3. Check Supabase dashboard to see saved candidates
4. Deploy to Vercel

## Need Help?

Check:
1. All 4 environment variables set?
2. Database migration ran?
3. GitHub token has correct permissions?
4. Node.js 18+ installed?

Everything should "just work" if these are correct.

---

**Time to first search**: ~5 minutes
**Time to deploy**: ~15 minutes total
