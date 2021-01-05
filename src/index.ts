import { config } from './config'
import { newBall, newRocket, randomWord } from './game'
import { calcDistanceSquare } from './math'
import { Shape } from './types'
import { getWordSize } from './word'

const canvas = document.querySelector('canvas#game') as HTMLCanvasElement
canvas.width = config.width
canvas.height = config.height
const W = canvas.width
const H = canvas.height
const ctx = canvas.getContext('2d')!
ctx.font = 'bold 16px verdana, sans-serif'

let lastTime = Date.now()
let dt: number
let lastSpawnBallTime = Date.now()

let balls = [newBall('T')]
let rockets = [newRocket('T')]

function tick() {
  const now = Date.now()
  dt = (now - lastTime) / 1000
  lastTime = now

  if (now - lastSpawnBallTime > config.spawnBallInterval) {
    balls.push(newBall(randomWord()))
    lastSpawnBallTime = now
  }

  balls.forEach(moveBall)
  rockets.forEach(moveRocket)
  rockets = rockets.filter(rocket => !rocket.die)
}

function moveBall(ball: typeof balls[number]) {
  if (ball.die) {
    return
  }
  ball.y += dt * config.ballSpeed
}

function moveRocket(rocket: typeof rockets[number]) {
  if (rocket.die) {
    return
  }
  const target = balls
    .filter(ball => ball.word === rocket.word)
    .map(ball => {
      const distanceSquare = calcDistanceSquare(ball, rocket)
      return { ball, distanceSquare }
    })
    .sort((a, b) => a.distanceSquare - b.distanceSquare)[0]
  let targetX: number
  let targetY: number
  if (!target) {
    targetX = config.width / 2
    targetY = config.height / 2
  } else {
    const ball = target.ball
    if (target.distanceSquare < 1) {
      ball.die = true
      ball.color = config.dieColor
      rocket.die = true
      rocket.color = config.dieColor
      setTimeout(() => {
        balls = balls.filter(x => x !== ball)
      }, config.deadLatency)
      config.spawnBallInterval *= 0.9
      return
    }
    targetX = ball.x
    targetY = ball.y
  }
  let dx = rocket.x - targetX
  let dy = rocket.y - targetY
  dx = config.rocketSpeed * Math.sign(dx)
  dy = config.rocketSpeed * Math.sign(dy)
  rocket.x -= dt * dx
  rocket.y -= dt * dy
}

function paint() {
  tick()

  // background
  ctx.fillStyle = '#c0ffee'
  ctx.fillRect(0, 0, W, H)

  const deadBalls = balls.filter(ball => ball.die)
  const liveBalls = balls.filter(ball => !ball.die)

  deadBalls.forEach(paintShape)
  deadBalls.forEach(paintWord)

  liveBalls.forEach(paintShape)
  rockets.forEach(paintShape)

  liveBalls.forEach(paintWord)
  rockets.forEach(paintWord)

  requestAnimationFrame(paint)
}

function paintShape(shape: Shape) {
  ctx.fillStyle = shape.color
  const size = shape.size
  const radius = size / 2
  ctx.fillRect(shape.x - radius, shape.y - radius, size, size)
  if (shape.word) {
    // paintWord(shape)
  }
}

function paintWord(shape: Shape) {
  ctx.fillStyle = config.textColor
  const wordSize = getWordSize(shape.word)
  const x = shape.x - wordSize.width / 2
  const y = shape.y + wordSize.height / 3
  ctx.fillText(shape.word, x, y)
}

window.addEventListener('keypress', ev => {
  const word = ev.key.toUpperCase()
  const rocket = newRocket(word)
  rockets.push(rocket)
})
requestAnimationFrame(paint)
