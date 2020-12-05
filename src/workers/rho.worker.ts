import * as math from 'mathjs';
import { calcRho } from '../utils/calcRho';

const ctx: Worker = self as any;

ctx.onmessage = (e) => {
  const M = 50,
    N = 30,
    T = 1;

  const u = Array(N + 1)
    .fill(0)
    .map((_, i) =>
      Array(M + 1)
        .fill(0)
        .map((_, j) => math.evaluate('sin(2*pi*x)', { x: j * (1 / M) }))
    );

  const rho = 'e^(-t)*cos(x*pi)';
  const res = calcRho({
    rho0: math.parse('cos(pi*x)'),
    f: math.parse('pi*e^(-t)*(-sin(pi*x)*sin(2*pi*x)+2*cos(pi*x)*cos(2*pi*x))'),
    epsilon: Math.pow(Math.PI, 2),
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
