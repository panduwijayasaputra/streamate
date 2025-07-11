import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  YouTubeChatService,
  ChatMessageEvent,
} from '../services/youtube-chat.service';
import { ChatQueueService, QueueStats } from '../services/chat-queue.service';

interface ChatMessage {
  id: string;
  streamId: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
  metadata?: any;
  filteredContent?: string;
  isSpam?: boolean;
  isRelevant?: boolean;
  confidence?: number;
}

interface AIResponse {
  id: string;
  messageId: string;
  content: string;
  confidence: number;
  responseTime: number;
}

interface TrendingQuestion {
  id: string;
  content: string;
  frequency: number;
  category: string;
  priority: string;
}

interface StreamStats {
  streamId: string;
  messageCount: number;
  viewerCount: number;
  responseCount: number;
  trendingQuestions: TrendingQuestion[];
  queueStats?: QueueStats;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private connectedClients = new Map<
    string,
    { socket: Socket; streamId?: string; liveChatId?: string }
  >();

  constructor(
    private readonly youtubeChatService: YouTubeChatService,
    private readonly chatQueueService: ChatQueueService,
  ) {
    // Listen for processed messages from the queue
    this.youtubeChatService.onMessage((event: ChatMessageEvent) => {
      this.broadcastChatMessage(event);
    });
  }

  afterInit() {
    this.logger.log('Chat WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    const clientId = client.id;
    this.connectedClients.set(clientId, { socket: client });
    this.logger.log(`Client connected: ${clientId}`);

    // Send initial connection info
    client.emit('connected', {
      clientId,
      timestamp: new Date(),
      queueStats: this.chatQueueService.getStats(),
    });
  }

  handleDisconnect(client: Socket) {
    const clientId = client.id;
    this.connectedClients.delete(clientId);
    this.logger.log(`Client disconnected: ${clientId}`);
  }

  @SubscribeMessage('join-stream')
  async handleJoinStream(
    client: Socket,
    payload: { videoId: string; channelId: string },
  ) {
    const { videoId, channelId } = payload;

    try {
      // Start YouTube chat connection
      const connection = await this.youtubeChatService.startChatConnection(
        videoId,
        channelId,
      );

      if (connection) {
        const clientData = this.connectedClients.get(client.id);
        if (clientData) {
          clientData.streamId = videoId;
          clientData.liveChatId = connection.liveChatId;
          client.join(`stream:${videoId}`);

          this.logger.log(`Client ${client.id} joined stream: ${videoId}`);

          // Send confirmation to client
          client.emit('stream-joined', {
            streamId: videoId,
            liveChatId: connection.liveChatId,
            timestamp: new Date(),
          });

          // Send initial stats
          const stats = this.youtubeChatService.getConnectionStats(
            connection.liveChatId,
          );
          if (stats) {
            client.emit('connection-stats', stats);
          }
        }
      } else {
        client.emit('error', {
          code: 'CONNECTION_FAILED',
          message: 'Failed to connect to YouTube chat',
        });
      }
    } catch (error) {
      this.logger.error(`Error joining stream: ${error}`);
      client.emit('error', {
        code: 'JOIN_ERROR',
        message: 'Error joining stream',
      });
    }
  }

  @SubscribeMessage('leave-stream')
  handleLeaveStream(client: Socket, payload: { streamId: string }) {
    const { streamId } = payload;
    client.leave(`stream:${streamId}`);

    const clientData = this.connectedClients.get(client.id);
    if (clientData) {
      // Stop YouTube chat connection if this was the last client
      if (clientData.liveChatId) {
        const remainingClients = this.getConnectedClientsForStream(streamId);
        if (remainingClients.length <= 1) {
          this.youtubeChatService.stopChatConnection(clientData.liveChatId);
        }
      }

      clientData.streamId = undefined;
      clientData.liveChatId = undefined;
    }

    this.logger.log(`Client ${client.id} left stream: ${streamId}`);
    client.emit('stream-left', { streamId, timestamp: new Date() });
  }

  @SubscribeMessage('get-queue-stats')
  handleGetQueueStats(client: Socket) {
    const stats = this.chatQueueService.getStats();
    client.emit('queue-stats', stats);
  }

  @SubscribeMessage('get-connection-stats')
  handleGetConnectionStats(client: Socket, payload: { liveChatId: string }) {
    const stats = this.youtubeChatService.getConnectionStats(
      payload.liveChatId,
    );
    client.emit('connection-stats', stats);
  }

  @SubscribeMessage('force-reconnect')
  async handleForceReconnect(client: Socket, payload: { liveChatId: string }) {
    try {
      const success = await this.youtubeChatService.forceReconnect(
        payload.liveChatId,
      );
      client.emit('reconnect-result', {
        success,
        liveChatId: payload.liveChatId,
      });
    } catch {
      client.emit('error', {
        code: 'RECONNECT_ERROR',
        message: 'Error reconnecting to chat',
      });
    }
  }

  // Method to broadcast new chat messages to stream room
  private broadcastChatMessage(event: ChatMessageEvent) {
    const chatMessage: ChatMessage = {
      id: event.message.id,
      streamId: event.videoId,
      authorId: event.message.authorId,
      authorName: event.message.authorName,
      content: event.message.content,
      timestamp: event.message.timestamp,
      metadata: event.message.metadata,
      filteredContent: event.filteredMessage?.filteredContent,
      isSpam: event.filteredMessage?.isSpam,
      isRelevant: event.filteredMessage?.isRelevant,
      confidence: event.filteredMessage?.confidence,
    };

    this.server.to(`stream:${event.videoId}`).emit('new-message', chatMessage);
    this.logger.debug(`Broadcasted message to stream: ${event.videoId}`);
  }

  // Method to broadcast AI responses to stream room
  broadcastAIResponse(streamId: string, response: AIResponse) {
    this.server.to(`stream:${streamId}`).emit('ai-response', response);
    this.logger.log(`Broadcasted AI response to stream: ${streamId}`);
  }

  // Method to broadcast trending questions to stream room
  broadcastTrendingQuestions(streamId: string, questions: TrendingQuestion[]) {
    this.server.to(`stream:${streamId}`).emit('question-trend', { questions });
    this.logger.log(`Broadcasted trending questions to stream: ${streamId}`);
  }

  // Method to broadcast stream statistics to stream room
  broadcastStreamStats(streamId: string, stats: StreamStats) {
    // Add queue stats to stream stats
    const queueStats = this.chatQueueService.getStats();
    stats.queueStats = queueStats;

    this.server.to(`stream:${streamId}`).emit('stream-stats', stats);
    this.logger.log(`Broadcasted stream stats to stream: ${streamId}`);
  }

  // Method to broadcast queue stats to all clients
  broadcastQueueStats() {
    const stats = this.chatQueueService.getStats();
    this.server.emit('queue-stats-update', stats);
  }

  // Method to send error messages to specific client
  sendError(clientId: string, error: { code: string; message: string }) {
    const clientData = this.connectedClients.get(clientId);
    if (clientData) {
      clientData.socket.emit('error', error);
    }
  }

  // Method to get connected clients for a specific stream
  getConnectedClientsForStream(streamId: string): string[] {
    const clients: string[] = [];
    this.connectedClients.forEach((clientData, clientId) => {
      if (clientData.streamId === streamId) {
        clients.push(clientId);
      }
    });
    return clients;
  }

  // Method to get total connected clients count
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  // Method to get queue statistics
  getQueueStats() {
    return this.chatQueueService.getStats();
  }
}
