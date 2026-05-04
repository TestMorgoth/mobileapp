import { Outlet, matchPath, useLocation } from 'react-router-dom';
import { MobileTabbar } from './mobile-tabbar.js';
import { MobileTopbar } from './mobile-topbar.js';
import { PageShell } from './page-shell.js';

const routeMeta = [
  {
    path: '/',
    pageKey: 'home',
    eyebrow: 'Nome del Comune',
    title: 'Benvenuto nel Territorio',
    subtitle: 'Come vuoi vivere oggi?',
    shellVariant: 'immersive',
    navKey: 'home',
  },
  {
    path: '/explore',
    pageKey: 'explore',
    eyebrow: 'Discover',
    title: 'Esplora il territorio',
    subtitle: 'Luoghi, eventi, itinerari e suggerimenti intelligenti.',
    shellVariant: 'feature',
    navKey: 'explore',
  },
  {
    path: '/search',
    pageKey: 'search',
    eyebrow: 'Ricerca',
    title: 'Cerca',
    subtitle: 'Trova contenuti per bisogno, tempo e accessibilita.',
    shellVariant: 'utility',
    navKey: 'explore',
  },
  {
    path: '/planner',
    pageKey: 'planner',
    eyebrow: 'Planner',
    title: 'Crea itinerario',
    subtitle: 'Configura tempo, interessi e ritmo della visita.',
    shellVariant: 'utility',
    navKey: 'explore',
  },
  {
    path: '/assistant',
    pageKey: 'assistant',
    eyebrow: 'Composer',
    title: 'Assistente AI',
    subtitle: 'Scrivi una domanda o scegli un suggerimento pronto.',
    shellVariant: 'feature',
    navKey: 'assistant',
  },
  {
    path: '/poi',
    pageKey: 'poi-list',
    eyebrow: 'Luoghi',
    title: 'Scorci da scoprire',
    subtitle: 'Lista verticale di punti di interesse e soste consigliate.',
    shellVariant: 'feature',
    navKey: 'explore',
  },
  {
    path: '/poi/:id',
    pageKey: 'poi-detail',
    eyebrow: 'Luogo',
    title: 'Dettaglio luogo',
    subtitle: 'Descrizione, informazioni utili, preferiti e mappa.',
    shellVariant: 'detail',
    navKey: 'explore',
  },
  {
    path: '/events',
    pageKey: 'events-list',
    eyebrow: 'Eventi',
    title: 'Storie da vivere',
    subtitle: 'Carosello orizzontale di appuntamenti in evidenza.',
    shellVariant: 'feature',
    navKey: 'events',
  },
  {
    path: '/events/:id',
    pageKey: 'event-detail',
    eyebrow: 'Evento',
    title: 'Dettaglio evento',
    subtitle: 'Date, luogo, accesso, prenotazione e informazioni utili.',
    shellVariant: 'detail',
    navKey: 'events',
  },
  {
    path: '/itineraries',
    pageKey: 'itineraries-list',
    eyebrow: 'Itinerari',
    title: 'Percorsi consigliati',
    subtitle: 'Proposte editoriali e percorsi pronti da seguire.',
    shellVariant: 'feature',
    navKey: 'explore',
  },
  {
    path: '/itineraries/:id',
    pageKey: 'itinerary-detail',
    eyebrow: 'Itinerario',
    title: 'Dettaglio itinerario',
    subtitle: 'Sintesi, tappe, tempi, distanza e note di accessibilita.',
    shellVariant: 'detail',
    navKey: 'explore',
  },
  {
    path: '/favorites',
    pageKey: 'favorites',
    eyebrow: 'Preferiti',
    title: 'Contenuti salvati',
    subtitle: 'Luoghi, eventi e itinerari da ritrovare rapidamente.',
    shellVariant: 'utility',
    navKey: 'assistant',
  },
  {
    path: '/profile',
    pageKey: 'profile',
    eyebrow: 'Profilo',
    title: 'Profilo',
    subtitle: 'Sessione locale, scorciatoie e preferenze personali.',
    shellVariant: 'utility',
    navKey: 'assistant',
  },
  {
    path: '/accessibility',
    pageKey: 'accessibility',
    eyebrow: 'Inclusione',
    title: 'Accessibilita',
    subtitle: 'Leggibilita, contrasto e preferenze di fruizione.',
    shellVariant: 'utility',
    navKey: 'assistant',
  },
  {
    path: '/settings',
    pageKey: 'settings',
    eyebrow: 'Sistema',
    title: 'Impostazioni',
    subtitle: 'Lingua, permessi, cache e notifiche future.',
    shellVariant: 'utility',
    navKey: 'assistant',
  },
  {
    path: '/legal',
    pageKey: 'legal',
    eyebrow: 'Trasparenza',
    title: 'Legale',
    subtitle: 'Privacy, termini e contatti istituzionali.',
    shellVariant: 'utility',
    navKey: 'assistant',
  },
  {
    path: '/map',
    pageKey: 'map',
    eyebrow: 'Orientati',
    title: 'Mappa',
    subtitle: 'Posizione, target e contenuti vicini sul territorio.',
    shellVariant: 'map',
    navKey: 'map',
  },
] as const;

export function MobileLayout(): JSX.Element {
  const location = useLocation();
  const fallbackMeta = routeMeta[0];
  const currentMeta = routeMeta.find((item) => matchPath({ path: item.path, end: true }, location.pathname)) ?? fallbackMeta;

  return (
    <div className={`nl-app-shell nl-app-shell--${currentMeta.shellVariant} nl-app-shell--${currentMeta.pageKey}`}>
      <div className="nl-app-bg" aria-hidden="true" />
      <div className="nl-app-hero-bg" aria-hidden="true" />
      <div className="nl-app-overlay nl-app-overlay--top" aria-hidden="true" />
      <div className="nl-app-overlay nl-app-overlay--fade" aria-hidden="true" />
      <div className="nl-app-overlay nl-app-overlay--vignette" aria-hidden="true" />

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
