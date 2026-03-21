import { useId } from 'react';
import clsx from 'clsx';

type Props = {
  title: string;
  status: {
    kind: 'NotStarted' | 'Current' | 'Completed';
    description: string;
  };
};

export default function ProgressStep({ title, status }: Props) {
  const titleId = useId();
  const descId = useId();

  return (
    <li
      aria-current={status.kind === 'Current' ? 'step' : undefined}
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="flex items-center gap-2"
    >
      <p
        id={titleId}
        className={clsx('sr-only sm:not-sr-only', status.kind != 'Current' && 'sm:text-black/45')}
      >
        {title}
      </p>

      <span id={descId} className="sr-only">
        {status.description}
      </span>
    </li>
  );
}
