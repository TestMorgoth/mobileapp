import { Link } from 'react-router-dom';
import { PremiumSectionHead, StatusPill } from '../../../components/ui.js';

export function FavoritesList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: Array<{ id: string; label: string; to: string; subtitle?: string }>;
  emptyText: string;
}): JSX.Element {
  return (
    <section className="section">
      <PremiumSectionHead title={title} eyebrow="Lista salvata" action={<StatusPill text={String(items.length)} />} />

      {items.length === 0 ? (
        <p className="muted">{emptyText}</p>
      ) : (
        <div className="stack compact">
          {items.map((item) => (
            <Link key={item.id} className="unstyled-link" to={item.to}>
              <article className="card card-content">
                <h3>{item.label}</h3>
                {item.subtitle ? <p className="muted">{item.subtitle}</p> : null}
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
