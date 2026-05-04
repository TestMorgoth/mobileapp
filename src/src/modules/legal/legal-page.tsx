import { Badge, HeroMediaPanel, Section } from '../../components/ui.js';

export function LegalPage(): JSX.Element {
  return (
    <div className="stack">
      <HeroMediaPanel
        eyebrow="Trasparenza"
        title="Riferimenti chiari per privacy, utilizzo del servizio e contatti istituzionali"
        description="Questa sezione prepara la struttura documentale finale con una gerarchia leggibile anche da mobile."
        topMeta={(
          <>
            <Badge>Privacy</Badge>
            <Badge>Termini</Badge>
            <Badge>Contatti</Badge>
          </>
        )}
      />

      <Section title="Contenuti previsti" eyebrow="Documenti">
        <div className="grid">
          <article className="card">
            <h3>Privacy policy</h3>
            <p>Informazioni sul trattamento dei dati e sulle basi di utilizzo del servizio.</p>
          </article>
          <article className="card">
            <h3>Termini di utilizzo</h3>
            <p>Ambito del servizio, responsabilita e limiti operativi.</p>
          </article>
          <article className="card">
            <h3>Contatti istituzionali</h3>
            <p>Riferimenti del Comune o dell'ente titolare del canale pubblico.</p>
          </article>
        </div>
      </Section>
    </div>
  );
}
