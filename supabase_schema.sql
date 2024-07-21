-- Create the categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create the games table
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    release_date DATE,
    rating DECIMAL(3, 2),
    is_featured BOOLEAN DEFAULT false,
    is_most_popular BOOLEAN DEFAULT false,
    is_top_rated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a junction table for games and categories
CREATE TABLE game_categories (
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, category_id)
);

-- Create indexes for faster querying
CREATE INDEX idx_games_is_featured ON games(is_featured) WHERE is_featured = true;
CREATE INDEX idx_games_is_most_popular ON games(is_most_popular) WHERE is_most_popular = true;
CREATE INDEX idx_games_is_top_rated ON games(is_top_rated) WHERE is_top_rated = true;
CREATE INDEX idx_games_release_date ON games(release_date DESC);
CREATE INDEX idx_games_rating ON games(rating DESC);

-- Create a view for featured games
CREATE VIEW featured_games AS
SELECT * FROM games WHERE is_featured = true;

-- Create a view for most popular games
CREATE VIEW most_popular_games AS
SELECT * FROM games WHERE is_most_popular = true;

-- Create a view for top rated games
CREATE VIEW top_rated_games AS
SELECT * FROM games WHERE is_top_rated = true;

-- Create a view for latest games
CREATE VIEW latest_games AS
SELECT * FROM games ORDER BY release_date DESC LIMIT 10;

-- Create a function to get games by category
CREATE OR REPLACE FUNCTION get_games_by_category(category_name TEXT)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    description TEXT,
    image_url TEXT,
    release_date DATE,
    rating DECIMAL(3, 2),
    is_featured BOOLEAN,
    is_most_popular BOOLEAN,
    is_top_rated BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT g.*
    FROM games g
    JOIN game_categories gc ON g.id = gc.game_id
    JOIN categories c ON gc.category_id = c.id
    WHERE c.name = category_name;
END;
$$ LANGUAGE plpgsql;
