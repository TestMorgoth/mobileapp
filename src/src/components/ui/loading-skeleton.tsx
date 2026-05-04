export function LoadingSkeleton({ text = 'Caricamento in corso...' }: { text?: string }): JSX.Element {
  return <div className="loading-block">{text}</div>;
}
