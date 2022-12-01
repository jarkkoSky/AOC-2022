import { pipe, flow, S, A, NEA, sum, N, O } from '../utils/fp-utils';
import { readFileSync } from 'fs';

const parseInputAndSumElfCalories = pipe(
  readFileSync('./day_01/input.txt').toString('utf-8'),
  S.split('\r\n\r\n'),
  NEA.fromReadonlyNonEmptyArray,
  A.map(flow(S.replace(/(\r\n)/gm, ','), S.split(','), NEA.fromReadonlyNonEmptyArray, A.map(parseInt), sum)),
  NEA.fromArray,
);

pipe(
  parseInputAndSumElfCalories,
  O.map(NEA.max(N.Ord)),
  O.getOrElseW(() => ':('),
  (answer) => console.log(`Part 1: ${answer}`),
);

pipe(
  parseInputAndSumElfCalories,
  O.map(flow(NEA.sortBy([N.Ord]), A.takeRight(3), sum)),
  O.getOrElseW(() => ':('),
  (answer) => console.log(`Part 2: ${answer}`),
);
