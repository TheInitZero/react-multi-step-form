import { getPriceLabel, type BillingPeriod } from '../utils';
import { useId } from 'react';

export type AddOnsOptionProps = {
  value: string;
  checked?: boolean;
  onChange: (value: string) => void;
  labelText: string;
  description: string;
  price: { billingPeriod: BillingPeriod; amount: number };
};

export default function AddOnsOption({
  value,
  checked = false,
  onChange,
  labelText,
  description,
  price,
}: AddOnsOptionProps) {
  const inputId = useId();

  return (
    <li className="expanded-option-region">
      <input
        type="checkbox"
        name="add-ons"
        id={inputId}
        value={value}
        aria-describedby={`${inputId}-description ${inputId}-price`}
        checked={checked}
        onChange={() => onChange(value)}
        className="expanded-option"
      />

      <div>
        <label htmlFor={inputId} className="mb-2 block">
          {labelText}
        </label>

        <p id={`${inputId}-price`}>
          +{getPriceLabel({ amount: price.amount, billingPeriod: price.billingPeriod })}
        </p>

        <p id={`${inputId}-description`} className="text-black/45">
          {description}
        </p>
      </div>
    </li>
  );
}
