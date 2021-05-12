import * as math from 'mathjs';
import { calcAbsoluteDeviation } from '../utils/calcAbsoluteDeviation';
import { calcRho } from '../utils/calcRho';
import { makeArray } from '../utils/makeArray';
import { makeMatrix } from '../utils/makeMatrix';

const ctx: Worker = self as any;

ctx.onmessage = (e) => {
  const { M, N, T, rho, epsilon, ...data } = e.data;
  console.log('Starting rho worker');

  const h = 1 / M;
  const tau = T / N;

  const x = makeArray(M + 1, (i) => i * h);
  const t = makeArray(N + 1, (i) => i * tau);

  const rho0 = makeArray(M + 1, (i) => math.evaluate(data.rho0, { x: x[i] }));
  const u = makeMatrix(N + 1, M + 1, (i, j) =>
    math.evaluate(data.u, { x: x[j], t: t[i] })
  );

  const f = data.f
    ? makeMatrix(N + 1, M + 1, (i, j) =>
        math.evaluate(data.f, { x: x[j], t: t[i] })
      )
    : undefined;

  const res = calcRho(rho0, u, M, N, epsilon, tau, h, f);

  const actualF = makeMatrix(N + 1, M + 1, (i, j) =>
    math.evaluate(rho, { x: j * (1 / M), t: i * (T / N) })
  );

  const diff = calcAbsoluteDeviation(res, actualF);

  ctx.postMessage({
    plot: { x, y: t, z: res, type: 'surface' },
    actualFunction: { x, y: t, z: actualF, type: 'surface' },
    difference: { x, y: t, z: diff, type: 'surface' },
  });
};

export default {} as typeof Worker & { new (): Worker };
