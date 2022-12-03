import { readFileSync } from 'fs';
import { pipe, flow, S, NEA, sum, A, O, divide, stringFromCharCode } from '../utils/fp-utils';

const groupsOf =
  <T>(n: number) =>
  (list: T[]): T[][] => {
    if (A.isEmpty(list)) {
      return [];
    }

    return A.prepend(A.takeLeft(n)(list))(groupsOf(n)(A.dropLeft(n)(list)) as T[][]);
  };

const intersection = ([f, s]: [string, string]) =>
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

const intersection3 = ([f, s, t]: [string, string, string]) =>
  pipe(
    intersection([f, s]),
    A.map((x) => intersection([x, t])),
    A.flatten,
  );

const splitStringAtMiddle = (input: string): [string, string] =>
  pipe(
    input,
    S.size,
    (length) => [divide(2)(length), length],
    ([half, length]) => [S.slice(0, half)(input), S.slice(half, length)(input)],
  );

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

pipe(
  readFileSync('./day_03/input.txt').toString('utf-8'),
  S.split('\r\n'),
  NEA.fromReadonlyNonEmptyArray,
  A.map(
    flow(
      splitStringAtMiddle,
      intersection,
      NEA.fromArray,
      O.map(flow(NEA.head, priority)),
      O.getOrElse(() => 0),
    ),
  ),
  sum,
  (x) => console.log(`Part 1 answer ${x}`),
);

pipe(
  readFileSync('./day_03/input.txt').toString('utf-8'),
  S.split('\r\n'),
  NEA.fromReadonlyNonEmptyArray,
  groupsOf(3),
  A.map((group) =>
    pipe(
      intersection3(group as [string, string, string]),
      NEA.fromArray,
      O.map(flow(NEA.head, priority)),
      O.getOrElse(() => 0),
    ),
  ),
  sum,
  (x) => console.log(`Part 2 answer ${x}`),
);
