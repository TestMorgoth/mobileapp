import { ContentCard } from '../../../components/ui/content-card.js';
import { MetaBadges } from '../../../components/ui/meta-badges.js';

const actions = [
  {
    title: 'Luoghi del territorio',
    subtitle: 'Patrimonio, soste e punti di interesse',
    body: 'Accedi rapidamente ai contenuti editoriali e ai dettagli utili alla visita.',
    to: '/poi',
    badges: ['Patrimonio', 'Visita'],
  },
  {
    title: 'Eventi in programma',
    subtitle: 'Appuntamenti e attivita',
    body: 'Verifica cosa succede oggi o nei prossimi giorni.',
    to: '/events',
    badges: ['Agenda', 'Territorio'],
  },
  {
    title: 'Itinerari guidati',
    subtitle: 'Percorsi editoriali pronti',
    body: 'Trova proposte gia organizzate per famiglie, accessibilita e stagionalita.',
    to: '/itineraries',
    badges: ['Percorsi', 'Editoriale'],
  },
  {
    title: 'Preferiti salvati',
    subtitle: 'Riprendi da dove eri rimasto',
    body: 'Raccogli i contenuti da consultare durante la visita.',
    to: '/favorites',
    badges: ['Continuita', 'Sessione'],
  },
  {
    title: 'Apri la mappa',
    subtitle: 'Usa la tua posizione sul territorio',
    body: 'Accedi alla mappa con geolocalizzazione e orientamento dal dispositivo.',
    to: '/map',
    badges: ['Mappa', 'Posizione'],
  },
];

export function QuickActions(): JSX.Element {
  return (
    <div className="grid">
      {actions.map((action) => (
        <ContentCard
          key={action.title}
          title={action.title}
          subtitle={action.subtitle}
          body={action.body}
          to={action.to}
          meta={<MetaBadges items={action.badges} />}
        />
      ))}
    </div>
  );
}
