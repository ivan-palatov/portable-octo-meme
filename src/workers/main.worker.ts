import * as math from 'mathjs';
import { FormTypes } from '../components/result/ResultForm';
import { calcMain } from '../utils/calcMain';
import { makeArray } from '../utils/makeArray';
import { makeMatrix } from '../utils/makeMatrix';

const ctx: Worker = self as any;

ctx.onmessage = (e) => {
  const {
    M,
    N,
    T,
    a,
    v11,
    v12,
    v21,
    v22,
    epsilon,
    epsilon0,
    ...data
  } = e.data as FormTypes;
  console.log('Starting main worker');

  const h = 1 / M;
  const tau = T / N;

  const x = makeArray(M + 1, (i) => i * h);
  const t = makeArray(N + 1, (i) => i * tau);

  const rho10 = makeArray(M + 1, (i) => math.evaluate(data.rho10, { x: x[i] }));
  const rho20 = makeArray(M + 1, (i) => math.evaluate(data.rho20, { x: x[i] }));

  const u10 = makeMatrix(N + 1, M + 1, (i, j) =>
    math.evaluate(data.u10, { x: x[j] })
  );
  const u20 = makeMatrix(N + 1, M + 1, (i, j) =>
    math.evaluate(data.u20, { x: x[j] })
  );

  const V = math.matrix([
    [v11, v12],
    [v21, v22],
  ]);

  const K = math.matrix([
    [-a, a],
    [a, -a],
  ]);

  const results = calcMain({
    M,
    N,
    K,
    V,
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
