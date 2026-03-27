import type { ReactNode } from 'react';

type AddOnsProps = {
  options: ReactNode;
  footer: ReactNode;
};

export default function AddOns({ options, footer }: AddOnsProps) {
  return (
    <fieldset className="space-y-4">
      <div className="space-y-2">
        <legend className="text-xl">Pick add-ons</legend>
        <p className="text-black/45">Add-ons help enhance your gaming experience.</p>
      </div>

      <ul className="grid gap-2">{options}</ul>

      {footer}
    </fieldset>
  );
}
