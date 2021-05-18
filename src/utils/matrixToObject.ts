export function matrixToObject(matrixArray: math.Matrix[][]) {
  const results = {
    rho1: [] as number[][],
    rho2: [] as number[][],
    u1: [] as number[][],
    u2: [] as number[][],
  };

  matrixArray.forEach((arr, i) => {
    results.rho1.push([]);
    results.rho2.push([]);
    results.u1.push([]);
    results.u2.push([]);
    arr.forEach((matrix, j) => {
      results.rho1[i].push(matrix.get([0, 0]));
      results.rho2[i].push(matrix.get([1, 0]));
      results.u1[i].push(matrix.get([2, 0]));
      results.u2[i].push(matrix.get([3, 0]));
    });
  });

  return results;
}
