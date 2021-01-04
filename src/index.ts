import { calcDistanceSquare } from './math'

const canvas = document.querySelector('canvas#game') as HTMLCanvasElement
const W = canvas.width
const H = canvas.height
const ctx = canvas.getContext('2d')!
ctx.font = 'bold 16px verdana, sans-serif'

requestAnimationFrame(paint)

let lastTime = Date.now()
let dt: number

type Shape = {
  color: string
  x: number
  y: number
  size: number
}
const textColor = 'black'
const ballSize = 50
const ballSpeed = 30
const ballColor = 'orange'
const rocketSize = 30
const rocketSpeed = 50
const rocketColor = 'red'
const balls = [
  {
    x: 50,
    y: 50,
    die: false,
    color: ballColor,
    size: ballSize,
  },
]
const rockets = [
  {
    x: 250,
    y: 250,
    die: false,
    color: rocketColor,
    size: rocketSize,
  },
]

function tick() {
  const now = Date.now()
  dt = (now - lastTime) / 1000
  lastTime = now

  balls.forEach(moveBall)
  rockets.forEach(moveRocket)
  detectCollision()
}

function moveBall(ball: typeof balls[number]) {
  if (ball.die) {
    return
  }
  ball.y += dt * ballSpeed
}

function moveRocket(rocket: typeof rockets[number]) {
  if (rocket.die) {
    return
  }
  if (balls.length === 0) {
    return
  }
  const ball = balls[0]
  let dy = rocket.y - ball.y
  let dx = rocket.x - ball.x
  dy = rocketSpeed * Math.sign(dy)
  dx = rocketSpeed * Math.sign(dx)
  rocket.y -= dt * dy
  rocket.x -= dt * dx
}

function detectCollision() {
  balls.forEach(ball =>
    rockets.forEach(rocket => {
      const distanceSquare = calcDistanceSquare(ball, rocket)
      if (distanceSquare < 1) {
        ball.die = true
        rocket.die = true
        ball.color = 'gray'
        rocket.color = 'gray'
      }
    }),
  )
}

function paint() {
  tick()

  // background
  ctx.fillStyle = '#c0ffee'
  ctx.fillRect(0, 0, W, H)

  balls.forEach(ball => {
    paintShape(ball)
    ctx.fillStyle = textColor
    ctx.fillText('A', ball.x, ball.y)
  })
  rockets.forEach(rocket => {
    if (rocket.die) {
      return
    }
    paintShape(rocket)
  })

  requestAnimationFrame(paint)
}

function paintShape(shape: Shape) {
  ctx.fillStyle = shape.color
  const size = shape.size
  const radius = size / 2
  ctx.fillRect(shape.x - radius, shape.y - radius, size, size)
}
