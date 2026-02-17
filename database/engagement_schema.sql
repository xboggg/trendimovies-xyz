-- ============================================
-- TrendiMovies.xyz Engagement Features Schema
-- Run this on your Supabase database
-- ============================================

-- 1. DAILY POLLS
-- ============================================
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',  -- Array of {id, text, votes}
  is_active BOOLEAN DEFAULT false,
  start_date DATE NOT NULL,
  end_date DATE,
  total_votes INTEGER DEFAULT 0,
  category VARCHAR(50) DEFAULT 'general',  -- movies, tv, general
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track individual votes to prevent duplicate voting
CREATE TABLE IF NOT EXISTS poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_id VARCHAR(50) NOT NULL,
  voter_id VARCHAR(255) NOT NULL,  -- Session ID or fingerprint
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, voter_id)
);

CREATE INDEX IF NOT EXISTS idx_poll_votes_poll ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_polls_active ON polls(is_active, start_date);

-- 2. MOVIE BATTLES
-- ============================================
CREATE TABLE IF NOT EXISTS movie_battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_a_id INTEGER NOT NULL,  -- TMDB ID
  movie_a_title VARCHAR(255) NOT NULL,
  movie_a_poster VARCHAR(500),
  movie_a_votes INTEGER DEFAULT 0,
  movie_b_id INTEGER NOT NULL,
  movie_b_title VARCHAR(255) NOT NULL,
  movie_b_poster VARCHAR(500),
  movie_b_votes INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT false,
  start_date DATE NOT NULL,
  end_date DATE,
  category VARCHAR(50) DEFAULT 'general',  -- action, comedy, classic, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS battle_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id UUID REFERENCES movie_battles(id) ON DELETE CASCADE,
  chosen_movie_id INTEGER NOT NULL,
  voter_id VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(battle_id, voter_id)
);

CREATE INDEX IF NOT EXISTS idx_battle_votes_battle ON battle_votes(battle_id);
CREATE INDEX IF NOT EXISTS idx_battles_active ON movie_battles(is_active, start_date);

-- 3. DAILY TRIVIA
-- ============================================
CREATE TABLE IF NOT EXISTS trivia_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',  -- Array of {id, text}
  correct_option_id VARCHAR(50) NOT NULL,
  hint TEXT,
  explanation TEXT,  -- Shown after answering
  difficulty VARCHAR(20) DEFAULT 'medium',  -- easy, medium, hard
  category VARCHAR(50) DEFAULT 'general',  -- movies, tv, actors, directors
  tmdb_movie_id INTEGER,  -- Related movie if applicable
  tmdb_tv_id INTEGER,
  image_url VARCHAR(500),  -- Screenshot or related image
  is_active BOOLEAN DEFAULT true,
  times_shown INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trivia_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,  -- Browser session
  player_name VARCHAR(100),
  score INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  quiz_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trivia_category ON trivia_questions(category, is_active);
CREATE INDEX IF NOT EXISTS idx_trivia_sessions_date ON trivia_sessions(quiz_date, score DESC);

-- 4. THIS DAY IN MOVIE HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS movie_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_date DATE NOT NULL,  -- Month and day (year in event)
  year INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  event_type VARCHAR(50) DEFAULT 'release',  -- release, award, milestone, birthday
  tmdb_movie_id INTEGER,
  tmdb_tv_id INTEGER,
  tmdb_person_id INTEGER,
  image_url VARCHAR(500),
  source_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_history_date ON movie_history(
  EXTRACT(MONTH FROM event_date),
  EXTRACT(DAY FROM event_date)
);

-- 5. COMMENTS / DISCUSSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(20) NOT NULL,  -- movie, tv, news, general
  content_id VARCHAR(50) NOT NULL,  -- TMDB ID or article slug
  content_title VARCHAR(255),  -- For display purposes
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255),  -- Optional, not displayed
  comment_text TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,  -- For replies
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,  -- For moderation
  is_featured BOOLEAN DEFAULT false,  -- Hot discussions
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  reaction_type VARCHAR(20) NOT NULL,  -- like, dislike
  reactor_id VARCHAR(255) NOT NULL,  -- Session ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, reactor_id)
);

CREATE INDEX IF NOT EXISTS idx_comments_content ON comments(content_type, content_id, is_approved);
CREATE INDEX IF NOT EXISTS idx_comments_featured ON comments(is_featured, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- 6. TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables that need it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_polls_updated_at') THEN
    CREATE TRIGGER update_polls_updated_at
      BEFORE UPDATE ON polls
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_comments_updated_at') THEN
    CREATE TRIGGER update_comments_updated_at
      BEFORE UPDATE ON comments
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- 7. SEED DATA - Sample Poll
-- ============================================
INSERT INTO polls (question, options, is_active, start_date, category)
VALUES (
  'Which 2026 movie are you most excited for?',
  '[
    {"id": "1", "text": "Avatar 3", "votes": 0},
    {"id": "2", "text": "The Batman 2", "votes": 0},
    {"id": "3", "text": "Jurassic World 4", "votes": 0},
    {"id": "4", "text": "Mission: Impossible 8", "votes": 0}
  ]'::jsonb,
  true,
  CURRENT_DATE,
  'movies'
) ON CONFLICT DO NOTHING;

-- 8. SEED DATA - Sample Battle
-- ============================================
INSERT INTO movie_battles (
  movie_a_id, movie_a_title, movie_a_poster,
  movie_b_id, movie_b_title, movie_b_poster,
  is_active, start_date, category
)
VALUES (
  155, 'The Dark Knight', '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  27205, 'Inception', '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
  true,
  CURRENT_DATE,
  'classic'
) ON CONFLICT DO NOTHING;

-- 9. SEED DATA - Sample Trivia Questions
-- ============================================
INSERT INTO trivia_questions (question, options, correct_option_id, explanation, category, difficulty)
VALUES
(
  'Which movie won the Academy Award for Best Picture in 2024?',
  '[
    {"id": "a", "text": "Oppenheimer"},
    {"id": "b", "text": "Barbie"},
    {"id": "c", "text": "Killers of the Flower Moon"},
    {"id": "d", "text": "Poor Things"}
  ]'::jsonb,
  'a',
  'Oppenheimer won 7 Academy Awards including Best Picture and Best Director for Christopher Nolan.',
  'movies',
  'easy'
),
(
  'Who directed "Pulp Fiction"?',
  '[
    {"id": "a", "text": "Martin Scorsese"},
    {"id": "b", "text": "Quentin Tarantino"},
    {"id": "c", "text": "David Fincher"},
    {"id": "d", "text": "Christopher Nolan"}
  ]'::jsonb,
  'b',
  'Quentin Tarantino wrote and directed Pulp Fiction, released in 1994.',
  'directors',
  'easy'
),
(
  'What is the highest-grossing film of all time (not adjusted for inflation)?',
  '[
    {"id": "a", "text": "Avengers: Endgame"},
    {"id": "b", "text": "Avatar"},
    {"id": "c", "text": "Titanic"},
    {"id": "d", "text": "Star Wars: The Force Awakens"}
  ]'::jsonb,
  'b',
  'Avatar (2009) is the highest-grossing film with over $2.9 billion worldwide.',
  'movies',
  'medium'
),
(
  'Which actor has won the most Academy Awards?',
  '[
    {"id": "a", "text": "Meryl Streep"},
    {"id": "b", "text": "Katharine Hepburn"},
    {"id": "c", "text": "Daniel Day-Lewis"},
    {"id": "d", "text": "Jack Nicholson"}
  ]'::jsonb,
  'b',
  'Katharine Hepburn won 4 Best Actress Oscars, more than any other actor.',
  'actors',
  'hard'
),
(
  'In which year was the first "Star Wars" movie released?',
  '[
    {"id": "a", "text": "1975"},
    {"id": "b", "text": "1977"},
    {"id": "c", "text": "1979"},
    {"id": "d", "text": "1980"}
  ]'::jsonb,
  'b',
  'Star Wars: A New Hope was released on May 25, 1977.',
  'movies',
  'easy'
)
ON CONFLICT DO NOTHING;

-- 10. SEED DATA - This Day in History samples
-- ============================================
INSERT INTO movie_history (event_date, year, title, description, event_type, tmdb_movie_id)
VALUES
(
  '2024-02-17',
  2014,
  'The Lego Movie Released',
  'The Lego Movie premiered, becoming a massive hit and spawning a franchise. Everything was awesome!',
  'release',
  137106
),
(
  '2024-02-17',
  1963,
  'Michael Jordan Born',
  'Basketball legend and Space Jam star Michael Jordan was born in Brooklyn, New York.',
  'birthday',
  NULL
),
(
  '2024-02-17',
  2003,
  'Chicago Wins Best Picture',
  'Chicago won the Academy Award for Best Picture at the 75th Academy Awards, the first musical to win since Oliver! in 1968.',
  'award',
  824
)
ON CONFLICT DO NOTHING;

-- 11. ROW LEVEL SECURITY (Optional but recommended)
-- ============================================
-- Enable RLS on tables
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trivia_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trivia_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read polls" ON polls FOR SELECT USING (true);
CREATE POLICY "Public read battles" ON movie_battles FOR SELECT USING (true);
CREATE POLICY "Public read trivia" ON trivia_questions FOR SELECT USING (is_active = true);
CREATE POLICY "Public read history" ON movie_history FOR SELECT USING (true);
CREATE POLICY "Public read comments" ON comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Public read sessions" ON trivia_sessions FOR SELECT USING (true);

-- Allow public insert for votes/comments
CREATE POLICY "Public insert poll_votes" ON poll_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert battle_votes" ON battle_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert trivia_sessions" ON trivia_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert reactions" ON comment_reactions FOR INSERT WITH CHECK (true);

-- Allow public update for trivia sessions (to update score)
CREATE POLICY "Public update trivia_sessions" ON trivia_sessions FOR UPDATE USING (true);

COMMENT ON TABLE polls IS 'Daily polls for user engagement';
COMMENT ON TABLE movie_battles IS 'Movie vs Movie voting battles';
COMMENT ON TABLE trivia_questions IS 'Trivia quiz questions';
COMMENT ON TABLE movie_history IS 'This day in movie history events';
COMMENT ON TABLE comments IS 'User comments on movies/shows/news';
