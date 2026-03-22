import { useId } from 'react';
import type { Maybe } from '../../../utils';

type InputType =
  | {
      kind: 'text';
      autoComplete: 'name';
    }
  | {
      kind: 'email';
      autoComplete: 'email';
    }
  | {
      kind: 'tel';
      autoComplete: 'tel';
    };

type Props = {
  labelText: string;
  name: string;
  placeholder: string;
  required?: boolean;
  inputType: InputType;
  value: string;
  onInput: (value: string) => void;
  validationStatus: Maybe<string>;
};

export default function InfoInput({
  labelText,
  name,
  placeholder,
  required,
  inputType,
  value,
  onInput,
  validationStatus,
}: Props) {
  const inputId = useId();

  return (
    <div className="grid gap-2">
      <label htmlFor={inputId}>
        {labelText}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={inputType.kind}
        name={name}
        id={inputId}
        placeholder={placeholder}
        autoComplete={inputType.autoComplete}
        aria-describedby={`${inputId}-error`}
        aria-invalid={validationStatus.kind === 'Some'}
        required={required}
        className="rounded-lg border-2 border-gray-300 text-blue-700 shadow-sm placeholder:text-black/45 focus:border-blue-500 focus:ring-0 focus:outline-2 focus:outline-blue-500 aria-invalid:border-red-300 aria-invalid:focus:border-red-500 aria-invalid:focus:outline-red-500"
        value={value}
        onInput={(event) => onInput(event.currentTarget.value)}
      />
      <span id={`${inputId}-error`} aria-live="assertive" className="text-red-500">
        {validationStatus.kind === 'Some' && validationStatus.value}
      </span>
    </div>
  );
}
