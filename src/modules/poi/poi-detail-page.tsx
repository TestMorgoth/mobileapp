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
import { fetchPoi } from '../../services/content-api.js';
import { useFavoritesStore } from '../../store/favorites-store.js';

function formatDurationRange(min?: number | null, max?: number | null): string {
  if (min == null && max == null) {
    return 'Non specificata';
  }

  if (min != null && max != null && min !== max) {
    return `${min}-${max} min`;
  }

  return `${min ?? max} min`;
}

export function PoiDetailPage(): JSX.Element {
  const { id = '' } = useParams();
  const query = useQuery({ queryKey: ['poi', id], queryFn: () => fetchPoi(id), enabled: Boolean(id) });
  const favoritePoiIds = useFavoritesStore((state) => state.poiIds);
  const togglePoi = useFavoritesStore((state) => state.togglePoi);

  if (!id) {
    return <EmptyState title="POI non trovato" text="Identificativo mancante." />;
  }

  if (query.isLoading) {
    return <LoadingBlock />;
  }

  if (!query.data) {
    return <EmptyState title="POI non disponibile" text="Il contenuto richiesto non è disponibile." />;
  }

  const poi = query.data;

  return (
    <div className="stack">
      <HeroMediaPanel
        eyebrow="Luogo"
        title={poi.name}
        description={poi.shortDescription ?? poi.description ?? 'Scheda luogo disponibile nel canale mobile.'}
        backgroundImage={poi.coverMedia?.url}
        topMeta={(
          <>
            <Badge>{poi.municipality}</Badge>
            <Badge>{formatDurationRange(poi.visitDurationMin, poi.visitDurationMax)}</Badge>
            {poi.familyFriendly ? <Badge>Family friendly</Badge> : null}
          </>
        )}
        meta={(
          <>
            {poi.coordinates ? <Badge>Coordinate disponibili</Badge> : <Badge>Coordinate assenti</Badge>}
            {poi.coverMedia ? <Badge>Cover presente</Badge> : <Badge>Fallback cover</Badge>}
            {poi.seasonalityNotes ? <Badge>Note stagionali</Badge> : <Badge>Nessuna nota stagionale</Badge>}
          </>
        )}
        actions={(
          <>
            <button className="button button-secondary" onClick={() => togglePoi(poi.id)}>
              {favoritePoiIds.includes(poi.id) ? 'Rimuovi preferito' : 'Salva preferito'}
            </button>
            <Link className="button button-ghost" to="/assistant">
              Chiedi all assistant
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
            { label: 'Comune', value: poi.municipality },
            { label: 'Durata visita', value: formatDurationRange(poi.visitDurationMin, poi.visitDurationMax) },
            { label: 'Famiglie', value: poi.familyFriendly ? 'Si' : 'Non indicato' },
            { label: 'Mappa', value: poi.coordinates ? 'Disponibile' : 'Non disponibile' },
          ]}
        />
      </section>

      <Section title="Panoramica" eyebrow="Contenuto">
        <div className="detail-block">
          <p>{poi.description ?? poi.shortDescription ?? 'Descrizione non disponibile.'}</p>
        </div>
      </Section>

      <Section title="Informazioni utili" eyebrow="Pratiche">
        <div className="grid">
          <article className="card">
            <h3>Comune</h3>
            <p>{poi.municipality}</p>
          </article>
          <article className="card">
            <h3>Indirizzo</h3>
            <p>{poi.address ?? 'Informazione non disponibile.'}</p>
          </article>
          <article className="card">
            <h3>Durata visita</h3>
            <p>{formatDurationRange(poi.visitDurationMin, poi.visitDurationMax)}</p>
          </article>
          <article className="card">
            <h3>Accesso famiglie</h3>
            <p>{poi.familyFriendly ? 'Contenuto adatto a famiglie.' : 'Nessuna indicazione specifica.'}</p>
          </article>
        </div>
      </Section>

      <Section title="Da non perdere" eyebrow="Lettura editoriale">
        <div className="grid">
          <article className="card">
            <h3>Perche aprirlo ora</h3>
            <p>{poi.shortDescription ?? 'Scheda sintetica non disponibile.'}</p>
          </article>
          <article className="card">
            <h3>Contesto stagionale</h3>
            <p>{poi.seasonalityNotes ?? 'Nessuna nota stagionale disponibile per questo luogo.'}</p>
          </article>
          <article className="card">
            <h3>Orientamento</h3>
            <p>
              {poi.coordinates
                ? 'Il luogo puo essere aperto direttamente in mappa e integrato nel percorso di visita.'
                : 'Questo luogo non espone ancora coordinate nel payload pubblico mobile.'}
            </p>
          </article>
        </div>
      </Section>

      {poi.coordinates ? (
        <Section title="Mappa" eyebrow="Orientati">
          <div className="stack compact">
            <p>Questo luogo ha coordinate disponibili e puo essere aperto direttamente sulla mappa.</p>
            <Link
              className="button"
              to={`/map?lat=${poi.coordinates.latitude}&lng=${poi.coordinates.longitude}&label=${encodeURIComponent(poi.name)}`}
            >
              Apri in mappa
            </Link>
          </div>
        </Section>
      ) : null}
    </div>
  );
}
