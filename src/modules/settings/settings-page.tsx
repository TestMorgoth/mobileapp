import { Badge, HeroMediaPanel, MetricRow, Section } from '../../components/ui.js';

export function SettingsPage(): JSX.Element {
  return (
    <div className="stack">
      <HeroMediaPanel
        eyebrow="Configurazione"
        title="Controlli rapidi per il comportamento del canale mobile"
        description="Le impostazioni restano ancora foundation, ma sono presentate come pannello di prodotto e non come semplice lista."
        topMeta={(
          <>
            <Badge>Lingua</Badge>
            <Badge>Permessi</Badge>
            <Badge>Cache locale</Badge>
          </>
        )}
      />

      <section className="section">
        <div className="section-head-premium">
          <div className="section-title-group">
            <p className="eyebrow">Stato</p>
            <h2>Preferenze previste</h2>
          </div>
        </div>
        <MetricRow
          items={[
            { label: 'Lingua', value: 'Da attivare' },
            { label: 'Permessi', value: 'Parziali' },
            { label: 'Cache', value: 'Foundation' },
            { label: 'Notifiche', value: 'Future' },
          ]}
        />
        <div className="grid">
          <article className="card">
            <h3>Lingua applicazione</h3>
            <p>Preparazione per localizzazione e preferenze personali.</p>
          </article>
          <article className="card">
            <h3>Geolocalizzazione</h3>
            <p>Controlli sui permessi necessari a mappa e suggerimenti contestuali.</p>
          </article>
          <article className="card">
            <h3>Cache locale</h3>
            <p>Gestione dei contenuti essenziali per velocizzare l'esperienza.</p>
          </article>
          <article className="card">
            <h3>Notifiche future</h3>
            <p>Predisposizione per comunicazioni su eventi e promemoria visita.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
