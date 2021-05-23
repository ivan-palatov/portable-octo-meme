export function separateX(X: math.Matrix[][], n: number, m: number) {
  const rho1 = X[n - 1][m].get([0, 0]);
  const rho2 = X[n - 1][m].get([1, 0]);
  const u1 = X[n - 1][m].get([2, 0]);
  const u2 = X[n - 1][m].get([3, 0]);
  return { u1, rho1, u2, rho2 };
}
