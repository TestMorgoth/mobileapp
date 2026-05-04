import { Link } from 'react-router-dom';

export function MobileTopbar({
  eyebrow,
  title,
  subtitle,
  shellVariant,
  navKey,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  shellVariant: string;
  navKey: string;
}): JSX.Element {
  const showUtilityActions = navKey !== 'assistant';
  const isImmersive = shellVariant === 'immersive';
  const isDetail = shellVariant === 'detail';

  return (
    <header className={`topbar topbar-${shellVariant}`}>
      <div className="topbar-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="topbar-subtitle">{subtitle}</p>
      </div>

      <div className="topbar-actions">
        {showUtilityActions ? (
          <Link className="topbar-action" to="/search">
            Cerca
          </Link>
        ) : null}
        {showUtilityActions ? (
          <Link className="topbar-action" to="/planner">
            Planner
          </Link>
        ) : null}
        {isDetail ? (
          <Link className="topbar-action" to="/favorites">
            Salva
          </Link>
        ) : null}
        <Link className={isImmersive ? 'topbar-action topbar-action-primary' : 'topbar-action'} to="/profile">
          Profilo
        </Link>
      </div>
    </header>
  );
}
