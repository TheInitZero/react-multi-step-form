import { useId } from 'react';

export type BillingOptionProps = {
  value: string;
  required?: boolean;
  checked?: boolean;
  onChange: (value: string) => void;
  labelText: string;
};

export default function BillingOption({
  value,
  required = false,
  checked = false,
  onChange,
  labelText,
}: BillingOptionProps) {
  const inputId = useId();

  return (
    <div className="flex items-center rounded-xl border-2 border-gray-300 p-4 shadow-md focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-500 has-checked:border-blue-500 has-checked:bg-blue-50">
      <input
        type="radio"
        name="billing-frequency"
        id={inputId}
        value={value}
        required={required}
        checked={checked}
        onChange={() => onChange(value)}
        className="focus:ring-0"
      />
      <label htmlFor={inputId} className="flex-1 text-center">
        {labelText}
      </label>
    </div>
  );
}
