import { readFileSync } from 'fs';
import { pipe, S, A, O, NEA, flow, stringToCharArray, identity } from '../utils/fp-utils';

const isVisibleFromLeftOrRight = ([xIndex, yIndex]: [number, number], rows: number[][]) => {
  const row = rows[yIndex];

  const indexValue = pipe(
    A.lookup(xIndex)(row),
    O.getOrElse(() => 0),
  );

  const isVisibleFromLeft = pipe(
    A.splitAt(xIndex)(row),
    A.head,
    O.map(A.every((val) => val < indexValue)),
    O.getOrElse(() => false),
  );

  const isVisibleFromRight = pipe(
    A.splitAt(xIndex)(row),
    A.last,
    O.map(
      flow(
        A.dropLeft(1),
        A.every((val) => val < indexValue),
      ),
    ),
    O.getOrElse(() => false),
  );

  return isVisibleFromRight || isVisibleFromLeft;
};

const isVisibleFromTop = ([xIndex, yIndex]: [number, number], rows: number[][]) => {
  if (yIndex === 0) return true;

  const indexValue = pipe(
    A.lookup(xIndex)(rows[yIndex]),
    O.getOrElse(() => 0),
  );

  return pipe(
    NEA.range(0, yIndex - 1),
    A.every((y) => rows[y][xIndex] < indexValue),
  );
};

const isVisibleFromBottom = ([xIndex, yIndex]: [number, number], rows: number[][]) => {
  if (yIndex === A.size(rows) - 1) return true;

  const indexValue = pipe(
    A.lookup(xIndex)(rows[yIndex]),
    O.getOrElse(() => 0),
  );

  return pipe(
    NEA.range(yIndex + 1, A.size(rows) - 1),
    A.every((y) => rows[y][xIndex] < indexValue),
  );
};

const rows = pipe(
  readFileSync('./day_08/input.txt').toString('utf-8'),
  S.split('\r\n'),
  NEA.fromReadonlyNonEmptyArray,
  A.map(flow(stringToCharArray, A.map(parseInt))),
);

pipe(
  rows,
  A.mapWithIndex((yIndex, row) =>
    A.mapWithIndex(
      (xIndex, val) =>
        isVisibleFromBottom([xIndex, yIndex], rows) ||
        isVisibleFromTop([xIndex, yIndex], rows) ||
        isVisibleFromLeftOrRight([xIndex, yIndex], rows),
    )(row),
  ),
  A.flatten,
  A.filter(identity),
  A.size,
);
