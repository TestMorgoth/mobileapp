import { Badge, HeroMediaPanel, MetricRow, Section, VisualCard } from '../../components/ui.js';
import { Link } from 'react-router-dom';
import { useSessionStore } from '../../store/session-store.js';
import { useFavoritesStore } from '../../store/favorites-store.js';

export function ProfilePage(): JSX.Element {
  const accessToken = useSessionStore((state) => state.accessToken);
  const poiCount = useFavoritesStore((state) => state.poiIds.length);
  const eventCount = useFavoritesStore((state) => state.eventIds.length);
  const itineraryCount = useFavoritesStore((state) => state.itineraryIds.length);

  return (
    <div className="stack">
      <HeroMediaPanel
        eyebrow="Profilo locale"
        title="Stato dell esperienza personale sul dispositivo"
        description="Questa sezione raccoglie gli elementi che rendono l app piu personale senza introdurre nuova logica backend."
        topMeta={(
          <>
            <Badge>{accessToken ? 'Sessione presente' : 'Sessione assente'}</Badge>
            <Badge>{poiCount + eventCount + itineraryCount} preferiti</Badge>
          </>
        )}
        meta={<Badge>Profilo locale</Badge>}
        actions={<Link className="button" to="/settings">Apri impostazioni</Link>}
      />

      <section className="section">
        <div className="section-head-premium">
          <div className="section-title-group">
            <p className="eyebrow">Sessione</p>
            <h2>Stato locale</h2>
          </div>
        </div>
        <MetricRow
          items={[
            { label: 'Autenticazione', value: accessToken ? 'Token presente' : 'Nessun token' },
            { label: 'Luoghi', value: poiCount },
            { label: 'Eventi', value: eventCount },
            { label: 'Itinerari', value: itineraryCount },
          ]}
        />
      </section>

      <Section title="Sviluppi previsti" eyebrow="Roadmap">
        <ul className="simple-list">
          <li>Preferenze personali e lingua del visitatore</li>
          <li>Storico visite e rientro rapido nei contenuti consultati</li>
          <li>Consenso analytics e gestione privacy lato utente</li>
        </ul>
      </Section>

      <Section title="Strumenti" eyebrow="Scorciatoie">
        <div className="grid">
          <VisualCard
            title="Apri mappa"
            eyebrow="Strumento"
            subtitle="Geolocalizzazione e orientamento"
            body="Vai alla mappa con posizione utente, target e marker."
            to="/map"
          />
          <VisualCard
            title="Impostazioni"
            eyebrow="Strumento"
            subtitle="Lingua, permessi e configurazioni"
            body="Controlla le preferenze disponibili del canale mobile."
            to="/settings"
          />
        </div>
      </Section>
    </div>
  );
}
