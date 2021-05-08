import * as math from 'mathjs';
import { FormTypes } from '../components/u/UForm';
import { calcMainU } from '../utils/calcMainU';
import { makeArray } from '../utils/makeArray';
import { makeMatrix } from '../utils/makeMatrix';

const ctx: Worker = self as any;

ctx.onmessage = (e) => {
  const { N, M, T, a, v1, v2, ...data } = e.data as FormTypes;
  console.log('Starting u worker');

  const h = 1 / M;
  const tau = T / N;

  const x = makeArray(M + 1, (i) => i * h);
  const t = makeArray(N + 1, (i) => i * tau);

  const u0 = makeArray(M + 1, (i) => math.evaluate(data.u0, { x: x[i] }));
  const otherU = makeMatrix(N + 1, M + 1, (i, j) =>
    math.evaluate(data.uOther, { x: x[j], t: t[i] })
  );

  const rho = makeMatrix(N + 1, M + 1, (i, j) =>
    math.evaluate(data.rho, { x: x[j], t: t[i] })
  );

  const f = makeMatrix(N + 1, M + 1, (i, j) =>
    math.evaluate(data.f, { x: x[j], t: t[i] })
  );

  // Получение численного решения
  const result = calcMainU(u0, rho, otherU, a, v1, v2, 0.1, M, N, tau, h, f);

  const uReal = makeMatrix(N + 1, M + 1, (i, j) =>
    math.evaluate(data.uReal, { x: x[j], t: t[i] })
  );

  const diff = makeMatrix(N + 1, M + 1, (i, j) =>
    Math.abs(result[i][j] - uReal[i][j])
  );

  ctx.postMessage({
    u: { x, y: t, z: result, type: 'surface' },
    uReal: { x, y: t, z: uReal, type: 'surface' },
    diff: { x, y: t, z: diff, type: 'surface' },
  });
};

export default {} as typeof Worker & { new (): Worker };
