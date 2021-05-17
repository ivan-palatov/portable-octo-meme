import * as math from 'mathjs';
import { makeMatrix } from './makeMatrix';

export function calcResult(
  X0: math.Matrix[],
  gamma1: number,
  gamma2: number,
  v11: number,
  v12: number,
  v21: number,
  v22: number,
  a: number,
  epsilon: number,
  delta: number,
  beta1: number,
  beta2: number,
  M: number,
  N: number,
  tau: number,
  h: number,
  Phi: math.Matrix[][] = makeMatrix(N + 1, M + 1, () =>
    math.matrix([[0], [0], [0], [0]])
  )
): math.Matrix[][] {
  // Заполняем первый ряд по времени из начальных условий
  const X = [X0];

  // Вычисляем вспомогательные матрицы
  const C = math.matrix([
    [epsilon, 0, 0, 0],
    [0, epsilon, 0, 0],
    [0, 0, v11, v12],
    [0, 0, v21, v22],
  ]);

  const F = math.matrix([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, -a, a],
    [0, 0, a, -a],
  ]);

  // Заполняем остальные ряды по времени t
  for (let n = 1; n <= N; n++) {
    // Из левых граничных условий
    const beta = [math.matrix([[0], [0], [0], [0]])];
    const alpha = [
      math.matrix([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
    ];

    // Вычисление коэф. альфа и бета (прямой ход прогонки)
    for (let m = 1; m < M; m++) {
      // Вычисление вспомогательных матриц
      const rho1 = X[n - 1][m].get([0, 0]);
      const rho2 = X[n - 1][m].get([1, 0]);
      const u1 = X[n - 1][m].get([2, 0]);
      const u2 = X[n - 1][m].get([3, 0]);

      const A = math.matrix([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [u1, 0, rho1, 0],
        [0, u2, 0, rho2],
      ]);

      const B = math.matrix([
        [u1, 0, rho1, 0],
        [0, u2, 0, rho2],
        [
          u1 ** 2 +
            gamma1 * rho1 ** (gamma1 - 1) +
            delta * beta1 * rho1 ** (beta1 - 1),
          0,
          2 * u1 * rho1 +
            (epsilon *
              (X[n - 1][m + 1].get([0, 0]) - X[n - 1][m - 1].get([0, 0]))) /
              (2 * h),
          0,
        ],
        [
          0,
          u2 ** 2 +
            gamma2 * rho2 ** (gamma2 - 1) +
            delta * beta2 * rho2 ** (beta2 - 1),
          0,
          2 * u2 * rho2 +
            (epsilon *
              (X[n - 1][m + 1].get([1, 0]) - X[n - 1][m - 1].get([1, 0]))) /
              (2 * h),
        ],
      ]);

      // Вычисление прогоночных коэффициентов
      const An = math.add(
        math.multiply(1 / (2 * h), B),
        math.multiply(1 / h ** 2, C)
      );

      const Bn = math.add(
        math.multiply(-1 / (2 * h), B),
        math.multiply(1 / h ** 2, C)
      );

      const Cn = math.add(
        math.multiply(1 / tau, A),
        math.multiply(2 / h ** 2, C)
      );

      const Fn = math.add(
        math.multiply(math.multiply(1 / tau, A), X[n - 1][m]),
        math.add(math.multiply(F, X[n - 1][m]), Phi[n - 1][m])
      );

      const inverseW = math.inv(
        math.subtract(Cn, math.multiply(An, alpha[m - 1])) as math.Matrix
      );
      alpha.push(math.multiply(inverseW, Bn));
      beta.push(
        math.multiply(inverseW, math.add(math.multiply(An, beta[m - 1]), Fn))
      );
    }

    // Обратный ход, вычисление X
    const Xn = [...Array(Math.round(M + 1))];
    // Из правых граничных условий
    Xn[Xn.length - 1] = math.multiply(
      math.inv(
        math.subtract(
          math.matrix([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
          ]),
          alpha[alpha.length - 2]
        ) as math.Matrix
      ),
      beta[beta.length - 2]
    ) as math.Matrix; // в последних 2-х должны быть нули
    Xn[Xn.length - 1].set([2, 0], 0);
    Xn[Xn.length - 1].set([3, 0], 0);

    for (let i = M - 1; i >= 0; i--) {
      Xn[i] = math.add(
        beta[i],
        math.multiply(alpha[i], Xn[i + 1])
      ) as math.Matrix;
    }
    // Добавление временного слоя к массиву всех временных слоев
    X.push(Xn);
  }

  return X;
}
