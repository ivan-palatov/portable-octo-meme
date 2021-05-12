import * as math from 'mathjs';
import { FormTypes } from '../components/result/ResultForm';
import { calcAbsoluteDeviation } from '../utils/calcAbsoluteDeviation';
import { calcFMatrix, calcGMatrix } from '../utils/calcFunctions';
import { calcMain } from '../utils/calcMain';
import { getValueMatrix } from '../utils/getValueMatrix';
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
    gamma1,
    gamma2,
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

  if (data.rho1 && data.rho2 && data.u1 && data.u2) {
    const f1 = calcFMatrix(data.rho1, data.u1, epsilon, N, M, tau, h);
    const f2 = calcFMatrix(data.rho2, data.u2, epsilon, N, M, tau, h);

    const G = calcGMatrix({
      a,
      V,
      N,
      M,
      tau,
      h,
      gamma1,
      gamma2,
      rho1: data.rho1,
      rho2: data.rho2,
      u1: data.u1,
      u2: data.u2,
    });

    const results = calcMain({
      M,
      N,
      K,
      V,
      gamma1,
      gamma2,
      epsilon,
      epsilon0,
      tau,
      h,
      u10,
      u20,
      rho10,
      rho20,
      f1,
      f2,
      G,
    });

    const rho1 = getValueMatrix(data.rho1, N, M, tau, h);
    const rho2 = getValueMatrix(data.rho2, N, M, tau, h);
    const u1 = getValueMatrix(data.u1, N, M, tau, h);
    const u2 = getValueMatrix(data.u2, N, M, tau, h);

    const diffRho1 = calcAbsoluteDeviation(rho1, results.rho1);
    const diffRho2 = calcAbsoluteDeviation(rho2, results.rho2);
    const diffU1 = calcAbsoluteDeviation(u1, results.u1);
    const diffU2 = calcAbsoluteDeviation(u2, results.u2);

    ctx.postMessage({
      u1: { x, y: t, z: results.u1, type: 'surface' },
      u1Real: { x, y: t, z: u1, type: 'surface' },
      u1Diff: { x, y: t, z: diffU1, type: 'surface' },
      u2: { x, y: t, z: results.u2, type: 'surface' },
      u2Real: { x, y: t, z: u2, type: 'surface' },
      u2Diff: { x, y: t, z: diffU2, type: 'surface' },
      rho1: { x, y: t, z: results.rho1, type: 'surface' },
      rho1Real: { x, y: t, z: rho1, type: 'surface' },
      rho1Diff: { x, y: t, z: diffRho1, type: 'surface' },
      rho2: { x, y: t, z: results.rho2, type: 'surface' },
      rho2Real: { x, y: t, z: rho2, type: 'surface' },
      rho2Diff: { x, y: t, z: diffRho2, type: 'surface' },
      iterations: results.i,
    });

    return;
  }

  const results = calcMain({
    M,
    N,
    K,
    V,
    gamma1,
    gamma2,
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
