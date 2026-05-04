import { useEffect, useDeferredValue, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchAssistantSettings, sendAssistantFeedback, sendAssistantMessage } from '../../services/assistant-api.js';
import { Badge, HeroMediaPanel, MetricRow, Section, StatusPill } from '../../components/ui.js';
import { AssistantMessage } from './components/assistant-message.js';
import { AssistantComposer } from './components/assistant-composer.js';
import { MetaBadges } from '../../components/ui/meta-badges.js';
import { useAssistantSessionStore } from './assistant-session-store.js';
import { useUserGeolocation } from '../../hooks/use-user-geolocation.js';
import { buildAssistantChatContext, settingsFingerprint } from './assistant-page.helpers.js';

export function AssistantPage(): JSX.Element {
  const [message, setMessage] = useState('');
  const [shareLocation, setShareLocation] = useState(false);
  const deferredMessage = useDeferredValue(message);
  const sessionId = useAssistantSessionStore((state) => state.sessionId);
  const turns = useAssistantSessionStore((state) => state.turns);
  const addTurn = useAssistantSessionStore((state) => state.addTurn);
  const clearTurns = useAssistantSessionStore((state) => state.clearTurns);
  const syncSettingsScope = useAssistantSessionStore((state) => state.syncSettingsScope);
  const setTurnFeedback = useAssistantSessionStore((state) => state.setTurnFeedback);
  const geolocation = useUserGeolocation(false);
  const settingsQuery = useQuery({
    queryKey: ['assistant-settings'],
    queryFn: fetchAssistantSettings,
  });
  const settings = settingsQuery.data;
  const starterQuestions = [
    `Qual e la storia di ${settings?.municipalityName ?? 'questo Comune'}?`,
    'Cosa posso visitare in due ore?',
    'Ci sono eventi nel territorio?',
    'Come arrivo al punto di interesse piu vicino?',
  ];

  useEffect(() => {
    if (!settings) {
      return;
    }

    syncSettingsScope(settingsFingerprint(settings));
  }, [settings, syncSettingsScope]);

  const chatMutation = useMutation({
    mutationFn: async (content: string) => {
      return sendAssistantMessage({
        sessionId,
        locale: 'it-IT',
        channel: 'mobile',
        message: content,
        context: settings
          ? buildAssistantChatContext({
              settings,
              shareLocation,
              message: content,
              coordinates: geolocation.coordinates,
            })
          : undefined,
      });
    },
    onSuccess: (response, content) => {
      addTurn({
        id: crypto.randomUUID(),
        question: content,
        response,
        createdAt: new Date().toISOString(),
      });
      setMessage('');
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: async (input: {
      conversationId: string;
      assistantMessageId: string;
      sentiment: 'helpful' | 'not_helpful';
    }) => sendAssistantFeedback({
      conversationId: input.conversationId,
      assistantMessageId: input.assistantMessageId,
      score: input.sentiment === 'helpful' ? 5 : 1,
      feedbackSource: 'user',
    }),
  });

  const errorMessage = chatMutation.error instanceof Error
    ? chatMutation.error.message
    : 'Richiesta assistant non riuscita.';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = message.trim();
    if (!trimmed || chatMutation.isPending || settings?.assistantEnabled === false) {
      return;
    }

    await chatMutation.mutateAsync(trimmed);
  }

  async function handleReuseSuggestion(suggestion: string) {
    setMessage(suggestion);
  }

  async function handleFeedback(turnId: string, sentiment: 'helpful' | 'not_helpful') {
    const turn = turns.find((entry) => entry.id === turnId);

    if (!turn?.response.conversationId || !turn.response.assistantMessageId || feedbackMutation.isPending) {
      return;
    }

    await feedbackMutation.mutateAsync({
      conversationId: turn.response.conversationId,
      assistantMessageId: turn.response.assistantMessageId,
      sentiment,
    });

    setTurnFeedback(turnId, sentiment);
  }

  const hasTurns = turns.length > 0;
  const locationReady = geolocation.status === 'success' && Boolean(geolocation.coordinates);
  const locationHint = shareLocation
    ? locationReady
      ? 'Posizione disponibile per richieste di indicazioni'
      : geolocation.status === 'loading'
        ? 'Recupero posizione in corso'
        : geolocation.errorMessage ?? 'Consenso richiesto per usare la posizione'
    : 'Posizione non condivisa con l assistant';

  return (
    <div className="stack assistant-stack">
      <HeroMediaPanel
        eyebrow="Assistant territoriale"
        title="Fai una domanda e ottieni risposte guidate dal contenuto reale"
        description={`Risponde sul turismo di ${settings?.municipalityName ?? 'questo Comune'} usando contenuti pubblicati e, quando consentito, conoscenza turistica generale sul territorio.`}
        topMeta={(
          <>
            <Badge>{settings?.assistantEnabled === false ? 'Assistant disattivato' : 'Assistant attivo'}</Badge>
            <Badge>{hasTurns ? `${turns.length} turni` : 'Nuova sessione'}</Badge>
            {settings ? <Badge>{settings.municipalityName}</Badge> : null}
          </>
        )}
        meta={(
          <>
            <Badge>{locationHint}</Badge>
            <Badge>{deferredMessage.trim() ? 'Bozza pronta' : 'In attesa'}</Badge>
          </>
        )}
        actions={(
          <>
            <Link className="button" to="/map">Apri mappa</Link>
            <Link className="button button-secondary" to="/planner">Apri planner</Link>
            <button className="button button-ghost" onClick={clearTurns} type="button">
              Nuova chat
            </button>
          </>
        )}
      />

      <section className="section assistant-overview">
        <div className="section-head-premium">
          <div className="section-title-group">
            <p className="eyebrow">Sessione</p>
            <h2>Stato dell assistant</h2>
          </div>
          <div className="assistant-inline">
            <StatusPill text={`ID ${sessionId.slice(0, 8)}`} />
            {settings ? <StatusPill text={settings.municipalityName} /> : null}
          </div>
        </div>

        <MetricRow
          items={[
            { label: 'Turni', value: turns.length },
            { label: 'Comune', value: settings?.municipalityName ?? 'In caricamento' },
            { label: 'Posizione', value: shareLocation ? (locationReady ? 'Condivisa' : 'Richiesta') : 'Non condivisa' },
            { label: 'Stato', value: settings?.assistantEnabled === false ? 'Off' : 'On' },
          ]}
        />

        <p className="assistant-overview-text">
          {settings?.assistantEnabled === false
            ? 'Assistant non attivo per questo Comune.'
            : 'L assistant usa contenuti pubblicati, policy comunale configurata dal backoffice e segnali contestuali opzionali come la posizione.'}
        </p>

        <MetaBadges items={['Sessione locale attiva', `ID ${sessionId.slice(0, 8)}`, locationHint]} />
      </section>

      <Section
        title="Avvia una richiesta"
        eyebrow="Composer"
        actions={<Link className="button button-ghost" to="/explore">Apri esplora</Link>}
      >
        <div className="assistant-starter-grid">
          {starterQuestions.map((question) => (
            <button
              key={question}
              className="chip"
              onClick={() => setMessage(question)}
              type="button"
            >
              {question}
            </button>
          ))}
        </div>

        <div className="assistant-inline assistant-controls-row">
          <button
            className={shareLocation ? 'chip chip-active' : 'chip chip-secondary'}
            onClick={() => {
              setShareLocation((current) => {
                const next = !current;
                if (next) {
                  geolocation.requestLocation();
                }
                return next;
              });
            }}
            type="button"
          >
            {shareLocation ? 'Posizione condivisa' : 'Usa la mia posizione'}
          </button>
          {shareLocation && !locationReady && geolocation.status !== 'loading' ? (
            <button className="chip chip-secondary" onClick={geolocation.requestLocation} type="button">
              Aggiorna posizione
            </button>
          ) : null}
        </div>

        <AssistantComposer
          value={message}
          onChange={setMessage}
          onSubmit={handleSubmit}
          disabled={chatMutation.isPending || settings?.assistantEnabled === false}
        />

        {chatMutation.isPending ? (
          <div className="assistant-pending-card">
            <p className="eyebrow">Elaborazione</p>
            <p>L assistente sta componendo una risposta strutturata dal backend.</p>
          </div>
        ) : null}

        {chatMutation.isError ? (
          <div className="assistant-error-card" role="alert">
            <p>{errorMessage}</p>
            {message.trim() ? (
              <button className="chip chip-secondary" onClick={() => chatMutation.mutate(message.trim())} type="button">
                Riprova
              </button>
            ) : null}
          </div>
        ) : null}
      </Section>

      {turns.length === 0 ? (
        <section className="section">
          <p className="eyebrow">Cronologia</p>
          <p>Nessun turno ancora salvato in questa sessione locale. Parti da una domanda rapida o scrivine una personalizzata.</p>
        </section>
      ) : null}

      {turns.map((turn) => (
        <AssistantMessage
          key={turn.id}
          turn={turn}
          onReuseSuggestion={handleReuseSuggestion}
          onFeedback={(sentiment) => {
            void handleFeedback(turn.id, sentiment);
          }}
        />
      ))}
    </div>
  );
}
