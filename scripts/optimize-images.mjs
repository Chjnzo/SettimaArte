/**
 * Comprime tutte le immagini in public/images/ in-place.
 * - Ridimensiona a max 1920px di larghezza
 * - JPEG/JPG → qualità 82 (mozjpeg)
 * - PNG      → qualità 85
 * - WebP     → qualità 82
 * - Salta file già sotto 150KB (già ottimizzati)
 *
 * Uso: node scripts/optimize-images.mjs
 */

import sharp from 'sharp'
import { readdirSync, statSync, renameSync, mkdirSync } from 'fs'
import { join, extname, relative } from 'path'

const ROOT = 'public/images'
const MAX_WIDTH = 1920
const SKIP_BELOW_KB = 150
const QUALITY = { jpeg: 82, png: 85, webp: 82 }

function walkDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) files.push(...walkDir(full))
    else files.push(full)
  }
  return files
}

async function run() {
  const all = walkDir(ROOT).filter((f) =>
    /\.(jpe?g|png|webp)$/i.test(f),
  )

  console.log(`\n📁 ${all.length} immagini trovate in ${ROOT}\n`)

  let saved = 0
  let skipped = 0

  for (const file of all) {
    const kb = statSync(file).size / 1024
    const rel = relative(ROOT, file)

    if (kb < SKIP_BELOW_KB) {
      console.log(`  ⏭  skip  ${rel} (${kb.toFixed(0)}KB — già ottimizzata)`)
      skipped++
      continue
    }

    const ext = extname(file).toLowerCase().replace('.', '')
    const fmt = ext === 'jpg' ? 'jpeg' : ext

    const tmp = file + '.opt.tmp'

    try {
      const img = sharp(file, { failOnError: false })
      const meta = await img.metadata()
      const needsResize = (meta.width ?? 0) > MAX_WIDTH

      let pipe = needsResize ? img.resize(MAX_WIDTH, undefined, { withoutEnlargement: true }) : img

      if (fmt === 'jpeg') pipe = pipe.jpeg({ quality: QUALITY.jpeg, mozjpeg: true })
      else if (fmt === 'png') pipe = pipe.png({ quality: QUALITY.png, compressionLevel: 8 })
      else pipe = pipe.webp({ quality: QUALITY.webp })

      await pipe.toFile(tmp)

      const newKb = statSync(tmp).size / 1024
      const saving = kb - newKb
      saved += saving

      renameSync(tmp, file)

      const arrow = needsResize ? ` [→ ${MAX_WIDTH}px]` : ''
      console.log(
        `  ✓  ${rel}${arrow}\n     ${kb.toFixed(0)}KB → ${newKb.toFixed(0)}KB  (-${saving.toFixed(0)}KB)`,
      )
    } catch (err) {
      console.error(`  ✗  ERRORE su ${rel}: ${err.message}`)
      try { renameSync(tmp, file) } catch { /* tmp non esiste */ }
    }
  }

  const savedMB = (saved / 1024).toFixed(1)
  console.log(`\n✅ Fatto. Spazio liberato: ~${savedMB}MB. Skippate: ${skipped}.`)
}

run()
