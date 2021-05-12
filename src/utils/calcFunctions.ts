import * as math from 'mathjs';
import { makeMatrix } from './makeMatrix';

export function calcF(rho: string, u: string) {
  const _rho = math.parse(rho);
  const _u = math.parse(u);

  const dtRho = math.derivative(_rho, 't');
  const dxRho = math.derivative(_rho, 'x');
  const d2xRho = math.derivative(dxRho, 'x');

  const dxU = math.derivative(_u, 'x');

  return math.simplify(
    math.parse(
      `${dtRho.toString()} + (${dxRho.toString()})*(${u}) + (${dxU.toString()})*(${rho}) - epsilon * (${d2xRho.toString()})`
    )
  );
}

export function calcG(rho: string, u: string, otherU: string) {
  const _rho = math.parse(rho);
  const _u = math.parse(u);
  const _otherU = math.parse(otherU);

  const dxRho = math.derivative(_rho, 'x');

  const dtU = math.derivative(_u, 't');
  const dxU = math.derivative(_u, 'x');
  const d2xU = math.derivative(dxU, 'x');

  const d2xOtherU = math.derivative(math.derivative(_otherU, 'x'), 'x');

  return math.simplify(
    math.parse(
      `(${rho})*(${dtU.toString()}) + (${rho})*(${u})*(${dxU.toString()}) + gamma * (${rho})^(gamma - 1) * (${dxRho.toString()}) - v1 * (${d2xU.toString()}) - v2 * (${d2xOtherU.toString()}) + a * (${u} - ${otherU})`
    )
  );
}

export function calcFMatrix(
  rho: string,
  u: string,
  epsilon: number,
  N: number,
  M: number,
  tau: number,
  h: number
): number[][] {
  const f = calcF(rho, u);

  return makeMatrix(N + 1, M + 1, (i, j) =>
    f.evaluate({ epsilon, x: h * j, t: tau * i })
  );
}

export function calcGMatrix({
  N,
  M,
  tau,
  h,
  a,
  V,
  ...params
}: {
  rho1: string;
  rho2: string;
  u1: string;
  u2: string;
  gamma1: number;
  gamma2: number;
  V: math.Matrix;
  a: number;
  N: number;
  M: number;
  tau: number;
  h: number;
}): math.Matrix[][] {
  const g1 = calcG(params.rho1, params.u1, params.u2);
  const g2 = calcG(params.rho2, params.u2, params.u1);

  return makeMatrix(N + 1, M + 1, (i, j) =>
    math.matrix([
      [
        g1.evaluate({
          a,
          v1: V.get([0, 0]),
          v2: V.get([0, 1]),
          gamma: params.gamma1,
          x: h * j,
          t: tau * i,
        }),
      ],
      [
        g2.evaluate({
          a,
          v1: V.get([1, 1]),
          v2: V.get([1, 0]),
          gamma: params.gamma2,
          x: h * j,
          t: tau * i,
        }),
      ],
    ])
  );
}
