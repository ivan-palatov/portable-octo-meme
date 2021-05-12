export function calcRho(
  rho0: number[],
  u: number[][],
  M: number,
  N: number,
  epsilon: number,
  tau: number,
  h: number,
  f?: number[][]
): number[][] {
  // Заполняем первый ряд по t из нач. усл.
  const rho = [rho0];

  // Заполняем остальные ряды по времени t
  for (let n = 1; n <= N; n++) {
    // Из первого граничного условия Неймана
    const alpha = [1];
    const beta = [0];
    // Вычисление коэф. альфа и бета
    for (let m = 1; m < M; m++) {
      // Вычисление коэфициентов A, B, C, F по формулам
      const A = u[n][m - 1] / h + epsilon / Math.pow(h, 2);
      const B = epsilon / Math.pow(h, 2);
      const C = 1 / tau + u[n][m] / h + (2 * epsilon) / Math.pow(h, 2);
      const F = +rho[n - 1][m] / tau + (f ? f[n - 1][m] : 0);

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
