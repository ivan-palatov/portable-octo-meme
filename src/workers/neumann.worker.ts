import * as math from 'mathjs';
import { calcNeumann } from '../utils/calcNeumann';

const ctx: Worker = self as any;

ctx.onmessage = (e) => {
  const { rho0, N, M, T, rho, epsilon } = e.data;
  const res = calcNeumann(math.parse(rho0), math.evaluate(epsilon), N, M, T);

  const x = Array(M + 1)
    .fill(0)
    .map((_, i) => i * (1 / M));
  const y = Array(N + 1)
    .fill(0)
    .map((_, i) => i * (T / N));

  if (!rho || rho === '' || rho === '0') {
    ctx.postMessage({
      plot: { x, y, z: res, type: 'surface' },
    });
    return;
  }

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
        .map((_, j) =>
          math.abs(
            math.evaluate(rho, { x: j * (1 / M), t: i * (T / N) }) - res[i][j]
          )
        )
    );

  ctx.postMessage({
    plot: { x, y, z: res, type: 'surface' },
    actualFunction: { x, y, z: actualF, type: 'surface' },
    difference: { x, y, z: diff, type: 'surface' },
  });
};

export default {} as typeof Worker & { new (): Worker };
