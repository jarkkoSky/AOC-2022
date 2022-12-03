import { pipe, flow, constFalse, constTrue, constUndefined, apply } from 'fp-ts/lib/function';
import * as R from 'fp-ts/lib/Record';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';
import * as S from 'fp-ts/lib/string';
import * as Ord from 'fp-ts/lib/Ord';
import * as N from 'fp-ts/lib/number';

import * as NEA from 'fp-ts/lib/NonEmptyArray';

export { pipe, flow, constFalse, constTrue, constUndefined, R, A, O, E, NEA, S, Ord, N };

export const sum = (arr: number[]) => A.reduce<number, number>(0, (prev, next) => prev + next)(arr);

export const min = (arr: number[]) => A.reduce<number, number>(0, (prev, next) => Ord.min(N.Ord)(prev, next))(arr);

export const max = (arr: number[]) => A.reduce<number, number>(0, (prev, next) => Ord.max(N.Ord)(prev, next))(arr);

export const sortDescending = NEA.sortBy([N.Ord]);

export const divide = (divider: number) => (value: number) => value / divider;

export const stringFromCharCode = (code: number) => String.fromCharCode(code);

export const groupsOf =
  <T>(n: number) =>
  (list: T[]): T[][] => {
    if (A.isEmpty(list)) {
      return [];
    }

    return A.prepend(A.takeLeft(n)(list))(groupsOf(n)(A.dropLeft(n)(list)) as T[][]);
  };

export const intersection = ([f, s]: [string, string]) =>
  pipe(
    S.split('')(f),
    NEA.fromReadonlyNonEmptyArray,
    NEA.map((char) =>
      pipe(
        S.split('')(s),
        NEA.fromReadonlyNonEmptyArray,
        A.findFirst((c) => c === char),
      ),
    ),
    A.filter(O.isSome),
    A.map((x) => x.value),
    A.uniq(S.Eq),
  );

export const intersection3 = ([f, s, t]: [string, string, string]) =>
  pipe(
    intersection([f, s]),
    A.map((x) => intersection([x, t])),
    A.flatten,
  );

export const splitStringAtMiddle = (input: string): [string, string] =>
  pipe(
    input,
    S.size,
    (length) => [divide(2)(length), length],
    ([half, length]) => [S.slice(0, half)(input), S.slice(half, length)(input)],
  );

export const alphabets = (transformFn: (s: string) => string) =>
  pipe(NEA.range(65, 90), A.map(flow(stringFromCharCode, transformFn)));
