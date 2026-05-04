import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import {
  Badge,
  EmptyState,
  HeroMediaPanel,
  LoadingBlock,
  MetricRow,
  Section,
} from '../../components/ui.js';
import { fetchEvent } from '../../services/content-api.js';
import { useFavoritesStore } from '../../store/favorites-store.js';

function formatEventDateTime(value: string): string {
  return new Date(value).toLocaleString('it-IT', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function EventDetailPage(): JSX.Element {
  const { id = '' } = useParams();
  const query = useQuery({ queryKey: ['event', id], queryFn: () => fetchEvent(id), enabled: Boolean(id) });
  const favoriteEventIds = useFavoritesStore((state) => state.eventIds);
  const toggleEvent = useFavoritesStore((state) => state.toggleEvent);

  if (!id) {
    return <EmptyState title="Evento non trovato" text="Identificativo mancante." />;
  }

  if (query.isLoading) {
    return <LoadingBlock />;
  }

  if (!query.data) {
    return <EmptyState title="Evento non disponibile" text="Il contenuto richiesto non è disponibile." />;
  }

  const event = query.data;

  return (
    <div className="stack">
      <HeroMediaPanel
        eyebrow="Evento"
        title={event.title}
        description={event.shortDescription ?? event.description ?? 'Dettaglio evento disponibile nel canale mobile.'}
        backgroundImage={event.coverMedia?.url}
        topMeta={(
          <>
            <Badge>{formatEventDateTime(event.startsAt)}</Badge>
            {event.venueName ? <Badge>{event.venueName}</Badge> : null}
            {event.familyFriendly ? <Badge>Family friendly</Badge> : null}
          </>
        )}
        meta={(
          <>
            {event.bookingUrl ? <Badge>Con prenotazione</Badge> : <Badge>Senza booking URL</Badge>}
            {event.coordinates ? <Badge>Coordinate disponibili</Badge> : <Badge>Coordinate assenti</Badge>}
          </>
        )}
        actions={(
          <>
            <button className="button button-secondary" onClick={() => toggleEvent(event.id)}>
              {favoriteEventIds.includes(event.id) ? 'Rimuovi preferito' : 'Salva preferito'}
            </button>
            {event.bookingUrl ? (
              <a className="button button-ghost" href={event.bookingUrl} target="_blank" rel="noreferrer">
                Prenota
              </a>
            ) : null}
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
            { label: 'Inizio', value: formatEventDateTime(event.startsAt) },
            { label: 'Fine', value: event.endsAt ? formatEventDateTime(event.endsAt) : 'Non specificata' },
            { label: 'Luogo', value: event.venueName ?? 'Non indicato' },
            { label: 'Accesso', value: event.bookingUrl ? 'Prenotabile' : 'Libero o esterno' },
          ]}
        />
      </section>

      <Section title="Descrizione" eyebrow="Contenuto">
        <p>{event.description ?? event.shortDescription ?? 'Descrizione non disponibile.'}</p>
      </Section>

      <Section title="Informazioni utili" eyebrow="Pratiche">
        <div className="grid">
          <article className="card">
            <h3>Inizio</h3>
            <p>{formatEventDateTime(event.startsAt)}</p>
          </article>
          <article className="card">
            <h3>Fine</h3>
            <p>{event.endsAt ? formatEventDateTime(event.endsAt) : 'Non specificata.'}</p>
          </article>
          <article className="card">
            <h3>Luogo</h3>
            <p>{event.venueName ?? event.address ?? 'Informazione non disponibile.'}</p>
          </article>
          <article className="card">
            <h3>Prenotazione</h3>
            <p>{event.bookingUrl ? 'Disponibile sul canale indicato.' : 'Non richiesta o non specificata.'}</p>
          </article>
        </div>
      </Section>

      {event.coordinates ? (
        <Section title="Mappa" eyebrow="Orientati">
          <div className="stack compact">
            <p>Questo evento ha coordinate disponibili e puo essere aperto direttamente sulla mappa.</p>
            <Link
              className="button"
              to={`/map?lat=${event.coordinates.latitude}&lng=${event.coordinates.longitude}&label=${encodeURIComponent(event.title)}`}
            >
              Apri in mappa
            </Link>
          </div>
        </Section>
      ) : null}
    </div>
  );
}
