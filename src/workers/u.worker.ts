import * as math from 'mathjs';
import { calcU } from '../utils/calcU';

const ctx: Worker = self as any;

ctx.onmessage = (e) => {
  const { u0, rho: rhoFunc, f, V, N, M, T, u } = e.data;

  const rho = Array(N + 1)
    .fill(0)
    .map((_, i) =>
      Array(M + 1)
        .fill(0)
        .map((_, j) =>
          math.evaluate(rhoFunc, {
            t: i * (T / N),
            x: j / M,
          })
        )
    );

  const res = calcU({
    u0: math.parse(u0),
    f: math.parse(f),
    V: math.evaluate(V),
    M,
    N,
    T,
    rho,
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
        .map((_, j) => math.evaluate(u, { x: j * (1 / M), t: i * (T / N) }))
    );

  const diff = Array(N + 1)
    .fill(0)
    .map((_, i) =>
      Array(M + 1)
        .fill(0)
        .map((_, j) => {
          const actual = actualF[i][j];
          // if (actual === 0) {
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
