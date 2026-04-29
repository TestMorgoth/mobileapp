import { MetaBadges } from '../../../components/ui/meta-badges.js';

export function PlannerSummaryCard({
  availableMinutes,
  selectedInterests,
  groupType,
  familyFriendly,
  wheelchairAccess,
  strollerAccess,
  municipality,
}: {
  availableMinutes: number;
  selectedInterests: string[];
  groupType: string;
  familyFriendly: boolean;
  wheelchairAccess: boolean;
  strollerAccess: boolean;
  municipality: string;
}): JSX.Element {
  const badges = [
    `${availableMinutes} min`,
    `Gruppo: ${groupType}`,
    ...(municipality ? [`Comune: ${municipality}`] : []),
    ...(familyFriendly ? ['Famiglie'] : []),
    ...(wheelchairAccess ? ['Carrozzina'] : []),
    ...(strollerAccess ? ['Passeggino'] : []),
  ];

  return (
    <div className="planner-summary-card">
      <p className="eyebrow">Riepilogo richiesta</p>
      <h3>Vincoli attivi</h3>
      <MetaBadges items={badges} />
      <p className="muted">
        Interessi selezionati: {selectedInterests.length > 0 ? selectedInterests.join(', ') : 'nessuno'}.
      </p>
    </div>
  );
}
