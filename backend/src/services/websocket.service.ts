import { Server as WebSocketServer } from 'ws';
import { Server } from 'http';

let wss: WebSocketServer;

export const initializeWebSocket = (server: Server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
};

export const broadcastUpdate = (data: any) => {
  if (!wss) {
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(data));
    }
  });
};
