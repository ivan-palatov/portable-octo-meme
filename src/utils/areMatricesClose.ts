export function areMatricesClose(
  m1: number[][],
  m2: number[][],
  epsilon0: number
): boolean {
  const l1 = m1.length;
  const l2 = m1[0].length;

  for (let i = 0; i < l1; i++) {
    for (let j = 0; j < l2; j++) {
      if (epsilon0 < Math.abs(m1[i][j] - m2[i][j])) return false;
    }
  }

  return true;
}
