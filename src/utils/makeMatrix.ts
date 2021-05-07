export function makeMatrix<T>(
  N: number,
  M: number,
  rule: (i: number, j: number) => T
): T[][] {
  return [...Array(N)].map((_, i) => [...Array(M)].map((_, j) => rule(i, j)));
}
