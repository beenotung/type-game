import { config } from './config'
import { randomElement, randomInt } from './random'
import { Shape } from './types'

const words: string[] = []
for (let i = 0; i < 26; i++) {
  const word = String.fromCharCode(65 + i)
  words.push(word)
}

export function randomWord() {
  return randomElement(words)
}

export function newBall(word: string): Shape {
  const x = randomInt(config.width - config.ballSize) + config.ballSize / 2
  const y = config.ballSize / 2
  return {
    color: config.ballColor,
    word,
    size: config.ballSize,
    x,
    y,
  }
}

export function newRocket(word: string): Shape {
  const x = config.width / 2
  const y = config.height - config.rocketSize / 2
  return {
    color: config.rocketColor,
    word,
    size: config.rocketSize,
    x,
    y,
  }
}
