import * as math from 'mathjs';
import { areMatricesClose } from './areMatricesClose';
import { calcBothU } from './calcBothU';
import { calcRho } from './calcRho';
import { makeArray } from './makeArray';
import { makeMatrix } from './makeMatrix';
import { matrixToObject } from './matrixToObject';

interface IData {
  u10: number[][];
  u20: number[][];
  rho10: number[];
  rho20: number[];
  V: math.Matrix;
  K: math.Matrix;
  epsilon: number;
  gamma1: number;
  gamma2: number;
  M: number;
  N: number;
  tau: number;
  h: number;
  epsilon0: number;
  f1?: number[][];
  f2?: number[][];
  G?: math.Matrix[][];
}

export function calcMain({ V, K, N, M, tau, h, ...params }: IData) {
  const U0 = makeArray(M + 1, (i) =>
    math.matrix([[params.u10[0][i]], [params.u20[0][i]]])
  );

  const previous = {
    u1: [] as number[][],
    u2: [] as number[][],
  };

  const current = {
    u1: params.u10,
    u2: params.u20,
    rho1: [] as number[][],
    rho2: [] as number[][],
  };

  let i = 0;
  do {
    previous.u1 = current.u1;
    previous.u2 = current.u2;

    // Calculating rho1 and rho2 for the last known approximations of u1 and u2
    current.rho1 = calcRho(
      params.rho10,
      previous.u1,
      M,
      N,
      params.epsilon,
      tau,
      h,
      params.f1
    );
    current.rho2 = calcRho(
      params.rho20,
      previous.u2,
      M,
      N,
      params.epsilon,
      tau,
      h,
      params.f2
    );

    const Rho = makeMatrix(N + 1, M + 1, (i, j) =>
      math.matrix([
        [current.rho1[j][i], 0],
        [0, current.rho2[j][i]],
      ])
    );
    const { u1, u2 } = matrixToObject(
      calcBothU(
        U0,
        Rho,
        params.gamma1,
        params.gamma2,
        V,
        K,
        M,
        N,
        tau,
        h,
        params.G
      )
    );
    current.u1 = u1;
    current.u2 = u2;

    i++;
  } while (
    !areMatricesClose(previous.u1, current.u1, params.epsilon0) &&
    !areMatricesClose(previous.u2, current.u2, params.epsilon0) &&
    i !== 10
  );

  return { ...current, i };
}
