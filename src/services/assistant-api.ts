import type {
  AssistantChatRequest,
  AssistantChatResponse,
  AssistantFeedback,
  AssistantFeedbackResult,
  AssistantPublicSettings,
} from '@territorio/shared-types';
import { apiClient } from './api.js';

export async function sendAssistantMessage(payload: AssistantChatRequest): Promise<AssistantChatResponse> {
  try {
    const response = await apiClient.post<AssistantChatResponse>('/api/v1/assistant/chat', payload);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Assistant non disponibile: ${error.message}`);
    }

    throw new Error('Assistant non disponibile.');
  }
}

export async function sendAssistantFeedback(payload: AssistantFeedback): Promise<AssistantFeedbackResult> {
  try {
    const response = await apiClient.post<AssistantFeedbackResult>('/api/v1/assistant/feedback', payload);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Feedback assistant non disponibile: ${error.message}`);
    }

    throw new Error('Feedback assistant non disponibile.');
  }
}

export async function fetchAssistantSettings(): Promise<AssistantPublicSettings> {
  const response = await apiClient.get<AssistantPublicSettings>('/api/v1/assistant/settings');
  return response.data;
}
