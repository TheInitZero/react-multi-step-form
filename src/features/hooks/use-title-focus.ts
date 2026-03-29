import { useEffect, useRef } from 'react';
import { none, nullishToMaybe, type Maybe } from '../../utils';

export function useTitleFocus<T extends HTMLElement>() {
  const titleRef = useRef<Maybe<T>>(none());

  useEffect(() => {
    if (titleRef.current.kind === 'Some') {
      titleRef.current.value.focus();
    }
  });

  function refCallback(node: T | null) {
    titleRef.current = nullishToMaybe(node);

    return () => {
      titleRef.current = none();
    };
  }

  return refCallback;
}
