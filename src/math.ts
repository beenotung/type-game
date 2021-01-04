type Pos = {
  x: number
  y: number
}

export function calcDistanceSquare(a: Pos, b: Pos): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}
