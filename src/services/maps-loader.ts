import { Loader } from '@googlemaps/js-api-loader';
import { appConfig } from '../app/app-config.js';

let loader: Loader | null = null;
let mapsPromise: Promise<typeof google> | null = null;

export function hasGoogleMapsApiKey(): boolean {
  return Boolean(appConfig.googleMapsApiKey);
}

export async function loadGoogleMaps(): Promise<typeof google> {
  if (!appConfig.googleMapsApiKey) {
    throw new Error('Google Maps API key non configurata.');
  }

  if (!loader) {
    loader = new Loader({
      apiKey: appConfig.googleMapsApiKey,
      version: 'weekly',
      libraries: ['marker'],
      language: 'it',
      region: 'IT',
    });
  }

  if (!mapsPromise) {
    mapsPromise = loader.load();
  }

  return mapsPromise;
}
