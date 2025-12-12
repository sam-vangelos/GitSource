# ✅ Setup Checklist - Print & Follow

**Target: 20 minutes from zero to deployed**

---

## 📋 STEP 1: Supabase (5 min)

**Create Project:**
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Sign up with GitHub
- [ ] Click "New Project"
- [ ] Name: `agi-sourcing-engine`
- [ ] Generate database password → **SAVE IT**
- [ ] Select region (US West recommended)
- [ ] Click "Create new project"
- [ ] Wait 2 minutes for setup

**Get Credentials:**
- [ ] Project Settings (gear icon) → API
- [ ] Copy and save:
  ```
  URL: _________________________________
  
  Anon key: _________________________________
  
  Service key: _________________________________
  ```

**Run Migration:**
- [ ] Click "SQL Editor" in sidebar
- [ ] Click "New query"
- [ ] Open `supabase/migrations/001_initial_schema.sql`
- [ ] Copy entire file (232 lines)
- [ ] Paste into editor
- [ ] Click "Run"
- [ ] Success? (should see "No rows returned")
- [ ] Verify: Table Editor → 4 tables exist
  - [ ] candidates
  - [ ] repositories
  - [ ] saved_searches
  - [ ] search_history

---

## 🔑 STEP 2: GitHub Token (3 min)

**Generate Token:**
- [ ] Go to [github.com/settings/tokens](https://github.com/settings/tokens)
- [ ] Click "Generate new token (classic)"
- [ ] Note: `AGI Sourcing Engine`
- [ ] Expiration: 90 days
- [ ] Select scopes:
  - [ ] ✅ `read:user`
  - [ ] ✅ `public_repo`
- [ ] Click "Generate token"
- [ ] Copy immediately (won't be shown again):
  ```
  Token: _________________________________
  ```

---

## 💻 STEP 3: Local Testing (5 min)

**Create .env.local:**
- [ ] Open project folder in editor
- [ ] Create file named `.env.local` (with the dot!)
- [ ] Paste this template:
  ```bash
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  GITHUB_TOKEN=
  ```
- [ ] Fill in all 4 values from above
- [ ] No spaces around `=`
- [ ] No quotes around values
- [ ] Save file

**Install & Run:**
- [ ] Open terminal in project folder
- [ ] Run: `npm install`
  - [ ] Completes without errors
  - [ ] Takes 30-60 seconds
- [ ] Run: `npm run dev`
  - [ ] Shows "Local: http://localhost:3000"
  - [ ] Takes <5 seconds to start

**Test Search:**
- [ ] Open browser: [http://localhost:3000](http://localhost:3000)
- [ ] See brown background with smoke
- [ ] See "AGI Talent Sourcing Engine" title
- [ ] Enter keywords: `PPO, gymnasium`
- [ ] Select modality: `RL Gym`
- [ ] Click "Search Candidates"
- [ ] Loading spinner appears
- [ ] Results appear in 2-5 seconds
- [ ] See candidate cards with:
  - [ ] Avatars
  - [ ] Names and scores
  - [ ] Repos listed

**If test works:** ✅ Ready to deploy!

---

## 🚀 STEP 4: Deploy to Vercel (5 min)

**Push to GitHub:**
- [ ] In terminal:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  ```
- [ ] Choose option:
  - [ ] **A**: GitHub CLI: `gh repo create agi-sourcing-engine --private --source=. --push`
  - [ ] **B**: Manual at github.com/new → follow instructions

**Deploy:**
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up with GitHub
- [ ] Click "Add New..." → "Project"
- [ ] Find `agi-sourcing-engine` repo
- [ ] Click "Import"

**Add Environment Variables:**
- [ ] Expand "Environment Variables" section
- [ ] Add all 4 variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` = (your URL)
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key)
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` = (your service key)
  - [ ] `GITHUB_TOKEN` = (your token)
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes
- [ ] Build completes successfully

**Test Production:**
- [ ] Click "Visit" button
- [ ] App loads (brown background)
- [ ] Run same test search
- [ ] Results appear
- [ ] Works correctly

**Save URLs:**
```
Production: _________________________________

Supabase: _________________________________

GitHub Repo: _________________________________
```

---

## ✨ Success Checklist

All these should be TRUE:
- [ ] Local dev server starts without errors
- [ ] Test search returns 20+ candidates
- [ ] Results appear in <5 seconds
- [ ] Candidates save to Supabase (check Table Editor)
- [ ] Production URL accessible
- [ ] Production search works same as local
- [ ] No console errors (F12 to check)

---

## 🚨 Common Issues

**"Missing environment variable"**
→ Check `.env.local` locally or Vercel env vars
→ Make sure all 4 are present
→ Redeploy if on Vercel

**"relation 'candidates' does not exist"**
→ Migration didn't run
→ Re-run in Supabase SQL Editor

**"401 Bad credentials"**
→ GitHub token expired/wrong scopes
→ Generate new token
→ Update GITHUB_TOKEN

**Search returns 0 results**
→ Try simpler keywords: just "Python"
→ Check browser console for errors

**Full troubleshooting:** See TROUBLESHOOTING.md

---

## 📞 Quick Help

**Environment Variables Format:**
```bash
# CORRECT ✅
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
GITHUB_TOKEN=ghp_xxxxx

# WRONG ❌
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co  (spaces)
GITHUB_TOKEN="ghp_xxxxx"  (quotes)
```

**Check if working:**
- Browser console (F12) shows no errors
- Search returns results in 2-5 seconds
- Supabase Table Editor shows new rows

**Still stuck?**
1. Check TROUBLESHOOTING.md
2. Read full DEPLOYMENT_GUIDE.md
3. Check browser console + terminal output

---

## 🎯 After Deployment

**Bookmark these:**
- [ ] Your production URL
- [ ] Supabase dashboard
- [ ] Vercel dashboard
- [ ] This checklist for future reference

**Next steps:**
- [ ] Try different search terms
- [ ] Verify candidates save to database
- [ ] Check data quality in Supabase
- [ ] Start building your pipeline!

---

## ⏱️ Time Tracker

Check actual time taken:
- Supabase: _____ min
- GitHub: _____ min
- Local: _____ min
- Deploy: _____ min
- **Total: _____ min**

Target: 20 min | Acceptable: 45 min

---

**Print this page and tick off as you go! 📋**
