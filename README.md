# Car Trip Planner

A React-based car trip planning application with AI-powered trip generation.

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Google Maps API Key** (for map functionality)
- **Google Gemini API Key** (for Car Trip planning)

## Setup Instructions for macOS

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Keys

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your API keys:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Where to get API keys:**
- **Google Maps API Key**: https://console.cloud.google.com/google/maps-apis
- **Gemini API Key**: https://aistudio.google.com/apikey

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
car_trip_planner/
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
├── index.html           # HTML template
├── types.ts             # TypeScript type definitions
├── constants.ts         # Constants and mock data
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── utils/              # Utility functions
    └── apiKey.ts       # API key configuration
```

## Troubleshooting

- **Map not loading**: Ensure your Google Maps API key is valid and has the Maps JavaScript API enabled
- **AI features not working**: Check that your Gemini API key is correctly set in `.env.local`
- **Port already in use**: Change the port in `vite.config.ts` or use `npm run dev -- --port 3001`
