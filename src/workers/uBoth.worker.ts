import * as math from 'mathjs';
import { FormTypes } from '../components/bothU/BothUForm';
import { calcBothU } from '../utils/calcBothU';
import { makeArray } from '../utils/makeArray';
import { makeMatrix } from '../utils/makeMatrix';
import { matrixToObject } from '../utils/matrixToObject';

const ctx: Worker = self as any;

ctx.onmessage = (e) => {
  const { a, v11, v12, v21, v22, N, M, T, ...data } = e.data as FormTypes;
  console.log('Starting uBoth worker');

  const h = 1 / M;
  const tau = T / N;

  const x = makeArray(M + 1, (i) => i * h);
  const t = makeArray(N + 1, (i) => i * tau);

  const U0 = makeArray(M + 1, (i) =>
    math.matrix([
      [math.evaluate(data.u10, { x: x[i] })],
      [math.evaluate(data.u20, { x: x[i] })],
    ])
  );

  const Rho = makeMatrix(N + 1, M + 1, (i, j) =>
    math.matrix([
      [math.evaluate(data.rho1, { x: x[j], t: t[i] }), 0],
      [0, math.evaluate(data.rho2, { x: x[j], t: t[i] })],
    ])
  );

  const F =
    data.f1 && data.f2
      ? makeMatrix(N + 1, M + 1, (i, j) =>
          math.matrix([
            [math.evaluate(data.f1, { x: x[j], t: t[i] })],
            [math.evaluate(data.f2, { x: x[j], t: t[i] })],
          ])
        )
      : undefined;

  const V = math.matrix([
    [v11, v12],
    [v21, v22],
  ]);

  const K = math.matrix([
    [-a, a],
    [a, -a],
  ]);

  // Вычисление численного решения
  const matrixArray = calcBothU(U0, Rho, V, K, M, N, tau, h, F);

  const result = matrixToObject(matrixArray);

  const u1Real = makeMatrix(N + 1, M + 1, (i, j) =>
    math.evaluate(data.u1Real, { x: x[j], t: t[i] })
  );
  const u2Real = makeMatrix(N + 1, M + 1, (i, j) =>
    math.evaluate(data.u2Real, { x: x[j], t: t[i] })
  );

  const diff1 = makeMatrix(N + 1, M + 1, (i, j) =>
    math.abs(u1Real[i][j] - result.u1[i][j])
  );
  const diff2 = makeMatrix(N + 1, M + 1, (i, j) =>
    math.abs(u2Real[i][j] - result.u2[i][j])
  );

  ctx.postMessage({
    u1: { x, y: t, z: result.u1, type: 'surface' },
    u2: { x, y: t, z: result.u2, type: 'surface' },
    u1Real: { x, y: t, z: u1Real, type: 'surface' },
    u2Real: { x, y: t, z: u2Real, type: 'surface' },
    diff1: { x, y: t, z: diff1, type: 'surface' },
    diff2: { x, y: t, z: diff2, type: 'surface' },
  });
};

export default {} as typeof Worker & { new (): Worker };
