import type { ReactNode } from 'react';
import { calculateTotalPrice, getPriceLabel, type BillingPeriod } from '../utils';

export type SummaryProps = {
  subscription: { name: string; billingPeriod: BillingPeriod; price: number };
  addOns: { name: string; price: number }[];
  onSubscriptionChange: () => void;
  footer: ReactNode;
};

export default function Summary({
  subscription,
  addOns,
  onSubscriptionChange,
  footer,
}: SummaryProps) {
  const addOnsList = addOns.map((addOn) => (
    <li className="flex items-center justify-between">
      <span className="text-black/45">{addOn.name}</span>
      <span>
        +{getPriceLabel({ amount: addOn.price, billingPeriod: subscription.billingPeriod })}
      </span>
    </li>
  ));

  const totalPrice = calculateTotalPrice(
    subscription.price,
    addOns.map(({ price }) => price),
  );

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl">Finishing up</h2>
        <p className="text-black/45">Double-check everything looks OK before confirming.</p>
      </div>

      <div className="space-y-4 rounded-2xl border-2 border-gray-200 p-4 shadow-sm">
        <section aria-label="Subscription" className="space-y-2">
          <p className="flex items-center justify-between">
            <span>
              {subscription.name} ({subscription.billingPeriod})
            </span>{' '}
            <span>
              {getPriceLabel({
                amount: subscription.price,
                billingPeriod: subscription.billingPeriod,
              })}
            </span>
          </p>
          <button
            type="button"
            className="text-blue-700 underline underline-offset-2 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
            onClick={onSubscriptionChange}
          >
            Change subscription
          </button>
        </section>

        {addOnsList.length > 0 && <ul aria-label="Add-ons">{addOnsList}</ul>}

        <hr className="border-t-2 border-gray-200" />

        <p className="flex items-center justify-between">
          <span>Total ({subscription.billingPeriod})</span>{' '}
          <span>
            {getPriceLabel({ amount: totalPrice, billingPeriod: subscription.billingPeriod })}
          </span>
        </p>
      </div>

      {footer}
    </section>
  );
}
