import * as math from 'mathjs';
import { makeMatrix } from './makeMatrix';
import {
  calcA,
  calcAn,
  calcB,
  calcBn,
  calcC,
  calcCn,
  calcF,
  calcFn,
  calcInverseW,
} from './matrices';
import { reverseSweep } from './reverseSweep';
import { separateX } from './separateX';

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
  const C = calcC(epsilon, v11, v12, v21, v22);
  const F = calcF(a);

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
      forwardSweep(n, m, alpha, beta);
    }

    // Обратный ход прогонки, вычисление X
    const Xn = reverseSweep(M, alpha, beta);

    // Добавление временного слоя к массиву всех временных слоев
    X.push(Xn);
  }

  return X;

  function forwardSweep(
    n: number,
    m: number,
    alpha: math.Matrix[],
    beta: math.Matrix[]
  ) {
    const { u1, rho1, u2, rho2 } = separateX(X, n, m);

    const A = calcA(u1, rho1, u2, rho2);
    const B = calcB(
      u1,
      rho1,
      u2,
      rho2,
      gamma1,
      delta,
      beta1,
      epsilon,
      X,
      n,
      m,
      h,
      gamma2,
      beta2
    );

    // Вычисление прогоночных коэффициентов
    const An = calcAn(h, B, C); // m - 1
    const Bn = calcBn(h, B, C); // m + 1
    const Cn = calcCn(tau, A, h, C, F); // m
    const Fn = calcFn(tau, A, X, n, m, Phi); // n - 1

    const inverseW = calcInverseW(Cn, An, alpha, m);
    alpha.push(math.multiply(inverseW, Bn));
    beta.push(
      math.multiply(inverseW, math.add(math.multiply(An, beta[m - 1]), Fn))
    );
  }
}
