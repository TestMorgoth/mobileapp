import { Outlet, matchPath, useLocation } from 'react-router-dom';
import { MobileTabbar } from './mobile-tabbar.js';
import { MobileTopbar } from './mobile-topbar.js';
import { PageShell } from './page-shell.js';

const routeMeta = [
  {
    path: '/',
    pageKey: 'home',
    eyebrow: 'Subiaco',
    title: 'Territorio Vivo',
    subtitle: 'Scoperte, storie e accessi rapidi tra luoghi, eventi e assistant.',
    shellVariant: 'immersive',
    navKey: 'home',
  },
  {
    path: '/explore',
    pageKey: 'explore',
    eyebrow: 'Scopri',
    title: 'Esplora il territorio',
    subtitle: 'Luoghi, itinerari e temi da navigare in ottica discovery.',
    shellVariant: 'feature',
    navKey: 'explore',
  },
  {
    path: '/search',
    pageKey: 'search',
    eyebrow: 'Ricerca',
    title: 'Cerca',
    subtitle: 'Trova contenuti pubblicati e orienta la visita in pochi passaggi.',
    shellVariant: 'utility',
    navKey: 'explore',
  },
  {
    path: '/planner',
    pageKey: 'planner',
    eyebrow: 'Pianifica',
    title: 'Planner',
    subtitle: 'Costruisci un percorso su misura per tempo, interessi e ritmo di visita.',
    shellVariant: 'utility',
    navKey: 'explore',
  },
  {
    path: '/assistant',
    pageKey: 'assistant',
    eyebrow: 'Assistant',
    title: 'Chiedi al territorio',
    subtitle: 'Supporto contestuale, suggerimenti e itinerari in linguaggio naturale.',
    shellVariant: 'feature',
    navKey: 'assistant',
  },
  {
    path: '/poi',
    pageKey: 'poi-list',
    eyebrow: 'Luoghi',
    title: 'Punti di interesse',
    subtitle: 'Patrimonio, natura e soste da esplorare con filtri e fallback reali.',
    shellVariant: 'feature',
    navKey: 'explore',
  },
  {
    path: '/poi/:id',
    pageKey: 'poi-detail',
    eyebrow: 'Luogo',
    title: 'Scheda luogo',
    subtitle: 'Contesto, azioni rapide e lettura editoriale del punto di interesse.',
    shellVariant: 'detail',
    navKey: 'explore',
  },
  {
    path: '/events',
    pageKey: 'events-list',
    eyebrow: 'Agenda',
    title: 'Eventi',
    subtitle: 'Appuntamenti, occasioni e attivita da navigare come esperienza visuale.',
    shellVariant: 'feature',
    navKey: 'events',
  },
  {
    path: '/events/:id',
    pageKey: 'event-detail',
    eyebrow: 'Evento',
    title: 'Scheda evento',
    subtitle: 'Dettaglio, azioni rapide e informazioni essenziali prima della visita.',
    shellVariant: 'detail',
    navKey: 'events',
  },
  {
    path: '/itineraries',
    pageKey: 'itineraries-list',
    eyebrow: 'Percorsi',
    title: 'Itinerari',
    subtitle: 'Proposte editoriali e percorsi guidati tra luoghi, eventi e storie.',
    shellVariant: 'feature',
    navKey: 'explore',
  },
  {
    path: '/itineraries/:id',
    pageKey: 'itinerary-detail',
    eyebrow: 'Itinerario',
    title: 'Dettaglio itinerario',
    subtitle: 'Sintesi, stop e note utili per seguire il percorso.',
    shellVariant: 'detail',
    navKey: 'explore',
  },
  {
    path: '/favorites',
    pageKey: 'favorites',
    eyebrow: 'Raccolta',
    title: 'Preferiti',
    subtitle: 'Contenuti salvati per ritrovare subito i punti chiave del territorio.',
    shellVariant: 'utility',
    navKey: 'explore',
  },
  {
    path: '/profile',
    pageKey: 'profile',
    eyebrow: 'Profilo',
    title: 'Profilo',
    subtitle: 'Preferenze, stato locale e scorciatoie personali del visitatore.',
    shellVariant: 'utility',
    navKey: 'assistant',
  },
  {
    path: '/accessibility',
    pageKey: 'accessibility',
    eyebrow: 'Inclusione',
    title: 'Accessibilita',
    subtitle: 'Informazioni e impostazioni per una fruizione piu consapevole.',
    shellVariant: 'utility',
    navKey: 'assistant',
  },
  {
    path: '/settings',
    pageKey: 'settings',
    eyebrow: 'Sistema',
    title: 'Impostazioni',
    subtitle: 'Lingua, permessi e configurazioni del canale mobile.',
    shellVariant: 'utility',
    navKey: 'assistant',
  },
  {
    path: '/legal',
    pageKey: 'legal',
    eyebrow: 'Trasparenza',
    title: 'Legale',
    subtitle: 'Informazioni istituzionali, privacy e riferimenti di servizio.',
    shellVariant: 'utility',
    navKey: 'assistant',
  },
  {
    path: '/map',
    pageKey: 'map',
    eyebrow: 'Orientati',
    title: 'Mappa',
    subtitle: 'Vista territoriale, geolocalizzazione e passaggi rapidi verso i contenuti.',
    shellVariant: 'map',
    navKey: 'map',
  },
];

export function MobileLayout(): JSX.Element {
  const location = useLocation();
  const fallbackMeta = {
    pageKey: 'home',
    eyebrow: 'Subiaco',
    title: 'Territorio Vivo',
    subtitle: 'Scoperte, storie e accessi rapidi tra luoghi, eventi e assistant.',
    shellVariant: 'immersive',
    navKey: 'home',
  };
  const currentMeta = routeMeta.find((item) => matchPath({ path: item.path, end: true }, location.pathname)) ?? fallbackMeta;

  return (
    <div className={`app-shell app-shell-${currentMeta.shellVariant}`}>
      <MobileTopbar
        eyebrow={currentMeta.eyebrow}
        title={currentMeta.title}
        subtitle={currentMeta.subtitle}
        shellVariant={currentMeta.shellVariant}
        navKey={currentMeta.navKey}
      />
      <PageShell pageKey={currentMeta.pageKey} shellVariant={currentMeta.shellVariant}>
        <Outlet />
      </PageShell>
      <MobileTabbar activeKey={currentMeta.navKey} />
    </div>
  );
}
