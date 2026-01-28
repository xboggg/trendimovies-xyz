-- Seed data for TrendiMovies
-- Run this on the Supabase database to populate franchises and curated lists

-- Insert franchises (TMDB Collection IDs)
INSERT INTO franchises (name, slug, tmdb_collection_id, description) VALUES
('Marvel Cinematic Universe', 'marvel-cinematic-universe', 131295, 'The interconnected superhero franchise from Marvel Studios featuring Iron Man, Captain America, Thor, and more.'),
('Star Wars', 'star-wars', 10, 'The epic space opera saga created by George Lucas, spanning the Skywalker saga and beyond.'),
('Harry Potter', 'harry-potter', 1241, 'The magical wizarding world based on J.K. Rowling''s beloved book series.'),
('The Lord of the Rings', 'lord-of-the-rings', 119, 'Peter Jackson''s epic fantasy trilogy based on J.R.R. Tolkien''s classic novels.'),
('Fast & Furious', 'fast-and-furious', 9485, 'High-octane action franchise featuring street racing and heists.'),
('Jurassic Park', 'jurassic-park', 328, 'The dinosaur adventure franchise that brought prehistoric creatures to life.'),
('Pirates of the Caribbean', 'pirates-of-the-caribbean', 295, 'Swashbuckling adventures on the high seas with Captain Jack Sparrow.'),
('The Dark Knight Trilogy', 'dark-knight-trilogy', 263, 'Christopher Nolan''s gritty Batman trilogy.'),
('James Bond', 'james-bond', 645, 'The iconic British spy franchise spanning decades.'),
('Mission: Impossible', 'mission-impossible', 87359, 'Tom Cruise''s action-packed spy franchise.'),
('Transformers', 'transformers', 8650, 'Giant robots from Cybertron battle on Earth.'),
('X-Men', 'x-men', 748, 'Marvel''s mutant superhero team.'),
('Spider-Man (MCU)', 'spider-man-mcu', 531241, 'Tom Holland''s Spider-Man adventures in the MCU.'),
('Planet of the Apes', 'planet-of-the-apes', 173710, 'The rebooted ape civilization saga.'),
('John Wick', 'john-wick', 404609, 'Keanu Reeves as the legendary assassin.'),
('The Matrix', 'matrix', 2344, 'The groundbreaking sci-fi franchise about reality and machines.'),
('Toy Story', 'toy-story', 10194, 'Pixar''s beloved animated franchise about toys that come to life.'),
('Shrek', 'shrek', 2150, 'DreamWorks'' irreverent fairy tale franchise.'),
('How to Train Your Dragon', 'how-to-train-your-dragon', 89137, 'The Viking and dragon friendship saga.'),
('Despicable Me', 'despicable-me', 86066, 'Gru and the Minions animated franchise.')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tmdb_collection_id = EXCLUDED.tmdb_collection_id,
  description = EXCLUDED.description;

-- Insert curated lists
INSERT INTO curated_lists (title, slug, description, list_type, year, display_order) VALUES
-- Best Of Year
('Best Movies of 2024', 'best-movies-2024', 'Our picks for the best films released in 2024.', 'best-of', 2024, 1),
('Best Movies of 2023', 'best-movies-2023', 'The top films that defined 2023.', 'best-of', 2023, 2),
('Best Movies of 2022', 'best-movies-2022', 'Outstanding films from 2022.', 'best-of', 2022, 3),
('Best Horror Movies of 2024', 'best-horror-2024', 'The scariest films of 2024.', 'best-of', 2024, 4),
('Best Action Movies of 2024', 'best-action-2024', 'The most thrilling action films of 2024.', 'best-of', 2024, 5),
('Best Comedy Movies of 2024', 'best-comedy-2024', 'The funniest films of 2024.', 'best-of', 2024, 6),

-- Award Winners
('Oscar Winners - Best Picture', 'oscar-best-picture', 'All Academy Award winners for Best Picture.', 'awards', NULL, 10),
('Golden Globe Winners', 'golden-globe-winners', 'Golden Globe Award winning films.', 'awards', NULL, 11),

-- Recommendations
('Movies Like Inception', 'movies-like-inception', 'Mind-bending films similar to Christopher Nolan''s Inception.', 'recommendations', NULL, 20),
('Movies Like The Shawshank Redemption', 'movies-like-shawshank', 'Inspiring prison and redemption dramas.', 'recommendations', NULL, 21),
('Movies Like Interstellar', 'movies-like-interstellar', 'Epic sci-fi adventures exploring space and time.', 'recommendations', NULL, 22),
('Hidden Gems on Netflix', 'hidden-gems-netflix', 'Underrated movies worth watching on Netflix.', 'recommendations', NULL, 23),
('Best Movies to Watch Alone', 'best-movies-watch-alone', 'Perfect films for a solo movie night.', 'recommendations', NULL, 24)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  list_type = EXCLUDED.list_type,
  year = EXCLUDED.year,
  display_order = EXCLUDED.display_order;

-- Verify inserts
SELECT 'Franchises inserted:' as info, COUNT(*) as count FROM franchises;
SELECT 'Curated lists inserted:' as info, COUNT(*) as count FROM curated_lists;
