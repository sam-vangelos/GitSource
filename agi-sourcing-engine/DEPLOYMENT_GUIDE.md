# 🚀 Deployment Guide - AGI Sourcing Engine

## ⏱️ Time Required
- **Total**: 20 minutes
- Supabase setup: 5 minutes
- GitHub token: 3 minutes  
- Local testing: 5 minutes
- Vercel deployment: 5 minutes

---

## 📋 Prerequisites
- GitHub account
- Node.js 18+ installed ([nodejs.org](https://nodejs.org))
- A browser
- A text editor

---

## STEP 1: Create Supabase Project (5 min)

### 1.1 Sign Up
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)

### 1.2 Create Project
1. Click "New Project"
2. Fill in:
   - **Name**: `agi-sourcing-engine`
   - **Database Password**: Generate and SAVE IT
   - **Region**: US West (or closest)
3. Click "Create new project"
4. Wait 2 minutes for setup

### 1.3 Get Credentials
1. Go to Project Settings (gear icon) → API
2. Copy these 3 values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  (click "Reveal")
```

### 1.4 Run Migration
1. Click "SQL Editor" in sidebar
2. Click "New query"
3. Open `supabase/migrations/001_initial_schema.sql` from project
4. Copy ENTIRE file contents
5. Paste into SQL Editor
6. Click "Run"
7. Should see: "Success. No rows returned"
8. Verify: Click "Table Editor" → should see 4 tables

---

## STEP 2: Get GitHub Token (3 min)

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Settings:
   - Note: `AGI Sourcing Engine`
   - Expiration: 90 days
   - Scopes: ✅ `read:user`, ✅ `public_repo`
4. Click "Generate token"
5. **COPY IMMEDIATELY** (won't be shown again):

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
```

---

## STEP 3: Test Locally (5 min)

### 3.1 Create `.env.local`
Create this file in project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# GitHub  
GITHUB_TOKEN=ghp_xxxxx...
```

### 3.2 Install & Run
```bash
npm install
npm run dev
```

### 3.3 Test Search
1. Open [http://localhost:3000](http://localhost:3000)
2. Keywords: `PPO, gymnasium`
3. Modality: `RL Gym`
4. Click "Search Candidates"
5. Should see results in 2-5 seconds

**If search works**: ✅ Ready for deployment!

---

## STEP 4: Deploy to Vercel (5 min)

### 4.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"

# Option A: GitHub CLI
gh repo create agi-sourcing-engine --private --source=. --push

# Option B: Manual at github.com/new
```

### 4.2 Deploy
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import `agi-sourcing-engine`

### 4.3 Add Environment Variables
**Before clicking Deploy**, add all 4 variables:

```bash
NEXT_PUBLIC_SUPABASE_URL → (your URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY → (your key)
SUPABASE_SERVICE_ROLE_KEY → (your service key)
GITHUB_TOKEN → (your token)
```

### 4.4 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Click "Visit"
4. Test same search

**If works**: 🎉 You're live!

---

## 🔧 Troubleshooting

### "Missing environment variable"
→ Go to Vercel → Settings → Environment Variables → Add missing ones → Redeploy

### "relation 'candidates' does not exist"
→ Go to Supabase → SQL Editor → Re-run migration

### "401 Bad credentials"
→ Verify GitHub token is correct and hasn't expired

### Blank page
→ Check browser console (F12) for errors

---

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] 4 database tables exist
- [ ] GitHub token generated
- [ ] Local test search works
- [ ] Pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Production search works

---

## 📝 Save These URLs

```bash
# Your app
https://agi-sourcing-engine-xxxxx.vercel.app

# Supabase dashboard
https://supabase.com/dashboard/project/xxxxx

# GitHub repo
https://github.com/yourusername/agi-sourcing-engine
```

---

## 🎯 Next: Start Sourcing!

Try these searches:

**RL Engineers**:
- `PPO, DQN, gymnasium` → RL Gym

**LLM Builders**:
- `langchain, agent, tool` → Code Agents

**Eval Engineers**:
- `benchmark, eval, leaderboard` → Eval Infrastructure

Each search saves candidates to your database for later review.

---

## 📊 Free Tier Limits

You can comfortably:
- Store 10,000+ candidates
- Run 1,000+ searches/month
- Serve unlimited page views

All on free tier. No credit card needed.

---

## 🔐 Security

✅ **Public variables** (NEXT_PUBLIC_*): Safe in frontend
⚠️ **Secret variables**: Server-only, never exposed

Never commit `.env.local` to Git (already in `.gitignore`).

---

That's it! You're ready to find AGI talent. 🚀
