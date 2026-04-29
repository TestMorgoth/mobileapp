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
    <main className="content">
      <div className={`page-shell page-shell-${pageKey} page-shell-variant-${shellVariant}`}>
        {children}
      </div>
    </main>
  );
}
