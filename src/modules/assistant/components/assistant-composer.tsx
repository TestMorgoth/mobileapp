export function AssistantComposer({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
}): JSX.Element {
  return (
    <form className="stack assistant-composer" onSubmit={onSubmit}>
      <textarea
        className="textarea assistant-textarea"
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Scrivi una domanda sul territorio..."
      />
      <div className="assistant-inline">
        <button className="button" disabled={disabled || !value.trim()} type="submit">
          {disabled ? 'Invio in corso...' : 'Invia richiesta'}
        </button>
      </div>
    </form>
  );
}
