import * as math from 'mathjs';

interface IData {
  T: number;
  M: number;
  N: number;
  u0: math.EvalFunction;
  rho: number[][];
  V: number;
  f?: math.EvalFunction;
}

export function calcU({ T, M, N, rho, u0, V, f }: IData) {
  const h = 1 / M;
  const tau = T / N;

  // Заполняем первый ряд по t из нач. усл.
  const u = [
    Array(M + 1)
      .fill(0)
      .map((_, i) => u0.evaluate({ x: i * h })),
  ] as number[][];

  // Заполняем остальные ряды по времени t
  for (let n = 1; n <= N; n++) {
    // Из первого граничного условия Неймана
    const alpha = [0];
    const beta = [0];
    // Вычисление коэф. альфа и бета
    for (let m = 1; m < M; m++) {
      // Вычисление коэфициентов A, B, C, F по формулам
      const A = (rho[n - 1][m] * u[n - 1][m]) / h + V / h ** 2;
      const B = V / h ** 2;
      const C =
        rho[n - 1][m] / tau +
        (rho[n - 1][m] * u[n - 1][m]) / h +
        (2 * V) / h ** 2;
      const F =
        (rho[n - 1][m] * u[n - 1][m]) / tau +
        f?.evaluate({ t: tau * (n - 1), x: h * m });
      // const A = (rho[n - 1][m] * u[n - 1][m]) / (2 * h) + V / h ** 2;
      // const B = (-rho[n - 1][m] * u[n - 1][m]) / (2 * h) + V / h ** 2;
      // const C = rho[n - 1][m] / tau + (2 * V) / h ** 2;
      // const F =
      //   (rho[n - 1][m] * u[n - 1][m]) / tau +
      //   f?.evaluate({ t: tau * (n - 1), x: h * m });

      // Вычисление коэф. альфа и бета и добавление их в массивы альф и бет
      alpha.push(B / (C - A * alpha[m - 1]));
      beta.push((F + beta[m - 1] * A) / (C - A * alpha[m - 1]));
    }

    // Обратный ход, вычисление ро
    const un = [...Array(Math.round(M + 1))];
    // Из второго граничного условия Неймана
    un[un.length - 1] = 0;

    for (let i = M - 1; i >= 0; i--) {
      un[i] = un[i + 1] * alpha[i] + beta[i];
    }
    // Добавление временного слоя к массиву всех временных слоев ро
    u.push(un);
  }

  return u;
}
