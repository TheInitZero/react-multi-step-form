import type { ReactNode } from 'react';

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
  return (
    <fieldset className="space-y-4">
      <div className="space-y-2">
        <legend className="text-xl">Select your plan</legend>
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
