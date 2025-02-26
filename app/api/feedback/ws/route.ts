import { NextResponse } from 'next/server'
import { WebSocketServer } from 'ws'

let wss: WebSocketServer | null = null

export function GET() {
  if (!wss) {
    wss = new WebSocketServer({ noServer: true })

    wss.on('connection', (ws) => {
      console.log('Client connected')

      ws.on('close', () => {
        console.log('Client disconnected')
      })
    })
  }

  // Return a response to acknowledge the WebSocket upgrade request
  return new NextResponse(null, {
    status: 101,
    headers: {
      'Upgrade': 'websocket',
      'Connection': 'Upgrade'
    }
  })
}

// Export the WebSocket server instance so it can be used by other routes
export { wss }