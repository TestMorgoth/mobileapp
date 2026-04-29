import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Badge,
  EmptyState,
  HeroMediaPanel,
  LoadingBlock,
  MetricRow,
  OrnamentDivider,
  PremiumSectionHead,
  Section,
  VisualCard,
} from '../../components/ui.js';
import { fetchEvents, fetchItineraries, fetchPois, fetchStories } from '../../services/content-api.js';
import { useFavoritesStore } from '../../store/favorites-store.js';

function formatEventDate(value: string): string {
  return new Date(value).toLocaleDateString('it-IT', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

function formatDurationRange(min?: number | null, max?: number | null): string | null {
  if (min == null && max == null) {
    return null;
  }

  if (min != null && max != null && min !== max) {
    return `${min}-${max} min`;
  }

  return `${min ?? max} min`;
}

export function HomePage(): JSX.Element {
  const poisQuery = useQuery({ queryKey: ['pois'], queryFn: fetchPois });
  const eventsQuery = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const itinerariesQuery = useQuery({ queryKey: ['itineraries'], queryFn: fetchItineraries });
  const storiesQuery = useQuery({ queryKey: ['stories'], queryFn: fetchStories });
  const favoritePoiIds = useFavoritesStore((state) => state.poiIds);
  const favoriteEventIds = useFavoritesStore((state) => state.eventIds);
  const favoriteItineraryIds = useFavoritesStore((state) => state.itineraryIds);

  const pois = poisQuery.data ?? [];
  const events = eventsQuery.data ?? [];
  const itineraries = itinerariesQuery.data ?? [];
  const stories = storiesQuery.data ?? [];
  const featuredPoi = pois.find((poi) => poi.coverMedia?.url) ?? pois[0] ?? null;
  const featuredEvents = events.slice(0, 2);
  const featuredPois = pois.slice(0, 2);
  const featuredItinerary = itineraries[0] ?? null;
  const featuredStory = stories[0] ?? null;
  const favoritesCount = favoritePoiIds.length + favoriteEventIds.length + favoriteItineraryIds.length;
  const heroMeta = featuredPoi
    ? [
        featuredPoi.municipality,
        formatDurationRange(featuredPoi.visitDurationMin, featuredPoi.visitDurationMax),
        featuredPoi.familyFriendly ? 'Family friendly' : null,
      ].filter(Boolean) as string[]
    : ['Comune demo'];

  return (
    <div className="stack home-stack">
      <HeroMediaPanel
        eyebrow="Subiaco live"
        title={featuredPoi?.name ?? 'Scopri il territorio con una navigazione più immersiva'}
        description={
          featuredPoi?.shortDescription ??
          'Luoghi, eventi e itinerari pubblicati vengono trasformati in una home orientata all azione, alla scoperta e alla continuita di visita.'
        }
        backgroundImage={featuredPoi?.coverMedia?.url}
        topMeta={(
          <>
            <Badge>Comune demo</Badge>
            <Badge>{events.length} eventi pubblicati</Badge>
            <Badge>{favoritesCount} preferiti salvati</Badge>
          </>
        )}
        meta={heroMeta.map((item) => <Badge key={item}>{item}</Badge>)}
        actions={(
          <>
            <Link className="button" to="/assistant">Apri assistant</Link>
            <Link className="button button-secondary" to="/planner">Pianifica visita</Link>
            <Link className="button button-ghost" to="/map">Vai alla mappa</Link>
          </>
        )}
      />

      <section className="section home-overview">
        <PremiumSectionHead
          eyebrow="Stato visita"
          title="Un punto di ingresso più utile"
          action={<Link className="button button-ghost" to="/explore">Apri esplora</Link>}
        />
        <MetricRow
          items={[
            { label: 'Luoghi', value: pois.length },
            { label: 'Eventi', value: events.length },
            { label: 'Itinerari', value: itineraries.length },
            { label: 'Preferiti', value: favoritesCount },
          ]}
        />
        <div className="home-overview-copy">
          <p className="home-overview-text">
            La home ora privilegia contenuti realmente pubblicati, accessi primari e casi fallback già presenti nel dataset demo.
            Questo permette di verificare subito la resa del redesign su schede complete e incomplete.
          </p>
          <OrnamentDivider />
        </div>
      </section>

      <Section
        title="Accessi ad alta priorità"
        eyebrow="Quick start"
        actions={<Link className="button button-ghost" to="/search">Ricerca avanzata</Link>}
      >
        <div className="grid home-action-grid">
          <VisualCard
            title="Luoghi del territorio"
            eyebrow="Patrimonio"
            subtitle="Punti di interesse e soste consigliate"
            body="Apri subito il catalogo dei luoghi con cover, coordinate e fallback reali."
            to="/poi"
            badges={<><Badge>{pois.length} schede</Badge><Badge>Media-first</Badge></>}
          />
          <VisualCard
            title="Eventi in agenda"
            eyebrow="Agenda"
            subtitle="Appuntamenti e attivita"
            body="Passa direttamente agli eventi pubblicati, con CTA e copertine già disponibili."
            to="/events"
            badges={<><Badge>{events.length} eventi</Badge><Badge>Azioni rapide</Badge></>}
          />
          <VisualCard
            title="Percorsi pronti"
            eyebrow="Planner"
            subtitle="Itinerari editoriali e visite guidate"
            body="Consulta proposte strutturate prima di generare un nuovo percorso con assistant o planner."
            to="/itineraries"
            badges={<><Badge>{itineraries.length} itinerari</Badge><Badge>Editoriale</Badge></>}
          />
          <VisualCard
            title="Continuità di visita"
            eyebrow="Sessione"
            subtitle="Preferiti, mappa e profilo"
            body="Riprendi da dove eri rimasto e porta con te i contenuti salvati durante la permanenza."
            to="/favorites"
            badges={<><Badge>{favoritesCount} salvati</Badge><Badge>Persistenza locale</Badge></>}
          />
        </div>
      </Section>

      <Section
        title="In primo piano"
        eyebrow="Luoghi"
        actions={<Link className="button button-ghost" to="/poi">Tutti i luoghi</Link>}
      >
        {poisQuery.isLoading ? <LoadingBlock text="Sto preparando i luoghi in evidenza..." /> : null}
        {!poisQuery.isLoading && featuredPois.length === 0 ? (
          <EmptyState title="Nessun luogo in evidenza" text="I POI pubblicati compariranno qui appena disponibili." />
        ) : null}
        <div className="grid home-feature-grid">
          {featuredPois.map((poi) => (
            <VisualCard
              key={poi.id}
              title={poi.name}
              eyebrow={poi.municipality}
              subtitle={formatDurationRange(poi.visitDurationMin, poi.visitDurationMax) ?? 'Tempo di visita flessibile'}
              body={poi.shortDescription}
              imageSrc={poi.coverMedia?.url}
              imageAlt={poi.coverMedia?.altText ?? poi.name}
              to={`/poi/${poi.id}`}
              badges={(
                <>
                  {poi.familyFriendly ? <Badge>Famiglie</Badge> : null}
                  {poi.coverMedia ? <Badge>Cover presente</Badge> : <Badge>Fallback cover</Badge>}
                </>
              )}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Agenda vicina"
        eyebrow="Eventi"
        actions={<Link className="button button-ghost" to="/events">Vai agli eventi</Link>}
      >
        {eventsQuery.isLoading ? <LoadingBlock text="Sto preparando l agenda..." /> : null}
        {!eventsQuery.isLoading && featuredEvents.length === 0 ? (
          <EmptyState title="Nessun evento disponibile" text="Gli eventi pubblicati appariranno qui appena approvati." />
        ) : null}
        <div className="grid home-feature-grid">
          {featuredEvents.map((event) => (
            <VisualCard
              key={event.id}
              title={event.title}
              eyebrow={formatEventDate(event.startsAt)}
              subtitle={event.venueName ?? event.address ?? 'Territorio di Subiaco'}
              body={event.shortDescription}
              imageSrc={event.coverMedia?.url}
              imageAlt={event.coverMedia?.altText ?? event.title}
              to={`/events/${event.id}`}
              badges={(
                <>
                  <Badge>{event.familyFriendly ? 'Family friendly' : 'Per adulti e gruppi'}</Badge>
                  {event.bookingUrl ? <Badge>Con prenotazione</Badge> : <Badge>Senza booking URL</Badge>}
                </>
              )}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Percorsi e storie"
        eyebrow="Narrazione"
        actions={<Link className="button button-ghost" to="/itineraries">Apri itinerari</Link>}
      >
        <div className="grid home-story-grid">
          {featuredItinerary ? (
            <VisualCard
              title={featuredItinerary.title}
              eyebrow="Itinerario"
              subtitle={featuredItinerary.itineraryType}
              body={featuredItinerary.summary}
              to={`/itineraries/${featuredItinerary.id}`}
              badges={(
                <>
                  {featuredItinerary.durationMinutes ? <Badge>{featuredItinerary.durationMinutes} min</Badge> : null}
                  {featuredItinerary.distanceKm ? <Badge>{featuredItinerary.distanceKm} km</Badge> : null}
                </>
              )}
            />
          ) : (
            <article className="card">
              <p className="eyebrow">Itinerario</p>
              <h3>Nessun itinerario disponibile</h3>
              <p>Gli itinerari editoriali pubblicati compariranno qui appena disponibili.</p>
            </article>
          )}

          {featuredStory ? (
            <article className="card home-story-card">
              <p className="eyebrow">Story editoriale</p>
              <h3>{featuredStory.title}</h3>
              {featuredStory.summary ? <p className="muted">{featuredStory.summary}</p> : null}
              <div className="chips">
                <Badge>{featuredStory.storyType}</Badge>
                <Badge>Senza route dedicata</Badge>
              </div>
              <p className="home-story-body">{featuredStory.body}</p>
            </article>
          ) : (
            <article className="card">
              <p className="eyebrow">Story</p>
              <h3>Nessuna story disponibile</h3>
              <p>Le storie editoriali pubblicate compariranno qui appena disponibili.</p>
            </article>
          )}
        </div>
      </Section>
    </div>
  );
}
