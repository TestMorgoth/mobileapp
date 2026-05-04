import { Link, useNavigate } from 'react-router-dom';

function BackIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="M12 5l-7 7 7 7" />
    </svg>
  );
}

function ProfileIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 20a7 7 0 0 0-14 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

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
  const navigate = useNavigate();
  const isHome = navKey === 'home' && shellVariant === 'immersive';

  return (
    <header className={`nl-mobile-topbar nl-mobile-topbar--${shellVariant}`}>
      <button className="nl-circle-button" type="button" aria-label="Torna indietro" onClick={() => navigate(-1)}>
        <BackIcon />
      </button>

      <div className="nl-mobile-title">
        <p className="nl-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <div className="nl-ornament" aria-hidden="true">
          <span />
          <i />
          <span />
        </div>
        {isHome ? <p className="nl-mobile-subtitle">{subtitle}</p> : null}
      </div>

      <Link className="nl-circle-button" to="/profile" aria-label="Profilo">
        <ProfileIcon />
      </Link>
    </header>
  );
}
