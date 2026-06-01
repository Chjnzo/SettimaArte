// Cloudflare Worker — SettimaArte
// Gestisce /api/corti come proxy verso Google Sheets (URL nascosto lato server)
// Tutto il resto viene servito come asset statico via ASSETS binding

function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  return lines.slice(1).map(line => {
    const fields = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++ }
        else inQuotes = !inQuotes
      } else if (ch === ',' && !inQuotes) {
        fields.push(cur.trim())
        cur = ''
      } else {
        cur += ch
      }
    }
    fields.push(cur.trim())

    const [id, edizione, classe, nome_progetto, trama, locandina_url, video_url, link_voto, attivo] = fields
    return {
      id: Number(id) || 0,
      edizione: edizione ?? '',
      classe: classe ?? '',
      nome_progetto: nome_progetto ?? '',
      trama: trama || null,
      locandina_url: locandina_url || null,
      video_url: video_url || null,
      link_voto: link_voto || null,
      attivo: ['TRUE', 'VERO', '1', 'YES', 'SÌ', 'SI'].includes((attivo ?? '').toUpperCase().trim()),
    }
  }).filter(r => r.attivo && r.nome_progetto)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/corti') {
      const sheetUrl = env.GSHEET_URL
      if (!sheetUrl) {
        return new Response(JSON.stringify([]), {
          headers: { 'Content-Type': 'application/json' },
        })
      }

      try {
        const sep = sheetUrl.includes('?') ? '&' : '?'
        const fetchUrl = `${sheetUrl}${sep}t=${Math.floor(Date.now() / 60000)}`
        const res = await fetch(fetchUrl)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const csv = await res.text()
        const corti = parseCSV(csv)

        return new Response(JSON.stringify(corti), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=60',
          },
        })
      } catch {
        return new Response(JSON.stringify([]), {
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    return env.ASSETS.fetch(request)
  },
}
