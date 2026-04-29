import { Badge, HeroMediaPanel, MetricRow, Section } from '../../components/ui.js';

export function AccessibilityPage(): JSX.Element {
  return (
    <div className="stack">
      <HeroMediaPanel
        eyebrow="Inclusione"
        title="Una UX piu leggibile e piu chiara deve partire da qui"
        description="Questa pagina presenta lo stato attuale dell esperienza accessibile e prepara il futuro pannello preferenze utente."
        topMeta={(
          <>
            <Badge>Contrasto</Badge>
            <Badge>Leggibilita</Badge>
            <Badge>Dati di dominio</Badge>
          </>
        )}
      />

      <section className="section">
        <div className="section-head-premium">
          <div className="section-title-group">
            <p className="eyebrow">Stato</p>
            <h2>Indicatori attuali</h2>
          </div>
        </div>
        <MetricRow
          items={[
            { label: 'Contrasto', value: 'Migliorato' },
            { label: 'Leggibilita', value: 'Migliorata' },
            { label: 'Filtri', value: 'Parziali' },
            { label: 'Preferenze utente', value: 'Da estendere' },
          ]}
        />
      </section>

      <Section title="Stato attuale" eyebrow="Analisi">
        <div className="grid">
          <article className="card">
            <h3>Contrasto e leggibilita</h3>
            <p>Il restyling attuale migliora scala tipografica, spaziatura e contrasto delle superfici principali.</p>
          </article>
          <article className="card">
            <h3>Dati di dominio</h3>
            <p>I contenuti supportano gia metadati di accessibilita che potranno essere esposti meglio nei dettagli.</p>
          </article>
        </div>
      </Section>

      <Section title="Prossimi sviluppi" eyebrow="Roadmap">
        <ul className="simple-list">
          <li>Preferenze utente persistite per leggibilita e inclusione</li>
          <li>Filtri accessibilita piu granulari in ricerca e discovery</li>
          <li>Maggiore evidenza dei metadata accessibili nelle pagine contenuto</li>
        </ul>
      </Section>
    </div>
  );
}
