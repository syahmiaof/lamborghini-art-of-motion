import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function imageDimensions(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
  if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') throw new Error('Unsupported image: expected PNG or WebP')
  const codec = bytes.toString('ascii', 12, 16)
  if (codec === 'VP8X') return { width: 1 + bytes.readUIntLE(24, 3), height: 1 + bytes.readUIntLE(27, 3) }
  if (codec === 'VP8 ') return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff }
  if (codec === 'VP8L') { const bits = bytes.readUInt32LE(21); return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 } }
  throw new Error(`Unsupported WebP chunk: ${codec}`)
}

function publicPath(root, url) {
  if (typeof url !== 'string' || !url.startsWith('/media/sequences/') || url.includes('..') || url.includes('\\')) throw new Error('Sequence URL must be a local /media/sequences/ path')
  const resolved = path.resolve(root, `.${url}`)
  if (!resolved.startsWith(path.resolve(root) + path.sep)) throw new Error('Sequence URL escapes public root')
  return resolved
}

export async function validateManifest(manifestPath, publicRoot = path.resolve('public')) {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.id)) throw new Error('Invalid sequence ID')
  if (manifest.rightsStatus !== 'approved' || manifest.derivativeFramesAllowed !== true || !manifest.assetRegisterId?.trim()) throw new Error('Approved source and derivative-frame rights with assetRegisterId are required')
  if (!manifest.alt?.trim()) throw new Error('Poster alt text is required')
  const poster = await readFile(publicPath(publicRoot, manifest.poster))
  imageDimensions(poster)
  const report = []
  for (const name of ['desktop', 'mobile']) {
    const variant = manifest[name]
    if (!variant && name === 'mobile') continue
    if (!variant || !Number.isInteger(variant.frameCount) || variant.frameCount < 2 || variant.frameCount > 10000) throw new Error(`Invalid ${name} frameCount`)
    if (!['png', 'webp'].includes(variant.extension)) throw new Error('Only WebP and PNG variants are supported')
    if (!Number.isInteger(variant.width) || !Number.isInteger(variant.height) || variant.width < 1 || variant.height < 1 || variant.width * variant.height > 4096 * 2160) throw new Error(`Invalid ${name} dimensions`)
    if (variant.urlTemplate?.split('{frame}').length !== 2 || !variant.urlTemplate.endsWith(`/frame_{frame}.${variant.extension}`)) throw new Error(`Invalid ${name} frame URL template`)
    let totalBytes = 0
    for (let index = 0; index < variant.frameCount; index++) {
      const frame = publicPath(publicRoot, variant.urlTemplate.replace('{frame}', String(index).padStart(5, '0')))
      const buffer = await readFile(frame)
      const dimensions = imageDimensions(buffer)
      if (dimensions.width !== variant.width || dimensions.height !== variant.height) throw new Error(`Dimension mismatch: ${frame}`)
      totalBytes += buffer.byteLength
    }
    const directory = path.dirname(publicPath(publicRoot, variant.urlTemplate))
    const frameFiles = (await readdir(directory)).filter(name => name.startsWith('frame_'))
    if (frameFiles.length !== variant.frameCount) throw new Error(`Unexpected or stale frames in ${directory}`)
    if (totalBytes !== variant.totalBytes) throw new Error(`${name} byte total mismatch: measured ${totalBytes}, manifest ${variant.totalBytes}`)
    report.push({ variant: name, frameCount: variant.frameCount, width: variant.width, height: variant.height, totalBytes, budgetExceeded: totalBytes > (name === 'desktop' ? 4 : 2) * 1024 * 1024 })
  }
  return { id: manifest.id, assetRegisterId: manifest.assetRegisterId, variants: report }
}

async function main() {
  const root = path.resolve('public/media/sequences')
  try { await stat(root) } catch (error) { if (error.code === 'ENOENT') { console.log('No sequence media supplied; poster fallback is expected.'); return } throw error }
  const directories = await readdir(root, { withFileTypes: true })
  const reports = []
  for (const directory of directories.filter(entry => entry.isDirectory())) reports.push(await validateManifest(path.join(root, directory.name, 'manifest.json')))
  console.log(JSON.stringify(reports, null, 2))
  if (reports.some(report => report.variants.some(variant => variant.budgetExceeded))) throw new Error('Sequence transfer budget exceeded; optimize media before release')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1 })
