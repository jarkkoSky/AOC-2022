import { readFileSync } from 'fs';
import { pipe, flow, S, NEA, sum, A, O, stringFromCharCode } from '../utils/fp-utils';

const stringToCharArray = (s: string) => pipe(s, S.split(''), NEA.fromReadonlyNonEmptyArray);

const splitStringAtMiddle = (input: string) => pipe(input, stringToCharArray, A.splitAt(S.size(input) / 2));

const alphabets = (transformFn: (s: string) => string) =>
  pipe(NEA.range(65, 90), A.map(flow(stringFromCharCode, transformFn)));

const priority = (item: string) =>
  pipe(
    alphabets(S.toLowerCase),
    A.concat(alphabets(S.toUpperCase)),
    A.findIndex((x) => x === item),
    O.map((index) => index + 1),
    O.getOrElse(() => 0),
  );

const input = pipe(
  readFileSync('./day_03/input.txt').toString('utf-8'),
  S.split('\r\n'),
  NEA.fromReadonlyNonEmptyArray,
);

pipe(
  input,
  A.map(
    flow(
      splitStringAtMiddle,
      ([f, s]) => A.intersection(S.Eq)(f)(s),
      NEA.fromArray,
      O.map(flow(NEA.head, priority)),
      O.getOrElse(() => 0),
    ),
  ),
  sum,
  (x) => console.log(`Part 1 answer ${x}`),
);

pipe(
  input,
  A.chunksOf(3),
  A.map(
    flow(
      ([f, s, t]) =>
        pipe(
          A.intersection(S.Eq)(stringToCharArray(f))(stringToCharArray(s)),
          A.intersection(S.Eq)(stringToCharArray(t)),
        ),
      NEA.fromArray,
      O.map(flow(NEA.head, priority)),
      O.getOrElse(() => 0),
    ),
  ),
  sum,
  (x) => console.log(`Part 2 answer ${x}`),
);
