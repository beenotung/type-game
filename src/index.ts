import { config } from './config'
import { newBall, newRocket, randomWord } from './game'
import { calcDistanceSquare } from './math'
import { Shape } from './types'
import { getWordSize } from './word'

const intervalSpan = document.querySelector('#interval') as HTMLSpanElement
const wpmSpan = document.querySelector('#wpm') as HTMLSpanElement
paintInterval()

const canvas = document.querySelector('canvas#game') as HTMLCanvasElement
canvas.width = config.width
canvas.height = config.height
let ctx = canvas.getContext('2d')!
ctx.font = 'bold 16px verdana, sans-serif'

let lastTime = Date.now()
let dt: number
let lastSpawnBallTime = Date.now()

const center = newBall('')

let balls = [newBall('T')]
let rockets = [newRocket('T')]

function tick() {
  const now = Date.now()
  dt = (now - lastTime) / 1000
  lastTime = now

  if (now - lastSpawnBallTime > config.spawnBallInterval) {
    lastSpawnBallTime = now
    const word = randomWord()
    const ball = newBall(word)
    balls.push(ball)
    if (config.auto) {
      rockets.push(newRocket(word))
    }
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

function findRocketTarget(rocket: typeof rockets[number]) {
  const target = balls
    .filter(ball => !ball.targetBy && ball.word === rocket.word)
    .map(ball => {
      const distanceSquare = calcDistanceSquare(ball, rocket)
      return { ball, distanceSquare }
    })
    .sort((a, b) => a.distanceSquare - b.distanceSquare)[0]
  return target
}

function moveRocket(rocket: typeof rockets[number]) {
  if (rocket.die) {
    return
  }
  let target: Shape = center
  let distanceSquare: number
  if (rocket.target) {
    target = rocket.target
  } else {
    const rocketTarget = findRocketTarget(rocket)
    if (rocketTarget) {
      target = rocket.target = rocketTarget.ball
      target.targetBy = rocket
      distanceSquare = rocketTarget.distanceSquare
    }
  }
  distanceSquare = distanceSquare! || calcDistanceSquare(rocket, target)
  if (target !== center) {
    const ball = target
    if (distanceSquare < 1) {
      ball.die = true
      ball.color = config.dieColor
      rocket.die = true
      rocket.color = config.dieColor
      setTimeout(() => {
        balls = balls.filter(x => x !== ball)
      }, config.deadLatency)
      config.spawnBallInterval = Math.ceil(config.spawnBallInterval * 0.9)
      paintInterval()
      return
    }
  }
  let dx = rocket.x - target.x
  let dy = rocket.y - target.y
  dx = config.rocketSpeed * Math.sign(dx)
  dy = config.rocketSpeed * Math.sign(dy)
  rocket.x -= dt * dx
  rocket.y -= dt * dy
}

function paint() {
  tick()

  // background
  ctx.fillStyle = '#c0ffee'
  ctx.fillRect(0, 0, config.width, config.height)

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

function paintInterval() {
  intervalSpan.textContent = config.spawnBallInterval + ''
  wpmSpan.textContent = Math.round((1000 / config.spawnBallInterval) * 60) + ''
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

let code = ''
window.addEventListener('keypress', ev => {
  const word = ev.key.toUpperCase()
  code += word
  checkCode()
  rockets.push(newRocket(word))
})

function checkCode() {
  if (code.endsWith('AUTO')) {
    config.auto = true
  } else if (code.endsWith('OFF')) {
    config.auto = false
  }
  if (code.length > 4) {
    code = code.slice(-4)
  }
}

function resize() {
  config.width = window.innerWidth * 0.8
  config.height = window.innerHeight * 0.75

  canvas.width = config.width
  canvas.height = config.height
  ctx = canvas.getContext('2d')!
  ctx.font = 'bold 16px verdana, sans-serif'

  center.x = config.width / 2
  center.y = config.height / 2
}

resize()
window.addEventListener('resize', resize)

requestAnimationFrame(paint)
