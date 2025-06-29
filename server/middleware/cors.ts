export function cors(request: Request): Response | null {
  const origin = request.headers.get('origin')
  const method = request.method

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  }

  // Handle preflight requests
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  return null
}

export function addCorsHeaders(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}