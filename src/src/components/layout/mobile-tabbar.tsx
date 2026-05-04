import { Link } from 'react-router-dom';

const primaryNav = [
  { to: '/', label: 'Home', shortLabel: 'Home', navKey: 'home' },
  { to: '/explore', label: 'Esplora', shortLabel: 'Esplora', navKey: 'explore' },
  { to: '/events', label: 'Eventi', shortLabel: 'Eventi', navKey: 'events' },
  { to: '/map', label: 'Mappa', shortLabel: 'Mappa', navKey: 'map' },
  { to: '/assistant', label: 'Assistant', shortLabel: 'AI', navKey: 'assistant' },
];

export function MobileTabbar({ activeKey }: { activeKey: string }): JSX.Element {
  return (
    <nav className="bottom-nav" aria-label="Navigazione principale">
      {primaryNav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={item.navKey === activeKey ? 'nav-link nav-link-active' : 'nav-link'}
          aria-current={item.navKey === activeKey ? 'page' : undefined}
        >
          <span className="nav-link-dot" aria-hidden="true" />
          <span className="nav-link-label">{item.label}</span>
          <span className="nav-link-label nav-link-label-compact">{item.shortLabel}</span>
        </Link>
      ))}
    </nav>
  );
}
