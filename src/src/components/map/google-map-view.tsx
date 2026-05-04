import { useEffect, useRef } from 'react';
import { loadGoogleMaps } from '../../services/maps-loader.js';
import type { UserCoordinates } from '../../hooks/use-user-geolocation.js';

export function GoogleMapView({
  center,
  userPosition,
  targetPosition,
  targetTitle,
  markerTitle = 'La tua posizione',
}: {
  center: UserCoordinates;
  userPosition?: UserCoordinates | null;
  targetPosition?: UserCoordinates | null;
  targetTitle?: string;
  markerTitle?: string;
}): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const targetMarkerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function setupMap() {
      if (!containerRef.current) {
        return;
      }

      const googleApi = await loadGoogleMaps();
      if (cancelled || !containerRef.current) {
        return;
      }

      const position = {
        lat: center.latitude,
        lng: center.longitude,
      };

      if (!mapRef.current) {
        mapRef.current = new googleApi.maps.Map(containerRef.current, {
          center: position,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
        });
      } else {
        mapRef.current.setCenter(position);
      }

      if (userPosition) {
        const userMarkerPosition = {
          lat: userPosition.latitude,
          lng: userPosition.longitude,
        };

        if (!userMarkerRef.current) {
          userMarkerRef.current = new googleApi.maps.Marker({
            map: mapRef.current,
            position: userMarkerPosition,
            title: markerTitle,
            animation: googleApi.maps.Animation.DROP,
            icon: {
              path: googleApi.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#174c4f',
              fillOpacity: 1,
              strokeColor: '#fdfbf7',
              strokeWeight: 3,
            },
          });
        } else {
          userMarkerRef.current.setPosition(userMarkerPosition);
        }
      } else if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }

      if (targetPosition) {
        const targetMarkerPosition = {
          lat: targetPosition.latitude,
          lng: targetPosition.longitude,
        };

        if (!targetMarkerRef.current) {
          targetMarkerRef.current = new googleApi.maps.Marker({
            map: mapRef.current,
            position: targetMarkerPosition,
            title: targetTitle ?? 'Destinazione',
            icon: {
              path: googleApi.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 6,
              fillColor: '#d7a95b',
              fillOpacity: 1,
              strokeColor: '#7b5721',
              strokeWeight: 2,
            },
          });
        } else {
          targetMarkerRef.current.setPosition(targetMarkerPosition);
          targetMarkerRef.current.setTitle(targetTitle ?? 'Destinazione');
        }
      } else if (targetMarkerRef.current) {
        targetMarkerRef.current.setMap(null);
        targetMarkerRef.current = null;
      }
    }

    void setupMap();

    return () => {
      cancelled = true;
    };
  }, [
    center.latitude,
    center.longitude,
    markerTitle,
    targetTitle,
    targetPosition?.latitude,
    targetPosition?.longitude,
    userPosition?.latitude,
    userPosition?.longitude,
  ]);

  return <div ref={containerRef} className="map-canvas" role="img" aria-label="Mappa Google centrata sulla posizione dell'utente" />;
}
