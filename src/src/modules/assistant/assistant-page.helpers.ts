import type { AssistantPublicSettings, AssistantUserLocation } from '@territorio/shared-types';

export function settingsFingerprint(settings: AssistantPublicSettings) {
  return JSON.stringify({
    assistantEnabled: settings.assistantEnabled,
    municipalityName: settings.municipalityName,
    province: settings.province ?? null,
    region: settings.region ?? null,
    countryCode: settings.countryCode,
    center: settings.center ?? null,
    allowedTopics: settings.allowedTopics,
    llmEnrichmentEnabled: settings.llmEnrichmentEnabled,
    directionsEnabled: settings.directionsEnabled,
  });
}

export function messageNeedsDirections(message: string) {
  return /come arrivo|indicazion|mappa|portami|naviga|dove si trova|raggiunger|quanto tempo impiego|quanto tempo ci metto|ci metto quanto|in quanto tempo arrivo|tempo di percorrenza|quanto dista/i.test(message);
}

export function buildAssistantChatContext(input: {
  settings: AssistantPublicSettings;
  shareLocation: boolean;
  message: string;
  coordinates: AssistantUserLocation | null;
}) {
  const wantsDirections = messageNeedsDirections(input.message);
  const userLocation = input.shareLocation && wantsDirections && input.coordinates
    ? input.coordinates
    : undefined;

  return {
    municipality: input.settings.municipalityName,
    ...(userLocation ? { userLocation } : {}),
  };
}
