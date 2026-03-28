import { getPriceLabel, type BillingPeriod } from '../utils';
import { useId } from 'react';

export type SubscriptionOptionProps = {
  value: string;
  required?: boolean;
  checked?: boolean;
  onChange: (value: string) => void;
  labelText: string;
  description:
    | { billingPeriod: Extract<BillingPeriod, 'Monthly'>; price: number }
    | { billingPeriod: Extract<BillingPeriod, 'Yearly'>; price: number; bonuses: string[] };
};

export default function SubscriptionOption({
  value,
  required = false,
  checked = false,
  onChange,
  labelText,
  description,
}: SubscriptionOptionProps) {
  const inputId = useId();

  return (
    <div className="expanded-option-region">
      <input
        type="radio"
        name="subscription-level"
        id={inputId}
        value={value}
        aria-describedby={`${inputId}-description`}
        required={required}
        checked={checked}
        onChange={() => onChange(value)}
        className="expanded-option"
      />

      <div>
        <label htmlFor={inputId} className="mb-2 block">
          {labelText}
        </label>
        <p id={`${inputId}-description`}>
          {getPriceLabel({ amount: description.price, billingPeriod: description.billingPeriod })}
        </p>

        {description.billingPeriod == 'Yearly' &&
          description.bonuses.map((bonus) => (
            <p key={bonus} className="text-black/45">
              {bonus}
            </p>
          ))}
      </div>
    </div>
  );
}
