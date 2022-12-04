import { pipe, flow, constFalse, constTrue, constUndefined, apply } from 'fp-ts/lib/function';
import * as R from 'fp-ts/lib/Record';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';
import * as S from 'fp-ts/lib/string';
import * as Ord from 'fp-ts/lib/Ord';
import * as N from 'fp-ts/lib/number';
import * as SG from 'fp-ts/lib/Semigroup';

import * as NEA from 'fp-ts/lib/NonEmptyArray';

export { pipe, flow, constFalse, constTrue, constUndefined, R, A, O, E, NEA, S, Ord, N };

export const sum = (numbers: number[]) => pipe(numbers, SG.concatAll(N.SemigroupSum)(0));

export const min = (arr: number[]) => A.reduce<number, number>(0, (prev, next) => Ord.min(N.Ord)(prev, next))(arr);

export const max = (arr: number[]) => A.reduce<number, number>(0, (prev, next) => Ord.max(N.Ord)(prev, next))(arr);

export const sortDescending = NEA.sortBy([N.Ord]);

export const divide = (divider: number) => (value: number) => value / divider;

export const stringFromCharCode = (code: number) => String.fromCharCode(code);

export const alphabets = (transformFn: (s: string) => string) =>
  pipe(NEA.range(65, 90), A.map(flow(stringFromCharCode, transformFn)));
