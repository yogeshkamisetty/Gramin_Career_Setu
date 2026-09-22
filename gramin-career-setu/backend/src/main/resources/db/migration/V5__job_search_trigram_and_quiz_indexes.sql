-- ==============================================================================
-- Gramin Career Setu: Performance Optimization & Search Indexing
-- Flyway Migration: V5__job_search_trigram_and_quiz_indexes.sql
-- ==============================================================================

-- 1. Enable PostgreSQL Trigram Extension for fast substring/wildcard searches
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Create Trigram GIN index across job search columns to eliminate sequential table scans on LIKE '%query%'
CREATE INDEX IF NOT EXISTS idx_jobs_search_trgm_gin ON jobs USING gin (
    (title_en || ' ' || title_te || ' ' || COALESCE(qualification, '') || ' ' || COALESCE(company, '')) gin_trgm_ops
);

-- 3. Composite index for user quiz attempts retrieval ordered by creation date
CREATE INDEX IF NOT EXISTS idx_quiz_user_created ON quiz_attempts(user_id, created_at DESC);

-- 4. Composite index for user resume retrieval ordered by update date
CREATE INDEX IF NOT EXISTS idx_resumes_user_updated ON resumes(user_id, updated_at DESC);
