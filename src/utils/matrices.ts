import * as math from 'mathjs';

export function calcC(
  epsilon: number,
  v11: number,
  v12: number,
  v21: number,
  v22: number
) {
  return math.matrix([
    [epsilon, 0, 0, 0],
    [0, epsilon, 0, 0],
    [0, 0, v11, v12],
    [0, 0, v21, v22],
  ]);
}

export function calcF(a: number) {
  return math.matrix([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, -a, a],
    [0, 0, a, -a],
  ]);
}

export function calcB(
  u1: any,
  rho1: any,
  u2: any,
  rho2: any,
  gamma1: number,
  delta: number,
  beta1: number,
  epsilon: number,
  X: math.Matrix[][],
  n: number,
  m: number,
  h: number,
  gamma2: number,
  beta2: number
) {
  return math.matrix([
    [u1, 0, rho1, 0],
    [0, u2, 0, rho2],
    [
      u1 ** 2 +
        gamma1 * rho1 ** (gamma1 - 1) +
        delta * beta1 * rho1 ** (beta1 - 1),
      0,
      2 * u1 * rho1 +
        (epsilon *
          (X[n - 1][m + 1].get([0, 0]) - X[n - 1][m - 1].get([0, 0]))) /
          (2 * h),
      0,
    ],
    [
      0,
      u2 ** 2 +
        gamma2 * rho2 ** (gamma2 - 1) +
        delta * beta2 * rho2 ** (beta2 - 1),
      0,
      2 * u2 * rho2 +
        (epsilon *
          (X[n - 1][m + 1].get([1, 0]) - X[n - 1][m - 1].get([1, 0]))) /
          (2 * h),
    ],
  ]);
}

export function calcA(u1: any, rho1: any, u2: any, rho2: any) {
  return math.matrix([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [u1, 0, rho1, 0],
    [0, u2, 0, rho2],
  ]);
}

export function calcFn(
  tau: number,
  A: math.Matrix,
  X: math.Matrix[][],
  n: number,
  m: number,
  Phi: math.Matrix[][]
  // F: math.Matrix
) {
  // return math.add(
  return math.add(
    math.multiply(math.multiply(1 / tau, A), X[n - 1][m]),
    Phi[n - 1][m]
  );
  // math.multiply(F, X[n - 1][m])
  // );
}

export function calcCn(
  tau: number,
  A: math.Matrix,
  h: number,
  C: math.Matrix,
  F: math.Matrix
) {
  return math.subtract(
    math.add(math.multiply(1 / tau, A), math.multiply(2 / h ** 2, C)),
    F
  );
}

export function calcBn(h: number, B: math.Matrix, C: math.Matrix) {
  return math.add(math.multiply(-1 / (2 * h), B), math.multiply(1 / h ** 2, C));
}

export function calcAn(h: number, B: math.Matrix, C: math.Matrix) {
  return math.add(math.multiply(1 / (2 * h), B), math.multiply(1 / h ** 2, C));
}

export function calcInverseW(
  Cn: math.MathType,
  An: math.MathType,
  alpha: math.Matrix[],
  m: number
) {
  return math.inv(
    math.subtract(Cn, math.multiply(An, alpha[m - 1])) as math.Matrix
  );
}
