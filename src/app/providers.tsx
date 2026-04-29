import { useEffect, type PropsWithChildren } from 'react';
import { mobileTerritoryTheme } from '@territorio/shared-design-tokens';

function applyTheme() {
  const root = document.documentElement;

  root.dataset.theme = mobileTerritoryTheme.name;

  for (const [token, value] of Object.entries(mobileTerritoryTheme.colors)) {
    root.style.setProperty(`--color-${token}`, value);
  }

  for (const [token, value] of Object.entries(mobileTerritoryTheme.spacing)) {
    root.style.setProperty(`--space-${token}`, value);
  }

  for (const [token, value] of Object.entries(mobileTerritoryTheme.radius)) {
    root.style.setProperty(`--radius-${token}`, value);
  }

  for (const [token, value] of Object.entries(mobileTerritoryTheme.shadows)) {
    root.style.setProperty(`--shadow-${token}`, value);
  }

  for (const [token, value] of Object.entries(mobileTerritoryTheme.typography)) {
    root.style.setProperty(`--type-${token}`, value);
  }

  for (const [token, value] of Object.entries(mobileTerritoryTheme.motion)) {
    root.style.setProperty(`--motion-${token}`, value);
  }
}

export function AppProviders({ children }: PropsWithChildren): JSX.Element {
  useEffect(() => {
    applyTheme();
  }, []);

  return <>{children}</>;
}
