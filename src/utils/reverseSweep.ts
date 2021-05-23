import * as math from 'mathjs';
import { calcXM } from './calcXM';

export function reverseSweep(
  M: number,
  alpha: math.Matrix[],
  beta: math.Matrix[]
) {
  const Xn = [...Array(Math.round(M + 1))] as math.Matrix[];
  Xn[Xn.length - 1] = calcXM(alpha, beta);

  for (let i = M - 1; i >= 0; i--) {
    Xn[i] = math.add(
      beta[i],
      math.multiply(alpha[i], Xn[i + 1])
    ) as math.Matrix;
  }
  return Xn;
}
