// Use the same approach as API calls - go through the Vite dev server proxy
const getWebSocketUrl = () => {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  
  // For development, use the current location with ws protocol
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host; // includes port
  
  // In development mode with Vite proxy, we can connect to the same host
  // The proxy will forward WebSocket connections to the backend
  return `${protocol}//${host}`;
};

const WS_URL = getWebSocketUrl();

type WebSocketCallback = (data: any) => void;
type WebSocketEventType = 'EXECUTION_CREATED' | 'EXECUTION_UPDATED';

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<WebSocketEventType, WebSocketCallback[]> = new Map();

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      console.log('Attempting to connect to WebSocket:', WS_URL);
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const { type, data } = JSON.parse(event.data);
          this.notifyListeners(type, data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.warn('WebSocket connection failed - real-time updates disabled:', error);
        // Don't attempt to reconnect immediately on connection errors in HTTPS environments
        if (window.location.protocol === 'https:') {
          console.log('HTTPS environment detected - WebSocket real-time updates are disabled');
          return;
        }
      };
    } catch (error) {
      console.warn('Failed to create WebSocket connection - real-time updates disabled:', error);
    }
  }

  private attemptReconnect() {
    // Don't attempt reconnection in HTTPS environments where WebSocket might be blocked
    if (window.location.protocol === 'https:' && WS_URL.startsWith('ws:')) {
      console.log('Skipping reconnection - mixed content blocked in HTTPS environment');
      return;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), 3000);
    } else {
      console.log('Max reconnection attempts reached - real-time updates disabled');
    }
  }

  addEventListener(type: WebSocketEventType, callback: WebSocketCallback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)?.push(callback);
  }

  removeEventListener(type: WebSocketEventType, callback: WebSocketCallback) {
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(type: WebSocketEventType, data: any) {
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();
