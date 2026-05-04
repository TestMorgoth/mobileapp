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
import { fetchPois } from '../../services/content-api.js';

function formatDurationRange(min?: number | null, max?: number | null): string | null {
  if (min == null && max == null) {
    return null;
  }

  if (min != null && max != null && min !== max) {
    return `${min}-${max} min`;
  }

  return `${min ?? max} min`;
}

export function PoiListPage(): JSX.Element {
  const query = useQuery({ queryKey: ['pois'], queryFn: fetchPois });
  const pois = query.data ?? [];
  const selectedPoi = pois.find((poi) => poi.coverMedia?.url) ?? pois[0] ?? null;
  const familyFriendlyCount = pois.filter((poi) => poi.familyFriendly).length;
  const withCoverCount = pois.filter((poi) => poi.coverMedia?.url).length;
  const withCoordinatesCount = pois.filter((poi) => poi.coordinates).length;

  return (
    <div className="stack poi-stack">
      <HeroMediaPanel
        eyebrow="Patrimonio e scoperta"
        title={selectedPoi?.name ?? 'Luoghi del territorio da navigare in chiave media-first'}
        description={
          selectedPoi?.shortDescription ??
          'La nuova esperienza POI mette in primo piano copertine, tempi di visita, coordinate e segnali editoriali già presenti nel dataset.'
        }
        backgroundImage={selectedPoi?.coverMedia?.url}
        topMeta={(
          <>
            <Badge>{pois.length} luoghi</Badge>
            <Badge>{withCoverCount} con cover</Badge>
            <Badge>{withCoordinatesCount} con coordinate</Badge>
          </>
        )}
        meta={selectedPoi ? (
          <>
            <Badge>{selectedPoi.municipality}</Badge>
            {formatDurationRange(selectedPoi.visitDurationMin, selectedPoi.visitDurationMax) ? (
              <Badge>{formatDurationRange(selectedPoi.visitDurationMin, selectedPoi.visitDurationMax)!}</Badge>
            ) : null}
            {selectedPoi.familyFriendly ? <Badge>Famiglie</Badge> : <Badge>Scoperta editoriale</Badge>}
          </>
        ) : undefined}
        actions={(
          <>
            <Link className="button" to={selectedPoi ? `/poi/${selectedPoi.id}` : '/poi'}>
              Apri dettaglio
            </Link>
            <Link className="button button-secondary" to="/map">
              Vai alla mappa
            </Link>
            <Link className="button button-ghost" to="/search">
              Cerca luoghi
            </Link>
          </>
        )}
      />

      <section className="section poi-overview">
        <div className="section-head-premium">
          <div className="section-title-group">
            <p className="eyebrow">Vista rapida</p>
            <h2>Una lettura più utile dei luoghi</h2>
          </div>
          <Link className="button button-ghost" to="/explore">Torna a esplora</Link>
        </div>
        <MetricRow
          items={[
            { label: 'Luoghi pubblicati', value: pois.length },
            { label: 'Family friendly', value: familyFriendlyCount },
            { label: 'Con cover', value: withCoverCount },
            { label: 'Con coordinate', value: withCoordinatesCount },
          ]}
        />
      </section>

      <Section
        title="Luoghi in evidenza"
        eyebrow="Catalogo"
        actions={<Link className="button button-ghost" to="/search">Ricerca avanzata</Link>}
      >
        {query.isLoading ? <LoadingBlock text="Sto preparando i luoghi..." /> : null}
        {!query.isLoading && pois.length === 0 ? (
          <EmptyState title="Nessun luogo disponibile" text="I contenuti saranno disponibili dopo la pubblicazione dal backoffice." />
        ) : null}
        <div className="grid poi-grid">
          {pois.map((poi) => (
            <VisualCard
              key={poi.id}
              title={poi.name}
              eyebrow={poi.municipality}
              subtitle={formatDurationRange(poi.visitDurationMin, poi.visitDurationMax) ?? 'Tempo di visita non specificato'}
              body={poi.shortDescription}
              imageSrc={poi.coverMedia?.url}
              imageAlt={poi.coverMedia?.altText ?? poi.name}
              to={`/poi/${poi.id}`}
              badges={(
                <>
                  {poi.familyFriendly ? <Badge>Famiglie</Badge> : null}
                  {poi.coverMedia ? <Badge>Cover presente</Badge> : <Badge>Fallback cover</Badge>}
                  {poi.coordinates ? <Badge>Con mappa</Badge> : <Badge>Senza coordinate</Badge>}
                </>
              )}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
