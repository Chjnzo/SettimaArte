// Cloudflare Worker — SettimaArte
// Routes:
//   GET  /api/corti           → public, only attivo=true records
//   GET  /api/admin/corti     → admin (Bearer PIN), all records
//   POST /api/admin/corti     → admin (Bearer PIN), write full array
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

const DEFAULT_CORTI: CortoCorrente[] = [
  { id: 1, edizione: '', classe: '1F', nome_progetto: '', trama: null, locandina_url: null, video_url: null, link_voto: null, attivo: false },
  { id: 2, edizione: '', classe: '2F', nome_progetto: '', trama: null, locandina_url: null, video_url: null, link_voto: null, attivo: false },
  { id: 3, edizione: '', classe: '3F', nome_progetto: '', trama: null, locandina_url: null, video_url: null, link_voto: null, attivo: false },
  { id: 4, edizione: '', classe: '4F', nome_progetto: '', trama: null, locandina_url: null, video_url: null, link_voto: null, attivo: false },
]

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  })
}

function isAuthorized(request: Request, env: Env): boolean {
  const auth = request.headers.get('Authorization') ?? ''
  const pin = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  return pin.length > 0 && pin === env.ADMIN_PIN
}

async function readKV(env: Env): Promise<CortoCorrente[]> {
  const raw = await env.CORTI_KV.get('corti_correnti')
  if (!raw) return DEFAULT_CORTI
  try {
    return JSON.parse(raw) as CortoCorrente[]
  } catch {
    return DEFAULT_CORTI
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const { pathname } = url
    const method = request.method.toUpperCase()

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    // GET /api/corti — public, only attivo=true
    if (method === 'GET' && pathname === '/api/corti') {
      const corti = await readKV(env)
      const active = corti.filter((c) => c.attivo)
      return json(active)
    }

    // GET /api/admin/corti — admin, all records
    if (method === 'GET' && pathname === '/api/admin/corti') {
      if (!isAuthorized(request, env)) {
        return json({ error: 'Unauthorized' }, 401)
      }
      const corti = await readKV(env)
      return json(corti)
    }

    // POST /api/admin/corti — admin, write full array
    if (method === 'POST' && pathname === '/api/admin/corti') {
      if (!isAuthorized(request, env)) {
        return json({ error: 'Unauthorized' }, 401)
      }
      let body: unknown
      try {
        body = await request.json()
      } catch {
        return json({ error: 'Invalid JSON' }, 400)
      }
      if (!Array.isArray(body)) {
        return json({ error: 'Body must be a JSON array' }, 400)
      }
      await env.CORTI_KV.put('corti_correnti', JSON.stringify(body))
      return json({ ok: true })
    }

    // Fallthrough — serve React SPA
    return env.ASSETS.fetch(request)
  },
}
