import { formatAssistantGuardrailReason } from '@territorio/shared-types';
import { MetaBadges } from '../../../components/ui/meta-badges.js';

export function AssistantResponseMeta({
  mode,
  fallbackUsed,
  retrievalCount,
  promptVersion,
  groundingMode,
  municipalityName,
  guardrailReason,
  llmEnrichmentUsed,
}: {
  mode: string;
  fallbackUsed: boolean;
  retrievalCount: number;
  promptVersion: string;
  groundingMode?: string | undefined;
  municipalityName?: string | undefined;
  guardrailReason?: string | null | undefined;
  llmEnrichmentUsed?: boolean | undefined;
}): JSX.Element {
  const guardrailLabel = guardrailReason
    ? `Guardrail: ${formatAssistantGuardrailReason(guardrailReason)}`
    : null;

  const groundingLabel = groundingMode === 'backend_grounded'
    ? 'Grounding: backend'
    : groundingMode === 'llm_enriched'
      ? 'Grounding: llm'
      : groundingMode === 'guardrail'
        ? 'Grounding: guardrail'
        : null;

  return (
    <div className="stack compact">
      <MetaBadges
        items={[
          `Modalita: ${mode}`,
          fallbackUsed ? 'Fallback attivo' : 'Live response',
          `${retrievalCount} fonti`,
          ...(groundingLabel ? [groundingLabel] : []),
          ...(municipalityName ? [`Comune: ${municipalityName}`] : []),
          ...(llmEnrichmentUsed ? ['LLM enrichment'] : []),
          ...(guardrailLabel ? [guardrailLabel] : []),
        ]}
      />
      <p className="muted">Versione prompt: {promptVersion}</p>
    </div>
  );
}
