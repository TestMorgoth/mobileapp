import type { PropsWithChildren } from 'react';

export function PageShell({
  pageKey,
  shellVariant,
  children,
}: PropsWithChildren<{
  pageKey: string;
  shellVariant: string;
}>): JSX.Element {
  return (
    <main className="nl-content">
      <div className={`nl-page-shell nl-page-shell--${pageKey} nl-page-shell--${shellVariant}`}>
        {children}
      </div>
    </main>
  );
}
