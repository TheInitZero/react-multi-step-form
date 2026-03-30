import { useMachine } from '@xstate/react';
import { formProgressMachine } from '../state/form-progress-state';

export function useFormProgressMachine() {
  const [snapshot, send] = useMachine(formProgressMachine);
  return { snapshot, send };
}
