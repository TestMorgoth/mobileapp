import type { PropsWithChildren } from 'react';

export function PlannerStepSection({
  step,
  title,
  text,
  children,
}: PropsWithChildren<{
  step: string;
  title: string;
  text: string;
}>): JSX.Element {
  return (
    <section className="planner-step-section">
      <div className="planner-step-copy">
        <p className="eyebrow">{step}</p>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      {children}
    </section>
  );
}
