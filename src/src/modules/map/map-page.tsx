import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Badge, HeroMediaPanel, MetricRow, Section } from '../../components/ui.js';
import { MetaBadges } from '../../components/ui/meta-badges.js';
import { GoogleMapView } from '../../components/map/google-map-view.js';
import { useUserGeolocation } from '../../hooks/use-user-geolocation.js';
import { hasGoogleMapsApiKey } from '../../services/maps-loader.js';

export function MapPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const geolocation = useUserGeolocation(false);
  const mapsConfigured = hasGoogleMapsApiKey();
  const targetCoordinates = useMemo(() => {
    const lat = Number(searchParams.get('lat'));
    const lng = Number(searchParams.get('lng'));

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return {
      latitude: lat,
      longitude: lng,
    };
  }, [searchParams]);
  const targetLabel = searchParams.get('label') ?? null;
  const readyCoordinates = geolocation.status === 'success' && geolocation.coordinates
    ? geolocation.coordinates
    : targetCoordinates;
  const isReady = mapsConfigured && Boolean(readyCoordinates);

  return (
    <div className="stack map-shell">
      <HeroMediaPanel
        eyebrow="Orientamento"
        title="La mappa puo usare la tua posizione per orientarti nel territorio"
        description="Google Maps viene caricata solo in questa pagina e prova a rilevare la posizione corrente del dispositivo con un marker dedicato."
        topMeta={(
          <>
            <Badge>{mapsConfigured ? 'Maps configurata' : 'Maps non configurata'}</Badge>
            <Badge>{targetLabel ?? 'Nessun target'}</Badge>
          </>
        )}
        meta={(
          <>
            <Badge>{geolocation.status}</Badge>
            <Badge>{readyCoordinates ? 'Coordinate pronte' : 'Coordinate assenti'}</Badge>
          </>
        )}
        actions={(
          <>
            <button className="button" type="button" onClick={geolocation.requestLocation} disabled={!mapsConfigured}>
              Usa la mia posizione
            </button>
            <Link className="button button-secondary" to="/explore">Apri esplora</Link>
          </>
        )}
      />

      <section className="section">
        <div className="section-head-premium">
          <div className="section-title-group">
            <p className="eyebrow">Stato mappa</p>
            <h2>Stato posizione</h2>
          </div>
        </div>
        <MetricRow
          items={[
            { label: 'Maps', value: mapsConfigured ? 'On' : 'Off' },
            { label: 'Geolocalizzazione', value: geolocation.status },
            { label: 'Target', value: targetLabel ?? 'Nessuno' },
            { label: 'Coordinate', value: readyCoordinates ? 'Pronte' : 'Assenti' },
          ]}
        />
        <div className="map-status-card">
          {!mapsConfigured ? (
            <>
              <p>La mappa non e configurata: manca `VITE_GOOGLE_MAPS_API_KEY`.</p>
              <p className="muted">Aggiungi la chiave Google Maps nelle env del frontend mobile per abilitare la visualizzazione reale.</p>
            </>
          ) : null}

          {mapsConfigured && geolocation.status === 'idle' ? (
            <>
              <p>
                {targetCoordinates
                  ? 'La mappa puo mostrare subito il punto selezionato. Usa il bottone se vuoi aggiungere anche la tua posizione.'
                  : 'Per mostrare la tua posizione su mappa serve una richiesta esplicita dal dispositivo.'}
              </p>
              <div className="map-actions">
                <button className="button" type="button" onClick={geolocation.requestLocation}>
                  Usa la mia posizione
                </button>
              </div>
            </>
          ) : null}

          {mapsConfigured && geolocation.status === 'loading' ? (
            <p>Sto cercando la tua posizione...</p>
          ) : null}

          {mapsConfigured && geolocation.status === 'success' && geolocation.coordinates ? (
            <>
              <p>Posizione rilevata. Puoi usare la mappa per orientarti nel territorio.</p>
              <MetaBadges
                items={[
                  `${geolocation.coordinates.latitude.toFixed(5)}, ${geolocation.coordinates.longitude.toFixed(5)}`,
                  ...(geolocation.coordinates.accuracy ? [`accuratezza ${Math.round(geolocation.coordinates.accuracy)} m`] : []),
                  ...(targetLabel ? [`target: ${targetLabel}`] : []),
                ]}
              />
            </>
          ) : null}

          {mapsConfigured && geolocation.status !== 'success' && targetCoordinates ? (
            <>
              <p>Sto mostrando il punto selezionato sulla mappa.</p>
              <MetaBadges
                items={[
                  ...(targetLabel ? [targetLabel] : ['Punto selezionato']),
                  `${targetCoordinates.latitude.toFixed(5)}, ${targetCoordinates.longitude.toFixed(5)}`,
                ]}
              />
            </>
          ) : null}

          {mapsConfigured && (geolocation.status === 'denied' || geolocation.status === 'error' || geolocation.status === 'unsupported') ? (
            <>
              <p>{geolocation.errorMessage}</p>
              <div className="map-actions">
                <button className="button" type="button" onClick={geolocation.requestLocation}>
                  Riprova geolocalizzazione
                </button>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <Section title="Mappa" eyebrow="Canvas">
        <div className="card map-canvas-shell">
          {isReady ? (
            <GoogleMapView
              center={readyCoordinates!}
              userPosition={geolocation.status === 'success' ? geolocation.coordinates : null}
              targetPosition={targetCoordinates}
              {...(targetLabel ? { targetTitle: targetLabel } : {})}
            />
          ) : (
            <div className="map-placeholder">
              <p>Mappa non ancora disponibile.</p>
              <p>
                {mapsConfigured
                  ? 'Tocca "Usa la mia posizione" per autorizzare la geolocalizzazione e caricare la mappa.'
                  : 'Configura la chiave Google Maps per abilitare la visualizzazione reale.'}
              </p>
            </div>
          )}
        </div>

        <div className="map-actions">
          <button className="button" type="button" onClick={geolocation.requestLocation} disabled={!mapsConfigured}>
            Usa la mia posizione
          </button>
        </div>
      </Section>

      <Section title="Uso previsto" eyebrow="Roadmap">
        <div className="grid">
          <article className="card">
            <h3>Vicino a te</h3>
            <p>Prossimo step: collegare la mappa ai contenuti piu vicini alla posizione rilevata.</p>
          </article>
          <article className="card">
            <h3>Orientamento</h3>
            <p>La mappa e pronta a diventare punto di ingresso verso detail page e discovery geospaziale.</p>
          </article>
        </div>
      </Section>
    </div>
  );
}
