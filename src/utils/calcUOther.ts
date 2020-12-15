import * as math from 'mathjs';

interface IData {
  T: number;
  N: number;
  M: number;
  rho: number[][];
  u0: math.EvalFunction;
  otherU: number[][];
  delta: number;
  epsilon: number;
  beta: number;
  gamma: number;
  nu1: number;
  nu2: number;
  a: number;
}

export function calcU({
  T,
  N,
  M,
  rho,
  u0,
  otherU,
  delta,
  epsilon,
  beta,
  gamma,
  nu1,
  nu2,
  a,
}: IData) {
  const h = 1 / M;
  const tau = T / N;

  // Заполняем первый ряд по t из нач. усл.
  const u = [
    Array(M + 1)
      .fill(0)
      .map((_, i) => u0.evaluate({ x: i * h })),
  ] as number[][];

  // Заполняем остальные ряды по времени t
  for (let n = 1; n <= Math.round(N); n++) {
    const alpha = [0];
    const zeta = [0];
    // Вычисление коэф. альфа и бета
    for (let m = 1; m < M; m++) {
      const denominator =
        h * h * rho[n - 1][m] -
        2 * tau * h * u[n - 1][m] * rho[n - 1][m] -
        epsilon * tau * (rho[n][m + 1] - rho[n][m]) +
        2 * tau * nu1 -
        tau * nu1 * alpha[m - 1];

      alpha.push(
        (tau *
          (-2 * h * u[n - 1][m] * rho[n - 1][m] -
            epsilon * (rho[n][m + 1] - rho[n][m]) +
            nu1)) /
          denominator
      );

      zeta.push(
        (-u[n - 1][m] * h * h * (rho[n][m] - rho[n - 1][m]) +
          h * h * rho[n - 1][m] * u[n - 1][m] -
          Math.pow(u[n - 1][m], 2) * tau * h * (rho[n][m + 1] - rho[n][m]) +
          nu1 * zeta[m - 1] * tau +
          tau * nu2 * (otherU[n][m + 1] - 2 * otherU[n][m] + otherU[n][m - 1]) +
          a * h * h * tau * (otherU[n - 1][m] - u[n - 1][m])) /
          // TODO: добавить производные по x от ро в степени
          denominator
      );
    }

    // Обратный ход, вычисление ро
    const un = [...Array(Math.round(M + 1))];
    un[un.length - 1] = 0;
    un[0] = 0;

    for (let i = M - 1; i > 0; i--) {
      un[i] = un[i + 1] * alpha[i] + zeta[i];
    }

    u.push(un);
  }

  return u;
}
