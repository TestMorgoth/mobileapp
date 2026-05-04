import type { PropsWithChildren, ReactNode } from 'react';
import { ContentCard } from './ui/content-card.js';
import { EmptyStateBlock } from './ui/empty-state-block.js';
import { LoadingSkeleton } from './ui/loading-skeleton.js';

export function Section({
  title,
  eyebrow,
  actions,
  children,
}: PropsWithChildren<{ title: string; eyebrow?: string; actions?: ReactNode }>): JSX.Element {
  return (
    <section className="section">
      <div className="section-head">
        <div className="section-title-group">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function Card({
  title,
  eyebrow,
  subtitle,
  meta,
  body,
  to,
  badges,
  footer,
}: {
  title: string;
  eyebrow?: string | null | undefined;
  subtitle?: string | null | undefined;
  meta?: ReactNode;
  body?: string | null | undefined;
  to?: string | undefined;
  badges?: ReactNode;
  footer?: ReactNode;
}): JSX.Element {
  return (
    <ContentCard
      title={title}
      eyebrow={eyebrow}
      subtitle={subtitle}
      meta={meta}
      body={body}
      badges={badges}
      footer={footer}
      to={to}
    />
  );
}

export function EmptyState({ title, text }: { title: string; text: string }): JSX.Element {
  return <EmptyStateBlock title={title} text={text} />;
}

export function LoadingBlock({ text = 'Caricamento...' }: { text?: string }): JSX.Element {
  return <LoadingSkeleton text={text} />;
}

export function StatusPill({ text }: { text: string }): JSX.Element {
  return <span className="assistant-pill">{text}</span>;
}

export function Badge({ children }: PropsWithChildren): JSX.Element {
  return <span className="badge">{children}</span>;
}

export function OrnamentDivider(): JSX.Element {
  return <div className="ornament-divider" aria-hidden="true"><span>◆</span></div>;
}

export function ActionRow({ children }: PropsWithChildren): JSX.Element {
  return <div className="action-row">{children}</div>;
}

export function ActionButton({
  children,
  variant = 'fill',
  type = 'button',
  disabled,
  onClick,
}: PropsWithChildren<{
  variant?: 'fill' | 'secondary' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (() => void) | undefined;
}>): JSX.Element {
  const className =
    variant === 'secondary'
      ? 'button button-secondary'
      : variant === 'ghost'
        ? 'button button-ghost'
        : 'button';

  return (
    <button className={className} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function IconActionButton({
  label,
  children,
  type = 'button',
  onClick,
}: PropsWithChildren<{
  label: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (() => void) | undefined;
}>): JSX.Element {
  return (
    <button className="icon-button" type={type} aria-label={label} title={label} onClick={onClick}>
      {children}
    </button>
  );
}

export function MetricRow({
  items,
}: {
  items: Array<{ label: string; value: ReactNode }>;
}): JSX.Element {
  return (
    <div className="metric-row">
      {items.map((item) => (
        <div key={item.label} className="metric-item">
          <span className="metric-label">{item.label}</span>
          <strong className="metric-value">{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

export function PremiumSectionHead({
  title,
  eyebrow,
  action,
}: {
  title: string;
  eyebrow?: string | null | undefined;
  action?: ReactNode;
}): JSX.Element {
  return (
    <div className="section-head-premium">
      <div className="section-title-group">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function VisualCard({
  title,
  eyebrow,
  subtitle,
  body,
  imageSrc,
  imageAlt,
  meta,
  badges,
  footer,
  to,
  children,
}: PropsWithChildren<{
  title: string;
  eyebrow?: string | null | undefined;
  subtitle?: string | null | undefined;
  body?: string | null | undefined;
  imageSrc?: string | null | undefined;
  imageAlt?: string | null | undefined;
  meta?: ReactNode;
  badges?: ReactNode;
  footer?: ReactNode;
  to?: string | undefined;
}>): JSX.Element {
  return (
    <ContentCard
      title={title}
      eyebrow={eyebrow}
      subtitle={subtitle}
      body={body}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      meta={meta}
      badges={badges}
      footer={footer}
      to={to}
      variant="visual"
    >
      {children}
    </ContentCard>
  );
}

export function HeroMediaPanel({
  title,
  eyebrow,
  description,
  backgroundImage,
  topMeta,
  meta,
  actions,
}: {
  title: string;
  eyebrow?: string | null | undefined;
  description?: string | null | undefined;
  backgroundImage?: string | null | undefined;
  topMeta?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}): JSX.Element {
  return (
    <section className="hero-media">
      <div
        className="hero-media-backdrop"
        style={backgroundImage ? { backgroundImage: `url("${backgroundImage}")` } : undefined}
        aria-hidden="true"
      />
      <div className="hero-media-content">
        {topMeta ? <div className="hero-media-top">{topMeta}</div> : null}
        <div className="section-title-group">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
        </div>
        {description ? <p className="hero-media-description">{description}</p> : null}
        {meta ? <div className="hero-media-meta">{meta}</div> : null}
        {actions ? <div className="hero-media-actions">{actions}</div> : null}
      </div>
    </section>
  );
}
