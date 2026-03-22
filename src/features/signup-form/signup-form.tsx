import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function SignupForm({ children }: Props) {
  return <form className="rounded-2xl border-2 border-gray-200 p-4 shadow-sm">{children}</form>;
}
