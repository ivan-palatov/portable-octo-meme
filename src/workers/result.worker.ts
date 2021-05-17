import * as math from 'mathjs';
import { FormTypes } from '../components/result/ResultForm';
import { calcAbsoluteDeviation } from '../utils/calcAbsoluteDeviation';
import { calcFGMatrix } from '../utils/calcFunctions';
import { calcResult } from '../utils/calcResult';
import { getValueMatrix } from '../utils/getValueMatrix';
import { makeArray } from '../utils/makeArray';

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
  console.log('Starting result worker');

  const h = 1 / M;
  const tau = T / N;

  const x = makeArray(M + 1, (i) => i * h);
  const t = makeArray(N + 1, (i) => i * tau);

  const X0 = makeArray(M + 1, (i) =>
    math.matrix([
      [math.evaluate(data.rho10, { x: x[i] })],
      [math.evaluate(data.rho20, { x: x[i] })],
      [math.evaluate(data.u10, { x: x[i] })],
      [math.evaluate(data.u20, { x: x[i] })],
    ])
  );

  // if (data.rho1 && data.rho2 && data.u1 && data.u2) {
  const Phi = calcFGMatrix({
    a,
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
    V: math.matrix([
      [v11, v12],
      [v21, v22],
    ]),
    epsilon,
    beta1: data.beta1,
    beta2: data.beta2,
    delta: data.delta,
  });

  console.log('Calculated Phi');

  const result = calcResult(
    X0,
    gamma1,
    gamma2,
    v11,
    v12,
    v21,
    v22,
    a,
    epsilon,
    data.delta,
    data.beta1,
    data.beta2,
    M,
    N,
    tau,
    h,
    Phi
  );

  // TODO: matrixToObject function
  const results = {
    rho1: [] as number[][],
    rho2: [] as number[][],
    u1: [] as number[][],
    u2: [] as number[][],
  };

  result.forEach((arr, i) => {
    results.rho1.push([]);
    results.rho2.push([]);
    results.u1.push([]);
    results.u2.push([]);
    arr.forEach((matrix, j) => {
      results.rho1[i].push(matrix.get([0, 0]));
      results.rho2[i].push(matrix.get([1, 0]));
      results.u1[i].push(matrix.get([2, 0]));
      results.u2[i].push(matrix.get([3, 0]));
    });
  });
  // TODO: end matrixToObject function

  const rho1 = getValueMatrix(data.rho1, N, M, tau, h);
  const rho2 = getValueMatrix(data.rho2, N, M, tau, h);
  const u1 = getValueMatrix(data.u1, N, M, tau, h);
  const u2 = getValueMatrix(data.u2, N, M, tau, h);

  const diffRho1 = calcAbsoluteDeviation(rho1, results.rho1);
  const diffRho2 = calcAbsoluteDeviation(rho2, results.rho2);
  const diffU1 = calcAbsoluteDeviation(u1, results.u1);
  const diffU2 = calcAbsoluteDeviation(u2, results.u2);

  console.log({ diffRho1, diffRho2, diffU1, diffU2 });

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
    iterations: 1,
  });

  // return;
  // }

  // const results = calcMain({
  //   M,
  //   N,
  //   K,
  //   V,
  //   gamma1,
  //   gamma2,
  //   epsilon,
  //   epsilon0,
  //   tau,
  //   h,
  //   u10,
  //   u20,
  //   rho10,
  //   rho20,
  // });

  // ctx.postMessage({
  //   u1: { x, y: t, z: results.u1, type: 'surface' },
  //   u2: { x, y: t, z: results.u2, type: 'surface' },
  //   rho1: { x, y: t, z: results.rho1, type: 'surface' },
  //   rho2: { x, y: t, z: results.rho2, type: 'surface' },
  //   iterations: results.i,
  // });
};

export default {} as typeof Worker & { new (): Worker };
