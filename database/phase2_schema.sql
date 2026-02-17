-- ============================================
-- TrendiMovies.xyz Phase 2 Schema
-- Newsletter Subscribers & User Ratings
-- Run this on your Supabase database
-- ============================================

-- 1. NEWSLETTER SUBSCRIBERS
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  preferences JSONB DEFAULT '{"movies": true, "tvShows": true, "trivia": false}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  ip_address VARCHAR(45),
  user_agent TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  reactivated_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active) WHERE is_active = true;

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_newsletter_updated_at') THEN
    CREATE TRIGGER update_newsletter_updated_at
      BEFORE UPDATE ON newsletter_subscribers
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- 2. USER RATINGS
-- ============================================
CREATE TABLE IF NOT EXISTS user_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(20) NOT NULL,  -- movie, tv
  content_id VARCHAR(50) NOT NULL,  -- TMDB ID
  content_title VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  voter_id VARCHAR(255) NOT NULL,  -- UUID from localStorage
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_type, content_id, voter_id)
);

CREATE INDEX IF NOT EXISTS idx_ratings_content ON user_ratings(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_ratings_voter ON user_ratings(voter_id);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ratings_updated_at') THEN
    CREATE TRIGGER update_ratings_updated_at
      BEFORE UPDATE ON user_ratings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- 3. ROW LEVEL SECURITY
-- ============================================
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ratings ENABLE ROW LEVEL SECURITY;

-- Newsletter: only insert allowed publicly
CREATE POLICY "Public insert newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Ratings: public read and insert
CREATE POLICY "Public read ratings" ON user_ratings
  FOR SELECT USING (true);
CREATE POLICY "Public insert ratings" ON user_ratings
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update own ratings" ON user_ratings
  FOR UPDATE USING (true);

-- 4. AGGREGATED RATINGS VIEW (for performance)
-- ============================================
CREATE OR REPLACE VIEW content_ratings_summary AS
SELECT
  content_type,
  content_id,
  content_title,
  COUNT(*) as total_ratings,
  AVG(rating)::NUMERIC(3,1) as average_rating,
  MIN(rating) as min_rating,
  MAX(rating) as max_rating,
  jsonb_object_agg(
    rating::text,
    rating_count
  ) as distribution
FROM (
  SELECT
    content_type,
    content_id,
    MAX(content_title) as content_title,
    rating,
    COUNT(*) as rating_count
  FROM user_ratings
  GROUP BY content_type, content_id, rating
) sub
GROUP BY content_type, content_id, content_title;

-- 5. COMMENTS TABLE
-- ============================================
COMMENT ON TABLE newsletter_subscribers IS 'Email newsletter subscribers';
COMMENT ON TABLE user_ratings IS 'User ratings for movies and TV shows';
COMMENT ON VIEW content_ratings_summary IS 'Aggregated ratings by content';

-- 6. SAMPLE DATA FOR TESTING (Optional)
-- ============================================
-- Uncomment to add test data:
/*
INSERT INTO newsletter_subscribers (email, name, preferences)
VALUES
  ('test@example.com', 'Test User', '{"movies": true, "tvShows": true, "trivia": true}')
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_ratings (content_type, content_id, content_title, rating, voter_id)
VALUES
  ('movie', '155', 'The Dark Knight', 9, 'test-voter-1'),
  ('movie', '155', 'The Dark Knight', 10, 'test-voter-2'),
  ('movie', '155', 'The Dark Knight', 8, 'test-voter-3'),
  ('movie', '27205', 'Inception', 9, 'test-voter-1'),
  ('movie', '27205', 'Inception', 10, 'test-voter-2')
ON CONFLICT (content_type, content_id, voter_id) DO NOTHING;
*/
