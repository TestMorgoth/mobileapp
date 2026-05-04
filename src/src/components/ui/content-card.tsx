import type { PropsWithChildren, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function ContentCard({
  title,
  eyebrow,
  subtitle,
  meta,
  body,
  to,
  imageSrc,
  imageAlt,
  badges,
  footer,
  variant = 'default',
  children,
}: PropsWithChildren<{
  title: string;
  eyebrow?: string | null | undefined;
  subtitle?: string | null | undefined;
  meta?: ReactNode;
  body?: string | null | undefined;
  to?: string | undefined;
  imageSrc?: string | null | undefined;
  imageAlt?: string | null | undefined;
  badges?: ReactNode;
  footer?: ReactNode;
  variant?: 'default' | 'visual';
}>): JSX.Element {
  const content = variant === 'visual'
    ? (
      <article className="card card-content visual-card">
        <div
          className={`visual-card-media${imageSrc ? ' has-image' : ''}`}
          style={imageSrc ? { backgroundImage: `url("${imageSrc}")` } : undefined}
          aria-label={imageAlt ?? title}
        />
        <div className="visual-card-body">
          <div className="visual-card-head">
            <div className="visual-card-copy">
              {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
              <h3>{title}</h3>
              {subtitle ? <p className="visual-card-subtitle">{subtitle}</p> : null}
            </div>
            {meta ? <div className="card-meta">{meta}</div> : null}
          </div>
          {badges ? <div className="chips">{badges}</div> : null}
          {body ? <p className="visual-card-body-text">{body}</p> : null}
          {children}
          {footer}
        </div>
      </article>
    )
    : (
      <article className="card card-content">
        <div className="card-head">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h3>{title}</h3>
            {subtitle ? <p className="muted">{subtitle}</p> : null}
          </div>
          {meta ? <div className="card-meta">{meta}</div> : null}
        </div>
        {badges ? <div className="chips">{badges}</div> : null}
        {body ? <p>{body}</p> : null}
        {children}
        {footer}
      </article>
    );

  return to ? <Link to={to} className="unstyled-link">{content}</Link> : content;
}
