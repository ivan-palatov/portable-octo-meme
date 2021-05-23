import * as math from 'mathjs';

export function calcXM(
  alphaList: math.Matrix[],
  betaList: math.Matrix[]
): math.Matrix {
  const alpha = alphaList[alphaList.length - 1];
  const beta = betaList[betaList.length - 1];

  const Alpha = math.matrix([
    [alpha.get([0, 0]), alpha.get([0, 1])],
    [alpha.get([1, 0]), alpha.get([1, 1])],
  ]);
  const Beta = math.matrix([[beta.get([0, 0])], [beta.get([1, 0])]]);

  const Rho = (math.multiply(
    math.inv(math.subtract(math.identity([2, 2]), Alpha) as math.Matrix),
    Beta
  ) as math.Matrix).toArray() as number[][];

  // Из правых граничных условий
  return math.matrix([[Rho[0][0]], [Rho[1][0]], [0], [0]]);
}
