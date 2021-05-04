import * as math from 'mathjs';
import { calcMain } from '../utils/mainCalcs';

const ctx: Worker = self as any;

ctx.onmessage = (e) => {
  const { M, N, T, a, v11, v12, v21, v22, epsilon, epsilon0, ...data } = e.data;

  const h = 1 / M;
  const tau = T / N;

  const x = Array(M + 1)
    .fill(0)
    .map((_, i) => i * h);
  const t = Array(N + 1)
    .fill(0)
    .map((_, i) => i * tau);

  const rho10 = Array(M + 1)
    .fill(0)
    .map((_, j) => math.evaluate(data.rho10, { x: x[j] }));
  const rho20 = Array(M + 1)
    .fill(0)
    .map((_, j) => math.evaluate(data.rho20, { x: x[j] }));

  const u10 = Array(N + 1)
    .fill(0)
    .map((_, i) =>
      Array(M + 1)
        .fill(0)
        .map((_, j) => math.evaluate(data.u10, { x: x[j] }))
    );
  const u20 = Array(N + 1)
    .fill(0)
    .map((_, i) =>
      Array(M + 1)
        .fill(0)
        .map((_, j) => math.evaluate(data.u20, { x: x[j] }))
    );

  const results = calcMain({
    M,
    N,
    a,
    v11,
    v12,
    v21,
    v22,
    epsilon,
    epsilon0,
    tau,
    h,
    u10,
    u20,
    rho10,
    rho20,
  });

  ctx.postMessage({
    u1: { x, y: t, z: results.u1, type: 'surface' },
    u2: { x, y: t, z: results.u2, type: 'surface' },
    rho1: { x, y: t, z: results.rho1, type: 'surface' },
    rho2: { x, y: t, z: results.rho2, type: 'surface' },
    iterations: results.i,
  });
};

export default {} as typeof Worker & { new (): Worker };
