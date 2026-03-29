import { type ReactNode } from 'react';
import { useTitleFocus } from '../../hooks/use-title-focus';

type YourInfoProps = {
  inputs: ReactNode;
  footer: ReactNode;
};

export default function YourInfo({ inputs, footer }: YourInfoProps) {
  const titleRefCallback = useTitleFocus<HTMLLegendElement>();

  return (
    <fieldset className="space-y-4">
      <div className="space-y-2">
        <legend tabIndex={-1} className="text-xl outline-none" ref={titleRefCallback}>
          Personal info
        </legend>
        <p className="text-black/45">Please provide your name, email address, and phone number.</p>
      </div>

      <div className="space-y-2">{inputs}</div>

      {footer}
    </fieldset>
  );
}
