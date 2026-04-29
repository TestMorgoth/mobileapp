import type { ReactNode } from 'react';

export function DetailHero({
  title,
  eyebrow,
  meta,
  actions,
}: {
  title: string;
  eyebrow?: string;
  meta?: ReactNode;
  actions?: ReactNode;
}): JSX.Element {
  return (
    <section className="hero hero-detail">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <div className="hero-detail-head">
        <h2>{title}</h2>
        {actions ? <div className="hero-detail-actions">{actions}</div> : null}
      </div>
      {meta ? <div className="hero-detail-meta">{meta}</div> : null}
    </section>
  );
}
