import { AppProviders } from './app/providers.js';
import { AppRouter } from './app/router.js';

export function App(): JSX.Element {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
