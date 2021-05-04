export function calcMainU(
  u0: number[],
  rho: number[][],
  otherU: number[][],
  a: number,
  v: number,
  vOther: number,
  M: number,
  N: number,
  tau: number,
  h: number,
  f?: number[][]
): number[][] {
  // Заполняем первый ряд по t из нач. усл.
  const u = [u0];

  // Заполняем остальные ряды по времени t
  for (let n = 1; n <= N; n++) {
    // Из левого граничного условия Дирихле
    const alpha = [0];
    const beta = [0];
    // Вычисление коэф. альфа и бета
    for (let m = 1; m < M; m++) {
      // Вычисление коэфициентов A, B, C, F по формулам
      const A = (rho[n - 1][m] * u[n - 1][m]) / h + v / h ** 2;
      const B = v / h ** 2;
      const C =
        rho[n - 1][m] / tau +
        (rho[n - 1][m] * u[n - 1][m]) / h +
        (2 * v) / h ** 2;
      const F =
        (rho[n - 1][m] * u[n - 1][m]) / tau +
        a * (otherU[n - 1][m] - u[n - 1][m]) +
        (f ? f[n - 1][m] : 0); // возможно нужна еще производная (по х) другой компоненты умн. на её коэф. v
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
    // Из правого граничного условия Дирихле
    un[un.length - 1] = 0;

    for (let i = M - 1; i >= 0; i--) {
      un[i] = un[i + 1] * alpha[i] + beta[i];
    }
    // Добавление временного слоя к массиву всех временных слоев ро
    u.push(un);
  }

  return u;
}
