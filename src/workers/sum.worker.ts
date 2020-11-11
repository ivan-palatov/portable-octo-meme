import * as math from 'mathjs';

const ctx: Worker = self as any;

function progonka(
  ksi: math.MathNode,
  mu1: math.MathNode,
  mu2: math.MathNode,
  f: math.MathNode,
  N: number,
  M: number,
  X: number,
  T: number
) {
  const tau = T / N;
  const h = X / M;
  const omega = tau / h ** 2;

  // Заполняем первый ряд по t из нач. усл.
  const rho = [
    Array(M + 1)
      .fill(0)
      .map((_, i) => ksi.evaluate({ x: i * h })),
  ] as number[][];

  // Заполняем остальные ряды по времени t
  for (let n = 1; n <= Math.round(N); n++) {
    const t = tau * n;
    const alpha = [0];
    const beta = [mu1.evaluate({ t })];
    // Вычисление коэф. альфа и бета
    for (let m = 1; m < M; m++) {
      alpha.push(omega / (1 + 2 * omega - omega * alpha[m - 1]));
      beta.push(
        (omega * beta[m - 1] +
          tau * f.evaluate({ t: tau * (n - 1), x: h * m }) +
          rho[n - 1][m]) /
          (1 + 2 * omega - omega * alpha[m - 1])
      );
    }

    // Обратный ход, вычисление ро
    const rhon = [...Array(Math.round(M + 1))];
    rhon[rhon.length - 1] = mu2.evaluate({ t });
    rhon[0] = mu1.evaluate({ t });

    for (let i = M - 1; i > 0; i--) {
      rhon[i] = rhon[i + 1] * alpha[i] + beta[i];
    }

    rho.push(rhon);
  }

  return rho;
}

ctx.onmessage = (e) => {
  const { ksi, mu1, mu2, N, M, X, T, rho, f } = e.data;
  const res = progonka(
    math.parse(ksi),
    math.parse(mu1),
    math.parse(mu2),
    math.parse(f),
    N,
    M,
    X,
    T
  );

  const x = Array(M + 1)
    .fill(0)
    .map((_, i) => i * (X / M));
  const y = Array(N + 1)
    .fill(0)
    .map((_, i) => i * (T / N));

  if (!rho || rho === '' || rho === '0') {
    ctx.postMessage({
      plot: { x, y, z: res, type: 'surface' },
    });
    return;
  }

  const actualF = Array(N + 1)
    .fill(0)
    .map((_, i) =>
      Array(M + 1)
        .fill(0)
        .map((_, j) => math.evaluate(rho, { x: j * (X / M), t: i * (T / N) }))
    );

  const diff = Array(N + 1)
    .fill(0)
    .map((_, i) =>
      Array(M + 1)
        .fill(0)
        .map((_, j) =>
          math.abs(
            math.evaluate(rho, { x: j * (X / M), t: i * (T / N) }) - res[i][j]
          )
        )
    );

  ctx.postMessage({
    plot: { x, y, z: res, type: 'surface' },
    actualFunction: { x, y, z: actualF, type: 'surface' },
    difference: { x, y, z: diff, type: 'surface' },
  });
};

export default {} as typeof Worker & { new (): Worker };
