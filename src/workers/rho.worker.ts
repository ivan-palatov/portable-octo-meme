import * as math from 'mathjs';
import { calcRho } from '../utils/calcRho';

const ctx: Worker = self as any;

ctx.onmessage = (e) => {
  const { M, N, T, u: ufunc, rho0, rho, epsilon, f } = e.data;
  console.log('Starting rho worker');

  const u = Array(N + 1)
    .fill(0)
    .map((_, i) =>
      Array(M + 1)
        .fill(0)
        .map((_, j) =>
          math.evaluate(ufunc, {
            t: i * (T / N),
            x: j / M,
          })
        )
    );

  const res = calcRho({
    rho0: math.parse(rho0),
    f: math.parse(f),
    epsilon: math.evaluate(epsilon),
    M,
    N,
    T,
    u,
  });

  const x = Array(M + 1)
    .fill(0)
    .map((_, i) => i * (1 / M));
  const y = Array(N + 1)
    .fill(0)
    .map((_, i) => i * (T / N));

  const actualF = Array(N + 1)
    .fill(0)
    .map((_, i) =>
      Array(M + 1)
        .fill(0)
        .map((_, j) => math.evaluate(rho, { x: j * (1 / M), t: i * (T / N) }))
    );

  const diff = Array(N + 1)
    .fill(0)
    .map((_, i) =>
      Array(M + 1)
        .fill(0)
        .map((_, j) => {
          const actual = actualF[i][j];
          // if (math.abs(actual) <= 0.00001) {
          return math.abs(actual - res[i][j]);
          // } else {
          //   return math.abs((actual - res[i][j]) / actual);
          // }
        })
    );

  ctx.postMessage({
    plot: { x, y, z: res, type: 'surface' },
    actualFunction: { x, y, z: actualF, type: 'surface' },
    difference: { x, y, z: diff, type: 'surface' },
  });
};

export default {} as typeof Worker & { new (): Worker };
