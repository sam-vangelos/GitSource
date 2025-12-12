import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchGitHubUsers } from '@/lib/github/client';
import { scoreCandidate } from '@/lib/scoring/simple-scorer';
import { upsertCandidate, logSearchHistory } from '@/lib/db/queries';
import { MODALITIES } from '@/lib/constants';
import type { Modality } from '@/lib/constants';
import type { Candidate, CandidateInsert, RepositoryInsert } from '@/lib/db/schema';

const SearchRequestSchema = z.object({
  keywords: z.array(z.string()).min(1, 'At least one keyword required'),
  modality: z.enum(MODALITIES),
  filters: z
    .object({
      language: z.string().optional(),
      location: z.string().optional(),
      min_stars: z.number().optional(),
      min_followers: z.number().optional(),
    })
    .optional(),
  max_results: z.number().max(200).default(100),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Validate request body
    const body = await request.json();
    const validated = SearchRequestSchema.parse(body);

    console.log('Search request:', {
      keywords: validated.keywords,
      modality: validated.modality,
      max_results: validated.max_results,
    });

    // 2. Search GitHub
    const githubUsers = await searchGitHubUsers(
      validated.keywords,
      validated.filters,
      validated.max_results
    );

    console.log(`Found ${githubUsers.length} GitHub users`);

    if (githubUsers.length === 0) {
      return NextResponse.json({
        candidates: [],
        total: 0,
        execution_time_ms: Date.now() - startTime,
        message: 'No candidates found matching the criteria',
      });
    }

    // 3. Score each candidate
    const scoredCandidates = githubUsers.map(user => {
      const totalStars = user.repositories.reduce(
        (sum, repo) => sum + repo.stargazerCount,
        0
      );

      const scoringResult = scoreCandidate(
        {
          bio: user.bio,
          totalStars,
          repositories: user.repositories.map(repo => ({
            topics: repo.topics,
            description: repo.description,
            name: repo.name,
            primaryLanguage: repo.primaryLanguage,
          })),
        },
        validated.modality as Modality
      );

      return {
        user,
        score: scoringResult.score,
        explanation: scoringResult.explanation,
        totalStars,
      };
    });

    // 4. Sort by score (descending)
    scoredCandidates.sort((a, b) => b.score - a.score);

    console.log(`Scored ${scoredCandidates.length} candidates`);

    // 5. Save to database
    const savedCandidates: Candidate[] = [];
    
    for (const scored of scoredCandidates) {
      try {
        // Extract primary languages from repos
        const languageCounts: Record<string, number> = {};
        for (const repo of scored.user.repositories) {
          if (repo.primaryLanguage) {
            languageCounts[repo.primaryLanguage] =
              (languageCounts[repo.primaryLanguage] || 0) + 1;
          }
        }
        
        const primaryLanguages = Object.entries(languageCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([lang]) => lang);

        const candidateData: Partial<CandidateInsert> & {
          github_username: string;
          github_id: number;
        } = {
          github_username: scored.user.login,
          github_url: scored.user.url,
          github_id: scored.user.id,
          name: scored.user.name,
          bio: scored.user.bio,
          avatar_url: scored.user.avatarUrl,
          email: scored.user.email,
          twitter_username: scored.user.twitterUsername,
          personal_website: scored.user.websiteUrl,
          company: scored.user.company,
          location: scored.user.location,
          followers_count: scored.user.followers,
          following_count: scored.user.following,
          public_repos_count: scored.user.publicRepos,
          github_created_at: scored.user.createdAt,
          total_stars: scored.totalStars,
          primary_languages: primaryLanguages,
          modalities: [validated.modality as Modality],
          overall_score: scored.score,
          score_algorithm_version: 'v1.0',
          score_explanation: scored.explanation,
        };

        const repositories: RepositoryInsert[] = scored.user.repositories.map(
          repo => ({
            github_repo_id: repo.id,
            name: repo.name,
            full_name: `${scored.user.login}/${repo.name}`,
            description: repo.description,
            url: repo.url,
            stargazer_count: repo.stargazerCount,
            fork_count: repo.forkCount,
            watchers_count: 0,
            primary_language: repo.primaryLanguage,
            languages: repo.languages,
            topics: repo.topics,
            created_at: repo.createdAt,
            pushed_at: repo.pushedAt,
            is_fork: repo.isFork,
            repo_category: null,
            relevance_score: 0,
            candidate_id: 0,
          })
        );

        const saved = await upsertCandidate(candidateData, repositories);
        savedCandidates.push(saved);
      } catch (error) {
        console.error(
          `Failed to save candidate ${scored.user.login}:`,
          error
        );
      }
    }

    console.log(`Saved ${savedCandidates.length} candidates to database`);

    // 6. Log search history
    const avgScore = scoredCandidates.length > 0
      ? scoredCandidates.reduce((sum, c) => sum + c.score, 0) / scoredCandidates.length
      : 0;

    const searchId = await logSearchHistory({
      query_string: validated.keywords.join(' '),
      modality: validated.modality as Modality,
      keywords: validated.keywords,
      filters: validated.filters || {},
      results_count: scoredCandidates.length,
      avg_score: avgScore,
      execution_time_ms: Date.now() - startTime,
    });

    // 7. Return results
    const response = {
      candidates: scoredCandidates.slice(0, 50).map(c => ({
        id: savedCandidates.find(s => s.github_username === c.user.login)
          ?.id,
        github_username: c.user.login,
        name: c.user.name,
        avatar_url: c.user.avatarUrl,
        bio: c.user.bio,
        url: c.user.url,
        overall_score: c.score,
        total_stars: c.totalStars,
        modalities: [validated.modality],
        score_explanation: c.explanation,
        primary_languages: c.user.repositories
          .map(r => r.primaryLanguage)
          .filter((l): l is string => l !== null)
          .slice(0, 3),
        top_repos: c.user.repositories.slice(0, 3).map(r => ({
          name: r.name,
          url: r.url,
          stars: r.stargazerCount,
          topics: r.topics,
        })),
      })),
      total: scoredCandidates.length,
      execution_time_ms: Date.now() - startTime,
      search_id: searchId,
      avg_score: avgScore,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Search failed',
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    message: 'Search API is operational',
  });
}
