import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Badge, Card, EmptyState, HeroMediaPanel, LoadingBlock, MetricRow, Section } from '../../components/ui.js';
import { FilterChipGroup } from '../../components/ui/filter-chip-group.js';
import { MetaBadges } from '../../components/ui/meta-badges.js';
import { generateRecommendations } from '../../services/content-api.js';
import { PlannerSummaryCard } from './components/planner-summary-card.js';
import { PlannerStepSection } from './components/planner-step-section.js';

const interestOptions = [
  { value: 'culture', label: 'Cultura' },
  { value: 'history', label: 'Storia' },
  { value: 'nature', label: 'Natura' },
  { value: 'food', label: 'Enogastronomia' },
  { value: 'landscape', label: 'Panorami' },
  { value: 'family', label: 'Famiglie' },
  { value: 'accessible', label: 'Accessibile' },
];

export function PlannerPage(): JSX.Element {
  const [availableMinutes, setAvailableMinutes] = useState(180);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['culture']);
  const [groupType, setGroupType] = useState('solo');
  const [familyFriendly, setFamilyFriendly] = useState(false);
  const [wheelchairAccess, setWheelchairAccess] = useState(false);
  const [strollerAccess, setStrollerAccess] = useState(false);
  const [municipality, setMunicipality] = useState('');

  const mutation = useMutation({
    mutationFn: generateRecommendations,
  });

  const canSubmit = useMemo(() => selectedInterests.length > 0 && availableMinutes >= 30, [selectedInterests, availableMinutes]);

  function toggleInterest(value: string) {
    setSelectedInterests((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  return (
    <div className="stack">
      <HeroMediaPanel
        eyebrow="Planner guidato"
        title="Crea un percorso su misura in base a tempo, interessi e accessibilita"
        description="Il planner usa il motore regole-based gia presente nel backend e lo presenta come un flusso mobile piu comprensibile, con riepilogo dei vincoli e risultato narrato."
        topMeta={(
          <>
            <Badge>{availableMinutes} min</Badge>
            <Badge>{selectedInterests.length} interessi</Badge>
            <Badge>{groupType}</Badge>
          </>
        )}
        meta={(
          <>
            {familyFriendly ? <Badge>Famiglie</Badge> : null}
            {wheelchairAccess ? <Badge>Carrozzina</Badge> : null}
            {strollerAccess ? <Badge>Passeggino</Badge> : null}
            {municipality ? <Badge>{municipality}</Badge> : <Badge>Comune libero</Badge>}
          </>
        )}
        actions={(
          <>
            <Link className="button" to="/explore">Apri esplora</Link>
            <Link className="button button-secondary" to="/assistant">Chiedi all assistant</Link>
          </>
        )}
      />

      <section className="section">
        <div className="section-head-premium">
          <div className="section-title-group">
            <p className="eyebrow">Riepilogo vincoli</p>
            <h2>Genera un percorso</h2>
          </div>
        </div>
        <MetricRow
          items={[
            { label: 'Tempo', value: `${availableMinutes} min` },
            { label: 'Interessi', value: selectedInterests.length },
            { label: 'Gruppo', value: groupType },
            { label: 'Comune', value: municipality || 'Non impostato' },
          ]}
        />
        <div className="stack">
          <PlannerStepSection
            step="Passo 1"
            title="Quanto tempo hai?"
            text="Questa informazione orienta il numero di tappe e la durata del percorso."
          >
            <label className="field">
              <span>Tempo disponibile</span>
              <select value={availableMinutes} onChange={(event) => setAvailableMinutes(Number(event.target.value))} className="input">
                <option value={60}>1 ora</option>
                <option value={120}>2 ore</option>
                <option value={180}>3 ore</option>
                <option value={240}>4 ore</option>
                <option value={360}>6 ore</option>
              </select>
            </label>
          </PlannerStepSection>

          <PlannerStepSection
            step="Passo 2"
            title="Quali interessi vuoi privilegiare?"
            text="Il ranking del motore usa questi segnali per scegliere le tappe migliori."
          >
            <FilterChipGroup options={interestOptions} selected={selectedInterests} onToggle={toggleInterest} />
          </PlannerStepSection>

          <PlannerStepSection
            step="Passo 3"
            title="Contesto di visita"
            text="Definisci gruppo e localita per rendere piu pertinenti i suggerimenti."
          >
            <div className="two-columns">
              <label className="field">
                <span>Gruppo</span>
                <select value={groupType} onChange={(event) => setGroupType(event.target.value)} className="input">
                  <option value="solo">Solo</option>
                  <option value="couple">Coppia</option>
                  <option value="family">Famiglia</option>
                  <option value="group">Gruppo</option>
                  <option value="senior">Senior</option>
                </select>
              </label>

              <label className="field">
                <span>Comune</span>
                <input
                  value={municipality}
                  onChange={(event) => setMunicipality(event.target.value)}
                  className="input"
                  placeholder="Facoltativo"
                />
              </label>
            </div>
          </PlannerStepSection>

          <PlannerStepSection
            step="Passo 4"
            title="Preferenze di accessibilita"
            text="Attiva solo i vincoli davvero necessari per non restringere troppo i risultati."
          >
            <div className="stack compact">
              <label className="toggle planner-toggle-card">
                <input type="checkbox" checked={familyFriendly} onChange={(event) => setFamilyFriendly(event.target.checked)} />
                <span>Adatto a famiglie</span>
              </label>
              <label className="toggle planner-toggle-card">
                <input type="checkbox" checked={wheelchairAccess} onChange={(event) => setWheelchairAccess(event.target.checked)} />
                <span>Accessibile in carrozzina</span>
              </label>
              <label className="toggle planner-toggle-card">
                <input type="checkbox" checked={strollerAccess} onChange={(event) => setStrollerAccess(event.target.checked)} />
                <span>Adatto a passeggino</span>
              </label>
            </div>
          </PlannerStepSection>

          <PlannerSummaryCard
            availableMinutes={availableMinutes}
            selectedInterests={selectedInterests}
            groupType={groupType}
            familyFriendly={familyFriendly}
            wheelchairAccess={wheelchairAccess}
            strollerAccess={strollerAccess}
            municipality={municipality}
          />
        </div>

        <button
          className="button"
          disabled={!canSubmit || mutation.isPending}
          onClick={() => {
            const payload = {
              availableMinutes,
              interests: selectedInterests,
              groupType,
              familyFriendly,
              wheelchairAccess,
              strollerAccess,
              limit: 5,
              ...(municipality ? { municipality } : {}),
            };

            mutation.mutate(payload);
          }}
        >
          {mutation.isPending ? 'Generazione in corso...' : 'Genera percorso'}
        </button>
      </section>

      {mutation.isPending ? <LoadingBlock text="Sto costruendo un percorso personalizzato..." /> : null}

      {mutation.data ? (
        <>
          <Section title={mutation.data.itinerary.title} eyebrow="Risultato">
            <MetaBadges
              items={[
                `${mutation.data.itinerary.durationMinutes} min`,
                ...mutation.data.itinerary.interests.slice(0, 3),
                ...(mutation.data.itinerary.targetAudience ? [mutation.data.itinerary.targetAudience] : []),
              ]}
            />
            <p>{mutation.data.itinerary.summary}</p>
            <ul className="simple-list">
              {mutation.data.explanation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="Tappe suggerite" eyebrow="Percorso">
            <div className="stack">
              {mutation.data.itinerary.stops.map((stop) => (
                <Card
                  key={stop.poiId}
                  title={`${stop.order}. ${stop.title}`}
                  subtitle={`${stop.estimatedMinutes} min`}
                  body={stop.reason}
                  to={`/poi/${stop.poiId}`}
                />
              ))}
            </div>
          </Section>

          <Section title="Luoghi con punteggio migliore" eyebrow="Ranking">
            <div className="stack">
              {mutation.data.matchedPois.map((poi) => (
                <Card
                  key={poi.id}
                  title={poi.name}
                  subtitle={`Score ${poi.score} · ${poi.municipality ?? 'Territorio'}`}
                  body={poi.reasons.join(' • ')}
                  to={`/poi/${poi.id}`}
                />
              ))}
            </div>
          </Section>
        </>
      ) : null}

      {mutation.isSuccess && mutation.data.matchedPois.length === 0 ? (
        <EmptyState
          title="Nessuna corrispondenza forte"
          text="Prova a ridurre i filtri o aumentare il tempo disponibile."
        />
      ) : null}
    </div>
  );
}
