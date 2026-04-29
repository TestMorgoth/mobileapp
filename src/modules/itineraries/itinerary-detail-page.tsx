import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Badge, EmptyState, HeroMediaPanel, LoadingBlock, MetricRow, Section } from '../../components/ui.js';
import { fetchItinerary } from '../../services/content-api.js';
import { useFavoritesStore } from '../../store/favorites-store.js';

export function ItineraryDetailPage(): JSX.Element {
  const { id = '' } = useParams();
  const query = useQuery({ queryKey: ['itinerary', id], queryFn: () => fetchItinerary(id), enabled: Boolean(id) });
  const favoriteItineraryIds = useFavoritesStore((state) => state.itineraryIds);
  const toggleItinerary = useFavoritesStore((state) => state.toggleItinerary);

  if (!id) {
    return <EmptyState title="Itinerario non trovato" text="Identificativo mancante." />;
  }

  if (query.isLoading) {
    return <LoadingBlock />;
  }

  if (!query.data) {
    return <EmptyState title="Itinerario non disponibile" text="Il contenuto richiesto non è disponibile." />;
  }

  const itinerary = query.data;

  return (
    <div className="stack">
      <HeroMediaPanel
        eyebrow="Itinerario"
        title={itinerary.title}
        description={itinerary.summary ?? itinerary.description ?? 'Percorso editoriale disponibile nel canale mobile.'}
        topMeta={(
          <>
            <Badge>{itinerary.itineraryType}</Badge>
            {itinerary.durationMinutes ? <Badge>{itinerary.durationMinutes} min</Badge> : null}
            {itinerary.targetAudience ? <Badge>{itinerary.targetAudience}</Badge> : null}
          </>
        )}
        meta={(
          <>
            {itinerary.distanceKm ? <Badge>{itinerary.distanceKm} km</Badge> : null}
            {itinerary.generatedByAi ? <Badge>Generato da AI</Badge> : <Badge>Editoriale</Badge>}
          </>
        )}
        actions={(
          <>
            <button className="button button-secondary" onClick={() => toggleItinerary(itinerary.id)}>
              {favoriteItineraryIds.includes(itinerary.id) ? 'Rimuovi preferito' : 'Salva preferito'}
            </button>
            <Link className="button button-ghost" to="/planner">
              Apri planner
            </Link>
          </>
        )}
      />

      <section className="section">
        <div className="section-head-premium">
          <div className="section-title-group">
            <p className="eyebrow">Metriche</p>
            <h2>Informazioni essenziali</h2>
          </div>
        </div>
        <MetricRow
          items={[
            { label: 'Tipologia', value: itinerary.itineraryType },
            { label: 'Durata', value: itinerary.durationMinutes ? `${itinerary.durationMinutes} min` : 'Non specificata' },
            { label: 'Distanza', value: itinerary.distanceKm ? `${itinerary.distanceKm} km` : 'Non specificata' },
            { label: 'Target', value: itinerary.targetAudience ?? 'Generico' },
          ]}
        />
      </section>

      <Section title="Sintesi del percorso" eyebrow="Contenuto">
        <p>{itinerary.description ?? itinerary.summary ?? 'Descrizione non disponibile.'}</p>
      </Section>

      <Section title="Informazioni utili" eyebrow="Pratiche">
        <div className="grid">
          <article className="card">
            <h3>Tipologia</h3>
            <p>{itinerary.itineraryType}</p>
          </article>
          <article className="card">
            <h3>Durata</h3>
            <p>{itinerary.durationMinutes ? `${itinerary.durationMinutes} minuti` : 'Non specificata.'}</p>
          </article>
          <article className="card">
            <h3>Distanza</h3>
            <p>{itinerary.distanceKm ? `${itinerary.distanceKm} km` : 'Non specificata.'}</p>
          </article>
          <article className="card">
            <h3>Accessibilita</h3>
            <p>{itinerary.accessibilityNotes ?? 'Nessuna nota specifica disponibile.'}</p>
          </article>
        </div>
      </Section>
    </div>
  );
}
