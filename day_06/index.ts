import { readFileSync } from 'fs';
import { pipe, flow, S, A, O, stringToCharArray, aperture } from '../utils/fp-utils';

const result = (messageSize: number) =>
  pipe(
    readFileSync('./day_06/input.txt').toString('utf-8'),
    stringToCharArray,
    aperture(messageSize),
    A.findIndex(flow(A.uniq(S.Eq), A.size, (l) => l === messageSize)),
    O.map((x) => {
      console.log(`Answer is: ${x + messageSize}`);
    }),
  );

result(4);
result(14);
