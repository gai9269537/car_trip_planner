# Car Trip Planner - Backend Server

Express.js backend server with SQLite database for the Car Trip Planner application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your API keys:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Initialize database:
```bash
npm run setup-db
```

The database will be automatically created at `database/trips.db` when you first run the server.

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login or create user
- `GET /api/auth/user/:id` - Get user by ID

### Trips
- `GET /api/trips?userId=:userId` - Get all trips for a user
- `GET /api/trips/:id` - Get trip details by ID
- `POST /api/trips/generate` - Generate new trip plan
- `POST /api/trips/save` - Save trip
- `DELETE /api/trips/:id` - Delete trip

### Health Check
- `GET /api/health` - Check server status

## Database Schema

The database uses SQLite with the following tables:
- `users` - User accounts
- `trips` - Trip records
- `waypoints` - Waypoints in trips
- `attractions` - Attractions at waypoints
- `warnings` - Warnings for waypoints
- `deals` - Deals and offers
- `hotels` - Hotel listings
- `hotel_amenities` - Hotel amenities
- `trip_steps` - Route steps

See `database/schema.sql` for full schema details.

