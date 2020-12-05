import * as math from 'mathjs';

interface IData {
  T: number;
  M: number;
  N: number;
  rho0: math.EvalFunction;
  u: number[][];
  epsilon: number;
  f?: math.EvalFunction;
}

export function calcRho({ T, M, N, rho0, u, epsilon, f }: IData) {
  const h = 1 / M;
  const tau = T / N;

  // Заполняем первый ряд по t из нач. усл.
  const rho = [
    Array(M + 1)
      .fill(0)
      .map((_, i) => rho0.evaluate({ x: i * h })),
  ] as number[][];

  // Заполняем остальные ряды по времени t
  for (let n = 1; n <= Math.round(N); n++) {
    const alpha = [1];
    const beta = [0];
    // Вычисление коэф. альфа и бета
    for (let m = 1; m < M; m++) {
      const denominator =
        h * h -
        u[n - 1][m] * tau * h +
        2 * epsilon * tau -
        epsilon * tau * alpha[m - 1];

      alpha.push((epsilon * tau - tau * h * u[n - 1][m]) / denominator);

      // Для проверки алгоритма
      if (f !== undefined) {
        beta.push(
          (f.evaluate({ t: tau * (n - 1), x: h * m }) +
            h * h * rho[n - 1][m] -
            tau * h * rho[n - 1][m] * (u[n][m + 1] - u[n][m]) +
            epsilon * tau * beta[m - 1]) /
            denominator
        );
      } else {
        beta.push(
          (h * h * rho[n - 1][m] -
            tau * h * rho[n - 1][m] * (u[n][m + 1] - u[n][m]) +
            epsilon * tau * beta[m - 1]) /
            denominator
        );
      }
    }

    // Обратный ход, вычисление ро
    const rhon = [...Array(Math.round(M + 1))];
    rhon[rhon.length - 1] =
      beta[beta.length - 1] / (1 - alpha[alpha.length - 1]);

    for (let i = M - 1; i >= 0; i--) {
      rhon[i] = rhon[i + 1] * alpha[i] + beta[i];
    }

    rho.push(rhon);
  }

  return rho;
}
