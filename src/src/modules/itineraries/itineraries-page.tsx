import { useQuery } from '@tanstack/react-query';
import { Card, EmptyState, LoadingBlock, Section } from '../../components/ui.js';
import { fetchItineraries } from '../../services/content-api.js';

export function ItinerariesPage(): JSX.Element {
  const query = useQuery({ queryKey: ['itineraries'], queryFn: fetchItineraries });

  return (
    <Section title="Itinerari">
      {query.isLoading ? <LoadingBlock /> : null}
      {!query.isLoading && (query.data?.length ?? 0) === 0 ? (
        <EmptyState title="Nessun itinerario pubblicato" text="Gli itinerari appariranno qui quando disponibili." />
      ) : null}
      <div className="stack">
        {(query.data ?? []).map((itinerary) => (
          <Card
            key={itinerary.id}
            title={itinerary.title}
            subtitle={itinerary.itineraryType}
            body={itinerary.summary}
            to={`/itineraries/${itinerary.id}`}
          />
        ))}
      </div>
    </Section>
  );
}
