import * as math from 'mathjs';
import { makeMatrix } from './makeMatrix';

export function getValueMatrix(
  f: string,
  N: number,
  M: number,
  tau: number,
  h: number
) {
  const fParsed = math.parse(f);

  return makeMatrix(N + 1, M + 1, (i, j) =>
    fParsed.evaluate({ x: j * h, t: i * tau })
  );
}
