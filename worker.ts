// Cloudflare Worker — SettimaArte
// Routes:
//   GET  /api/corti           → public, returns corti only when enabled=true
//   GET  /api/admin/corti     → admin (Bearer PIN), returns full VotazioniData
//   POST /api/admin/corti     → admin (Bearer PIN), writes full VotazioniData
//   *                         → serve React SPA via ASSETS binding

interface KVNamespace {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
}

interface Fetcher {
  fetch(request: Request): Promise<Response>
}

interface Env {
  CORTI_KV: KVNamespace
  ASSETS: Fetcher
  ADMIN_PIN: string
}

export interface CortoCorrente {
  id: number
  edizione: string
  classe: string
  nome_progetto: string
  trama: string | null
  locandina_url: string | null
  video_url: string | null
  link_voto: string | null
  attivo: boolean
}

export interface VotazioniData {
  enabled: boolean
  corti: CortoCorrente[]
}

const DEFAULT_DATA: VotazioniData = {
  enabled: false,
  corti: [],
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}

function isAuthorized(request: Request, env: Env): boolean {
  const auth = request.headers.get('Authorization') ?? ''
  const pin = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  return pin.length > 0 && pin === env.ADMIN_PIN
}

async function readKV(env: Env): Promise<VotazioniData> {
  const raw = await env.CORTI_KV.get('corti_correnti')
  if (!raw) return DEFAULT_DATA
  try {
    const parsed = JSON.parse(raw)
    // backward compatibility: old format was a plain array
    if (Array.isArray(parsed)) return { enabled: false, corti: parsed }
    return parsed as VotazioniData
  } catch {
    return DEFAULT_DATA
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const { pathname } = url
    const method = request.method.toUpperCase()

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    // GET /api/corti — public, only when enabled and attivo
    if (method === 'GET' && pathname === '/api/corti') {
      const data = await readKV(env)
      if (!data.enabled) return json([])
      return json(data.corti.filter((c) => c.attivo))
    }

    // GET /api/admin/corti — admin, full VotazioniData
    if (method === 'GET' && pathname === '/api/admin/corti') {
      if (!isAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401)
      return json(await readKV(env))
    }

    // POST /api/admin/corti — admin, write full VotazioniData
    if (method === 'POST' && pathname === '/api/admin/corti') {
      if (!isAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401)
      let body: unknown
      try { body = await request.json() } catch { return json({ error: 'Invalid JSON' }, 400) }
      if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return json({ error: 'Body must be a VotazioniData object' }, 400)
      }
      await env.CORTI_KV.put('corti_correnti', JSON.stringify(body))
      return json({ ok: true })
    }

    // Fallthrough — serve React SPA (client-side routing)
    const hasFileExtension = pathname.includes('.')
    if (!hasFileExtension) {
      return env.ASSETS.fetch(new Request(new URL('/', request.url)))
    }
    return env.ASSETS.fetch(request)
  },
}
