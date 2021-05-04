import { areMatricesClose } from './areMatricesClose';
import { calcMainRho } from './calcMainRho';
import { calcMainU } from './calcMainU';

interface IData {
  u10: number[][];
  u20: number[][];
  rho10: number[];
  rho20: number[];
  v11: number;
  v12: number;
  v21: number;
  v22: number;
  a: number;
  epsilon: number;
  M: number;
  N: number;
  tau: number;
  h: number;
  epsilon0: number;
}

export function calcMain(params: IData) {
  const previous = {
    u1: [] as number[][],
    u2: [] as number[][],
  };

  const current = {
    u1: params.u10,
    u2: params.u20,
    rho1: [] as number[][],
    rho2: [] as number[][],
  };

  let i = 0;
  do {
    previous.u1 = current.u1;
    previous.u2 = current.u2;
    // Calculating rho1 and rho2 for the last known approximations of u1 and u2
    current.rho1 = calcMainRho(
      params.rho10,
      previous.u1,
      params.M,
      params.N,
      params.epsilon,
      params.tau,
      params.h
    );
    current.rho2 = calcMainRho(
      params.rho20,
      previous.u2,
      params.M,
      params.N,
      params.epsilon,
      params.tau,
      params.h
    );

    // Calculating u1 and u2
    current.u1 = calcMainU(
      params.u10[0],
      current.rho1,
      previous.u2,
      params.a,
      params.v11,
      params.v12,
      params.epsilon,
      params.M,
      params.N,
      params.tau,
      params.h
    );

    current.u2 = calcMainU(
      params.u20[0],
      current.rho2,
      previous.u1, // возможно, лучше взять current.u1
      params.a,
      params.v22, // возможно, нужно поменять местами
      params.v21,
      params.epsilon,
      params.M,
      params.N,
      params.tau,
      params.h
    );

    i++;
    console.log(i);
  } while (
    !areMatricesClose(previous.u1, current.u1, params.epsilon0) ||
    !areMatricesClose(previous.u2, current.u2, params.epsilon0) ||
    i === 10
  );
  // задать начальные u_i^0
  // 1. Цикл по k пока разница между k-ыми решениями не будет меньше эпсилон (сравнение по u_i, наверное)
  //      1) нахождение ро^i при начальных u_i^0
  //      2) для полученных выше ро^i нахождение u_i
  //      3) вместо начальных u_i^0 вписать полученные выше

  return { ...current, i };
}
