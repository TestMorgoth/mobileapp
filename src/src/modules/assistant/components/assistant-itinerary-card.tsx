import type { GeneratedItinerary } from '@territorio/shared-types';

export function AssistantItineraryCard({ itinerary }: { itinerary: GeneratedItinerary }): JSX.Element {
  return (
    <div className="assistant-block assistant-itinerary-card">
      <div className="assistant-inline">
        <p className="eyebrow">Itinerario suggerito</p>
        <span className="assistant-pill">{itinerary.durationMinutes} min</span>
      </div>

      <strong>{itinerary.title}</strong>
      <p>{itinerary.summary}</p>

      <div className="assistant-stop-list">
        {itinerary.stops.map((stop) => (
          <div key={`${stop.order}-${stop.poiId}`} className="assistant-stop-item">
            <div className="assistant-stop-order">{stop.order}</div>
            <div>
              <strong>{stop.title}</strong>
              <p>{stop.reason}</p>
              <p className="muted">{stop.estimatedMinutes} min</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
