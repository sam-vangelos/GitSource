# AGI Talent Sourcing Engine

Find deeply technical GitHub talent for frontier AI roles.

---

## 🚀 **[→ DEPLOYMENT GUIDE (20 min setup)](./DEPLOYMENT_GUIDE.md)** 🚀

---

## Features

✅ **GitHub Search**: Search for users by keywords, language, location, stars
✅ **Smart Scoring**: Keyword matching + star-based ranking
✅ **Database Storage**: All candidates saved to Supabase
✅ **Clean UI**: Dark mode, responsive design
✅ **Fast**: Results in <2 seconds

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Database**: Supabase (Postgres)
- **APIs**: GitHub GraphQL v4
- **Hosting**: Vercel

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account (free tier)
- GitHub personal access token

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be ready (~2 minutes)
3. Go to Project Settings → API
4. Copy the following:
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

### 3. Create GitHub Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "AGI Sourcing Engine"
4. Select scopes:
   - `read:user`
   - `public_repo`
5. Generate and copy the token

### 4. Set Up Environment Variables

Create `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# GitHub
GITHUB_TOKEN=ghp_your-token-here

# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Database Migration

1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL editor
6. Click "Run" (bottom right)
7. You should see "Success. No rows returned"

### 6. Install Dependencies

```bash
npm install
```

### 7. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Usage

1. **Enter Keywords**: Type relevant keywords separated by commas
   - Example: `PPO, gymnasium, reward modeling`

2. **Select Modality**: Choose the technical domain
   - RL Gym, Code Agent, Eval Infrastructure, etc.

3. **Click Search**: Results appear in ~2 seconds

4. **Review Candidates**: Each card shows:
   - Name, username, bio
   - Score (0.00 to 1.00)
   - Total GitHub stars
   - Primary programming languages
   - Top repositories with topics

5. **Click Username**: Opens GitHub profile in new tab

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GITHUB_TOKEN`
5. Click "Deploy"

Your app will be live at `https://your-project.vercel.app`

## Project Structure

```
agi-sourcing-engine/
├── app/
│   ├── api/search/          # Search API endpoint
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main search page
│   └── globals.css          # Global styles
├── components/
│   └── ui/                  # UI components (Button, Card, etc.)
├── lib/
│   ├── github/              # GitHub API client
│   ├── scoring/             # Scoring algorithm
│   ├── db/                  # Database queries
│   ├── constants.ts         # Modalities, keywords
│   └── utils.ts             # Utility functions
├── supabase/
│   └── migrations/          # Database migrations
├── .env.local               # Environment variables (local)
└── .env.example             # Template for environment variables
```

## How It Works

1. **Search**: User enters keywords → API builds GitHub query
2. **GitHub API**: Fetch 50-100 users with their top repos
3. **Scoring**: Each candidate scored based on:
   - Keyword matches in repos, topics, bio (70% weight)
   - Total GitHub stars (30% weight)
4. **Database**: Save candidates to Supabase (upsert to avoid duplicates)
5. **Display**: Show ranked results with scores

## Scoring Algorithm

**Simple Scorer** (v1.0):
- **Keyword Match** (70%):
  - Topics: High confidence (2x weight)
  - Description: Medium confidence (1.5x weight)
  - Repo name: Lower confidence (1x weight)
  - Bio: Medium confidence (1x weight)
- **Stars** (30%):
  - Normalized: total_stars / 1000
  - Capped at 1.0

**Final Score** = (keyword_score * 0.7) + (star_score * 0.3)

## Database Schema

**Main Tables**:
- `candidates`: User profiles, scores, tags, outreach status
- `repositories`: GitHub repos with topics, languages, stars
- `search_history`: Track all searches for analytics
- `saved_searches`: Store reusable search templates

## Troubleshooting

**"Missing environment variable" error**:
- Check that `.env.local` exists and has all required variables
- Restart dev server after adding environment variables

**"Failed to fetch candidate" error**:
- Check Supabase connection (URL and keys correct?)
- Run database migration if not already done

**"GitHub API request failed" error**:
- Check GitHub token is valid
- Check rate limit: 5000 requests/hour

**No results found**:
- Try broader keywords
- Check that keywords are relevant to the modality
- Try different modality

## Rate Limits

- **GitHub API**: 5,000 requests/hour
- **Searches**: ~5-10 API requests per search
- **Expected usage**: 50-75 candidates/week = negligible API usage

## Next Steps (Future Enhancements)

- [ ] Export to CSV
- [ ] Tags and notes
- [ ] Outreach status tracking
- [ ] Saved searches
- [ ] Email/LinkedIn enrichment
- [ ] Advanced filtering

## Support

For issues or questions, check:
1. Environment variables are set correctly
2. Database migration ran successfully
3. GitHub token has correct permissions

---

Built with Next.js 14, TypeScript, Tailwind CSS, Supabase, and GitHub API.
