import { Server as WebSocketServer } from 'ws';
import { WebSocket } from 'ws';
import { Server } from 'http';

let wss: WebSocketServer;

export const initializeWebSocket = (server: Server): void => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
};

export const broadcastUpdate = (data: unknown): void => {
  if (!wss) {
    return;
  }

  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};
