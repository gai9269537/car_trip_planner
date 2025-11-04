
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { MAPS_API_KEY } from './utils/apiKey';

// Dynamically load the Google Maps script to use the environment API key
const loadGoogleMapsScript = () => {
  // Prevent duplicate script injection
  if (document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]')) {
    if ((window as any).google) {
        window.dispatchEvent(new CustomEvent('google-maps-loaded'));
    }
    return;
  }

  const apiKey = MAPS_API_KEY;

  if (!apiKey) {
    console.warn("Google Maps API key is missing. Map functionality will be disabled.");
    // Dispatch error event immediately so components can react.
    window.dispatchEvent(new CustomEvent('google-maps-error'));
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,directions`;
  script.async = true;
  script.onload = () => {
    // Dispatch a custom event to notify components that the API is ready
    window.dispatchEvent(new CustomEvent('google-maps-loaded'));
  };
  script.onerror = () => {
    // Dispatch a custom event for script loading failure
    window.dispatchEvent(new CustomEvent('google-maps-error'));
  };
  document.head.appendChild(script);
};

loadGoogleMapsScript();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);