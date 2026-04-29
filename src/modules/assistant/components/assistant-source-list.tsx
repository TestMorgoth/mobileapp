import { Link } from 'react-router-dom';
import type { AssistantSourceReference } from '@territorio/shared-types';

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

export function AssistantSourceList({ sources }: { sources: AssistantSourceReference[] }): JSX.Element | null {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="assistant-block">
      <p className="eyebrow">Fonti usate</p>
      <div className="assistant-source-list">
        {sources.map((source) => (
          <Link key={`${source.kind}-${source.entityId}`} className="unstyled-link" to={buildLink(source.entityType, source.entityId)}>
            <article className="assistant-source-card">
              <p className="assistant-source-meta">
                {source.kind}
                {' · '}
                {source.entityType}
              </p>
              <strong>{source.title}</strong>
              <p>{source.summary ?? 'Contenuto territoriale disponibile.'}</p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
