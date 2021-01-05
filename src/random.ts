export function randomElement<T>(xs: T[]): T {
  const idx = randomInt(xs.length)
  return xs[idx]
}

// return 0 to n, excluding n
export function randomInt(n: number): number {
  return Math.floor(Math.random() * n)
}
