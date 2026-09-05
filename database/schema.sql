-- Run with: npm run db:migrate
CREATE TABLE IF NOT EXISTS viewers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Film lover',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS watchlist (
  viewer_id TEXT NOT NULL REFERENCES viewers(id) ON DELETE CASCADE,
  film_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (viewer_id, film_id)
);
CREATE TABLE IF NOT EXISTS progress (
  viewer_id TEXT NOT NULL REFERENCES viewers(id) ON DELETE CASCADE,
  film_id TEXT NOT NULL,
  seconds REAL NOT NULL DEFAULT 0 CHECK (seconds >= 0),
  duration REAL NOT NULL DEFAULT 0 CHECK (duration >= 0),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (viewer_id, film_id)
);
CREATE TABLE IF NOT EXISTS support_requests (
  id TEXT PRIMARY KEY,
  viewer_id TEXT NOT NULL REFERENCES viewers(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'saved',
  created_at TEXT NOT NULL
);
