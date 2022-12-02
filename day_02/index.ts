import { readFileSync } from 'fs';
import { pipe, flow, S, NEA, sum } from '../utils/fp-utils';

enum Move {
  ROCK = 'A',
  PAPER = 'B',
  SCISSORS = 'C',
}

enum Outcome {
  LOSE = 'X',
  DRAW = 'Y',
  WIN = 'Z',
}

enum MoveScore {
  'A' = 1,
  'B' = 2,
  'C' = 3,
}

enum MatchScore {
  LOST = 0,
  DRAW = 3,
  WIN = 6,
}

const transformMove = (x: string): Move => {
  if (x === 'X') return Move.ROCK;
  if (x === 'Y') return Move.PAPER;

  return Move.SCISSORS;
};

const transformMoveToGetOutcome = (opponentMove: Move, outcome: Outcome): Move => {
  if (outcome === Outcome.LOSE) {
    if (opponentMove === Move.PAPER) return Move.ROCK;
    if (opponentMove === Move.ROCK) return Move.SCISSORS;
    if (opponentMove === Move.SCISSORS) return Move.PAPER;
  }

  if (outcome === Outcome.WIN) {
    if (opponentMove === Move.PAPER) return Move.SCISSORS;
    if (opponentMove === Move.ROCK) return Move.PAPER;
    if (opponentMove === Move.SCISSORS) return Move.ROCK;
  }

  return opponentMove;
};

const roundScore = ([opponentMove, myMove]: [Move, Move]) => {
  if (
    (myMove === Move.ROCK && opponentMove === Move.PAPER) ||
    (myMove === Move.SCISSORS && opponentMove === Move.ROCK) ||
    (myMove === Move.PAPER && opponentMove === Move.SCISSORS)
  ) {
    return MatchScore.LOST + MoveScore[myMove];
  }

  if (
    (myMove === Move.ROCK && opponentMove === Move.SCISSORS) ||
    (myMove === Move.SCISSORS && opponentMove === Move.PAPER) ||
    (myMove === Move.PAPER && opponentMove === Move.ROCK)
  ) {
    return MatchScore.WIN + MoveScore[myMove];
  }

  return MatchScore.DRAW + MoveScore[myMove];
};

const result = (transformFn: ([f, s]: readonly string[]) => [Move, Move]) =>
  pipe(
    readFileSync('./day_02/input.txt').toString('utf-8'),
    S.split('\r\n'),
    NEA.fromReadonlyNonEmptyArray,
    NEA.map(flow(S.split(' '), transformFn, roundScore)),
    sum,
  );

console.log(`Part 1: ${result(([f, s]) => [f, transformMove(s)] as [Move, Move])}`);
console.log(`Part 2: ${result(([f, s]) => [f, transformMoveToGetOutcome(f as Move, s as Outcome)] as [Move, Move])}`);
