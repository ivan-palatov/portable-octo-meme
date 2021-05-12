import * as math from 'mathjs';
import { FormTypes } from '../components/result/ResultForm';
import { calcF, calcG } from './calcFunctions';
import { makeArray } from './makeArray';
import { makeMatrix } from './makeMatrix';

export class Calculator {
  private readonly M: number;
  private readonly N: number;
  private readonly h: number;
  private readonly tau: number;
  private readonly x: number[];
  private readonly t: number[];

  constructor(private readonly data: FormTypes) {
    this.M = data.M;
    this.N = data.N;
    this.h = 1 / this.M;
    this.tau = data.T / this.N;
    this.x = makeArray(data.M + 1, (i) => i * this.h);
    this.t = makeArray(data.N + 1, (i) => i * this.tau);
  }

  private get V() {
    return math.matrix([
      [this.data.v11, this.data.v12],
      [this.data.v21, this.data.v22],
    ]);
  }

  private get K() {
    return math.matrix([
      [-this.data.a, this.data.a],
      [this.data.a, -this.data.a],
    ]);
  }

  private calcF() {
    const f = calcF(this.data.rho1, this.data.u1);
    return makeMatrix(this.N + 1, this.M + 1, (i, j) =>
      f.evaluate({ epsilon: this.data.epsilon, x: this.x[j], t: this.t[i] })
    );
  }

  private calcG() {
    const g1 = calcG(this.data.rho1, this.data.u1, this.data.u2);
    const g2 = calcG(this.data.rho2, this.data.u2, this.data.u1);

    return makeMatrix(this.N + 1, this.M + 1, (i, j) =>
      math.matrix([
        [
          g1.evaluate({
            a: this.data.a,
            v1: this.V.get([0, 0]),
            v2: this.V.get([0, 1]),
            gamma: this.data.gamma1,
            x: this.x[j],
            t: this.t[i],
          }),
        ],
        [
          g2.evaluate({
            a: this.data.a,
            v1: this.V.get([1, 0]),
            v2: this.V.get([1, 1]),
            gamma: this.data.gamma2,
            x: this.x[j],
            t: this.t[i],
          }),
        ],
      ])
    );
  }
}
