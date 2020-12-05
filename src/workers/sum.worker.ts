import * as math from 'mathjs';
import { areMatricesClose } from '../utils/areMatricesClose';
import { calcRho } from '../utils/calcRho';
import { calcU } from '../utils/calcU';

const ctx: Worker = self as any;

interface IData {
  u10: math.EvalFunction;
  u20: math.EvalFunction;
  rho10: math.EvalFunction;
  rho20: math.EvalFunction;
  T: number;
  N: number;
  M: number;
  epsilon: number;
  delta: number;
  a: number;
  nu11: number;
  nu12: number;
  nu21: number;
  nu22: number;
  beta1: number;
  beta2: number;
  gamma1: number;
  gamma2: number;
  epsilon0: number;
}

function calculate({
  u10,
  u20,
  rho10,
  rho20,
  T,
  N,
  M,
  epsilon,
  delta,
  a,
  nu11,
  nu12,
  nu21,
  nu22,
  beta1,
  beta2,
  gamma1,
  gamma2,
  epsilon0,
}: IData) {
  const h = 1 / M;

  // Заполняем начальные значения u1
  let u1next: number[][] = Array(N + 1)
    .fill(0)
    .map((_, i) =>
      Array(M + 1)
        .fill(0)
        .map((_, j) => u10.evaluate({ x: j * h }))
    );

  // Заполняем начальные значения u2
  let u2next: number[][] = Array(N + 1)
    .fill(0)
    .map((_, i) =>
      Array(M + 1)
        .fill(0)
        .map((_, j) => u20.evaluate({ x: j * h }))
    );

  let u1prev: number[][], u2prev: number[][];

  let k = 0;
  // Выполняем цикл пока не сойдёмся к k-решению, отличающемуся от соседнего не более чем на epsilon0
  do {
    // Вычисляем ро1 и ро2 для известных нам u1 & u2
    const rho1 = calcRho({ T, M, N, rho0: rho10, u: u1next, epsilon });
    const rho2 = calcRho({ T, M, N, rho0: rho20, u: u2next, epsilon });

    u1prev = u1next;
    u2prev = u2next;

    // Вычисление следующего u1
    u1next = calcU({
      T,
      N,
      M,
      rho: rho1,
      u0: u10,
      otherU: u2prev,
      delta,
      beta: beta1,
      gamma: gamma1,
      epsilon,
      a,
      nu1: nu11,
      nu2: nu12,
    });

    // Вычисление следующего u2
    u2next = calcU({
      T,
      N,
      M,
      rho: rho2,
      u0: u20,
      otherU: u1prev,
      delta,
      beta: beta2,
      gamma: gamma2,
      epsilon,
      a,
      nu1: nu21,
      nu2: nu22,
    });

    k++;
  } while (
    (!areMatricesClose(u1prev, u1next, epsilon0) ||
      !areMatricesClose(u2prev, u2next, epsilon0)) &&
    k < 10
  );

  return { u1: u1next, u2: u2next };
}

ctx.onmessage = (e) => {
  const { rho10, rho20, u10, u20, M, N, T, ...data } = e.data;
  const { u1, u2 } = calculate({
    ...data,
    M,
    N,
    T,
    rho10: math.parse(rho10),
    rho20: math.parse(rho20),
    u10: math.parse(u10),
    u20: math.parse(u20),
  });

  const x = Array(M + 1)
    .fill(0)
    .map((_, i) => i * (1 / M));
  const y = Array(N + 1)
    .fill(0)
    .map((_, i) => i * (T / N));

  ctx.postMessage({
    plot1: { x, y, z: u1, type: 'surface' },
    plot2: { x, y, z: u2, type: 'surface' },
  });
};

export default {} as typeof Worker & { new (): Worker };
