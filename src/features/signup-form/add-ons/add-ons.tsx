import type { ReactNode } from 'react';
import { useTitleFocus } from '../../hooks/use-title-focus';

type AddOnsProps = {
  options: ReactNode;
  footer: ReactNode;
};

export default function AddOns({ options, footer }: AddOnsProps) {
  const titleRefCallback = useTitleFocus<HTMLLegendElement>();

  return (
    <fieldset className="space-y-4">
      <div className="space-y-2">
        <legend tabIndex={-1} className="text-xl outline-none" ref={titleRefCallback}>
          Pick add-ons
        </legend>
        <p className="text-black/45">Add-ons help enhance your gaming experience.</p>
      </div>

      <ul className="grid gap-2">{options}</ul>

      {footer}
    </fieldset>
  );
}
