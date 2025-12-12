-- ============================================================================
-- AGI Sourcing Engine - Initial Database Schema
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- CANDIDATES TABLE (Core entity)
-- ============================================================================
CREATE TABLE candidates (
    -- Primary key
    id SERIAL PRIMARY KEY,
    
    -- GitHub identity (unique constraint)
    github_username VARCHAR(100) UNIQUE NOT NULL,
    github_url VARCHAR(500) NOT NULL,
    github_id BIGINT UNIQUE NOT NULL,
    
    -- Profile data
    name VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(500),
    company VARCHAR(255),
    location VARCHAR(255),
    
    -- Contact info (enriched)
    email VARCHAR(255),
    linkedin_url VARCHAR(500),
    twitter_username VARCHAR(100),
    personal_website VARCHAR(500),
    
    -- GitHub stats
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    public_repos_count INTEGER DEFAULT 0,
    github_created_at TIMESTAMPTZ,
    
    -- Computed aggregates
    total_stars INTEGER DEFAULT 0,
    primary_languages TEXT[] DEFAULT '{}',
    modalities TEXT[] DEFAULT '{}',
    
    -- Scoring
    overall_score DECIMAL(5,4) DEFAULT 0.0,
    score_algorithm_version VARCHAR(20) DEFAULT 'v1.0',
    manual_score_adjustment DECIMAL(3,2) DEFAULT 0.0,
    score_explanation JSONB,
    
    -- Enrichment metadata
    enrichment_confidence DECIMAL(3,2),
    enrichment_source VARCHAR(50),
    last_enriched_at TIMESTAMPTZ,
    
    -- Sourcing metadata
    discovered_in_queries JSONB DEFAULT '{}',
    first_discovered_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Outreach tracking
    outreach_status VARCHAR(50) DEFAULT 'not_contacted',
    last_contacted_at TIMESTAMPTZ,
    outreach_channel VARCHAR(50),
    outreach_notes TEXT,
    
    -- User annotations
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    is_archived BOOLEAN DEFAULT FALSE,
    
    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(github_username, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(bio, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(company, '')), 'C')
    ) STORED,
    
    -- Constraints
    CONSTRAINT valid_score CHECK (overall_score >= 0.0 AND overall_score <= 1.0),
    CONSTRAINT valid_manual_adjustment CHECK (
        manual_score_adjustment >= -0.50 AND manual_score_adjustment <= 0.50
    ),
    CONSTRAINT valid_enrichment_confidence CHECK (
        enrichment_confidence IS NULL OR 
        (enrichment_confidence >= 0.0 AND enrichment_confidence <= 1.0)
    ),
    CONSTRAINT valid_outreach_status CHECK (
        outreach_status IN ('not_contacted', 'reached_out', 'responded', 
                           'not_interested', 'interviewing', 'hired')
    )
);

-- Indexes for candidates
CREATE INDEX idx_candidates_username ON candidates(github_username);
CREATE INDEX idx_candidates_score ON candidates(overall_score DESC) WHERE is_archived = FALSE;
CREATE INDEX idx_candidates_modalities ON candidates USING GIN(modalities);
CREATE INDEX idx_candidates_tags ON candidates USING GIN(tags);
CREATE INDEX idx_candidates_discovered ON candidates(first_discovered_at DESC);
CREATE INDEX idx_candidates_search ON candidates USING GIN(search_vector);
CREATE INDEX idx_candidates_outreach ON candidates(outreach_status) WHERE outreach_status != 'not_contacted';
CREATE INDEX idx_candidates_github_id ON candidates(github_id);

-- ============================================================================
-- REPOSITORIES TABLE (Nested under candidates)
-- ============================================================================
CREATE TABLE repositories (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    
    -- GitHub data
    github_repo_id BIGINT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    full_name VARCHAR(500) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    
    -- Stats
    stargazer_count INTEGER DEFAULT 0,
    fork_count INTEGER DEFAULT 0,
    watchers_count INTEGER DEFAULT 0,
    
    -- Technical metadata
    primary_language VARCHAR(100),
    languages TEXT[] DEFAULT '{}',
    topics TEXT[] DEFAULT '{}',
    
    -- Activity
    created_at TIMESTAMPTZ,
    pushed_at TIMESTAMPTZ,
    is_fork BOOLEAN DEFAULT FALSE,
    
    -- Computed
    repo_category VARCHAR(50),
    relevance_score DECIMAL(5,4) DEFAULT 0.0,
    
    -- Metadata
    added_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_relevance_score CHECK (
        relevance_score >= 0.0 AND relevance_score <= 1.0
    )
);

-- Indexes for repositories
CREATE INDEX idx_repos_candidate ON repositories(candidate_id);
CREATE INDEX idx_repos_stars ON repositories(stargazer_count DESC);
CREATE INDEX idx_repos_topics ON repositories USING GIN(topics);
CREATE INDEX idx_repos_languages ON repositories USING GIN(languages);
CREATE INDEX idx_repos_pushed ON repositories(pushed_at DESC);
CREATE INDEX idx_repos_github_id ON repositories(github_repo_id);

-- ============================================================================
-- SAVED_SEARCHES TABLE (User's search templates)
-- ============================================================================
CREATE TABLE saved_searches (
    id SERIAL PRIMARY KEY,
    
    name VARCHAR(255) NOT NULL,
    modality VARCHAR(50) NOT NULL,
    keywords TEXT[] NOT NULL,
    filters JSONB DEFAULT '{}',
    
    -- Execution metadata
    last_run_at TIMESTAMPTZ,
    run_count INTEGER DEFAULT 0,
    avg_results_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_searches_modality ON saved_searches(modality);

-- ============================================================================
-- SEARCH_HISTORY TABLE (Track all searches for analytics)
-- ============================================================================
CREATE TABLE search_history (
    id SERIAL PRIMARY KEY,
    saved_search_id INTEGER REFERENCES saved_searches(id) ON DELETE SET NULL,
    
    query_string TEXT NOT NULL,
    modality VARCHAR(50),
    keywords TEXT[] NOT NULL,
    filters JSONB DEFAULT '{}',
    
    -- Results
    results_count INTEGER DEFAULT 0,
    avg_score DECIMAL(5,4),
    execution_time_ms INTEGER,
    
    executed_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_avg_score CHECK (
        avg_score IS NULL OR (avg_score >= 0.0 AND avg_score <= 1.0)
    )
);

CREATE INDEX idx_search_history_executed ON search_history(executed_at DESC);
CREATE INDEX idx_search_history_modality ON search_history(modality);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Auto-update last_updated_at on candidates table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_candidates_updated_at
    BEFORE UPDATE ON candidates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on saved_searches table
CREATE TRIGGER update_saved_searches_updated_at
    BEFORE UPDATE ON saved_searches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert modality definitions (for reference/documentation)
COMMENT ON COLUMN candidates.modalities IS 'Possible values: RL_GYM, CODE_AGENT, EVAL_INFRA, PROMPT_ENGINEERING, FINETUNING, INFERENCE_OPT, DATASET_CURATION';
