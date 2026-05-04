import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { SearchEntityType, SearchResultItem } from '@territorio/shared-types';
import {
  Badge,
  EmptyState,
  HeroMediaPanel,
  LoadingBlock,
  MetricRow,
  Section,
  VisualCard,
} from '../../components/ui.js';
import { fetchDiscovery, fetchPois, fetchEvents, fetchItineraries } from '../../services/content-api.js';

function buildLink(item: { entityType: SearchEntityType; entityId: string }): string {
  switch (item.entityType) {
    case 'poi':
      return `/poi/${item.entityId}`;
    case 'event':
      return `/events/${item.entityId}`;
    case 'itinerary':
      return `/itineraries/${item.entityId}`;
    case 'story':
      return '/search';
  }
}

function sectionEyebrow(code: string): string {
  switch (code) {
    case 'trending':
      return 'Trending';
    case 'poi':
      return 'Luoghi';
    case 'events':
      return 'Eventi';
    case 'itineraries':
      return 'Itinerari';
    case 'stories':
      return 'Stories';
    default:
      return 'Discovery';
  }
}

function sectionCta(code: string): string {
  switch (code) {
    case 'poi':
      return '/poi';
    case 'events':
      return '/events';
    case 'itineraries':
      return '/itineraries';
    case 'stories':
      return '/search';
    case 'trending':
    default:
      return '/search';
  }
}

function sectionCtaLabel(code: string): string {
  switch (code) {
    case 'poi':
      return 'Tutti i luoghi';
    case 'events':
      return 'Tutti gli eventi';
    case 'itineraries':
      return 'Tutti gli itinerari';
    case 'stories':
      return 'Apri ricerca';
    case 'trending':
    default:
      return 'Scopri di più';
  }
}

function resultBadges(item: SearchResultItem): string[] {
  return [
    item.entityType.toUpperCase(),
    ...(item.municipality ? [item.municipality] : []),
    ...(item.familyFriendly ? ['Famiglie'] : []),
    ...(item.startsAt ? [new Date(item.startsAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })] : []),
  ];
}

export function ExplorePage(): JSX.Element {
  const discoveryQuery = useQuery({ queryKey: ['discovery'], queryFn: () => fetchDiscovery() });
  const poisQuery = useQuery({ queryKey: ['pois'], queryFn: fetchPois });
  const eventsQuery = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const itinerariesQuery = useQuery({ queryKey: ['itineraries'], queryFn: fetchItineraries });
  const pois = poisQuery.data ?? [];
  const events = eventsQuery.data ?? [];
  const itineraries = itinerariesQuery.data ?? [];
  const featuredPoi = pois.find((poi) => poi.coverMedia?.url) ?? pois[0] ?? null;
  const discoverySections = discoveryQuery.data?.sections ?? [];

  return (
    <div className="stack explore-stack">
      <HeroMediaPanel
        eyebrow="Discovery per intenti"
        title="Esplora il territorio seguendo motivazioni di visita reali"
        description="La pagina discovery mette insieme sezioni suggerite dal backend, contenuti pubblicati e scorciatoie coerenti con il planner, la mappa e la ricerca."
        backgroundImage={featuredPoi?.coverMedia?.url}
        topMeta={(
          <>
            <Badge>{discoverySections.length} sezioni discovery</Badge>
            <Badge>{pois.length} luoghi</Badge>
            <Badge>{events.length} eventi</Badge>
          </>
        )}
        meta={(
          <>
            <Badge>Famiglie</Badge>
            <Badge>Accessibilita</Badge>
            <Badge>Tempo di visita</Badge>
            <Badge>Mappa</Badge>
          </>
        )}
        actions={(
          <>
            <Link className="button" to="/search">Apri ricerca</Link>
            <Link className="button button-secondary" to="/planner">Costruisci itinerario</Link>
            <Link className="button button-ghost" to="/map">Apri mappa</Link>
          </>
        )}
      />

      <section className="section explore-intent-panel">
        <div className="section-head-premium">
          <div className="section-title-group">
            <p className="eyebrow">Scelte rapide</p>
            <h2>Inizia da un bisogno, non da una lista</h2>
          </div>
          <Link className="button button-ghost" to="/search">Filtri completi</Link>
        </div>
        <div className="grid explore-intent-grid">
          <VisualCard
            title="Sono con la famiglia"
            eyebrow="Intento"
            subtitle="Contenuti orientati a soste semplici e ritmi più morbidi"
            body="Usa ricerca e discovery per restringere subito i contenuti family-friendly già disponibili."
            to="/search"
            badges={<><Badge>Famiglie</Badge><Badge>Fallback reali</Badge></>}
          />
          <VisualCard
            title="Ho poco tempo"
            eyebrow="Intento"
            subtitle="Percorsi rapidi, schede sintetiche e tappe mirate"
            body="Passa al planner o apri POI ed eventi con tempi di visita e informazioni essenziali."
            to="/planner"
            badges={<><Badge>Tempo</Badge><Badge>Planner</Badge></>}
          />
          <VisualCard
            title="Mi oriento sulla mappa"
            eyebrow="Intento"
            subtitle="Geolocalizzazione e passaggio rapido ai contenuti vicini"
            body="La mappa resta la scorciatoia migliore quando la visita parte dal contesto fisico del territorio."
            to="/map"
            badges={<><Badge>Mappa</Badge><Badge>Posizione</Badge></>}
          />
          <VisualCard
            title="Chiedo all assistant"
            eyebrow="Intento"
            subtitle="Domande libere prima di filtrare o aprire un dettaglio"
            body="Quando il bisogno è ambiguo, l assistant può proporre luoghi, eventi e percorsi già pubblicati."
            to="/assistant"
            badges={<><Badge>Assistant</Badge><Badge>Percorsi</Badge></>}
          />
        </div>
        <MetricRow
          items={[
            { label: 'Sezioni discovery', value: discoverySections.length },
            { label: 'Luoghi pubblicati', value: pois.length },
            { label: 'Eventi pubblicati', value: events.length },
            { label: 'Itinerari', value: itineraries.length },
          ]}
        />
      </section>

      <Section
        title="Scoperte del momento"
        eyebrow="Backend discovery"
        actions={(
          <Link className="button button-ghost" to="/search">
            Vai alla ricerca
          </Link>
        )}
      >
        {discoveryQuery.isLoading ? <LoadingBlock text="Sto preparando la discovery..." /> : null}
        {!discoveryQuery.isLoading && discoverySections.length === 0 ? (
          <EmptyState
            title="Discovery non disponibile"
            text="Le sezioni suggerite compariranno qui quando il backend avrà contenuti sufficienti."
          />
        ) : null}
        <div className="stack">
          {discoverySections.map((section) => (
            <div key={section.code} className="stack compact">
              <div className="section-head-premium">
                <div className="section-title-group">
                  <p className="eyebrow">{sectionEyebrow(section.code)}</p>
                  <h3>{section.title}</h3>
                </div>
                <Link className="button button-ghost" to={sectionCta(section.code)}>
                  {sectionCtaLabel(section.code)}
                </Link>
              </div>
              <div className="grid explore-feature-grid">
                {section.items.slice(0, 4).map((item) => (
                  <VisualCard
                    key={`${section.code}-${item.entityId}`}
                    title={item.title}
                    eyebrow={item.entityType.toUpperCase()}
                    subtitle={item.summary ?? item.municipality ?? 'Contenuto territoriale pubblicato'}
                    body={item.tags.length > 0 ? item.tags.slice(0, 3).join(' · ') : 'Apri il contenuto per approfondire il contesto.'}
                    to={buildLink(item)}
                    badges={<>{resultBadges(item).map((badge) => <Badge key={badge}>{badge}</Badge>)}</>}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Luoghi consigliati"
        eyebrow="POI"
        actions={<Link className="button button-ghost" to="/poi">Apri luoghi</Link>}
      >
        {poisQuery.isLoading ? <LoadingBlock text="Sto preparando i luoghi consigliati..." /> : null}
        {!poisQuery.isLoading && pois.length === 0 ? (
          <EmptyState title="Nessun luogo disponibile" text="I POI pubblicati compariranno qui appena approvati." />
        ) : null}
        <div className="grid explore-feature-grid">
          {pois.slice(0, 4).map((poi) => (
            <VisualCard
              key={poi.id}
              title={poi.name}
              eyebrow={poi.municipality}
              subtitle={poi.familyFriendly ? 'Adatto anche a famiglie' : 'Scoperta territoriale'}
              body={poi.shortDescription}
              imageSrc={poi.coverMedia?.url}
              imageAlt={poi.coverMedia?.altText ?? poi.name}
              to={`/poi/${poi.id}`}
              badges={(
                <>
                  {poi.coverMedia ? <Badge>Cover presente</Badge> : <Badge>Fallback cover</Badge>}
                  {poi.visitDurationMin != null ? <Badge>{poi.visitDurationMin} min+</Badge> : null}
                </>
              )}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Eventi e percorsi da seguire"
        eyebrow="Agenda e itinerari"
        actions={<Link className="button button-ghost" to="/events">Apri eventi</Link>}
      >
        {(eventsQuery.isLoading || itinerariesQuery.isLoading) ? <LoadingBlock text="Sto preparando eventi e percorsi..." /> : null}
        <div className="grid explore-feature-grid">
          {events.slice(0, 2).map((event) => (
            <VisualCard
              key={event.id}
              title={event.title}
              eyebrow="Evento"
              subtitle={new Date(event.startsAt).toLocaleString('it-IT')}
              body={event.shortDescription}
              imageSrc={event.coverMedia?.url}
              imageAlt={event.coverMedia?.altText ?? event.title}
              to={`/events/${event.id}`}
              badges={(
                <>
                  {event.bookingUrl ? <Badge>Con prenotazione</Badge> : <Badge>Senza booking URL</Badge>}
                  {event.familyFriendly ? <Badge>Famiglie</Badge> : null}
                </>
              )}
            />
          ))}
          {itineraries.slice(0, 2).map((itinerary) => (
            <VisualCard
              key={itinerary.id}
              title={itinerary.title}
              eyebrow="Itinerario"
              subtitle={itinerary.itineraryType}
              body={itinerary.summary}
              to={`/itineraries/${itinerary.id}`}
              badges={(
                <>
                  {itinerary.durationMinutes ? <Badge>{itinerary.durationMinutes} min</Badge> : null}
                  {itinerary.targetAudience ? <Badge>{itinerary.targetAudience}</Badge> : null}
                </>
              )}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
