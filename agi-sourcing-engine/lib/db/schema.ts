import { Modality, OutreachStatus } from '../constants';

export interface Candidate {
  id: number;
  github_username: string;
  github_url: string;
  github_id: number;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  linkedin_url: string | null;
  twitter_username: string | null;
  personal_website: string | null;
  followers_count: number;
  following_count: number;
  public_repos_count: number;
  github_created_at: string | null;
  total_stars: number;
  primary_languages: string[];
  modalities: Modality[];
  overall_score: number;
  score_algorithm_version: string;
  manual_score_adjustment: number;
  score_explanation: ScoreExplanation | null;
  enrichment_confidence: number | null;
  enrichment_source: string | null;
  last_enriched_at: string | null;
  discovered_in_queries: Record<string, QueryDiscovery>;
  first_discovered_at: string;
  last_updated_at: string;
  outreach_status: OutreachStatus;
  last_contacted_at: string | null;
  outreach_channel: string | null;
  outreach_notes: string | null;
  tags: string[];
  notes: string | null;
  is_archived: boolean;
}

export interface Repository {
  id: number;
  candidate_id: number;
  github_repo_id: number;
  name: string;
  full_name: string;
  description: string | null;
  url: string;
  stargazer_count: number;
  fork_count: number;
  watchers_count: number;
  primary_language: string | null;
  languages: string[];
  topics: string[];
  created_at: string | null;
  pushed_at: string | null;
  is_fork: boolean;
  repo_category: string | null;
  relevance_score: number;
  added_at: string;
}

export interface SavedSearch {
  id: number;
  name: string;
  modality: Modality;
  keywords: string[];
  filters: SearchFilters;
  last_run_at: string | null;
  run_count: number;
  avg_results_count: number;
  created_at: string;
  updated_at: string;
}

export interface SearchHistory {
  id: number;
  saved_search_id: number | null;
  query_string: string;
  modality: Modality | null;
  keywords: string[];
  filters: SearchFilters;
  results_count: number;
  avg_score: number | null;
  execution_time_ms: number | null;
  executed_at: string;
}

export interface SearchFilters {
  language?: string;
  location?: string;
  min_stars?: number;
  min_followers?: number;
}

export interface ScoreExplanation {
  signal_count: number;
  top_signals: Signal[];
  keyword_match_score: number;
  star_score: number;
  activity_score: number;
  final_score: number;
  matched_keywords: string[];
  matched_repos: string[];
}

export interface Signal {
  type: string;
  value: string;
  contribution: number;
}

export interface QueryDiscovery {
  score: number;
  date: string;
  search_id: number;
}

// API Request/Response types
export interface SearchRequest {
  keywords: string[];
  modality: Modality;
  filters?: SearchFilters;
  max_results?: number;
}

export interface SearchResponse {
  candidates: CandidateWithRepos[];
  total: number;
  execution_time_ms: number;
  search_id: number;
}

export interface CandidateWithRepos extends Candidate {
  repositories: Repository[];
}

export interface CandidateListItem {
  id: number;
  github_username: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  overall_score: number;
  modalities: Modality[];
  total_stars: number;
  tags: string[];
  outreach_status: OutreachStatus;
  primary_languages: string[];
}

// Database insert types (without auto-generated fields)
export type CandidateInsert = Omit<
  Candidate,
  'id' | 'first_discovered_at' | 'last_updated_at'
>;

export type RepositoryInsert = Omit<Repository, 'id' | 'added_at'>;

export type SavedSearchInsert = Omit<
  SavedSearch,
  'id' | 'created_at' | 'updated_at' | 'last_run_at' | 'run_count' | 'avg_results_count'
>;
