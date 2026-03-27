import type { ReactNode } from 'react';

type YourInfoProps = {
  inputs: ReactNode;
  footer: ReactNode;
};

export default function YourInfo({ inputs, footer }: YourInfoProps) {
  return (
    <fieldset className="space-y-4">
      <div className="space-y-2">
        <legend className="text-xl">Personal info</legend>
        <p className="text-black/45">Please provide your name, email address, and phone number.</p>
      </div>

      <div className="space-y-2">{inputs}</div>

      {footer}
    </fieldset>
  );
}
