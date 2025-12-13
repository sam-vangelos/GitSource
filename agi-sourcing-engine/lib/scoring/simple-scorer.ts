import { Modality, MODALITY_KEYWORDS } from '../constants';
import type { ScoreExplanation } from '../db/schema';

interface ScoringInput {
  bio: string | null;
  totalStars: number;
  repositories: Array<{
    topics: string[];
    description: string | null;
    name: string;
    primaryLanguage: string | null;
    pushedAt: string;
    createdAt: string;
  }>;
}

interface ScoringOutput {
  score: number;
  explanation: ScoreExplanation;
}

function normalizeKeyword(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .trim();
}

function keywordMatches(text: string, keyword: string): boolean {
  const normalizedText = normalizeKeyword(text);
  const normalizedKeyword = normalizeKeyword(keyword);
  
  return normalizedText.includes(normalizedKeyword);
}

function findKeywordMatches(
  candidate: ScoringInput,
  modality: Modality
): {
  matchedKeywords: Set<string>;
  matchedRepos: Set<string>;
  matchCount: number;
} {
  const modalityKeywords = MODALITY_KEYWORDS[modality];
  const matchedKeywords = new Set<string>();
  const matchedRepos = new Set<string>();
  let matchCount = 0;

  // Check bio for keywords
  if (candidate.bio) {
    for (const keyword of modalityKeywords) {
      if (keywordMatches(candidate.bio, keyword)) {
        matchedKeywords.add(keyword);
        matchCount++;
      }
    }
  }

  // Check each repository
  for (const repo of candidate.repositories) {
    let repoHasMatch = false;

    // Check topics (highest confidence)
    for (const topic of repo.topics) {
      for (const keyword of modalityKeywords) {
        if (keywordMatches(topic, keyword)) {
          matchedKeywords.add(keyword);
          matchCount += 2; // Topics are more reliable
          repoHasMatch = true;
        }
      }
    }

    // Check description
    if (repo.description) {
      for (const keyword of modalityKeywords) {
        if (keywordMatches(repo.description, keyword)) {
          matchedKeywords.add(keyword);
          matchCount += 1.5; // Descriptions are good signals
          repoHasMatch = true;
        }
      }
    }

    // Check repo name (lower confidence)
    for (const keyword of modalityKeywords) {
      if (keywordMatches(repo.name, keyword)) {
        matchedKeywords.add(keyword);
        matchCount += 1;
        repoHasMatch = true;
      }
    }

    if (repoHasMatch) {
      matchedRepos.add(repo.name);
    }
  }

  return {
    matchedKeywords,
    matchedRepos,
    matchCount,
  };
}

function calculateKeywordScore(matchCount: number): number {
  // Scoring tiers based on match count
  if (matchCount === 0) return 0.0;
  if (matchCount <= 2) return 0.3;
  if (matchCount <= 5) return 0.5;
  if (matchCount <= 10) return 0.7;
  if (matchCount <= 15) return 0.85;
  return 1.0;
}

function calculateStarScore(totalStars: number): number {
  // Normalize stars to 0-1 scale
  // 1000+ stars = 1.0
  // Linear scaling below that
  return Math.min(totalStars / 1000, 1.0);
}

function calculateActivityScore(repositories: ScoringInput['repositories']): number {
  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  
  let activeRepos = 0;
  for (const repo of repositories) {
    const pushedAt = new Date(repo.pushedAt);
    if (pushedAt > oneYearAgo) {
      activeRepos++;
    }
  }
  
  // Score based on fraction of repos active in last year
  return activeRepos / Math.max(repositories.length, 1);
}

export function scoreCandidate(
  candidate: ScoringInput,
  modality: Modality
): ScoringOutput {
  // Find keyword matches
  const { matchedKeywords, matchedRepos, matchCount } = findKeywordMatches(
    candidate,
    modality
  );

  // Calculate component scores
  const keywordMatchScore = calculateKeywordScore(matchCount);
  const starScore = calculateStarScore(candidate.totalStars);
  const activityScore = calculateActivityScore(candidate.repositories);

  // Final score: 60% keywords, 20% stars, 20% activity
  const finalScore = keywordMatchScore * 0.6 + starScore * 0.2 + activityScore * 0.2;

  // Build explanation
  const explanation: ScoreExplanation = {
    signal_count: matchCount,
    top_signals: [
      {
        type: 'KEYWORD_MATCH',
        value: `${matchedKeywords.size} unique keywords`,
        contribution: keywordMatchScore * 0.6,
      },
      {
        type: 'STAR_COUNT',
        value: `${candidate.totalStars} stars`,
        contribution: starScore * 0.2,
      },
      {
        type: 'ACTIVITY',
        value: `${Math.round(activityScore * 100)}% repos active`,
        contribution: activityScore * 0.2,
      },
    ],
    keyword_match_score: keywordMatchScore,
    star_score: starScore,
    activity_score: activityScore,
    final_score: finalScore,
    matched_keywords: Array.from(matchedKeywords),
    matched_repos: Array.from(matchedRepos),
  };

  return {
    score: Number(finalScore.toFixed(4)),
    explanation,
  };
}

// Batch scoring for multiple candidates
export function batchScoreCandidates(
  candidates: ScoringInput[],
  modality: Modality
): ScoringOutput[] {
  return candidates.map(candidate => scoreCandidate(candidate, modality));
}
