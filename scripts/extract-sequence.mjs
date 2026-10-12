import { mkdir, readdir, readFile, writeFile, copyFile, stat } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { imageDimensions, validateManifest } from './validate-sequences.mjs'

// Usage: node scripts/extract-sequence.mjs --source /path/source.mov --id awakening-v1
// --asset-id ASSET-001 --rights approved --derivative-rights approved --alt "Vehicle headlights illuminate"
// Optional: --start 0 --duration 3 --frames 60 --width 1600 --quality 78 --ffmpeg ffmpeg
const options = new Map()
for (let i = 2; i < process.argv.length; i += 2) {
  const key = process.argv[i]
  const value = process.argv[i + 1]
  if (!key?.startsWith('--') || !value || value.startsWith('--')) throw new Error(`Expected --argument value, received ${key}`)
  options.set(key.slice(2), value)
}
const required = key => { const value = options.get(key); if (!value) throw new Error(`--${key} is required`); return value }
const numeric = (key, fallback, min, max) => { const value = Number(options.get(key) ?? fallback); if (!Number.isFinite(value) || value < min || value > max) throw new Error(`--${key} must be between ${min} and ${max}`); return value }

async function main() {
  const source = path.resolve(required('source'))
  const id = required('id')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('--id must be lowercase kebab-case')
  if (required('rights') !== 'approved' || required('derivative-rights') !== 'approved') throw new Error('Only explicitly approved source and derivative rights may be extracted')
  const assetRegisterId = required('asset-id')
  const alt = required('alt')
  if (!(await stat(source)).isFile()) throw new Error('Source must be a local file')
  const frames = numeric('frames', 60, 2, 120)
  const width = numeric('width', 1600, 64, 2560)
  if (!Number.isInteger(frames) || !Number.isInteger(width)) throw new Error('Frames and width must be integers')
  const start = numeric('start', 0, 0, 86400)
  const duration = numeric('duration', 3, 0.1, 10)
  const quality = numeric('quality', 78, 1, 100)
  const posterIndexOption = options.get('poster-index')
  const force = options.get('force') === 'true'
  const output = path.resolve('public/media/sequences', id)
  try {
    await stat(output)
    if (!force) throw new Error('Output exists; choose a new versioned sequence ID to avoid overwriting frames, or use --force true')
    const { rm } = await import('node:fs/promises')
    await rm(output, { recursive: true, force: true })
  } catch (error) {
    if (error.code !== 'ENOENT' && !force) throw error
  }
  const executable = options.get('ffmpeg') ?? 'ffmpeg'
  const probe = spawnSync(executable, ['-version'], { encoding: 'utf8', windowsHide: true })
  if (probe.error || probe.status !== 0) throw new Error('FFmpeg is not available. Install it locally or supply --ffmpeg with its executable path.')
  await mkdir(path.join(output, 'desktop'), { recursive: true })
  const result = spawnSync(executable, ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-ss', String(start), '-i', source, '-t', String(duration), '-vf', `fps=${frames / duration},scale=${width}:-2`, '-frames:v', String(frames), '-c:v', 'libwebp', '-quality', String(quality), '-start_number', '0', path.join(output, 'desktop/frame_%05d.webp')], { encoding: 'utf8', windowsHide: true })
  if (result.error || result.status !== 0) throw new Error(`Extraction failed; inspect partial output before retrying: ${result.stderr || result.error?.message}`)
  const files = (await readdir(path.join(output, 'desktop'))).filter(file => /^frame_\d{5}\.webp$/.test(file)).sort()
  if (files.length !== frames) throw new Error(`Source produced ${files.length}/${frames} frames. Choose a longer source segment.`)
  const first = await readFile(path.join(output, 'desktop', files[0]))
  const dimensions = imageDimensions(first)
  let totalBytes = 0
  for (const file of files) totalBytes += (await stat(path.join(output, 'desktop', file))).size
  const chosenPosterIndex = posterIndexOption !== undefined ? Math.max(0, Math.min(files.length - 1, parseInt(posterIndexOption, 10))) : 0
  const chosenPosterFile = files[chosenPosterIndex] || files[0]
  await copyFile(path.join(output, 'desktop', chosenPosterFile), path.join(output, 'poster.webp'))
  const manifest = { id, assetRegisterId, rightsStatus: 'approved', derivativeFramesAllowed: true, poster: `/media/sequences/${id}/poster.webp`, alt, desktop: { frameCount: frames, ...dimensions, extension: 'webp', urlTemplate: `/media/sequences/${id}/desktop/frame_{frame}.webp`, totalBytes } }
  const manifestPath = path.join(output, 'manifest.json')
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  console.log(JSON.stringify(await validateManifest(manifestPath), null, 2))
}

main().catch(error => { console.error(error.message); process.exitCode = 1 })
