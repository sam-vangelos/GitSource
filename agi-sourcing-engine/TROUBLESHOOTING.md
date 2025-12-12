# 🚨 Troubleshooting Quick Reference

## Most Common Issues

### Issue #1: "Missing environment variable: SUPABASE_URL"
**When**: Starting local dev or deployed app crashes
**Cause**: Environment variables not set
**Fix**:
- **Local**: Create `.env.local` with all 4 variables
- **Vercel**: Settings → Environment Variables → Add missing ones → Redeploy

---

### Issue #2: "relation 'candidates' does not exist"
**When**: First search fails with database error
**Cause**: Migration didn't run
**Fix**:
1. Supabase dashboard → SQL Editor
2. Copy contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and Run
4. Verify: Table Editor shows 4 tables

---

### Issue #3: "401 Bad credentials" (GitHub)
**When**: Search fails immediately
**Cause**: GitHub token invalid/expired/wrong scopes
**Fix**:
1. Generate new token at [github.com/settings/tokens](https://github.com/settings/tokens)
2. Select scopes: `read:user` + `public_repo`
3. Update `GITHUB_TOKEN` in `.env.local` (local) or Vercel (production)
4. Restart dev server or redeploy

---

### Issue #4: Search returns 0 results
**When**: Search completes but shows "No candidates found"
**Cause**: Keywords don't match anyone, or GitHub API query wrong
**Fix**:
1. Try simpler keywords: just `Python` or `machine learning`
2. Check browser console (F12) for errors
3. Verify GitHub token has correct scopes

---

### Issue #5: "Rate limit exceeded"
**When**: After many searches (>50 in an hour)
**Cause**: Hit GitHub's 5,000 requests/hour limit
**Fix**:
- Wait 1 hour (limit resets)
- Or: Generate new token from different GitHub account

---

### Issue #6: Blank page after Vercel deploy
**When**: Vercel says "Deployed" but page is white
**Cause**: Usually missing environment variables
**Fix**:
1. Open browser console (F12) → check for errors
2. Vercel → Settings → Environment Variables
3. Verify all 4 are present
4. Deployments tab → Redeploy

---

### Issue #7: TypeScript errors during build
**When**: `npm run build` fails locally or on Vercel
**Cause**: Type mismatches in code
**Fix**:
1. Run `npm run type-check` to see errors
2. Most common: Missing imports or wrong types
3. If stuck, DM me the error message

---

### Issue #8: "Cannot find module '@/components/...'"
**When**: Dev server crashes on start
**Cause**: Import path wrong or file missing
**Fix**:
1. Verify all files in `components/` folder exist
2. Check for typos in import statements
3. Make sure `tsconfig.json` has path alias configured

---

### Issue #9: Search is very slow (>10 seconds)
**When**: Search takes forever
**Cause**: GitHub API is slow or you're hitting rate limits
**Fix**:
- Normal speed: 2-5 seconds
- Check GitHub status: [www.githubstatus.com](https://www.githubstatus.com)
- Reduce `max_results` if you changed it

---

### Issue #10: Database query errors
**When**: Search fails with Postgres/Supabase error
**Cause**: Schema mismatch or constraint violation
**Fix**:
1. Supabase → SQL Editor
2. Drop and recreate tables:
```sql
DROP TABLE IF EXISTS search_history CASCADE;
DROP TABLE IF EXISTS saved_searches CASCADE;
DROP TABLE IF EXISTS repositories CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;

-- Then re-run entire migration
```

---

## Quick Diagnostics

### Is Supabase working?
```bash
# Check in browser console
fetch('https://YOUR-PROJECT.supabase.co/rest/v1/candidates?limit=1')
  .then(r => r.json())
  .then(console.log)

# Should return: array (empty is fine) or auth error
```

### Is GitHub token working?
```bash
# Check in terminal
curl -H "Authorization: Bearer YOUR_GITHUB_TOKEN" \
  https://api.github.com/user

# Should return: Your GitHub user data
```

### Are environment variables loaded?
```javascript
// Check in browser console (on app page)
console.log({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasGithubToken: !!process.env.GITHUB_TOKEN  // server-side, won't show
})
```

---

## Emergency Reset

If everything is broken:

### 1. Fresh local setup
```bash
# Delete node_modules
rm -rf node_modules

# Reinstall
npm install

# Recreate .env.local
# (add all 4 variables)

# Test
npm run dev
```

### 2. Fresh database
```sql
-- In Supabase SQL Editor
DROP TABLE IF EXISTS search_history CASCADE;
DROP TABLE IF EXISTS saved_searches CASCADE;
DROP TABLE IF EXISTS repositories CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;

-- Then paste and run full migration again
```

### 3. Fresh Vercel deploy
1. Vercel → Settings → Delete Project
2. Re-import from GitHub
3. Re-add all 4 environment variables
4. Deploy

---

## Getting Help

### What to include when asking for help:

1. **Error message** (full text)
2. **When it happens** (local dev, build, or production)
3. **What you were doing** (specific search terms, etc.)
4. **Browser console errors** (F12 → Console tab)
5. **Environment**:
   - Node version: `node -v`
   - OS: Mac/Windows/Linux

### Where to check first:
- Browser console (F12)
- Terminal output
- Vercel deployment logs
- Supabase logs (Logs section in dashboard)

---

## Prevention Checklist

Before deploying:
- [ ] Run `npm run build` locally (catches many errors)
- [ ] Run `npm run type-check` (catches type errors)
- [ ] Test search locally with real keywords
- [ ] Verify all 4 env vars are in Vercel
- [ ] Check Supabase tables exist

---

## Contact Decision Tree

```
Issue → Check this guide first
  ↓
Still broken? → Check browser console + terminal
  ↓
Still broken? → Check Supabase logs + Vercel logs
  ↓
Still broken? → Google the exact error message
  ↓
Still broken? → Ask for help with full context
```

---

## Useful Links

- **Supabase Status**: [status.supabase.com](https://status.supabase.com)
- **Vercel Status**: [www.vercel-status.com](https://www.vercel-status.com)
- **GitHub Status**: [www.githubstatus.com](https://www.githubstatus.com)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

## Pro Tips

1. **Always check browser console first** - 90% of issues show errors there
2. **Environment variables are #1 cause** of deployment issues
3. **GitHub token expiration** is easy to forget
4. **Supabase free tier** is plenty - don't worry about limits
5. **Vercel redeployment** fixes many cache issues

---

## Success Indicators

✅ **Working correctly if**:
- Local dev server starts in <5 seconds
- Search returns results in 2-5 seconds
- Candidates save to database (check Supabase Table Editor)
- Scores are between 0.0-1.0
- No console errors

⚠️ **Something's wrong if**:
- Any environment variable error
- Database "relation does not exist" errors
- GitHub 401/403 errors
- Searches take >10 seconds
- Blank page with no errors

---

Keep this handy while setting up! Most issues are quick fixes. 🚀
