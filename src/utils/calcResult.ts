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
    // const rho10 = X[n - 1][0].get([0, 0]);
    // const rho20 = X[n - 1][0].get([1, 0]);
    // const u10 = X[n - 1][0].get([2, 0]);
    // const u20 = X[n - 1][0].get([3, 0]);

    // const A = math.matrix([
    //   [1, 0, 0, 0],
    //   [0, 1, 0, 0],
    //   [u10, 0, rho10, 0],
    //   [0, u20, 0, rho20],
    // ]);

    // const B = math.matrix([
    //   [u10, 0, rho10, 0],
    //   [0, u20, 0, rho20],
    //   [
    //     u10 ** 2 +
    //       gamma1 * rho10 ** (gamma1 - 1) +
    //       delta * beta1 * rho10 ** (beta1 - 1),
    //     0,
    //     2 * u10 * rho10 + (epsilon * (X[n - 1][1].get([0, 0]) - rho10)) / h,
    //     0,
    //   ],
    //   [
    //     0,
    //     u20 ** 2 +
    //       gamma2 * rho20 ** (gamma2 - 1) +
    //       delta * beta2 * rho20 ** (beta2 - 1),
    //     0,
    //     2 * u20 * rho20 + (epsilon * (X[n - 1][1].get([1, 0]) - rho20)) / h,
    //   ],
    // ]);

    // const invW = math.inv(
    //   math.add(
    //     math.identity([4, 4]),
    //     math.multiply(math.multiply(h / 2, math.inv(C)), B)
    //   ) as math.Matrix
    // );

    // const WC = math.multiply(invW, math.inv(C));

    // const B0 = math.multiply(1 / h, invW);
    // const C0 = math.subtract(
    //   math.add(
    //     math.multiply(1 / h, invW),
    //     math.multiply(math.multiply(h / (2 * tau), WC), A)
    //   ),
    //   math.multiply(math.multiply(h / 2, WC), F)
    // );
    // const F0 = math
    //   .chain(h / (2 * tau))
    //   .multiply(WC)
    //   .multiply(A)
    //   .multiply(X[n - 1][0])
    //   .add(
    //     math
    //       .chain(h / 2)
    //       .multiply(WC)
    //       .multiply(Phi[n - 1][0])
    //       .done()
    //   )
    //   .subtract(
    //     math.matrix([
    //       [0],
    //       [0],
    //       [(X[n - 1][1].get([2, 0]) - u10) / h],
    //       [(X[n - 1][1].get([3, 0]) - u20) / h],
    //     ])
    //   )
    //   .done() as math.Matrix;

    // const beta = [math.multiply(math.inv(C0 as math.Matrix), F0)];
    // beta[0].set([2, 0], 0);
    // beta[0].set([3, 0], 0);

    // const alpha = [math.multiply(math.inv(C0 as math.Matrix), B0)];

    // alpha[0].set([2, 0], 0);
    // alpha[0].set([2, 1], 0);
    // alpha[0].set([2, 2], 0);
    // alpha[0].set([2, 3], 0);
    // alpha[0].set([3, 0], 0);
    // alpha[0].set([3, 1], 0);
    // alpha[0].set([3, 2], 0);
    // alpha[0].set([3, 3], 0);

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
      ); // m - 1

      const Bn = math.add(
        math.multiply(-1 / (2 * h), B),
        math.multiply(1 / h ** 2, C)
      ); // m + 1

      const Cn = math.add(
        math.multiply(1 / tau, A),
        math.multiply(2 / h ** 2, C)
      ); // m

      const Fn = math.add(
        math.add(
          math.multiply(math.multiply(1 / tau, A), X[n - 1][m]),
          Phi[n - 1][m]
        ),
        math.multiply(F, X[n - 1][m])
      ); // n - 1

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

    // const rho1M = X[n - 1][M].get([0, 0]);
    // const rho2M = X[n - 1][M].get([1, 0]);
    // const u1M = X[n - 1][M].get([2, 0]);
    // const u2M = X[n - 1][M].get([3, 0]);

    // const Ae = math.matrix([
    //   [1, 0, 0, 0],
    //   [0, 1, 0, 0],
    //   [u1M, 0, rho1M, 0],
    //   [0, u2M, 0, rho2M],
    // ]);

    // const Be = math.matrix([
    //   [u1M, 0, rho1M, 0],
    //   [0, u2M, 0, rho2M],
    //   [
    //     u1M ** 2 +
    //       gamma1 * rho1M ** (gamma1 - 1) +
    //       delta * beta1 * rho1M ** (beta1 - 1),
    //     0,
    //     2 * u1M * rho1M + (epsilon * (rho1M - X[n - 1][M - 1].get([0, 0]))) / h,
    //     0,
    //   ],
    //   [
    //     0,
    //     u2M ** 2 +
    //       gamma2 * rho2M ** (gamma2 - 1) +
    //       delta * beta2 * rho2M ** (beta2 - 1),
    //     0,
    //     2 * u2M * rho2M + (epsilon * (rho2M - X[n - 1][M - 1].get([1, 0]))) / h,
    //   ],
    // ]);

    // const invWM = math.inv(
    //   math.add(
    //     math.identity([4, 4]),
    //     math.multiply(math.multiply(h / 2, math.inv(C)), Be)
    //   ) as math.Matrix
    // );

    // const WCM = math.multiply(invWM, math.inv(C));

    // const AM = math.multiply(1 / h, invWM);

    // const CM = math.subtract(
    //   math.add(
    //     math.multiply(1 / h, invWM),
    //     math.multiply(math.multiply(h / (2 * tau), WCM), Ae)
    //   ),
    //   math.multiply(math.multiply(h / 2, WCM), F)
    // );

    // const FM = math
    //   .chain(h / (2 * tau))
    //   .multiply(WCM)
    //   .multiply(Ae)
    //   .multiply(X[n - 1][M])
    //   .add(
    //     math
    //       .chain(h / 2)
    //       .multiply(WCM)
    //       .multiply(Phi[n - 1][M])
    //       .done()
    //   )
    //   .subtract(
    //     math.matrix([
    //       [0],
    //       [0],
    //       [(X[n - 1][M].get([2, 0]) - u1M) / h],
    //       [(X[n - 1][M].get([3, 0]) - u2M) / h],
    //     ])
    //   )
    //   .done() as math.Matrix;

    // Xn[Xn.length - 1] = math.multiply(
    //   math.inv(CM as math.Matrix),
    //   math.add(math.multiply(AM, beta[beta.length - 1]), FM)
    // );
    // Xn[Xn.length - 1].set([2, 0], 0);
    // Xn[Xn.length - 1].set([3, 0], 0);

    // Xn[Xn.length - 1] = beta[beta.length - 1];
    Xn[Xn.length - 1] = math.multiply(
      math.inv(
        math.subtract(
          math.identity([4, 4]),
          alpha[alpha.length - 1]
        ) as math.Matrix
      ),
      beta[beta.length - 1]
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
