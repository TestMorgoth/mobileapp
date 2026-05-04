import { useEffect, useState } from 'react';

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

type GeolocationStatus = 'idle' | 'loading' | 'success' | 'denied' | 'error' | 'unsupported';

interface UserGeolocationState {
  status: GeolocationStatus;
  coordinates: UserCoordinates | null;
  errorMessage: string | null;
  requestLocation: () => void;
}

function toCoordinates(position: GeolocationPosition): UserCoordinates {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
  };
}

function resolveErrorMessage(error: GeolocationPositionError): {
  status: Exclude<GeolocationStatus, 'idle' | 'loading' | 'success'>;
  message: string;
} {
  if (error.code === error.PERMISSION_DENIED) {
    return {
      status: 'denied',
      message: 'Non posso mostrare la tua posizione senza autorizzazione.',
    };
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return {
      status: 'error',
      message: 'La posizione del dispositivo non e disponibile in questo momento.',
    };
  }

  return {
    status: 'error',
    message: 'Non sono riuscito a recuperare la posizione del dispositivo.',
  };
}

export function useUserGeolocation(autoRequest = true): UserGeolocationState {
  const [status, setStatus] = useState<GeolocationStatus>('idle');
  const [coordinates, setCoordinates] = useState<UserCoordinates | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function requestLocation() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unsupported');
      setErrorMessage('La geolocalizzazione non e supportata su questo dispositivo.');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates(toCoordinates(position));
        setStatus('success');
      },
      (error) => {
        const resolved = resolveErrorMessage(error);
        setCoordinates(null);
        setStatus(resolved.status);
        setErrorMessage(resolved.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }

  useEffect(() => {
    if (autoRequest) {
      requestLocation();
    }
  }, [autoRequest]);

  return {
    status,
    coordinates,
    errorMessage,
    requestLocation,
  };
}
