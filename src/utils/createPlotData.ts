export function createSurfacePlotData(
  x: number[],
  t: number[],
  results: {
    rho1: number[][];
    rho2: number[][];
    u1: number[][];
    u2: number[][];
  }
) {
  return {
    u1: { x, y: t, z: results.u1, type: 'surface' },
    u2: { x, y: t, z: results.u2, type: 'surface' },
    rho1: { x, y: t, z: results.rho1, type: 'surface' },
    rho2: { x, y: t, z: results.rho2, type: 'surface' },
  };
}

export function createScatterPlotData(
  x: number[],
  T: number,
  results: {
    rho1: number[][];
    rho2: number[][];
    u1: number[][];
    u2: number[][];
  }
) {
  return {
    u1: getScatterPlot(results.u1, x, T),
    u2: getScatterPlot(results.u2, x, T),
    rho1: getScatterPlot(results.rho1, x, T),
    rho2: getScatterPlot(results.rho2, x, T),
  };
}

function getScatterPlot(arr: number[][], x: number[], T: number, N = 5) {
  if (arr.length <= 5) {
    return arr.map((res, i) => ({
      x,
      y: res,
      type: 'scatter',
      name: `t=${i}`,
    }));
  }

  const res = [] as any[];
  for (let i = 0; i <= arr.length; i = Math.round(i + (arr.length - 1) / N)) {
    res.push({
      x,
      y: arr[i],
      type: 'scatter',
      name: `t=${((i / arr.length) * T).toPrecision(2)}`,
    });
  }

  return res;
}
