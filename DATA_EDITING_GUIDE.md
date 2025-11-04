# Data Editing Guide

This guide explains how to edit the data used by the Car Trip Planner application. Data can be modified through several methods depending on your needs.

## 📋 Table of Contents

1. [Database Direct Editing](#database-direct-editing)
2. [Editing Trip Generation Data](#editing-trip-generation-data)
3. [API-Based Editing](#api-based-editing)
4. [Sample Profiles Data](#sample-profiles-data)
5. [Database Schema Reference](#database-schema-reference)

## 🗄️ Database Direct Editing

The application uses SQLite database located at `server/database/trips.db`. You can edit it directly using SQLite tools.

### Prerequisites

Install SQLite command-line tool (if not already installed):

```bash
# macOS (using Homebrew)
brew install sqlite3

# Or use the built-in version
which sqlite3
```

### Opening the Database

```bash
cd server/database
sqlite3 trips.db
```

### Common Data Editing Operations

#### View All Trips

```sql
SELECT id, name, origin, destination, user_id, created_at 
FROM trips 
ORDER BY created_at DESC;
```

#### View Trip Details

```sql
-- Replace 'trip_id_here' with actual trip ID
SELECT * FROM trips WHERE id = 'trip_id_here';

-- View waypoints for a trip
SELECT * FROM waypoints WHERE trip_id = 'trip_id_here';

-- View attractions for a waypoint
SELECT * FROM attractions WHERE waypoint_id = 'waypoint_id_here';

-- View hotels for a waypoint
SELECT * FROM hotels WHERE waypoint_id = 'waypoint_id_here';
```

#### Edit Trip Name

```sql
UPDATE trips 
SET name = 'New Trip Name', updated_at = CURRENT_TIMESTAMP 
WHERE id = 'trip_id_here';
```

#### Edit Trip Dates

```sql
UPDATE trips 
SET dates = 'Dec 1-10, 2024', updated_at = CURRENT_TIMESTAMP 
WHERE id = 'trip_id_here';
```

#### Edit Trip Progress

```sql
UPDATE trips 
SET planned_progress = 0.75, updated_at = CURRENT_TIMESTAMP 
WHERE id = 'trip_id_here';
```

#### Edit Waypoint Name

```sql
UPDATE waypoints 
SET name = 'New Waypoint Name' 
WHERE id = 'waypoint_id_here';
```

#### Edit Attraction

```sql
UPDATE attractions 
SET name = 'New Attraction Name',
    category = 'New Category',
    rating = 4.5,
    description = 'New description'
WHERE id = 'attraction_id_here';
```

#### Edit Hotel

```sql
UPDATE hotels 
SET name = 'New Hotel Name',
    rating = 4.8,
    price_per_night = 250
WHERE id = 'hotel_id_here';
```

#### Delete a Trip

```sql
-- This will cascade delete all related data (waypoints, attractions, hotels, etc.)
DELETE FROM trips WHERE id = 'trip_id_here';
```

#### Delete a Waypoint

```sql
-- This will cascade delete all related data (attractions, hotels, warnings, deals)
DELETE FROM waypoints WHERE id = 'waypoint_id_here';
```

#### Add a New Attraction

```sql
INSERT INTO attractions (id, waypoint_id, name, category, rating, description)
VALUES (
    -- Generate a UUID or use a tool like: SELECT lower(hex(randomblob(16)))
    'new_attraction_id',
    'waypoint_id_here',
    'Attraction Name',
    'Category',
    4.5,
    'Description text'
);
```

#### Add a New Hotel

```sql
INSERT INTO hotels (
    id, waypoint_id, name, rating, price_per_night,
    action_type, action_display_text, action_target
)
VALUES (
    'new_hotel_id',
    'waypoint_id_here',
    'Hotel Name',
    4.5,
    200,
    'url',
    'Book Now',
    'https://example.com'
);

-- Add amenities
INSERT INTO hotel_amenities (hotel_id, amenity)
VALUES ('new_hotel_id', 'Pool'),
       ('new_hotel_id', 'Free WiFi'),
       ('new_hotel_id', 'Restaurant');
```

#### Add a New Warning

```sql
INSERT INTO warnings (id, waypoint_id, title, type, severity, description)
VALUES (
    'new_warning_id',
    'waypoint_id_here',
    'Warning Title',
    'Weather',
    'medium',
    'Warning description text'
);
```

#### Add a New Deal

```sql
INSERT INTO deals (
    id, waypoint_id, provider, title, description,
    action_type, action_display_text, action_target
)
VALUES (
    'new_deal_id',
    'waypoint_id_here',
    'Provider Name',
    'Deal Title',
    'Deal description',
    'url',
    'Claim Deal',
    'https://example.com/deal'
);
```

### Using SQLite GUI Tools

For easier database editing, consider using GUI tools:

- **DB Browser for SQLite** (Free): https://sqlitebrowser.org/
- **TablePlus** (Free/Paid): https://tableplus.com/
- **DBeaver** (Free): https://dbeaver.io/

Open `server/database/trips.db` with any of these tools.

## ✏️ Editing Trip Generation Data

The sample trip data is generated in `server/services/tripGenerator.js`. This file contains the default waypoints, attractions, hotels, warnings, and deals that are used when generating new trips.

### Location

```
server/services/tripGenerator.js
```

### How to Edit

1. Open `server/services/tripGenerator.js`
2. Find the `waypoints` array (around line 35)
3. Modify the data structures:

```javascript
const waypoints = [
  {
    id: randomUUID(),
    name: 'Your Waypoint Name',
    attractions: [
      {
        id: randomUUID(),
        name: 'Attraction Name',
        category: 'Category',
        rating: 4.5,
        description: 'Description text',
        deals: [ /* optional deals array */ ]
      }
    ],
    warnings: [
      {
        id: randomUUID(),
        title: 'Warning Title',
        type: 'Weather',
        severity: 'medium', // 'low', 'medium', or 'high'
        description: 'Warning description'
      }
    ],
    deals: [ /* waypoint-level deals */ ],
    hotels: [
      {
        id: randomUUID(),
        name: 'Hotel Name',
        rating: 4.5,
        pricePerNight: 200,
        action: {
          type: 'url', // or 'skill'
          displayText: 'Book Now',
          target: 'https://example.com'
        },
        expertHelpAction: { /* optional */ },
        amenities: ['Pool', 'Free WiFi', 'Restaurant']
      }
    ]
  }
];
```

### Adding New Waypoints

To add a new default waypoint, add a new object to the `waypoints` array:

```javascript
{
  id: randomUUID(),
  name: 'New City, State',
  attractions: [ /* attractions array */ ],
  warnings: [ /* warnings array */ ],
  deals: [ /* deals array */ ],
  hotels: [ /* hotels array */ ]
}
```

### Modifying Trip Steps

Edit the `steps` array in the return statement:

```javascript
steps: [
  `Start from ${origin}.`,
  'Your custom step 1',
  'Your custom step 2',
  `Arrive at your destination: ${destination}.`
]
```

### Restart Server After Changes

After editing `tripGenerator.js`, restart the backend server:

```bash
cd server
npm run dev
```

## 🌐 API-Based Editing

You can edit data through the API endpoints using tools like `curl`, Postman, or by creating a simple script.

### Update Trip via API

```bash
curl -X POST http://localhost:3001/api/trips/save \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id_here",
    "tripResult": {
      "id": "trip_id_here",
      "origin": "Updated Origin",
      "destination": "Updated Destination",
      "totalDistance": "600 miles",
      "totalDuration": "10 hours",
      "waypoints": [ /* waypoint data */ ],
      "steps": [ /* steps array */ ]
    }
  }'
```

### Delete Trip via API

```bash
curl -X DELETE http://localhost:3001/api/trips/trip_id_here
```

## 📝 Sample Profiles Data

Sample user profiles are stored in `constants.ts`:

```typescript
// constants.ts
export const SAMPLE_PROFILES: SampleProfile[] = [
    { 
        id: '1', 
        name: 'Adventure Seeker', 
        description: 'Loves hiking, climbing, and exploring the outdoors.', 
        iconName: 'mountain' 
    },
    // Add more profiles here
];
```

To edit:
1. Open `constants.ts`
2. Modify the `SAMPLE_PROFILES` array
3. No server restart needed (frontend code)

## 📊 Database Schema Reference

### Main Tables

- **users**: User accounts
- **trips**: Trip records
- **waypoints**: Waypoints in trips
- **attractions**: Attractions at waypoints
- **warnings**: Warnings for waypoints
- **deals**: Deals and offers
- **hotels**: Hotel listings
- **hotel_amenities**: Hotel amenities (many-to-many)
- **trip_steps**: Route steps

### Key Relationships

- `trips.user_id` → `users.id`
- `waypoints.trip_id` → `trips.id`
- `attractions.waypoint_id` → `waypoints.id`
- `warnings.waypoint_id` → `waypoints.id`
- `deals.waypoint_id` → `waypoints.id`
- `hotels.waypoint_id` → `waypoints.id`
- `hotel_amenities.hotel_id` → `hotels.id`
- `trip_steps.trip_id` → `trips.id`

### Foreign Key Constraints

All foreign keys have `ON DELETE CASCADE`, meaning:
- Deleting a trip deletes all its waypoints
- Deleting a waypoint deletes all its attractions, hotels, warnings, and deals
- Deleting a hotel deletes all its amenities

## 🔧 Useful SQL Queries

### Find All Data for a Trip

```sql
SELECT 
    t.name as trip_name,
    w.name as waypoint_name,
    a.name as attraction_name,
    h.name as hotel_name
FROM trips t
LEFT JOIN waypoints w ON w.trip_id = t.id
LEFT JOIN attractions a ON a.waypoint_id = w.id
LEFT JOIN hotels h ON h.waypoint_id = w.id
WHERE t.id = 'trip_id_here';
```

### Count Items per Trip

```sql
SELECT 
    t.name,
    COUNT(DISTINCT w.id) as waypoint_count,
    COUNT(DISTINCT a.id) as attraction_count,
    COUNT(DISTINCT h.id) as hotel_count
FROM trips t
LEFT JOIN waypoints w ON w.trip_id = t.id
LEFT JOIN attractions a ON a.waypoint_id = w.id
LEFT JOIN hotels h ON h.waypoint_id = w.id
GROUP BY t.id, t.name;
```

### Find All Hotels with Their Amenities

```sql
SELECT 
    h.name,
    h.rating,
    h.price_per_night,
    GROUP_CONCAT(ha.amenity, ', ') as amenities
FROM hotels h
LEFT JOIN hotel_amenities ha ON ha.hotel_id = h.id
GROUP BY h.id;
```

### Backup Database

```bash
# Create a backup
cp server/database/trips.db server/database/trips.db.backup

# Or export to SQL
sqlite3 server/database/trips.db .dump > backup.sql
```

### Restore Database

```bash
# From backup file
cp server/database/trips.db.backup server/database/trips.db

# Or from SQL dump
sqlite3 server/database/trips.db < backup.sql
```

## 🚨 Important Notes

1. **Always backup before editing**: Make a copy of `trips.db` before making changes
2. **Restart server**: After database changes, restart the backend server
3. **UUIDs**: When inserting new records, generate proper UUIDs (use `randomUUID()` in Node.js or SQLite's `lower(hex(randomblob(16)))`)
4. **Timestamps**: The database uses `CURRENT_TIMESTAMP` for `created_at` and `updated_at` fields
5. **Cascade Deletes**: Be careful when deleting - related data will be automatically deleted

## 🛠️ Creating a Simple Data Editor Script

You can create a Node.js script to edit data programmatically:

```javascript
// scripts/edit-data.js
import { getDatabase } from '../database/db.js';
import { randomUUID } from 'crypto';

const db = getDatabase();

// Example: Add a new attraction
const waypointId = 'your_waypoint_id';
const attractionId = randomUUID();

db.prepare(`
  INSERT INTO attractions (id, waypoint_id, name, category, rating, description)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(
  attractionId,
  waypointId,
  'New Attraction',
  'Sightseeing',
  4.8,
  'Description here'
);

console.log('Attraction added successfully!');
```

Run with:
```bash
cd server
node scripts/edit-data.js
```

## 📚 Additional Resources

- SQLite Documentation: https://www.sqlite.org/docs.html
- SQLite Tutorial: https://www.sqlitetutorial.net/
- Better-SQLite3 Documentation: https://github.com/WiseLibs/better-sqlite3

