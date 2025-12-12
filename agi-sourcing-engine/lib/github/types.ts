export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  url: string;
  email: string | null;
  twitterUsername: string | null;
  websiteUrl: string | null;
  company: string | null;
  location: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
  id: number;
  repositories: GitHubRepo[];
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: string | null;
  languages: string[];
  topics: string[];
  createdAt: string;
  pushedAt: string;
  isFork: boolean;
  id: number;
}

export interface GitHubSearchResponse {
  data: {
    search: {
      userCount: number;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes: Array<{
        __typename: string;
        login: string;
        name: string | null;
        bio: string | null;
        avatarUrl: string;
        url: string;
        email: string | null;
        twitterUsername: string | null;
        websiteUrl: string | null;
        company: string | null;
        location: string | null;
        followers: {
          totalCount: number;
        };
        following: {
          totalCount: number;
        };
        repositories: {
          totalCount: number;
        };
        createdAt: string;
        id: string;
        repositoryList: {
          nodes: Array<{
            name: string;
            description: string | null;
            url: string;
            stargazerCount: number;
            forkCount: number;
            primaryLanguage: {
              name: string;
            } | null;
            languages: {
              nodes: Array<{
                name: string;
              }>;
            };
            repositoryTopics: {
              nodes: Array<{
                topic: {
                  name: string;
                };
              }>;
            };
            createdAt: string;
            pushedAt: string;
            isFork: boolean;
            id: string;
          }>;
        };
      }>;
    };
  };
}

export interface RateLimit {
  limit: number;
  remaining: number;
  resetAt: Date;
  cost: number;
}
