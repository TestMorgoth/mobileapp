import { Link } from 'react-router-dom';
import { Badge, HeroMediaPanel, MetricRow, Section } from '../../components/ui.js';
import { useFavoritesStore } from '../../store/favorites-store.js';
import { FavoritesList } from './components/favorites-list.js';

export function FavoritesPage(): JSX.Element {
  const poiIds = useFavoritesStore((state) => state.poiIds);
  const eventIds = useFavoritesStore((state) => state.eventIds);
  const itineraryIds = useFavoritesStore((state) => state.itineraryIds);

  return (
    <div className="stack">
      <HeroMediaPanel
        eyebrow="Continuita locale"
        title="Ritrova subito i contenuti che hai deciso di tenere a portata di mano"
        description="I preferiti restano persistiti localmente e diventano un punto di rientro reale dell esperienza mobile."
        topMeta={(
          <>
            <Badge>{poiIds.length} luoghi</Badge>
            <Badge>{eventIds.length} eventi</Badge>
            <Badge>{itineraryIds.length} itinerari</Badge>
          </>
        )}
        meta={<Badge>{poiIds.length + eventIds.length + itineraryIds.length} contenuti salvati</Badge>}
        actions={<Link className="button" to="/explore">Torna a esplora</Link>}
      />

      <section className="section">
        <div className="section-head-premium">
          <div className="section-title-group">
            <p className="eyebrow">Riepilogo</p>
            <h2>Stato dei preferiti</h2>
          </div>
        </div>
        <MetricRow
          items={[
            { label: 'Luoghi', value: poiIds.length },
            { label: 'Eventi', value: eventIds.length },
            { label: 'Itinerari', value: itineraryIds.length },
            { label: 'Totale', value: poiIds.length + eventIds.length + itineraryIds.length },
          ]}
        />
      </section>

      <FavoritesList
        title="Luoghi salvati"
        items={poiIds.map((id) => ({ id, label: `POI ${id.slice(0, 8)}`, subtitle: 'Apri il dettaglio del luogo', to: `/poi/${id}` }))}
        emptyText="Nessun luogo salvato al momento."
      />
      <FavoritesList
        title="Eventi salvati"
        items={eventIds.map((id) => ({ id, label: `Evento ${id.slice(0, 8)}`, subtitle: 'Apri il dettaglio dell’evento', to: `/events/${id}` }))}
        emptyText="Nessun evento salvato al momento."
      />
      <FavoritesList
        title="Itinerari salvati"
        items={itineraryIds.map((id) => ({ id, label: `Itinerario ${id.slice(0, 8)}`, subtitle: 'Apri il dettaglio dell’itinerario', to: `/itineraries/${id}` }))}
        emptyText="Nessun itinerario salvato al momento."
      />
    </div>
  );
}
