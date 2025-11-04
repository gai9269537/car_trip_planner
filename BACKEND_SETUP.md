# Backend Setup Instructions

The application has been refactored to use a backend database instead of mock data.

## Quick Start

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Set Up Environment Variables

Create `server/.env`:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start the Backend Server

```bash
cd server
npm run dev
```

The server will automatically create the database on first run.

### 4. Update Frontend Environment

Add to your `.env.local` (frontend):
```env
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. Start Frontend

In a new terminal:
```bash
npm run dev
```

## What Changed

### Backend
- ✅ Express.js server with REST API
- ✅ SQLite database with full schema
- ✅ API endpoints for users, trips, and trip generation
- ✅ Database persistence for all trip data

### Frontend
- ✅ API service module (`services/api.ts`)
- ✅ UserContext now uses API for login
- ✅ App.tsx loads trips from database
- ✅ NewTripPlanningView calls backend API
- ✅ LoginView uses API authentication
- ✅ All mock data replaced with API calls

## Database

The database is automatically created at `server/database/trips.db` when the server starts.

To reset the database, delete the `trips.db` file and restart the server.

## API Endpoints

- `POST /api/auth/login` - Login/create user
- `GET /api/trips?userId=:id` - Get user's trips
- `POST /api/trips/generate` - Generate new trip
- `POST /api/trips/save` - Save trip
- `GET /api/trips/:id` - Get trip details
- `DELETE /api/trips/:id` - Delete trip

## Troubleshooting

**Backend won't start:**
- Check if port 3001 is available
- Verify Node.js version (18+)
- Check database permissions

**Frontend can't connect:**
- Ensure backend is running on port 3001
- Check CORS settings in server
- Verify `VITE_API_URL` in `.env.local`

**Database errors:**
- Delete `server/database/trips.db` and restart
- Check file permissions

