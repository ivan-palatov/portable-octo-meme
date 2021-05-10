export function matrixToObject(matrixArray: math.Matrix[][]) {
  const result = { u1: [] as number[][], u2: [] as number[][] };

  matrixArray.forEach((arr, i) => {
    result.u1.push([]);
    result.u2.push([]);
    arr.forEach((matrix, j) => {
      result.u1[i].push(matrix.get([0, 0]));
      result.u2[i].push(matrix.get([1, 0]));
    });
  });

  return result;
}
