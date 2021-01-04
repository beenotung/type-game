export function randomElement<T>(xs: T[]) {
  const idx = Math.floor(Math.random() * xs.length)
  return xs[idx]
}
