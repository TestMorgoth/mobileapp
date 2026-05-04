export function MetaBadges({ items }: { items: string[] }): JSX.Element | null {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="assistant-inline">
      {items.map((item) => (
        <span key={item} className="assistant-pill">
          {item}
        </span>
      ))}
    </div>
  );
}
