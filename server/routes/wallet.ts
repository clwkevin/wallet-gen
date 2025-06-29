import { generateWallet } from '../services/walletGenerator'
import { deriveWalletAddress } from '../services/walletDerivation'
import { saveWalletToFile } from '../services/walletStorage'
import { addCorsHeaders } from '../middleware/cors'

export async function walletRoutes(
  request: Request, 
  pathname: string, 
  method: string
): Promise<Response> {
  
  if (method === 'POST' && pathname === '/generate') {
    return addCorsHeaders(await handleGenerateWallet())
  }

  if (method === 'POST' && pathname === '/derive') {
    return addCorsHeaders(await handleDeriveWallet(request))
  }

  if (method === 'POST' && pathname === '/save') {
    return addCorsHeaders(await handleSaveWallet(request))
  }

  return new Response('Not Found', { status: 404 })
}

async function handleGenerateWallet(): Promise<Response> {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      try {
        await generateWallet((status: string, wallet?: any) => {
          if (wallet) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ status, wallet })}\n\n`)
            )
          } else {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ status })}\n\n`)
            )
          }
        })
        
        controller.close()
      } catch (error: any) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ status: 'ERROR: ' + error.message })}\n\n`)
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

async function handleDeriveWallet(request: Request): Promise<Response> {
  try {
    const data = await request.json()
    const result = await deriveWalletAddress(data)
    
    return Response.json({
      success: true,
      ...result
    })
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}

async function handleSaveWallet(request: Request): Promise<Response> {
  try {
    const walletData = await request.json()
    const result = await saveWalletToFile(walletData)
    
    return Response.json({
      success: true,
      ...result
    })
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}