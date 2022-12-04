import { readFileSync } from 'fs';
import { pipe, flow, S, NEA, A, N, identity } from '../utils/fp-utils';

const isContained = ([f, s]: NEA.NonEmptyArray<NEA.NonEmptyArray<number>>) =>
  pipe(A.intersection(N.Eq)(f)(s), A.size, (length) => A.size(f) === length || A.size(s) === length);

const isOverlapping = ([f, s]: NEA.NonEmptyArray<NEA.NonEmptyArray<number>>) =>
  pipe(A.intersection(N.Eq)(f)(s), A.size, (length) => length > 0);

const run = (part: string, intersecFn: typeof isContained) => {
  pipe(
    readFileSync('./day_04/input.txt').toString('utf-8'),
    S.split('\r\n'),
    NEA.fromReadonlyNonEmptyArray,
    NEA.map(
      flow(
        S.split(','),
        NEA.fromReadonlyNonEmptyArray,
        NEA.map(flow(S.split('-'), NEA.fromReadonlyNonEmptyArray, NEA.map(parseInt), ([s, e]) => NEA.range(s, e))),
        intersecFn,
      ),
    ),
    A.filter(identity),
    A.size,
    (x) => console.log(`${part} answer ${x}`),
  );
};

run('Part 1', isContained);
run('Part 2', isOverlapping);
