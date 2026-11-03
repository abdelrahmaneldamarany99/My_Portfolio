import express from 'express';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { apiRouter } from './server/routes/api.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    const origin = req.headers.origin || '*';
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use('/api', apiRouter);

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    try {
      const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
      if (url.pathname === '/api/live') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      }
    } catch (e) {
      console.error('Upgrade routing error:', e);
    }
  });

  wss.on('connection', async (clientWs) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      clientWs.send(
        JSON.stringify({
          status: 'connected',
          info: 'Gemini Live voice bridge connected (API Key not detected, running in interactive telemetry mode).',
          hasApiKey: false,
        })
      );

      clientWs.on('message', (raw) => {
        try {
          const data = JSON.parse(raw.toString());
          if (data.ping) {
            clientWs.send(JSON.stringify({ pong: true, timestamp: Date.now() }));
          }
        } catch {
          // ignore
        }
      });
      return;
    }

    try {
      const { GoogleGenAI, Modality } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction:
            'You are the real-time AI Voice Assistant for Abdelrahman Eldamarany, Senior Full-Stack Engineer with 7+ years of experience in React, Next.js, Node.js, Express, MongoDB, TypeScript, and 3+ years in AI/ML. Converse naturally, concisely, and technically in either English or Arabic based on what the user speaks.',
        },
        callbacks: {
          onmessage: (message) => {
            const parts = message.serverContent?.modelTurn?.parts ?? [];
            for (const part of parts) {
              if (part.inlineData?.data) {
                clientWs.send(JSON.stringify({ audio: part.inlineData.data }));
              }
            }
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onclose: () => {
            if (clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({ closed: true }));
            }
          },
          onerror: (err) => {
            console.error('Gemini Live session callback error:', err);
            if (clientWs.readyState === clientWs.OPEN) {
              clientWs.send(
                JSON.stringify({
                  error: err instanceof Error ? err.message : String(err),
                })
              );
            }
          },
        },
      });

      clientWs.send(
        JSON.stringify({
          status: 'connected',
          info: 'Connected to gemini-3.8-live session',
          hasApiKey: true,
        })
      );

      clientWs.on('message', (raw) => {
        try {
          const data = JSON.parse(raw.toString());
          if (data.audio) {
            session.sendRealtimeInput({
              audio: { data: data.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          } else if (data.text) {
            session.sendRealtimeInput({
              text: data.text,
            });
          }
        } catch (err) {
          console.error('Error forwarding input to Gemini Live session:', err);
        }
      });

      clientWs.on('close', () => {
        try {
          session.close();
        } catch {
          // ignore
        }
      });
    } catch (err) {
      console.error('Failed to establish Gemini Live API session:', err);
      if (clientWs.readyState === clientWs.OPEN) {
        clientWs.send(
          JSON.stringify({
            status: 'fallback',
            error: err instanceof Error ? err.message : 'Live session unavailable',
            hasApiKey: false,
          })
        );
      }
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

