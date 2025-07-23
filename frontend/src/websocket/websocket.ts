import { WebSocketMessage, ChatAnalysisAlert } from "@/types/common";
import { ChatMessage, AIResponse, Stream } from "@/types/stream";

// WebSocket Service
export class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();
  private isConnecting = false;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  // Connect to WebSocket
  async connect(): Promise<void> {
    if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      this.socket = new WebSocket(this.baseUrl);

      this.socket.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.emit("connected", {});
      };

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.socket.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        this.isConnecting = false;
        this.emit("disconnected", { code: event.code, reason: event.reason });

        if (
          !event.wasClean &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.scheduleReconnect();
        }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
        this.emit("error", error);
      };
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      this.isConnecting = false;
      this.emit("error", error);
    }
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, "Client disconnect");
      this.socket = null;
    }
    this.isConnecting = false;
  }

  // Send message to WebSocket
  send(type: string, data: Record<string, unknown>): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: type as WebSocketMessage["type"],
        data,
        timestamp: new Date(),
      };
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  }

  // Subscribe to specific message types
  subscribe<T = unknown>(
    type: string,
    callback: (data: T) => void
  ): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback as (data: unknown) => void);

    // Return unsubscribe function
    return () => {
      const typeListeners = this.listeners.get(type);
      if (typeListeners) {
        typeListeners.delete(callback as (data: unknown) => void);
        if (typeListeners.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  // Subscribe to chat messages
  onChatMessage(callback: (message: ChatMessage) => void): () => void {
    return this.subscribe<ChatMessage>("chat_message", callback);
  }

  // Subscribe to AI responses
  onAIResponse(callback: (response: AIResponse) => void): () => void {
    return this.subscribe<AIResponse>("ai_response", callback);
  }

  // Subscribe to stream status updates
  onStreamStatus(callback: (status: Stream) => void): () => void {
    return this.subscribe<Stream>("stream_status", callback);
  }

  // Subscribe to alerts
  onAlert(callback: (alert: ChatAnalysisAlert) => void): () => void {
    return this.subscribe<ChatAnalysisAlert>("alert", callback);
  }

  // Subscribe to heartbeat
  onHeartbeat(callback: (data: unknown) => void): () => void {
    return this.subscribe("heartbeat", callback);
  }

  // Subscribe to viewer updates
  onViewerUpdate(callback: (data: unknown) => void): () => void {
    return this.subscribe("viewer_update", callback);
  }

  // Subscribe to engagement updates
  onEngagementUpdate(callback: (data: unknown) => void): () => void {
    return this.subscribe("engagement_update", callback);
  }

  // Subscribe to connection events
  onConnected(callback: () => void): () => void {
    return this.subscribe("connected", callback);
  }

  onDisconnected(
    callback: (data: { code: number; reason: string }) => void
  ): () => void {
    return this.subscribe<{ code: number; reason: string }>(
      "disconnected",
      callback
    );
  }

  onError(callback: (error: unknown) => void): () => void {
    return this.subscribe("error", callback);
  }

  // Handle incoming messages
  private handleMessage(message: WebSocketMessage): void {
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(message.data);
        } catch (error) {
          console.error("Error in WebSocket listener:", error);
        }
      });
    }
  }

  // Emit event to listeners
  private emit(type: string, data: unknown): void {
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error("Error in WebSocket listener:", error);
        }
      });
    }
  }

  // Schedule reconnection
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      if (this.socket?.readyState !== WebSocket.OPEN) {
        console.log(
          `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );
        this.connect();
      }
    }, delay);
  }

  // Get connection status
  getConnectionStatus(): "connecting" | "connected" | "disconnected" | "error" {
    if (this.isConnecting) return "connecting";
    if (this.socket?.readyState === WebSocket.OPEN) return "connected";
    if (this.socket?.readyState === WebSocket.CLOSED) return "disconnected";
    return "error";
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  // Send chat message
  sendChatMessage(message: Omit<ChatMessage, "id" | "timestamp">): void {
    this.send("chat_message", message);
  }

  // Request AI response
  requestAIResponse(messageId: string, characterId: string): void {
    this.send("ai_response_request", { messageId, characterId });
  }

  // Update stream status
  updateStreamStatus(status: Partial<Stream>): void {
    this.send("stream_status_update", status);
  }

  // Update response rate
  updateResponseRate(rate: number): void {
    this.send("response_rate_update", { rate });
  }

  // Clear chat
  clearChat(): void {
    this.send("clear_chat", {});
  }

  // Mark alert as read
  markAlertAsRead(alertId: string): void {
    this.send("mark_alert_read", { alertId });
  }
}

// Export singleton instance
export const websocketService = WebSocketService.getInstance();

// WebSocket Hook for React components
export const useWebSocket = () => {
  return websocketService;
};
