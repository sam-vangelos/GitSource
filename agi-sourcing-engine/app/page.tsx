'use client';

import { useState } from 'react';
import { PageShell, Button, Card, Tag } from '@/components/hedra-primitives';
import { Input } from '@/components/ui/input';
import { MODALITIES, MODALITY_LABELS, type Modality } from '@/lib/constants';
import { formatNumber } from '@/lib/utils';

interface SearchResult {
  id?: number;
  github_username: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  url: string;
  overall_score: number;
  total_stars: number;
  modalities: Modality[];
  primary_languages: string[];
  score_explanation: any;
  top_repos: Array<{
    name: string;
    url: string;
    stars: number;
    topics: string[];
  }>;
}

interface SearchResponse {
  candidates: SearchResult[];
  total: number;
  execution_time_ms: number;
  avg_score: number;
}

export default function Home() {
  const [keywords, setKeywords] = useState('');
  const [modality, setModality] = useState<Modality>('RL_GYM');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!keywords.trim()) {
      setError('Please enter at least one keyword');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
          modality,
          max_results: 50,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Search failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreVariant = (score: number): "success" | "primary" | "warning" | "neutral" => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'primary';
    if (score >= 0.4) return 'warning';
    return 'neutral';
  };

  return (
    <PageShell
      title="AGI Talent Sourcing Engine"
      subtitle="Find deeply technical GitHub talent for frontier AI roles"
    >
      <div className="max-w-7xl mx-auto px-6 pb-16 animate-emerge-from-smoke">
        {/* Search Form */}
        <Card variant="unified" className="p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3 text-white/90">
                Keywords
              </label>
              <Input
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                placeholder="PPO, gymnasium, reward modeling..."
                onKeyDown={e => e.key === 'Enter' && !isLoading && handleSearch()}
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#E17B7B] focus:ring-[#E17B7B]/50"
              />
              <p className="text-xs text-white/50 mt-2">
                Separate multiple keywords with commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-white/90">
                Modality
              </label>
              <select
                value={modality}
                onChange={e => setModality(e.target.value as Modality)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E17B7B]/50 focus:border-[#E17B7B] backdrop-blur-xl"
                disabled={isLoading}
              >
                {MODALITIES.map(mod => (
                  <option key={mod} value={mod} className="bg-[#2a2a2a] text-white">
                    {MODALITY_LABELS[mod]}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleSearch}
              disabled={isLoading || !keywords.trim()}
              variant="primary"
              size="primary"
              className="w-full"
              loading={isLoading}
            >
              {isLoading ? 'Searching GitHub...' : 'Search Candidates'}
            </Button>

            {error && (
              <div className="text-sm text-red-300 bg-red-600/10 border border-red-600/20 rounded-xl p-4 backdrop-blur-xl">
                {error}
              </div>
            )}
          </div>
        </Card>

        {/* Results */}
        {results && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">
                  <span className="font-semibold">{results.total}</span> candidates found in{' '}
                  <span className="font-semibold">{(results.execution_time_ms / 1000).toFixed(1)}s</span>
                </p>
                <p className="text-white/50 text-xs mt-1">
                  Average score: {results.avg_score.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {results.candidates.map(candidate => (
                <Card
                  key={candidate.github_username}
                  variant="candidate"
                  className="p-6 hover:scale-[1.002] transition-all"
                >
                  <div className="flex items-start gap-5">
                    {/* Avatar */}
                    {candidate.avatar_url && (
                      <img
                        src={candidate.avatar_url}
                        alt={candidate.github_username}
                        className="w-20 h-20 rounded-full ring-2 ring-white/10 flex-shrink-0"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <a
                            href={candidate.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl font-medium text-white hover:text-[#E17B7B] transition-colors"
                          >
                            {candidate.name || candidate.github_username}
                          </a>
                          <p className="text-sm text-white/60 mt-1">
                            @{candidate.github_username} · {formatNumber(candidate.total_stars)} ⭐
                          </p>
                        </div>
                        <Tag
                          variant={getScoreVariant(candidate.overall_score)}
                          size="md"
                          className="flex-shrink-0"
                        >
                          {candidate.overall_score.toFixed(2)}
                        </Tag>
                      </div>

                      {/* Bio */}
                      {candidate.bio && (
                        <p className="text-sm text-white/70 mb-4 line-clamp-2">
                          {candidate.bio}
                        </p>
                      )}

                      {/* Languages */}
                      {candidate.primary_languages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {candidate.primary_languages.map(lang => (
                            <Tag key={lang} variant="neutral" size="sm">
                              {lang}
                            </Tag>
                          ))}
                        </div>
                      )}

                      {/* Top Repos */}
                      {candidate.top_repos.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-white/50 uppercase tracking-wide">
                            Top Repositories
                          </p>
                          {candidate.top_repos.slice(0, 3).map(repo => (
                            <div
                              key={repo.url}
                              className="text-sm bg-white/5 rounded-lg p-3 backdrop-blur-xl border border-white/5"
                            >
                              <a
                                href={repo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-[#E17B7B] hover:text-[#E88B8B] transition-colors"
                              >
                                {repo.name}
                              </a>
                              <span className="text-white/50 ml-2">
                                {formatNumber(repo.stars)} ⭐
                              </span>
                              {repo.topics.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {repo.topics.slice(0, 4).map(topic => (
                                    <span
                                      key={topic}
                                      className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {results.candidates.length === 0 && (
              <Card variant="unified" className="p-12 text-center">
                <p className="text-white/60 text-lg">
                  No candidates found matching your criteria.
                </p>
                <p className="text-white/40 text-sm mt-2">
                  Try different keywords or adjust your filters.
                </p>
              </Card>
            )}
          </div>
        )}

        {!results && !isLoading && (
          <Card variant="unified" className="p-12 text-center">
            <p className="text-white/60 text-lg">
              Enter keywords and select a modality to start searching
            </p>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
