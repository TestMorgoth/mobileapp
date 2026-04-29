import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SearchEntityType } from '@territorio/shared-types';
import { Link } from 'react-router-dom';
import { Badge, Card, EmptyState, HeroMediaPanel, LoadingBlock, MetricRow, Section } from '../../components/ui.js';
import { MetaBadges } from '../../components/ui/meta-badges.js';
import { fetchDiscovery, searchContent } from '../../services/content-api.js';
import { SearchFiltersPanel } from './components/search-filters-panel.js';

function buildLink(item: { entityType: SearchEntityType; entityId: string }) {
  switch (item.entityType) {
    case 'poi':
      return `/poi/${item.entityId}`;
    case 'event':
      return `/events/${item.entityId}`;
    case 'itinerary':
      return `/itineraries/${item.entityId}`;
    case 'story':
      return '/explore';
  }
}

export function SearchPage(): JSX.Element {
  const [q, setQ] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<SearchEntityType[]>([]);
  const [familyFriendly, setFamilyFriendly] = useState(false);
  const [accessibleOnly, setAccessibleOnly] = useState(false);

  const discoveryQuery = useQuery({
    queryKey: ['discovery'],
    queryFn: () => fetchDiscovery(),
  });

  const normalizedQuery = q.trim();

  const searchQuery = useQuery({
    queryKey: ['search', normalizedQuery, selectedTypes, familyFriendly, accessibleOnly],
    queryFn: () => searchContent({
      q: normalizedQuery,
      types: selectedTypes,
      page: 1,
      pageSize: 12,
      ...(familyFriendly ? { familyFriendly: true } : {}),
      ...(accessibleOnly ? { accessibleOnly: true } : {}),
    }),
    enabled: normalizedQuery.length >= 2 || selectedTypes.length > 0 || familyFriendly || accessibleOnly,
  });

  const isSearching = normalizedQuery.length >= 2 || selectedTypes.length > 0 || familyFriendly || accessibleOnly;
  const resultsCount = searchQuery.data?.total ?? 0;

  return (
    <div className="stack">
      <HeroMediaPanel
        eyebrow="Ricerca guidata"
        title="Trova contenuti utili in base a bisogno, tempo e accessibilita"
        description="La ricerca del canale mobile unisce query libera, filtri supportati e discovery iniziale per ridurre i passaggi prima di aprire un dettaglio."
        topMeta={(
          <>
            <Badge>Filtri reali</Badge>
            <Badge>{discoveryQuery.data?.sections.length ?? 0} sezioni discovery</Badge>
            <Badge>{isSearching ? `${resultsCount} risultati` : 'Ricerca inattiva'}</Badge>
          </>
        )}
        meta={(
          <>
            <Badge>Tipologie</Badge>
            <Badge>Famiglie</Badge>
            <Badge>Accessibilita</Badge>
          </>
        )}
        actions={(
          <>
            <Link className="button" to="/explore">Apri esplora</Link>
            <Link className="button button-secondary" to="/assistant">Chiedi all assistant</Link>
          </>
        )}
      />

      <section className="section">
        <div className="section-head-premium">
          <div className="section-title-group">
            <p className="eyebrow">Stato ricerca</p>
            <h2>Cerca e scopri</h2>
          </div>
        </div>
        <MetricRow
          items={[
            { label: 'Query', value: normalizedQuery || 'Nessuna' },
            { label: 'Tipi attivi', value: selectedTypes.length },
            { label: 'Famiglie', value: familyFriendly ? 'Si' : 'No' },
            { label: 'Accessibilita', value: accessibleOnly ? 'Si' : 'No' },
          ]}
        />
        <SearchFiltersPanel
          q={q}
          onQueryChange={setQ}
          selectedTypes={selectedTypes}
          onToggleType={(value) => {
            setSelectedTypes((current) => (
              current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
            ));
          }}
          familyFriendly={familyFriendly}
          onFamilyFriendlyChange={setFamilyFriendly}
          accessibleOnly={accessibleOnly}
          onAccessibleOnlyChange={setAccessibleOnly}
        />
      </section>

      {isSearching ? (
        <Section title={`Risultati trovati: ${resultsCount}`} eyebrow="Output">
          {searchQuery.isLoading ? <LoadingBlock text="Ricerca in corso..." /> : null}
          {!searchQuery.isLoading && (searchQuery.data?.items?.length ?? 0) === 0 ? (
            <EmptyState
              title="Nessun risultato"
              text="Prova a cambiare parola chiave o a togliere qualche filtro."
            />
          ) : null}
          <div className="grid">
            {(searchQuery.data?.items ?? []).map((item) => (
              <article
                key={`${item.entityType}-${item.entityId}`}
                className="card"
              >
                <div className="stack compact">
                  <div className="section-head">
                    <div>
                      <h3>{item.title}</h3>
                      <p className="muted">{item.summary ?? item.municipality ?? 'Contenuto territoriale disponibile.'}</p>
                    </div>
                    <MetaBadges
                      items={[
                        item.entityType.toUpperCase(),
                        ...(item.municipality ? [item.municipality] : []),
                        `score ${item.rank.toFixed(2)}`,
                      ]}
                    />
                  </div>
                  <Card
                    title="Apri contenuto"
                    subtitle="Vai al dettaglio"
                    to={buildLink(item)}
                  />
                </div>
              </article>
            ))}
          </div>
        </Section>
      ) : (
        <Section title="Scoperte del momento" eyebrow="Discovery">
          {discoveryQuery.isLoading ? <LoadingBlock text="Caricamento suggerimenti..." /> : null}
          {(discoveryQuery.data?.sections ?? []).map((section) => (
            <div key={section.code} className="stack">
              <h3>{section.title}</h3>
              <div className="grid">
                {section.items.map((item) => (
                  <Card
                    key={`${section.code}-${item.entityId}`}
                    title={item.title}
                    subtitle={item.entityType.toUpperCase()}
                    body={item.summary ?? item.municipality ?? ''}
                    to={buildLink(item)}
                  />
                ))}
              </div>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}
