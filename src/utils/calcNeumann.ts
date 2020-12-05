export function calcNeumann(
  rho0: math.EvalFunction,
  epsilon: number,
  N: number,
  M: number,
  T: number
) {
  const tau = T / N / epsilon;
  const h = 1 / M;
  const A = 1 / Math.pow(h, 2);
  const C = 1 / tau + (2 * 1) / Math.pow(h, 2);

  // Заполняем первый ряд по t из нач. усл.
  const rho = [
    Array(M + 1)
      .fill(0)
      .map((_, i) => rho0.evaluate({ x: i * h })),
  ] as number[][];

  // Заполняем остальные ряды по времени t
  for (let n = 1; n <= N; n++) {
    const alpha = [1];
    const beta = [0];
    // Вычисление коэф. альфа и бета
    for (let m = 1; m < M; m++) {
      const F = rho[n - 1][m] / tau;

      alpha.push(A / (C - A * alpha[m - 1]));
      beta.push((F + beta[m - 1] * A) / (C - A * alpha[m - 1]));
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
