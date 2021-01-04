export let font = 'bold 16px verdana, sans-serif'
const wordContainer = document.querySelector('#word') as HTMLSpanElement
wordContainer.style.font = font
type Size = {
  width: number
  height: number
}
const sizeCache: Record<string, Size> = {}

export function getWordSize(word: string): Size {
  if (word in sizeCache) {
    return sizeCache[word]
  }
  wordContainer.textContent = word
  const rect = wordContainer.getBoundingClientRect()
  const size: Size = { width: rect.width, height: rect.height }
  sizeCache[word] = size
  return size
}
