import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'plugin-inspect-react-code'

// ═══════════════════════════════════════════════════════════════════
// GLOBAL STATE: Active SSE client connections & notification history
// ═══════════════════════════════════════════════════════════════════
const sseClients = new Set();
const notificationHistory = [];
const MAX_HISTORY = 100;

// Helper: Add to history (FIFO, max 100)
function addToHistory(notification) {
  notificationHistory.unshift(notification);
  if (notificationHistory.length > MAX_HISTORY) {
    notificationHistory.pop();
  }
}

// Helper: Broadcast notification to all connected SSE clients
function broadcastNotification(notification) {
  const message = `data: ${JSON.stringify(notification)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.write(message);
    } catch (err) {
      // Client disconnected, remove from set
      sseClients.delete(client);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// VITE CONFIG WITH NOTIFICATION MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    inspectAttr(), 
    react(),
    {
      name: 'notification-sse-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // ─────────────────────────────────────────────────────────
          // SSE STREAM ENDPOINT: /api/notifications/stream
          // ─────────────────────────────────────────────────────────
          if (req.url === '/api/notifications/stream' && req.method === 'GET') {
            console.log('[SSE] New client connected');
            
            // Send SSE headers
            res.writeHead(200, {
              'Content-Type': 'text/event-stream; charset=utf-8',
              'Cache-Control': 'no-cache, no-transform',
              'Connection': 'keep-alive',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type',
              'X-Accel-Buffering': 'no',
              'Transfer-Encoding': 'chunked'
            });
            
            // Send comment to open connection
            res.write(': SSE connection established\n\n');
            
            // Send recent notification history to client
            notificationHistory.slice(0, 5).reverse().forEach(notif => {
              res.write(`data: ${JSON.stringify(notif)}\n\n`);
            });

            // Add client to active set
            sseClients.add(res);

            // Heartbeat to keep connection alive
            const heartbeat = setInterval(() => {
              if (res.writable) {
                res.write(': heartbeat\n\n');
              }
            }, 25000);

            // Cleanup on disconnect
            req.on('close', () => {
              clearInterval(heartbeat);
              sseClients.delete(res);
              console.log(`[SSE] Client disconnected (active: ${sseClients.size})`);
            });

            req.on('error', (err) => {
              clearInterval(heartbeat);
              sseClients.delete(res);
              console.error('[SSE] Connection error:', err);
            });

            return; // ✅ STOP MIDDLEWARE CHAIN
          }

          // ─────────────────────────────────────────────────────────
          // CORS PREFLIGHT: /api/notifications/ingest
          // ─────────────────────────────────────────────────────────
          if (req.url === '/api/notifications/ingest' && req.method === 'OPTIONS') {
            res.writeHead(200, {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              'Access-Control-Max-Age': '3600'
            });
            res.end();
            return; // ✅ STOP MIDDLEWARE CHAIN
          }

          // ─────────────────────────────────────────────────────────
          // INGEST ENDPOINT: POST /api/notifications/ingest
          // ─────────────────────────────────────────────────────────
          if (req.url === '/api/notifications/ingest' && req.method === 'POST') {
            let body = '';
            let hasTimedOut = false;

            // Timeout protection: 5 seconds max
            const timeout = setTimeout(() => {
              hasTimedOut = true;
              console.error('[INGEST] Request body parsing timeout');
              res.writeHead(408, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Request timeout' }));
            }, 5000);

            // Collect request body
            req.on('data', (chunk) => {
              if (!hasTimedOut) {
                body += chunk.toString('utf8');
                // Prevent huge payloads
                if (body.length > 10 * 1024) {
                  clearTimeout(timeout);
                  hasTimedOut = true;
                  res.writeHead(413, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Payload too large' }));
                }
              }
            });

            req.on('end', () => {
              if (hasTimedOut) return;
              clearTimeout(timeout);

              try {
                const data = JSON.parse(body);
                
                // Generate unique ID and timestamp
                const id = data.id || `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`;
                const timestamp = new Date().toISOString();
                const timeDisplay = new Date().toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit',
                  hour12: false
                });

                // Construct notification object
                const notification = {
                  id,
                  app: String(data.app || 'System').substring(0, 50),
                  sender: String(data.sender || 'Unknown Source').substring(0, 100),
                  body: String(data.body || '').substring(0, 1000),
                  time: timeDisplay,
                  timestamp,
                  analyzing: true
                };

                console.log(`[INGEST] Received notification: ${notification.id}`, {
                  app: notification.app,
                  sender: notification.sender
                });

                // Store in history
                addToHistory(notification);

                // Broadcast to all connected SSE clients
                broadcastNotification(notification);

                // Send success response
                res.writeHead(200, {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ 
                  success: true, 
                  notification,
                  connectedClients: sseClients.size
                }));

                console.log(`[INGEST] Broadcasted to ${sseClients.size} SSE clients`);
              } catch (err) {
                console.error('[INGEST] Error parsing JSON:', err.message);
                res.writeHead(400, {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ error: 'Invalid JSON body', details: err.message }));
              }
            });

            req.on('error', (err) => {
              clearTimeout(timeout);
              console.error('[INGEST] Request stream error:', err.message);
              if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Server error' }));
              }
            });

            return; // ✅ STOP MIDDLEWARE CHAIN
          }

          // Pass through to next middleware
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api/openrouter': {
        target: 'https://openrouter.ai/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openrouter/, ''),
      }
    }
  }
});
