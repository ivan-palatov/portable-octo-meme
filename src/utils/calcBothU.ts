import * as math from 'mathjs';

export function calcBothU(
  U0: math.Matrix[][],
  Rho: math.Matrix[][],
  V: math.Matrix,
  K: math.Matrix,
  M: number,
  N: number,
  tau: number,
  h: number,
  F: math.Matrix[][] = Array(N + 1)
    .fill(0)
    .map((_, i) =>
      Array(M + 1)
        .fill(0)
        .map((_, j) => math.matrix([[0], [0]]))
    )
): math.Matrix[][] {
  const U = [...U0];

  // Заполняем остальные ряды по времени t
  for (let n = 1; n <= N; n++) {
    // Из левого граничного условия Дирихле
    const g = [math.matrix([[0], [0]])];
    const q = [
      math.matrix([
        [0, 0],
        [0, 0],
      ]),
    ];

    let inverseW: math.Matrix;

    // Вычисление коэф. альфа и бета
    for (let m = 1; m < M; m++) {
      const G = math.matrix([
        [Rho[n - 1][m].get([0, 0]) * U[n - 1][m].get([0, 0]), 0],
        [0, Rho[n - 1][m].get([1, 0]) * U[n - 1][m].get([1, 0])],
      ]);

      // Вычисляем прогоночные коэффициенты
      const d = math.subtract(
        math.subtract(
          math.multiply(math.multiply(-1 / tau, Rho[n - 1][m]), U[n - 1][m]),
          math.multiply(K, U[n - 1][m])
        ),
        F[n - 1][m]
      ) as math.Matrix;

      const b = math.subtract(
        math.multiply(-1 / h, G),
        math.multiply(1 / h ** 2, V)
      ) as math.Matrix;

      const a = math.add(
        math.add(
          math.multiply(1 / tau, Rho[n - 1][m]),
          math.multiply(1 / h, G)
        ),
        math.multiply(2 / h ** 2, V)
      ) as math.Matrix;

      const c = math.multiply(-1 / h ** 2, V) as math.Matrix;

      // Вычисление коэффициентов q и g
      inverseW = math.inv(
        math.subtract(a, math.multiply(c, q[m - 1])) as math.Matrix
      );
      q.push(math.multiply(inverseW, b));
      g.push(
        math.multiply(inverseW, math.subtract(d, math.multiply(c, g[m - 1])))
      );
    }

    // Обратный ход, вычисление U
    // Из правого граничного условия Дирихле
    const Un = [...Array(Math.round(M + 1))];
    Un[Un.length - 1] = g[g.length - 1]; // либо math.matrix([[0], [0]]) ?

    for (let i = M - 1; i >= 0; i--) {
      Un[i] = math.subtract(
        g[i],
        math.multiply(q[i], U[n][i + 1])
      ) as math.Matrix;
    }
    // Добавление временного слоя к массиву всех временных слоев ро
    U.push(Un);
  }

  return U;
}
