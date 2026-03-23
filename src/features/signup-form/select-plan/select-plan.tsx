import BillingOption from './billing-option';
import SubscriptionOption from './subscription-option';

export default function SelectPlan() {
  return (
    <fieldset className="space-y-4">
      <div className="space-y-2">
        <legend className="text-xl">Select your plan</legend>
        <p className="text-black/45">You have the option of monthly or yearly billing.</p>
      </div>

      <fieldset className="space-y-2">
        <legend>Billing frequency</legend>

        <div className="grid gap-2 sm:grid-cols-2">
          <BillingOption
            value="monthly"
            labelText="Monthly"
            required={true}
            onChange={() => {}}
            checked
          />

          <BillingOption value="yearly" labelText="Yearly" required={true} onChange={() => {}} />
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend>Subscription level</legend>

        <div className="grid gap-2 sm:grid-cols-3">
          <SubscriptionOption
            value="arcade"
            required={true}
            labelText="Arcade"
            description={{
              billingPeriod: 'Yearly',
              price: 90,
              bonuses: ['2 months free'],
            }}
            onChange={() => {}}
            checked
          />

          <SubscriptionOption
            value="advanced"
            required={true}
            labelText="Advanced"
            description={{
              billingPeriod: 'Yearly',
              price: 120,
              bonuses: ['3 months free'],
            }}
            onChange={() => {}}
          />

          <SubscriptionOption
            value="pro"
            required={true}
            labelText="Pro"
            description={{
              billingPeriod: 'Yearly',
              price: 150,
              bonuses: ['4 months free'],
            }}
            onChange={() => {}}
          />
        </div>
      </fieldset>

      <div className="flex items-center justify-between">
        <button type="button" className="btn-ghost">
          Go Back
        </button>
        <button type="button" className="btn-primary">
          Next Step
        </button>
      </div>
    </fieldset>
  );
}
