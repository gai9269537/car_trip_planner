# 🗺️ Car Trip Planner

A full-stack React application for planning and managing car trips with AI-powered trip generation, interactive maps, and comprehensive trip details including waypoints, attractions, hotels, deals, and warnings.

## ✨ Features

- **AI-Powered Trip Generation**: Generate detailed road trip plans with waypoints and recommendations
- **Interactive Google Maps**: Visualize your trip route with waypoints and directions
- **Trip Management**: Save, view, and manage multiple trips
- **Waypoint Details**: Explore attractions, hotels, deals, and warnings for each waypoint
- **User Authentication**: Simple email-based login system
- **Database Persistence**: All trips are saved to SQLite database
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

This application consists of:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + SQLite database
- **APIs**: Google Maps API, Google Gemini API (optional)

## 📋 Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Google Maps API Key** (for map functionality)
- **Google Gemini API Key** (optional, for AI trip generation)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd car_trip_planner
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 4. Configure Environment Variables

#### Frontend Configuration

Create a `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

#### Backend Configuration

Create `server/.env`:

```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```

**Where to get API keys:**
- **Google Maps API Key**: https://console.cloud.google.com/google/maps-apis
  - Enable: Maps JavaScript API, Directions API, Geocoding API
- **Gemini API Key**: https://aistudio.google.com/apikey

### 5. Start the Backend Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:3001` and automatically create the database on first run.

### 6. Start the Frontend

In a new terminal window:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
car_trip_planner/
├── components/          # React components
│   ├── GoogleMap.tsx   # Google Maps integration
│   ├── Header.tsx      # Navigation header
│   └── NewTripPlanningView.tsx
├── contexts/           # React contexts
│   └── UserContext.tsx # User authentication context
├── services/           # API service layer
│   └── api.ts         # API client
├── views/              # Page components
│   ├── HomeView.tsx
│   ├── LoginView.tsx
│   ├── TripResultsView.tsx
│   └── ...
├── server/              # Backend server
│   ├── database/       # Database files
│   │   ├── db.js      # Database connection
│   │   └── schema.sql # Database schema
│   ├── routes/         # API routes
│   │   ├── auth.js    # Authentication routes
│   │   └── trips.js   # Trip routes
│   ├── services/       # Business logic
│   │   └── tripGenerator.js
│   └── server.js       # Express server
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── types.ts            # TypeScript type definitions
├── utils/              # Utility functions
│   └── apiKey.ts      # API key configuration
└── package.json        # Frontend dependencies
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login`
  - Body: `{ name: string, email: string, profilePictureUrl?: string }`
  - Returns: User object with id, name, email

- `GET /api/auth/user/:id`
  - Returns: User object

### Trips

- `GET /api/trips?userId=:userId`
  - Returns: Array of user's trips

- `GET /api/trips/:id`
  - Returns: Full trip details with waypoints, attractions, hotels, etc.

- `POST /api/trips/generate`
  - Body: `{ userId: string, origin: string, destination: string, vacationWants?: string }`
  - Returns: Generated trip result with all details

- `POST /api/trips/save`
  - Body: `{ userId: string, tripResult: TripResult }`
  - Saves trip to database

- `DELETE /api/trips/:id`
  - Deletes a trip

### Health Check

- `GET /api/health`
  - Returns: Server status

## 🗄️ Database Schema

The application uses SQLite with the following main tables:

- **users**: User accounts
- **trips**: Trip records
- **waypoints**: Waypoints in trips
- **attractions**: Attractions at waypoints
- **warnings**: Warnings for waypoints
- **deals**: Deals and offers
- **hotels**: Hotel listings
- **hotel_amenities**: Hotel amenities (many-to-many)
- **trip_steps**: Route steps

See `server/database/schema.sql` for the complete schema.

## 🛠️ Development

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Scripts

```bash
cd server
npm run dev          # Start development server with auto-reload
npm start            # Start production server
```

### Database Management

The database is automatically created at `server/database/trips.db` on first server start.

To reset the database:
```bash
rm server/database/trips.db
# Restart the server
```

## 🎨 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Google Maps API** - Interactive maps

### Backend
- **Express.js** - Web framework
- **SQLite** (better-sqlite3) - Database
- **Node.js** - Runtime
- **Google Gemini API** - AI trip generation (optional)

## 🔧 Configuration

### Vite Configuration

The frontend is configured to proxy API requests to the backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
}
```

### CORS

The backend is configured to allow requests from the frontend origin.

## 🐛 Troubleshooting

### Map not loading
- Ensure your Google Maps API key is valid
- Check that Maps JavaScript API, Directions API, and Geocoding API are enabled
- Verify the API key is set in `.env.local` as `VITE_GOOGLE_MAPS_API_KEY`
- Check browser console for API errors

### Backend won't start
- Check if port 3001 is available: `lsof -i :3001`
- Verify Node.js version: `node --version` (should be 18+)
- Check database file permissions in `server/database/`
- Review server logs for specific errors

### Frontend can't connect to backend
- Ensure backend is running on port 3001
- Check `VITE_API_URL` in `.env.local` matches backend URL
- Verify CORS is enabled in server configuration
- Check browser Network tab for API request errors

### Database errors
- Delete `server/database/trips.db` and restart server
- Check file system permissions
- Ensure SQLite3 is properly installed

### AI features not working
- Check that Gemini API key is set in both frontend `.env.local` and backend `server/.env`
- Verify API key is valid and has sufficient quota
- Check server logs for API errors

### Port already in use
- Frontend: Change port in `vite.config.ts` or use `npm run dev -- --port 3002`
- Backend: Change `PORT` in `server/.env`

## 📝 Environment Variables Reference

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_MAPS_API_KEY=your_key_here
VITE_GEMINI_API_KEY=your_key_here
```

### Backend (server/.env)
```env
PORT=3001
GEMINI_API_KEY=your_key_here
```

## 🚢 Production Build

### Frontend

```bash
npm run build
```

Output will be in the `dist` directory. Deploy to any static hosting service.

### Backend

```bash
cd server
npm start
```

For production, consider:
- Using a process manager like PM2
- Setting up environment variables properly
- Using a production database (PostgreSQL, MySQL)
- Enabling HTTPS
- Setting up proper CORS origins

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the GitHub repository.

---

**Built with ❤️ using React, Express, and SQLite**
