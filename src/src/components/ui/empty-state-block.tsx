export function EmptyStateBlock({
  title,
  text,
}: {
  title: string;
  text: string;
}): JSX.Element {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
