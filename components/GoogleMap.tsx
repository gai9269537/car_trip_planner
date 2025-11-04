import React, { useEffect, useRef, useState } from 'react';
import type { TripResult } from '../types';

interface GoogleMapProps {
  tripResult: TripResult;
  height?: string;
}

// Type for Google Maps (loaded dynamically)
type GoogleMaps = any;

export const GoogleMap: React.FC<GoogleMapProps> = ({ tripResult, height = '500px' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapInstanceRef = useRef<GoogleMaps | null>(null);
  const directionsServiceRef = useRef<GoogleMaps | null>(null);
  const directionsRendererRef = useRef<GoogleMaps | null>(null);

  useEffect(() => {
    const checkGoogleMaps = () => {
      if ((window as any).google && (window as any).google.maps) {
        setMapLoaded(true);
      }
    };

    // Check if Google Maps is already loaded
    checkGoogleMaps();

    // Listen for the Google Maps loaded event
    window.addEventListener('google-maps-loaded', checkGoogleMaps);
    window.addEventListener('google-maps-error', () => {
      setMapError(true);
    });

    return () => {
      window.removeEventListener('google-maps-loaded', checkGoogleMaps);
      window.removeEventListener('google-maps-error', () => {});
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapError) return;

    const google = (window as any).google;
    if (!google || !google.maps) return;

    try {
      // Initialize map
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
          zoom: 6,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });
      }

      // Initialize directions service and renderer
      if (!directionsServiceRef.current) {
        directionsServiceRef.current = new google.maps.DirectionsService();
      }
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map: mapInstanceRef.current,
          suppressMarkers: false,
        });
      }

      // Geocode origin and destination
      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode({ address: tripResult.origin }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0]) {
          const origin = results[0].geometry.location;
          
          geocoder.geocode({ address: tripResult.destination }, (destResults: any, destStatus: any) => {
            if (destStatus === 'OK' && destResults && destResults[0]) {
              const destination = destResults[0].geometry.location;
              
              // Center map on route
              const bounds = new google.maps.LatLngBounds();
              bounds.extend(origin);
              bounds.extend(destination);
              
              // Add waypoints
              const waypoints = tripResult.waypoints.map((wp) => ({
                location: wp.name,
                stopover: true,
              }));

              // Calculate route
              if (directionsServiceRef.current && directionsRendererRef.current) {
                directionsServiceRef.current.route(
                  {
                    origin: origin,
                    destination: destination,
                    waypoints: waypoints.length > 0 ? waypoints : undefined,
                    optimizeWaypoints: false,
                    travelMode: google.maps.TravelMode.DRIVING,
                  },
                  (response: any, routeStatus: any) => {
                    if (routeStatus === 'OK' && response) {
                      directionsRendererRef.current?.setDirections(response);
                      mapInstanceRef.current?.fitBounds(bounds);
                    } else {
                      console.warn('Directions request failed:', routeStatus);
                      // Fallback: just show markers
                      const markers: any[] = [];
                      
                      // Add origin marker
                      markers.push(new google.maps.Marker({
                        position: origin,
                        map: mapInstanceRef.current,
                        title: tripResult.origin,
                        label: 'O',
                      }));

                      // Add waypoint markers
                      tripResult.waypoints.forEach((wp, index) => {
                        geocoder.geocode({ address: wp.name }, (wpResults: any, wpStatus: any) => {
                          if (wpStatus === 'OK' && wpResults && wpResults[0]) {
                            markers.push(new google.maps.Marker({
                              position: wpResults[0].geometry.location,
                              map: mapInstanceRef.current,
                              title: wp.name,
                              label: String(index + 1),
                            }));
                            bounds.extend(wpResults[0].geometry.location);
                            mapInstanceRef.current?.fitBounds(bounds);
                          }
                        });
                      });

                      // Add destination marker
                      markers.push(new google.maps.Marker({
                        position: destination,
                        map: mapInstanceRef.current,
                        title: tripResult.destination,
                        label: 'D',
                      }));

                      mapInstanceRef.current?.fitBounds(bounds);
                    }
                  }
                );
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
    }
  }, [mapLoaded, tripResult, mapError]);

  if (mapError) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ height }}>
        <div className="text-center p-8">
          <p className="text-gray-600 mb-2">Map unavailable</p>
          <p className="text-sm text-gray-500">Please check your Google Maps API key</p>
          <p className="text-xs text-gray-400 mt-2">Check browser console (F12) for details</p>
        </div>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg shadow-md overflow-hidden"
      style={{ height }}
    />
  );
};
