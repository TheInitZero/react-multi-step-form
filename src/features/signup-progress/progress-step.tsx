import clsx from 'clsx';

type Props = {
  title: string;
  status: { kind: 'NotStarted' | 'Current' | 'Completed'; description: string };
};

export default function ProgressStep({ title, status }: Props) {
  return (
    <li
      aria-current={status.kind == 'Current' ? 'step' : undefined}
      data-progress-step={status.kind}
      className="flex items-center gap-2"
    >
      <p className={clsx('sr-only sm:not-sr-only', status.kind != 'Current' && 'sm:text-black/45')}>
        {title}
      </p>
      <span className="sr-only">{status.description}</span>
    </li>
  );
}
