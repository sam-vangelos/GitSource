import type { SearchFilters } from '../db/schema';

export function buildSearchQuery(
  keywords: string[],
  filters?: SearchFilters
): string {
  const parts: string[] = [];

  // Add keywords (OR'd together)
  if (keywords.length > 0) {
    const keywordString = keywords
      .map(k => k.trim())
      .filter(k => k.length > 0)
      .join(' OR ');
    
    if (keywordString) {
      parts.push(`(${keywordString})`);
    }
  }

  // Add language filter
  if (filters?.language) {
    parts.push(`language:${filters.language}`);
  }

  // Add location filter
  if (filters?.location) {
    parts.push(`location:"${filters.location}"`);
  }

  // Add minimum stars filter
  if (filters?.min_stars !== undefined && filters.min_stars > 0) {
    parts.push(`stars:>${filters.min_stars}`);
  }

  // Add minimum followers filter
  if (filters?.min_followers !== undefined && filters.min_followers > 0) {
    parts.push(`followers:>${filters.min_followers}`);
  }

  return parts.join(' ');
}

export const SEARCH_USERS_QUERY = `
query SearchUsers($query: String!, $first: Int!, $after: String) {
  search(type: USER, query: $query, first: $first, after: $after) {
    userCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ... on User {
        __typename
        login
        name
        bio
        avatarUrl
        url
        email
        twitterUsername
        websiteUrl
        company
        location
        followers {
          totalCount
        }
        following {
          totalCount
        }
        repositories(first: 1) {
          totalCount
        }
        createdAt
        id
        databaseId
        repositoryList: repositories(first: 20, orderBy: {field: STARGAZERS, direction: DESC}) {
          nodes {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
            }
            languages(first: 5) {
              nodes {
                name
              }
            }
            repositoryTopics(first: 10) {
              nodes {
                topic {
                  name
                }
              }
            }
            createdAt
            pushedAt
            isFork
            id
            databaseId
          }
        }
      }
    }
  }
  rateLimit {
    limit
    remaining
    resetAt
    cost
  }
}
`;

export const RATE_LIMIT_QUERY = `
query {
  rateLimit {
    limit
    remaining
    resetAt
    cost
  }
}
`;
