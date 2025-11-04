-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  profile_picture_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  dates TEXT,
  planned_progress REAL DEFAULT 0.0,
  icon_name TEXT DEFAULT 'map',
  total_distance TEXT,
  total_duration TEXT,
  vacation_wants TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Waypoints table
CREATE TABLE IF NOT EXISTS waypoints (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Attractions table
CREATE TABLE IF NOT EXISTS attractions (
  id TEXT PRIMARY KEY,
  waypoint_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  rating REAL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (waypoint_id) REFERENCES waypoints(id) ON DELETE CASCADE
);

-- Warnings table
CREATE TABLE IF NOT EXISTS warnings (
  id TEXT PRIMARY KEY,
  waypoint_id TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (waypoint_id) REFERENCES waypoints(id) ON DELETE CASCADE
);

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  waypoint_id TEXT,
  attraction_id TEXT,
  provider TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_display_text TEXT NOT NULL,
  action_target TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (waypoint_id) REFERENCES waypoints(id) ON DELETE CASCADE,
  FOREIGN KEY (attraction_id) REFERENCES attractions(id) ON DELETE CASCADE
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id TEXT PRIMARY KEY,
  waypoint_id TEXT NOT NULL,
  name TEXT NOT NULL,
  rating REAL,
  price_per_night REAL,
  action_type TEXT NOT NULL,
  action_display_text TEXT NOT NULL,
  action_target TEXT NOT NULL,
  expert_help_action_type TEXT,
  expert_help_action_display_text TEXT,
  expert_help_action_target TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (waypoint_id) REFERENCES waypoints(id) ON DELETE CASCADE
);

-- Hotel amenities (many-to-many)
CREATE TABLE IF NOT EXISTS hotel_amenities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hotel_id TEXT NOT NULL,
  amenity TEXT NOT NULL,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

-- Trip steps table
CREATE TABLE IF NOT EXISTS trip_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_id TEXT NOT NULL,
  step_text TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_waypoints_trip_id ON waypoints(trip_id);
CREATE INDEX IF NOT EXISTS idx_attractions_waypoint_id ON attractions(waypoint_id);
CREATE INDEX IF NOT EXISTS idx_warnings_waypoint_id ON warnings(waypoint_id);
CREATE INDEX IF NOT EXISTS idx_deals_waypoint_id ON deals(waypoint_id);
CREATE INDEX IF NOT EXISTS idx_hotels_waypoint_id ON hotels(waypoint_id);

