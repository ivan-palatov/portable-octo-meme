import * as math from 'mathjs';
import { makeMatrix } from './makeMatrix';

export function calcBothU(
  U0: math.Matrix[],
  Rho: math.Matrix[][],
  gamma1: number,
  gamma2: number,
  V: math.Matrix,
  K: math.Matrix,
  M: number,
  N: number,
  tau: number,
  h: number,
  F: math.Matrix[][] = makeMatrix(N + 1, M + 1, () => math.matrix([[0], [0]]))
): math.Matrix[][] {
  const U = [U0];

  // Заполняем остальные ряды по времени t
  for (let n = 1; n <= N; n++) {
    // Из левого граничного условия Дирихле
    const beta = [math.matrix([[0], [0]])];
    const alpha = [
      math.matrix([
        [0, 0],
        [0, 0],
      ]),
    ];

    // Вычисление коэф. альфа и бета (прямой ход прогонки)
    for (let m = 1; m < M; m++) {
      const G = math.matrix([
        [Rho[n - 1][m].get([0, 0]) * U[n - 1][m].get([0, 0]), 0],
        [0, Rho[n - 1][m].get([1, 1]) * U[n - 1][m].get([1, 0])],
      ]);
      // Вычисление прогоночных коэффициентов
      const A = math.add(
        math.multiply(1 / (2 * h), G),
        math.multiply(1 / h ** 2, V)
      ); // m - 1
      const B = math.add(
        math.multiply(1 / h ** 2, V),
        math.multiply(-1 / (2 * h), G)
      ); // m + 1
      const C = math.add(
        math.multiply(1 / tau, Rho[n - 1][m]),
        math.multiply(2 / h ** 2, V)
      ); // m
      // const Fn = math.add(
      //   math.add(
      //     math.multiply(math.multiply(1 / tau, Rho[n - 1][m]), U[n - 1][m]),
      //     math.multiply(K, U[n - 1][m])
      //   ),
      //   F[n - 1][m]
      // );
      const Fn = math
        .chain(1 / tau)
        .multiply(Rho[n - 1][m])
        .multiply(U[n - 1][m])
        .add(math.multiply(K, U[n - 1][m]))
        .add(F[n - 1][m])
        .subtract(
          math.matrix([
            [
              ((gamma1 * Rho[n - 1][m].get([0, 0]) ** (gamma1 - 1)) / h) *
                (Rho[n][m].get([0, 0]) - Rho[n][m - 1].get([0, 0])),
            ],
            [
              ((gamma2 * Rho[n - 1][m].get([1, 0]) ** (gamma2 - 1)) / h) *
                (Rho[n][m].get([1, 1]) - Rho[n][m - 1].get([1, 1])),
            ],
          ])
        )
        .done(); // n - 1

      const inverseW = math.inv(
        math.subtract(C, math.multiply(A, alpha[m - 1])) as math.Matrix
      );
      alpha.push(math.multiply(inverseW, B));
      beta.push(
        math.multiply(inverseW, math.add(math.multiply(A, beta[m - 1]), Fn))
      );
    }

    // Обратный ход, вычисление U
    const Un = [...Array(Math.round(M + 1))];
    // Из правого граничного условия Дирихле
    Un[Un.length - 1] = math.matrix([[0], [0]]);

    for (let i = M - 1; i >= 0; i--) {
      Un[i] = math.add(
        beta[i],
        math.multiply(alpha[i], Un[i + 1])
      ) as math.Matrix;
    }
    // Добавление временного слоя к массиву всех временных слоев ро
    U.push(Un);
  }

  return U;
}
