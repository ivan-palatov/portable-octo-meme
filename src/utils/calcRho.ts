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
  const tau = T / N / epsilon;

  // Заполняем первый ряд по t из нач. усл.
  const rho = [
    Array(M + 1)
      .fill(0)
      .map((_, i) => rho0.evaluate({ x: i * h })),
  ] as number[][];

  // Заполняем остальные ряды по времени t
  for (let n = 1; n <= N; n++) {
    // Из первого граничного условия Неймана
    const alpha = [1];
    const beta = [0];
    // Вычисление коэф. альфа и бета
    for (let m = 1; m <= M; m++) {
      // Вычисление коэфициентов A, B, C, F по формулам
      const A = -u[n - 1][m] / h - 1 / Math.pow(h, 2);
      const B = -1 / Math.pow(h, 2);
      const C = -1 / tau - u[n - 1][m] / h - (2 * 1) / Math.pow(h, 2);
      const F =
        -rho[n - 1][m] / tau +
        (rho[n - 1][m] * (u[n][m] - u[n][m - 1])) / h -
        f?.evaluate({ t: tau * (n - 1), x: h * m }) / epsilon;

      // Вычисление коэф. альфа и бета и добавление их в массивы альф и бет
      alpha.push(B / (C - A * alpha[m - 1]));
      beta.push((F + beta[m - 1] * A) / (C - A * alpha[m - 1]));
    }

    // Обратный ход, вычисление ро
    const rhon = [...Array(Math.round(M + 1))];
    // Из второго граничного условия Неймана
    rhon[rhon.length - 1] =
      beta[beta.length - 1] / (1 - alpha[alpha.length - 1]);

    for (let i = M - 1; i >= 0; i--) {
      rhon[i] = rhon[i + 1] * alpha[i] + beta[i];
    }
    // Добавление временного слоя к массиву всех временных слоев ро
    rho.push(rhon);
  }

  return rho;
}
