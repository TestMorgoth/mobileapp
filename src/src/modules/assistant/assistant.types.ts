import type { AssistantChatResponse } from '@territorio/shared-types';

export interface AssistantTurnFeedback {
  sentiment: 'helpful' | 'not_helpful';
  updatedAt: string;
}

export interface AssistantTurn {
  id: string;
  question: string;
  response: AssistantChatResponse;
  createdAt: string;
  feedback?: AssistantTurnFeedback | undefined;
}
