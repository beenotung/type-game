export type Shape = {
  color: string
  x: number
  y: number
  size: number
  word: string
  die?: boolean
  target?: Shape
  targetBy?: Shape
  startTime: number
}
