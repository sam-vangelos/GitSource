/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GitHubUser, GitHubSearchResponse, RateLimit } from './types';
import { SEARCH_USERS_QUERY, RATE_LIMIT_QUERY, buildSearchQuery } from './queries';
import type { SearchFilters } from '../db/schema';

const GITHUB_API_URL = 'https://api.github.com/graphql';

if (!process.env.GITHUB_TOKEN) {
  console.warn('Warning: GITHUB_TOKEN not set. GitHub API calls will fail.');
}

async function makeGraphQLRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }

  const response = await fetch(GITHUB_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v4+json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GitHub GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data as T;
}

function parseGitHubUser(node: unknown): GitHubUser {
  const n = node as any; // temporary cast
  return {
    login: n.login,
    name: n.name,
    bio: n.bio,
    avatarUrl: n.avatarUrl,
    url: n.url,
    email: n.email,
    twitterUsername: n.twitterUsername,
    websiteUrl: n.websiteUrl,
    company: n.company,
    location: n.location,
    followers: n.followers.totalCount,
    following: n.following.totalCount,
    publicRepos: n.repositories.totalCount,
    createdAt: n.createdAt,
    id: n.databaseId || Date.now(), // Use GitHub's numeric databaseId
    repositories: n.repositoryList.nodes.map((repo: unknown) => {
      const r = repo as any;
      return {
      name: r.name,
      description: r.description,
      url: r.url,
      stargazerCount: r.stargazerCount,
      forkCount: r.forkCount,
      primaryLanguage: r.primaryLanguage?.name || null,
      languages: r.languages.nodes.map((l: unknown) => (l as { name: string }).name),
      topics: r.repositoryTopics.nodes.map((t: unknown) => (t as { topic: { name: string } }).topic.name),
      createdAt: r.createdAt,
      pushedAt: r.pushedAt,
      isFork: r.isFork,
      id: r.databaseId || Date.now(),
    }
    }),
  };
}

export async function searchGitHubUsers(
  keywords: string[],
  filters?: SearchFilters,
  maxResults: number = 100
): Promise<GitHubUser[]> {
  const query = buildSearchQuery(keywords, filters);
  const users: GitHubUser[] = [];
  let hasNextPage = true;
  let endCursor: string | null = null;

  console.log('GitHub Search Query:', query);

  while (hasNextPage && users.length < maxResults) {
    const batchSize = Math.min(50, maxResults - users.length); // GitHub max is 100, but 50 is safer

    try {
      const response: GitHubSearchResponse = await makeGraphQLRequest<GitHubSearchResponse>(SEARCH_USERS_QUERY, {
        query,
        first: batchSize,
        after: endCursor,
      });

      if (!response.data.search.nodes || response.data.search.nodes.length === 0) {
        break;
      }

      // Filter out non-user nodes (sometimes organizations slip through)
      const userNodes = response.data.search.nodes.filter(
        node => node.__typename === 'User'
      );

      const parsedUsers = userNodes.map(parseGitHubUser);
      users.push(...parsedUsers);

      hasNextPage = response.data.search.pageInfo.hasNextPage;
      endCursor = response.data.search.pageInfo.endCursor;

      console.log(
        `Fetched ${parsedUsers.length} users (total: ${users.length}/${maxResults})`
      );

      // Don't fetch more pages if we have enough
      if (users.length >= maxResults) {
        break;
      }
    } catch (error) {
      console.error('Error fetching GitHub users:', error);
      
      // If we already have some results, return them
      if (users.length > 0) {
        console.log(`Returning ${users.length} users despite error`);
        break;
      }
      
      throw error;
    }
  }

  return users.slice(0, maxResults);
}

export async function checkRateLimit(): Promise<RateLimit> {
  const response: {
    data: {
      rateLimit: {
        limit: number;
        remaining: number;
        resetAt: string;
        cost: number;
      };
    };
  } = await makeGraphQLRequest<{
    data: {
      rateLimit: {
        limit: number;
        remaining: number;
        resetAt: string;
        cost: number;
      };
    };
  }>(RATE_LIMIT_QUERY);

  return {
    limit: response.data.rateLimit.limit,
    remaining: response.data.rateLimit.remaining,
    resetAt: new Date(response.data.rateLimit.resetAt),
    cost: response.data.rateLimit.cost,
  };
}

export async function getUserByUsername(username: string): Promise<GitHubUser | null> {
  try {
    const users = await searchGitHubUsers([`user:${username}`], undefined, 1);
    return users[0] || null;
  } catch (error) {
    console.error(`Error fetching user ${username}:`, error);
    return null;
  }
}
