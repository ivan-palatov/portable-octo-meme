export function calcAbsoluteDeviation(f1: number[][], f2: number[][]) {
  return f1.map((arr, i) => arr.map((v, j) => Math.abs(v - f2[i][j])));
}
