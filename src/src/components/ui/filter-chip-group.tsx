export function FilterChipGroup<TValue extends string>({
  options,
  selected,
  onToggle,
}: {
  options: Array<{ value: TValue; label: string }>;
  selected: TValue[];
  onToggle: (value: TValue) => void;
}): JSX.Element {
  return (
    <div className="chips">
      {options.map((option) => {
        const active = selected.includes(option.value);

        return (
          <button
            key={option.value}
            type="button"
            className={active ? 'chip chip-active' : 'chip chip-secondary'}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
