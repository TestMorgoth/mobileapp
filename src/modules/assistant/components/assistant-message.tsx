import { Link } from 'react-router-dom';
import type { AssistantTurn } from '../assistant.types.js';
import { AssistantResponseMeta } from './assistant-response-meta.js';
import { AssistantItineraryCard } from './assistant-itinerary-card.js';
import { AssistantSourceList } from './assistant-source-list.js';

function buildLink(entityType: string, entityId: string) {
  switch (entityType) {
    case 'poi':
      return `/poi/${entityId}`;
    case 'event':
      return `/events/${entityId}`;
    case 'itinerary':
      return `/itineraries/${entityId}`;
    default:
      return '/explore';
  }
}

export function AssistantMessage({
  turn,
  onReuseSuggestion,
  onFeedback,
}: {
  turn: AssistantTurn;
  onReuseSuggestion: (suggestion: string) => void;
  onFeedback: (sentiment: 'helpful' | 'not_helpful') => void;
}): JSX.Element {
  return (
    <section className="section assistant-turn">
      <div className="assistant-bubble assistant-bubble-user">
        <p className="eyebrow">Richiesta</p>
        <p>{turn.question}</p>
      </div>

      <div className="assistant-bubble assistant-bubble-assistant">
        <p className="eyebrow">Risposta</p>

        <p>{turn.response.replyText}</p>

        <AssistantResponseMeta
          mode={turn.response.meta.mode}
          fallbackUsed={turn.response.meta.fallbackUsed}
          retrievalCount={turn.response.meta.retrievalCount}
          promptVersion={turn.response.meta.promptVersion}
          groundingMode={turn.response.meta.groundingMode}
          municipalityName={turn.response.meta.municipalityName}
          guardrailReason={turn.response.meta.guardrailReason}
          llmEnrichmentUsed={turn.response.meta.llmEnrichmentUsed}
        />

        {(turn.response.actions ?? []).length > 0 ? (
          <div className="chips">
            {(turn.response.actions ?? []).map((action) => (
              <Link
                key={`${action.type}-${action.label}`}
                className="chip chip-secondary"
                to={`/map?lat=${action.target.latitude}&lng=${action.target.longitude}&label=${encodeURIComponent(action.target.label)}`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}

        {turn.response.generatedItinerary ? (
          <AssistantItineraryCard itinerary={turn.response.generatedItinerary} />
        ) : null}

        {turn.response.cards.length > 0 ? (
          <div className="assistant-card-grid">
            {turn.response.cards.map((card) => (
              <Link key={card.entityId} className="unstyled-link" to={buildLink(card.entityType, card.entityId)}>
                <article className="assistant-content-card">
                  <p className="eyebrow">{card.entityType}</p>
                  <h4>{card.title}</h4>
                  <p>{card.summary ?? 'Contenuto territoriale disponibile.'}</p>
                </article>
              </Link>
            ))}
          </div>
        ) : null}

        <AssistantSourceList sources={turn.response.sources} />

        {turn.response.followUpSuggestions.length > 0 ? (
          <div className="chips">
            {turn.response.followUpSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="chip chip-secondary"
                onClick={() => onReuseSuggestion(suggestion)}
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}

        <div className="assistant-feedback-row">
          <span className="muted">Questa risposta e stata utile?</span>
          <button
            className={turn.feedback?.sentiment === 'helpful' ? 'chip chip-active' : 'chip chip-secondary'}
            onClick={() => onFeedback('helpful')}
            type="button"
          >
            Si
          </button>
          <button
            className={turn.feedback?.sentiment === 'not_helpful' ? 'chip chip-active' : 'chip chip-secondary'}
            onClick={() => onFeedback('not_helpful')}
            type="button"
          >
            No
          </button>
        </div>
      </div>
    </section>
  );
}
