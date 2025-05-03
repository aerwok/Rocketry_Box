import { toast } from 'sonner';
import { WebSocketMessage, WebSocketEvent } from '@/types/api';

export class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private baseURL: string;
  private eventHandlers: Map<WebSocketEvent, ((data: any) => void)[]> = new Map();

  constructor() {
    this.baseURL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
    this.connect();
  }

  connect() {
    try {
      this.socket = new WebSocket(this.baseURL);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage<any> = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectTimeout * this.reconnectAttempts);
    } else {
      toast.error('Failed to connect to WebSocket server');
    }
  }

  private handleMessage(message: WebSocketMessage<any>) {
    const handlers = this.eventHandlers.get(message.event);
    if (handlers) {
      handlers.forEach(handler => handler(message.data));
    }
  }

  on(event: WebSocketEvent, handler: (data: any) => void) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(handler);
  }

  off(event: WebSocketEvent, handler: (data: any) => void) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  send(event: WebSocketEvent, data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage<any> = {
        event,
        data,
        timestamp: new Date().toISOString(),
      };
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
} 