# Debugging Guide

## How to View Logs

### 1. Browser Console (Most Important)
The React/JavaScript errors will show in your browser console:
- **Chrome/Edge**: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
- **Firefox**: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
- **Safari**: Enable Developer menu first: Preferences → Advanced → Show Develop menu, then `Cmd+Option+I`

Look for:
- Red error messages
- Yellow warnings
- Console.log messages

### 2. Terminal/Console Output
If you're running `npm run dev`, the terminal will show:
- Build errors
- TypeScript errors
- Vite compilation errors

To see full output:
```bash
npm run dev
```

### 3. Check Environment Variables
Make sure your `.env.local` file exists and has the API key:
```bash
cat .env.local
```

Should show:
```
VITE_GOOGLE_MAPS_API_KEY=your_key_here
VITE_GEMINI_API_KEY=your_key_here
```

### 4. Common Map Errors

**Error: "Google Maps API key is missing"**
- Check `.env.local` file exists
- Restart dev server after adding API key
- Make sure key starts with `VITE_`

**Error: "This API key is not authorized"**
- Go to Google Cloud Console
- Enable these APIs:
  - Maps JavaScript API
  - Directions API
  - Geocoding API

**Error: "RefererNotAllowedMapError"**
- Add your localhost to allowed referrers in Google Cloud Console
- Add: `http://localhost:3000/*`

### 5. Check Network Tab
In browser DevTools (F12):
1. Go to "Network" tab
2. Look for requests to `maps.googleapis.com`
3. Check if they return errors (red status codes)

### 6. View TypeScript Errors
```bash
npx tsc --noEmit
```

This will show all TypeScript errors without building.

