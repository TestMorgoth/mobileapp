import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('zustand/middleware', async () => {
  const actual = await vi.importActual<typeof import('zustand/middleware')>('zustand/middleware');

  return {
    ...actual,
    persist: <T>(initializer: Parameters<typeof actual.persist<T>>[0]) => initializer,
  };
});

describe('assistant session store', () => {
  beforeEach(async () => {
    vi.resetModules();
  });

  it('sets the first settings scope without resetting the session', async () => {
    const { useAssistantSessionStore } = await import('./assistant-session-store.js');

    useAssistantSessionStore.setState({
      sessionId: 'session-initial',
      settingsScopeKey: null,
      turns: [],
    });

    useAssistantSessionStore.getState().syncSettingsScope('scope-a');

    expect(useAssistantSessionStore.getState().sessionId).toBe('session-initial');
    expect(useAssistantSessionStore.getState().settingsScopeKey).toBe('scope-a');
  });

  it('resets session and turns when the authoritative settings scope changes', async () => {
    const { useAssistantSessionStore } = await import('./assistant-session-store.js');

    useAssistantSessionStore.setState({
      sessionId: 'session-before',
      settingsScopeKey: 'scope-a',
      turns: [{
        id: 'turn-1',
        question: 'Cosa posso visitare?',
        createdAt: '2026-04-28T00:00:00.000Z',
        response: {
          replyText: 'Puoi visitare la Rocca.',
          cards: [],
          sources: [],
          followUpSuggestions: [],
          meta: {
            mode: 'deterministic',
            fallbackUsed: true,
            sourceKinds: [],
            retrievalCount: 0,
            recommendationUsed: false,
            promptVersion: 'fase9-comune-v1',
          },
        },
      }],
    });

    useAssistantSessionStore.getState().syncSettingsScope('scope-b');
    const state = useAssistantSessionStore.getState();

    expect(state.settingsScopeKey).toBe('scope-b');
    expect(state.sessionId).not.toBe('session-before');
    expect(state.turns).toEqual([]);
  });

  it('keeps the settings scope when starting a new chat locally', async () => {
    const { useAssistantSessionStore } = await import('./assistant-session-store.js');

    useAssistantSessionStore.setState({
      sessionId: 'session-before',
      settingsScopeKey: 'scope-a',
      turns: [{
        id: 'turn-1',
        question: 'Cosa posso visitare?',
        createdAt: '2026-04-28T00:00:00.000Z',
        response: {
          replyText: 'Puoi visitare la Rocca.',
          cards: [],
          sources: [],
          followUpSuggestions: [],
          meta: {
            mode: 'deterministic',
            fallbackUsed: true,
            sourceKinds: [],
            retrievalCount: 0,
            recommendationUsed: false,
            promptVersion: 'fase9-comune-v1',
          },
        },
      }],
    });

    useAssistantSessionStore.getState().clearTurns();
    const state = useAssistantSessionStore.getState();

    expect(state.settingsScopeKey).toBe('scope-a');
    expect(state.sessionId).not.toBe('session-before');
    expect(state.turns).toEqual([]);
  });
});
