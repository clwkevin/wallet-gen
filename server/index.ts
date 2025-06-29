import { serve } from 'bun'
import { cors } from './middleware/cors'
import { walletRoutes } from './routes/wallet'
import { staticRoutes } from './routes/static'

const PORT = 8888

const server = serve({
  port: PORT,
  hostname: '0.0.0.0',
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const { pathname, method } = url

    // Apply CORS middleware
    const corsResponse = cors(request)
    if (corsResponse) return corsResponse

    console.log(`${method} ${pathname}`)

    try {
      // Handle API routes
      if (pathname.startsWith('/api/')) {
        return await walletRoutes(request, pathname.replace('/api', ''), method)
      }

      // Handle static file routes
      if (method === 'GET') {
        return await staticRoutes(pathname)
      }

      return new Response('Not Found', { status: 404 })
    } catch (error) {
      console.error('Server error:', error)
      return new Response('Internal Server Error', { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      })
    }
  },
})

console.log(`🚀 Octra Wallet Generator Backend Server running on http://localhost:${PORT}`)
console.log('📝 API Endpoints:')
console.log('  POST /api/generate - Generate new wallet')
console.log('  POST /api/derive - Derive wallet address')
console.log('  POST /api/save - Save wallet to file')