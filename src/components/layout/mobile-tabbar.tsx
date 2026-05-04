import { Link } from 'react-router-dom';

const primaryNav = [
  {
    to: '/',
    label: 'Home',
    shortLabel: 'Home',
    navKey: 'home',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M15.7 8.3l-4.5 7.5-2.9-2" />
      </svg>
    ),
  },
  {
    to: '/explore',
    label: 'Esplora',
    shortLabel: 'Esplora',
    navKey: 'explore',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" />
        <path d="M9 4v14M15 6v14" />
      </svg>
    ),
  },
  {
    to: '/events',
    label: 'Eventi',
    shortLabel: 'Eventi',
    navKey: 'events',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="6" width="16" height="14" rx="2" />
        <path d="M8 3v5M16 3v5M4 11h16" />
      </svg>
    ),
  },
  {
    to: '/map',
    label: 'Mappa',
    shortLabel: 'Mappa',
    navKey: 'map',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s6-5.6 6-11a6 6 0 1 0-12 0c0 5.4 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2.6" />
      </svg>
    ),
  },
  {
    to: '/assistant',
    label: 'Assistant',
    shortLabel: 'AI',
    navKey: 'assistant',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11.5 4.5c.5 2 1.8 3.4 3.9 3.9-2 .5-3.4 1.8-3.9 3.9-.5-2-1.8-3.4-3.9-3.9 2-.5 3.4-1.8 3.9-3.9Z" />
        <path d="M18 8.5c.25 1 .95 1.7 2 2-.95.25-1.7.95-2 2-.25-.95-.95-1.7-2-2 1.05-.3 1.75-1 2-2Z" />
      </svg>
    ),
  },
];

export function MobileTabbar({ activeKey }: { activeKey: string }): JSX.Element {
  return (
    <nav className="nl-bottom-nav" aria-label="Navigazione principale">
      {primaryNav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={item.navKey === activeKey ? 'nl-nav-link nl-nav-link--active' : 'nl-nav-link'}
          aria-current={item.navKey === activeKey ? 'page' : undefined}
        >
          <span className="nl-nav-link__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="nl-nav-link__label">{item.label}</span>
          <span className="nl-nav-link__label nl-nav-link__label--compact">{item.shortLabel}</span>
        </Link>
      ))}
    </nav>
  );
}
