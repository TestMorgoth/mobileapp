import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AssistantTurn } from './assistant.types.js';

interface AssistantSessionState {
  sessionId: string;
  settingsScopeKey: string | null;
  turns: AssistantTurn[];
  setSessionId: (sessionId: string) => void;
  syncSettingsScope: (settingsScopeKey: string) => void;
  addTurn: (turn: AssistantTurn) => void;
  clearTurns: () => void;
  setTurnFeedback: (turnId: string, sentiment: 'helpful' | 'not_helpful') => void;
}

function createSessionId() {
  return crypto.randomUUID();
}

export const useAssistantSessionStore = create<AssistantSessionState>()(
  persist(
    (set) => ({
      sessionId: createSessionId(),
      settingsScopeKey: null,
      turns: [],
      setSessionId: (sessionId) => set({ sessionId }),
      syncSettingsScope: (settingsScopeKey) => set((state) => {
        if (state.settingsScopeKey === settingsScopeKey) {
          return state;
        }

        if (state.settingsScopeKey === null) {
          return { settingsScopeKey };
        }

        return {
          settingsScopeKey,
          sessionId: createSessionId(),
          turns: [],
        };
      }),
      addTurn: (turn) => set((state) => ({ turns: [...state.turns, turn] })),
      clearTurns: () => set((state) => ({
        turns: [],
        sessionId: createSessionId(),
        settingsScopeKey: state.settingsScopeKey,
      })),
      setTurnFeedback: (turnId, sentiment) => set((state) => ({
        turns: state.turns.map((turn) => (
          turn.id === turnId
            ? {
                ...turn,
                feedback: {
                  sentiment,
                  updatedAt: new Date().toISOString(),
                },
              }
            : turn
        )),
      })),
    }),
    {
      name: 'assistant-session-store',
      partialize: (state) => ({
        sessionId: state.sessionId,
        settingsScopeKey: state.settingsScopeKey,
        turns: state.turns,
      }),
    },
  ),
);
