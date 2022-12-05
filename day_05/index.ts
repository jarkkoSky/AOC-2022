import { readFileSync } from 'fs';
import { pipe, flow, S, NEA, A, O, containsLetter, stringToCharArray, isLetter } from '../utils/fp-utils';

type Stack = string[];
type Stacks = Stack[];

type Move = {
  move: number;
  from: number;
  to: number;
};

const parseMove = (move: string) =>
  pipe(
    move.match(/move ([0-9]*) from ([0-9]*) to ([0-9]*)/),
    O.fromNullable,
    O.map(
      flow(A.map(parseInt), ([, move, from, to]) => ({
        move,
        from: from - 1,
        to: to - 1,
      })),
    ),
    O.getOrElse(() => ({
      move: 0,
      from: 0,
      to: 0,
    })),
  );

const deleteFromIndex =
  (index: number, count = 1) =>
  (stacks: Stacks) =>
    pipe(
      stacks,
      A.modifyAt(index, A.dropRight(count)),
      O.getOrElse(() => stacks),
    );

const takeFromIndex = (fromIndex: number, toIndex: number, count: number, stacks: Stacks) =>
  pipe(
    stacks,
    A.modifyAt(toIndex, (stack) =>
      A.concat(
        pipe(
          A.lookup(fromIndex)(stacks),
          O.map(A.takeRight(count)),
          O.getOrElse(() => [] as string[]),
        ),
      )(stack),
    ),
    O.getOrElse(() => stacks),
  );

const moveItem = (move: Move, stacks: Stacks, count = 1) =>
  pipe(takeFromIndex(move.from, move.to, count, stacks), deleteFromIndex(move.from, count));

const input = pipe(
  readFileSync('./day_05/input.txt').toString('utf-8'),
  S.split('\r\n'),
  NEA.fromReadonlyNonEmptyArray,
);

const stacks = pipe(
  input,
  A.map(
    flow(
      (x) => (containsLetter(x) ? O.some(x) : O.none),
      O.map(flow(stringToCharArray, A.chunksOf(4), A.map(A.filter(isLetter)))),
    ),
  ),
  A.compact,
  A.reverse,
  A.reduce([] as Stacks, (acc, letters) =>
    pipe(
      letters,
      A.reduceWithIndex(acc, (i, accumulator, letterArr) => {
        const letter = O.getOrElse(() => '')(A.head(letterArr));

        return pipe(
          accumulator,
          A.modifyAt(i, (stack) => (letter !== '' ? A.append(letter)(stack) : stack)),
          O.getOrElseW(() => A.append([letter])(accumulator)),
        );
      }),
    ),
  ),
);

const moves = pipe(input, A.map(flow((x) => (x.includes('move') ? O.some(x) : O.none))), A.compact, A.map(parseMove));

pipe(
  moves,
  A.scanLeft(stacks, (b: Stacks, a: Move) =>
    A.reduce(b, (acc) => moveItem(a, acc))(pipe(NEA.range(0, a.move), A.dropRight(1))),
  ),
  A.last,
  O.map(flow(A.map(A.last), A.compact, (x) => console.log(`Part 1 answer: ${x}`))),
);

pipe(
  moves,
  A.scanLeft(stacks, (b: Stacks, a: Move) => moveItem(a, b, a.move)),
  A.last,
  O.map(flow(A.map(A.last), A.compact, (x) => console.log(`Part 2 answer: ${x}`))),
);
