import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function SignupProgress({ children }: Props) {
  return (
    <aside
      aria-label="Signup progress"
      data-signup-progress
      className="rounded-2xl border-2 border-gray-200 p-4 shadow-sm"
    >
      <ol className="flex items-center justify-center gap-4">{children}</ol>
    </aside>
  );
}
