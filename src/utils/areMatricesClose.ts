export function areMatricesClose(
  m1: number[][],
  m2: number[][],
  epsilon0: number
): boolean {
  const l1 = m1.length;
  const l2 = m1[0].length;
  let acc = 0;
  for (let i = 0; i < l1; i++) {
    for (let j = 0; j < l2; j++) {
      const diff = Math.abs(m1[i][j] - m2[i][j]);
      acc += diff;
      if (diff > epsilon0) {
        return false;
      }
    }
  }

  return true;
}
