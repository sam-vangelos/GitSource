import { getSupabaseAdmin } from './client';
import type { Modality } from '../constants';
import type {
  Candidate,
  CandidateInsert,
  CandidateWithRepos,
  RepositoryInsert,
  SearchHistory,
} from './schema';

const supabaseAdmin = getSupabaseAdmin();

// ============================================================================
// CANDIDATE QUERIES
// ============================================================================

export async function upsertCandidate(
  candidateData: Partial<CandidateInsert> & { github_username: string; github_id: number },
  repositories: RepositoryInsert[]
): Promise<Candidate> {
  // Check if candidate exists
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('candidates')
    .select('id, modalities, discovered_in_queries')
    .eq('github_username', candidateData.github_username)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 is "not found" error
    throw new Error(`Failed to check existing candidate: ${fetchError.message}`);
  }

  let candidateId: number;

  if (existing) {
    // UPDATE existing candidate
    const mergedModalities = Array.from(
      new Set([...(existing.modalities || []), ...(candidateData.modalities || [])])
    );

    const { error: updateError } = await supabaseAdmin
      .from('candidates')
      .update({
        ...candidateData,
        modalities: mergedModalities,
        last_updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update candidate: ${updateError.message}`);
    }

    candidateId = existing.id;
  } else {
    // INSERT new candidate
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('candidates')
      .insert(candidateData)
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to insert candidate: ${insertError.message}`);
    }

    candidateId = inserted.id;
  }

  // Upsert repositories
  if (repositories.length > 0) {
    const reposWithCandidateId = repositories.map(repo => ({
      ...repo,
      candidate_id: candidateId,
    }));

    // Delete existing repos and insert new ones (simpler than complex upsert)
    await supabaseAdmin.from('repositories').delete().eq('candidate_id', candidateId);

    const { error: repoError } = await supabaseAdmin
      .from('repositories')
      .insert(reposWithCandidateId);

    if (repoError) {
      console.error('Failed to insert repositories:', repoError);
    }
  }

  // Fetch and return the complete candidate
  const { data: candidate, error } = await supabaseAdmin
    .from('candidates')
    .select('*')
    .eq('id', candidateId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch candidate: ${error.message}`);
  }

  return candidate;
}

export async function getCandidateById(id: number): Promise<CandidateWithRepos | null> {
  const { data: candidate, error: candidateError } = await supabaseAdmin
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single();

  if (candidateError) {
    if (candidateError.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch candidate: ${candidateError.message}`);
  }

  const { data: repositories, error: reposError } = await supabaseAdmin
    .from('repositories')
    .select('*')
    .eq('candidate_id', id)
    .order('stargazer_count', { ascending: false });

  if (reposError) {
    console.error('Failed to fetch repositories:', reposError);
  }

  return {
    ...candidate,
    repositories: repositories || [],
  };
}

export async function getCandidateByUsername(
  username: string
): Promise<Candidate | null> {
  const { data, error } = await supabaseAdmin
    .from('candidates')
    .select('*')
    .eq('github_username', username)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch candidate: ${error.message}`);
  }

  return data;
}

export async function listCandidates(filters?: {
  modality?: Modality;
  min_score?: number;
  tags?: string[];
  outreach_status?: string;
  search_text?: string;
  limit?: number;
  offset?: number;
}): Promise<{ candidates: Candidate[]; total: number }> {
  let query = supabaseAdmin.from('candidates').select('*', { count: 'exact' });

  // Apply filters
  if (filters?.modality) {
    query = query.contains('modalities', [filters.modality]);
  }

  if (filters?.min_score !== undefined) {
    query = query.gte('overall_score', filters.min_score);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags);
  }

  if (filters?.outreach_status) {
    query = query.eq('outreach_status', filters.outreach_status);
  }

  if (filters?.search_text) {
    query = query.textSearch('search_vector', filters.search_text);
  }

  // Don't show archived by default
  query = query.eq('is_archived', false);

  // Sorting and pagination
  query = query.order('overall_score', { ascending: false });

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit || 50) - 1
    );
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to list candidates: ${error.message}`);
  }

  return {
    candidates: data || [],
    total: count || 0,
  };
}

export async function updateCandidateTags(
  candidateId: number,
  tags: string[]
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('candidates')
    .update({ tags })
    .eq('id', candidateId);

  if (error) {
    throw new Error(`Failed to update tags: ${error.message}`);
  }
}

export async function updateCandidateOutreachStatus(
  candidateId: number,
  status: string,
  notes?: string
): Promise<void> {
  const updateData: Record<string, string | undefined> = {
    outreach_status: status,
  };

  if (status !== 'not_contacted') {
    updateData.last_contacted_at = new Date().toISOString();
  }

  if (notes !== undefined) {
    updateData.outreach_notes = notes;
  }

  const { error } = await supabaseAdmin
    .from('candidates')
    .update(updateData)
    .eq('id', candidateId);

  if (error) {
    throw new Error(`Failed to update outreach status: ${error.message}`);
  }
}

export async function updateCandidateNotes(
  candidateId: number,
  notes: string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('candidates')
    .update({ notes })
    .eq('id', candidateId);

  if (error) {
    throw new Error(`Failed to update notes: ${error.message}`);
  }
}

// ============================================================================
// SEARCH HISTORY QUERIES
// ============================================================================

export async function logSearchHistory(searchData: {
  query_string: string;
  modality: Modality | null;
  keywords: string[];
  filters: Record<string, unknown>;
  results_count: number;
  avg_score: number | null;
  execution_time_ms: number;
}): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('search_history')
    .insert(searchData)
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to log search history: ${error.message}`);
  }

  return data.id;
}

export async function getRecentSearches(limit: number = 10): Promise<SearchHistory[]> {
  const { data, error } = await supabaseAdmin
    .from('search_history')
    .select('*')
    .order('executed_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch search history: ${error.message}`);
  }

  return data || [];
}
