export function makeArray<T>(N: number, rule: (i: number) => T): Array<T> {
  return [...Array(N)].map((_, i) => rule(i));
}
