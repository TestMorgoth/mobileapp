import { describe, expect, it } from 'vitest';
import type { AssistantPublicSettings } from '@territorio/shared-types';
import {
  buildAssistantChatContext,
  messageNeedsDirections,
  settingsFingerprint,
} from './assistant-page.helpers.js';

const settings: AssistantPublicSettings = {
  assistantEnabled: true,
  municipalityName: 'Subiaco',
  province: 'Roma',
  region: 'Lazio',
  countryCode: 'IT',
  center: null,
  allowedTopics: ['history', 'places', 'directions'],
  llmEnrichmentEnabled: true,
  directionsEnabled: true,
};

describe('assistant page helpers', () => {
  it('treats travel-time prompts as directions requests', () => {
    expect(messageNeedsDirections('Quanto tempo impiego ad arrivare alla Rocca Abbaziale?')).toBe(true);
    expect(messageNeedsDirections('Quanto tempo ci metto per arrivare al museo?')).toBe(true);
    expect(messageNeedsDirections('Che eventi ci sono questo weekend?')).toBe(false);
  });

  it('includes userLocation only when sharing is enabled and the request is about directions', () => {
    const coordinates = {
      latitude: 41.92,
      longitude: 13.1,
      accuracy: 20,
    };

    const directionsContext = buildAssistantChatContext({
      settings,
      shareLocation: true,
      message: 'Quanto tempo impiego ad arrivare alla Rocca Abbaziale?',
      coordinates,
    });

    const genericContext = buildAssistantChatContext({
      settings,
      shareLocation: true,
      message: 'Raccontami la storia di Subiaco',
      coordinates,
    });

    const noConsentContext = buildAssistantChatContext({
      settings,
      shareLocation: false,
      message: 'Come arrivo al Monastero di Santa Scolastica?',
      coordinates,
    });

    expect(directionsContext).toEqual({
      municipality: 'Subiaco',
      userLocation: coordinates,
    });
    expect(genericContext).toEqual({
      municipality: 'Subiaco',
    });
    expect(noConsentContext).toEqual({
      municipality: 'Subiaco',
    });
  });

  it('changes fingerprint when authoritative settings change', () => {
    const original = settingsFingerprint(settings);
    const changed = settingsFingerprint({
      ...settings,
      municipalityName: 'Manziana',
    });

    expect(changed).not.toBe(original);
  });
});
