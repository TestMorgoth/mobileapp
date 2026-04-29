import type { SearchEntityType } from '@territorio/shared-types';
import { FilterChipGroup } from '../../../components/ui/filter-chip-group.js';

const typeOptions: Array<{ value: SearchEntityType; label: string }> = [
  { value: 'poi', label: 'Luoghi' },
  { value: 'event', label: 'Eventi' },
  { value: 'itinerary', label: 'Itinerari' },
  { value: 'story', label: 'Storie' },
];

export function SearchFiltersPanel({
  q,
  onQueryChange,
  selectedTypes,
  onToggleType,
  familyFriendly,
  onFamilyFriendlyChange,
  accessibleOnly,
  onAccessibleOnlyChange,
}: {
  q: string;
  onQueryChange: (value: string) => void;
  selectedTypes: SearchEntityType[];
  onToggleType: (value: SearchEntityType) => void;
  familyFriendly: boolean;
  onFamilyFriendlyChange: (value: boolean) => void;
  accessibleOnly: boolean;
  onAccessibleOnlyChange: (value: boolean) => void;
}): JSX.Element {
  return (
    <div className="stack compact">
      <div className="field">
        <label htmlFor="search-q">Cosa vuoi trovare?</label>
        <input
          id="search-q"
          className="input"
          value={q}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Musei, panorami, eventi, tradizioni..."
        />
      </div>

      <div className="field">
        <span>Tipologie</span>
        <FilterChipGroup options={typeOptions} selected={selectedTypes} onToggle={onToggleType} />
      </div>

      <div className="search-toggle-grid">
        <label className="toggle search-toggle-card">
          <input
            type="checkbox"
            checked={familyFriendly}
            onChange={(event) => onFamilyFriendlyChange(event.target.checked)}
          />
          <span>Solo risultati family-friendly</span>
        </label>

        <label className="toggle search-toggle-card">
          <input
            type="checkbox"
            checked={accessibleOnly}
            onChange={(event) => onAccessibleOnlyChange(event.target.checked)}
          />
          <span>Solo risultati accessibili</span>
        </label>
      </div>
    </div>
  );
}
