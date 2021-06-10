export function createSurfacePlotData(
  x: number[],
  t: number[],
  results: Record<string, number[][]>
) {
  const res = {} as Record<string, any>;
  for (const [name, arr] of Object.entries(results)) {
    res[name] = { x, y: t, z: arr, type: 'surface' };
  }

  return res;
}

export function createScatterPlotData(
  x: number[],
  T: number,
  results: Record<string, number[][]>
) {
  const res = {} as Record<string, any>;
  for (const [name, arr] of Object.entries(results)) {
    res[name] = getScatterPlot(arr, x, T);
  }

  return res;
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
      name: `t=${((i / (arr.length - 1)) * T).toPrecision(2)}`,
    });
  }

  return res;
}
