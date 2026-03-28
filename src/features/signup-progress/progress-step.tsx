import { useId } from 'react';
import clsx from 'clsx';

type Props = {
  title: string;
  status: {
    kind: 'NotStarted' | 'Started' | 'Completed';
    description: string;
  };
};

export default function ProgressStep({ title, status }: Props) {
  const titleId = useId();
  const descId = useId();

  return (
    <li
      aria-current={status.kind === 'Started' ? 'step' : undefined}
      aria-labelledby={titleId}
      aria-describedby={descId}
      data-progress-step={status.kind}
      className="flex items-center gap-2"
    >
      <p
        id={titleId}
        className={clsx('sr-only sm:not-sr-only', status.kind !== 'Started' && 'sm:text-black/45')}
      >
        {title}
      </p>

      <span id={descId} className="sr-only">
        {status.description}
      </span>
    </li>
  );
}
