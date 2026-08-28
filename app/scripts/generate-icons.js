import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const svg = readFileSync(join(__dirname, 'icon.svg'))
const publicDir = join(__dirname, '..', 'public')

const targets = [
  { file: 'pwa-192.png', size: 192 },
  { file: 'pwa-512.png', size: 512 },
  { file: 'pwa-maskable-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
]

for (const { file, size } of targets) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(join(publicDir, file))
  console.log('wrote', file)
}
