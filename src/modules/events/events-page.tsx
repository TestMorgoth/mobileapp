import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Badge,
  EmptyState,
  HeroMediaPanel,
  LoadingBlock,
  MetricRow,
  Section,
  VisualCard,
} from '../../components/ui.js';
import { fetchEvents } from '../../services/content-api.js';

function formatEventDate(value: string): string {
  return new Date(value).toLocaleDateString('it-IT', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

function formatEventDateTime(value: string): string {
  return new Date(value).toLocaleString('it-IT', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function EventsPage(): JSX.Element {
  const query = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const events = query.data ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedEvent = useMemo(() => {
    if (selectedId) {
      return events.find((event) => event.id === selectedId) ?? null;
    }

    return events[0] ?? null;
  }, [events, selectedId]);

  const familyFriendlyCount = events.filter((event) => event.familyFriendly).length;
  const withCoverCount = events.filter((event) => event.coverMedia?.url).length;

  return (
    <div className="stack events-stack">
      <HeroMediaPanel
        eyebrow="Agenda territoriale"
        title={selectedEvent?.title ?? 'Eventi pubblicati e fruibili da mobile'}
        description={
          selectedEvent?.shortDescription ??
          'La nuova esperienza eventi usa cover reali, fallback controllati e accessi rapidi verso mappa, detail e prenotazione.'
        }
        backgroundImage={selectedEvent?.coverMedia?.url}
        topMeta={(
          <>
            <Badge>{events.length} eventi</Badge>
            <Badge>{familyFriendlyCount} family friendly</Badge>
            <Badge>{withCoverCount} con cover</Badge>
          </>
        )}
        meta={selectedEvent ? (
          <>
            <Badge>{formatEventDate(selectedEvent.startsAt)}</Badge>
            {selectedEvent.venueName ? <Badge>{selectedEvent.venueName}</Badge> : null}
            {selectedEvent.bookingUrl ? <Badge>Con booking</Badge> : <Badge>Senza booking URL</Badge>}
          </>
        ) : undefined}
        actions={(
          <>
            <Link className="button" to={selectedEvent ? `/events/${selectedEvent.id}` : '/events'}>
              Apri dettaglio
            </Link>
            <Link className="button button-secondary" to="/map">
              Vai alla mappa
            </Link>
            <Link className="button button-ghost" to="/search">
              Cerca eventi
            </Link>
          </>
        )}
      />

      <section className="section events-overview">
        <div className="section-head-premium">
          <div className="section-title-group">
            <p className="eyebrow">Vista rapida</p>
            <h2>Una lettura più utile dell agenda</h2>
          </div>
          <Link className="button button-ghost" to="/planner">Apri planner</Link>
        </div>
        <MetricRow
          items={[
            { label: 'Eventi pubblicati', value: events.length },
            { label: 'Con cover', value: withCoverCount },
            { label: 'Family friendly', value: familyFriendlyCount },
            { label: 'Con luogo associato', value: events.filter((event) => event.poiId).length },
          ]}
        />
      </section>

      <Section
        title="Eventi in evidenza"
        eyebrow="Seleziona"
        actions={<Link className="button button-ghost" to="/search">Ricerca avanzata</Link>}
      >
        {query.isLoading ? <LoadingBlock text="Sto preparando gli eventi..." /> : null}
        {!query.isLoading && events.length === 0 ? (
          <EmptyState title="Nessun evento pubblicato" text="Gli eventi compariranno qui appena approvati dal Comune." />
        ) : null}
        <div className="grid events-grid">
          {events.map((event) => (
            <div key={event.id} className="events-card-stack">
              <VisualCard
                title={event.title}
                eyebrow={formatEventDate(event.startsAt)}
                subtitle={event.venueName ?? event.address ?? 'Territorio di Subiaco'}
                body={event.shortDescription}
                imageSrc={event.coverMedia?.url}
                imageAlt={event.coverMedia?.altText ?? event.title}
                to={`/events/${event.id}`}
                badges={(
                  <>
                    {event.familyFriendly ? <Badge>Famiglie</Badge> : null}
                    {event.bookingUrl ? <Badge>Con prenotazione</Badge> : <Badge>Ingresso libero o info esterna</Badge>}
                  </>
                )}
                footer={(
                  <div className="action-row">
                    <button
                      type="button"
                      className={event.id === selectedEvent?.id ? 'button button-secondary' : 'button button-ghost'}
                      onClick={(clickEvent) => {
                        clickEvent.preventDefault();
                        setSelectedId(event.id);
                      }}
                    >
                      Metti in evidenza
                    </button>
                  </div>
                )}
              />
            </div>
          ))}
        </div>
      </Section>

      {selectedEvent ? (
        <Section
          title="Focus evento"
          eyebrow="Contesto"
          actions={<Link className="button button-ghost" to={`/events/${selectedEvent.id}`}>Apri scheda</Link>}
        >
          <div className="grid events-focus-grid">
            <article className="card events-focus-card">
              <p className="eyebrow">Quando</p>
              <h3>{formatEventDateTime(selectedEvent.startsAt)}</h3>
              <p className="muted">
                {selectedEvent.endsAt ? `Fino a ${formatEventDateTime(selectedEvent.endsAt)}` : 'Orario di fine non specificato'}
              </p>
            </article>
            <article className="card events-focus-card">
              <p className="eyebrow">Dove</p>
              <h3>{selectedEvent.venueName ?? 'Luogo non nominato'}</h3>
              <p className="muted">{selectedEvent.address ?? 'Indirizzo non specificato'}</p>
            </article>
            <article className="card events-focus-card">
              <p className="eyebrow">Accesso</p>
              <h3>{selectedEvent.bookingUrl ? 'Prenotazione disponibile' : 'Ingresso diretto o info esterna'}</h3>
              <p className="muted">
                {selectedEvent.familyFriendly ? 'Adatto anche a famiglie.' : 'Target non esplicitamente family-friendly.'}
              </p>
            </article>
          </div>
        </Section>
      ) : null}
    </div>
  );
}
