import type {
  DiscoveryResponse,
  Event,
  Itinerary,
  ListResponse,
  Poi,
  SearchResponse,
  Story,
} from '@territorio/shared-types';
import { apiClient } from './api.js';
import type {
  RecommendationRequest,
  RecommendationResponse,
  SaveGeneratedItineraryResponse,
  SearchEntityType,
} from '@territorio/shared-types';

export async function fetchPois(): Promise<Poi[]> {
  const response = await apiClient.get<ListResponse<Poi>['data']>('/api/v1/poi?publishedStatus=published');
  return response.data.items;
}

export async function fetchPoi(id: string): Promise<Poi> {
  const response = await apiClient.get<Poi>(`/api/v1/poi/${id}`);
  return response.data;
}

export async function fetchEvents(): Promise<Event[]> {
  const response = await apiClient.get<ListResponse<Event>['data']>('/api/v1/events?publishedStatus=published');
  return response.data.items;
}

export async function fetchEvent(id: string): Promise<Event> {
  const response = await apiClient.get<Event>(`/api/v1/events/${id}`);
  return response.data;
}

export async function fetchItineraries(): Promise<Itinerary[]> {
  const response = await apiClient.get<ListResponse<Itinerary>['data']>('/api/v1/itineraries');
  return response.data.items;
}

export async function fetchItinerary(id: string): Promise<Itinerary> {
  const response = await apiClient.get<Itinerary>(`/api/v1/itineraries/${id}`);
  return response.data;
}

export async function fetchStories(): Promise<Story[]> {
  const response = await apiClient.get<ListResponse<Story>['data']>('/api/v1/stories');
  return response.data.items;
}

export async function fetchDiscovery(municipality?: string): Promise<DiscoveryResponse> {
  const query = municipality ? `?municipality=${encodeURIComponent(municipality)}` : '';
  const response = await apiClient.get<DiscoveryResponse>(`/api/v1/discovery${query}`);
  return response.data;
}

export async function searchContent(payload: {
  q?: string;
  types?: SearchEntityType[];
  municipality?: string;
  familyFriendly?: boolean;
  accessibleOnly?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<SearchResponse> {
  const params = new URLSearchParams();

  if (payload.q) params.set('q', payload.q);
  if (payload.types?.length) params.set('types', payload.types.join(','));
  if (payload.municipality) params.set('municipality', payload.municipality);
  if (typeof payload.familyFriendly === 'boolean') params.set('familyFriendly', String(payload.familyFriendly));
  if (typeof payload.accessibleOnly === 'boolean') params.set('accessibleOnly', String(payload.accessibleOnly));
  params.set('page', String(payload.page ?? 1));
  params.set('pageSize', String(payload.pageSize ?? 10));

  const response = await apiClient.get<SearchResponse>(`/api/v1/search?${params.toString()}`);
  return response.data;
}

export async function generateRecommendations(payload: RecommendationRequest): Promise<RecommendationResponse> {
  const response = await apiClient.post<RecommendationResponse>('/api/v1/recommendations/generate', payload);
  return response.data;
}

export async function saveGeneratedItinerary(payload: {
  title?: string;
  summary?: string;
  sourceRequest: RecommendationRequest;
  sourceResponse: RecommendationResponse;
}): Promise<SaveGeneratedItineraryResponse> {
  const response = await apiClient.post<SaveGeneratedItineraryResponse>('/api/v1/recommendations/save-itinerary', payload);
  return response.data;
}
