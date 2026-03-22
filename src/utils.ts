export type Some<T> = {
  kind: 'Some';
  value: T;
};

export type None = {
  kind: 'None';
};

export type Maybe<T> = Some<T> | None;

export type Ok<T> = {
  kind: 'Ok';
  value: T;
};

export type Err<E> = {
  kind: 'Err';
  value: E;
};

export type Result<T, E> = Ok<T> | Err<E>;

export function some<T>(value: T): Some<T> {
  return { kind: 'Some', value };
}

export function none(): None {
  return { kind: 'None' };
}

export function nullishToMaybe<T>(value: T | null | undefined): Maybe<T> {
  if (value == null) {
    return none();
  }
  return some(value);
}

export function ok<T>(value: T): Ok<T> {
  return { kind: 'Ok', value };
}

export function err<E>(value: E): Err<E> {
  return { kind: 'Err', value };
}
