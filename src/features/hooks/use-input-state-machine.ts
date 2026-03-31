import { useMachine } from '@xstate/react';
import { inputMachine } from '../state/input-state';

export function useInputStateMachine() {
  const [snapshot, send] = useMachine(inputMachine);
  return { snapshot, send };
}
