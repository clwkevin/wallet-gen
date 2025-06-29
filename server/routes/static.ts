import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const STATIC_FILES = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/assets/logo.svg': 'assets/logo.svg',
  '/fonts/national-regular.woff2': 'public/fonts/national-regular.woff2',
  '/fonts/founders-grotesk-bold.woff2': 'public/fonts/founders-grotesk-bold.woff2',
}

function getContentType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase()
  
  switch (ext) {
    case 'html': return 'text/html'
    case 'css': return 'text/css'
    case 'js': return 'application/javascript'
    case 'json': return 'application/json'
    case 'svg': return 'image/svg+xml'
    case 'png': return 'image/png'
    case 'jpg':
    case 'jpeg': return 'image/jpeg'
    case 'woff2': return 'font/woff2'
    case 'woff': return 'font/woff'
    case 'ttf': return 'font/ttf'
    default: return 'application/octet-stream'
  }
}

export async function staticRoutes(pathname: string): Promise<Response> {
  // Check if it's a known static file
  const filePath = STATIC_FILES[pathname as keyof typeof STATIC_FILES]
  
  if (filePath) {
    try {
      if (existsSync(filePath)) {
        const content = readFileSync(filePath)
        const contentType = getContentType(filePath)
        
        return new Response(content, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': contentType.startsWith('font/') 
              ? 'public, max-age=31536000' 
              : 'public, max-age=3600'
          }
        })
      }
    } catch (error) {
      console.error(`Error serving ${filePath}:`, error)
    }
  }

  // Try to serve from dist folder (for built frontend assets)
  if (pathname.startsWith('/assets/')) {
    const distPath = join('dist', pathname)
    if (existsSync(distPath)) {
      try {
        const content = readFileSync(distPath)
        const contentType = getContentType(pathname)
        
        return new Response(content, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600'
          }
        })
      } catch (error) {
        console.error(`Error serving ${distPath}:`, error)
      }
    }
  }

  return new Response('Not Found', { status: 404 })
}