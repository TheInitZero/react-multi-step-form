import type { ReactNode } from 'react';
import { useTitleFocus } from '../../hooks/use-title-focus';

type SelectPlanProps = {
  billingOptions: ReactNode;
  subscriptionOptions: ReactNode;
  footer: ReactNode;
};

export default function SelectPlan({
  billingOptions,
  subscriptionOptions,
  footer,
}: SelectPlanProps) {
  const titleRefCallback = useTitleFocus<HTMLLegendElement>();

  return (
    <fieldset className="space-y-4">
      <div className="space-y-2">
        <legend tabIndex={-1} className="text-xl outline-none" ref={titleRefCallback}>
          Select your plan
        </legend>
        <p className="text-black/45">You have the option of monthly or yearly billing.</p>
      </div>

      <fieldset className="space-y-2">
        <legend>Billing frequency</legend>
        <div className="grid gap-2 sm:grid-cols-2">{billingOptions}</div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend>Subscription level</legend>
        <div className="grid gap-2 sm:grid-cols-3">{subscriptionOptions}</div>
      </fieldset>

      {footer}
    </fieldset>
  );
}
