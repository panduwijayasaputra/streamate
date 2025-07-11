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

interface DashboardStats {
  streamId: string;
  totalMessages: number;
  totalResponses: number;
  averageResponseTime: number;
  viewerEngagement: number;
  trendingQuestions: any[];
  aiPerformance: {
    accuracy: number;
    helpfulness: number;
    responseRate: number;
  };
}

interface AISettings {
  personality: string;
  responseStyle: string;
  knowledgeAreas: string[];
  responseSensitivity: number;
  autoRespond: boolean;
  responseFrequency: number;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/dashboard',
})
export class DashboardGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(DashboardGateway.name);
  private connectedStreamers = new Map<
    string,
    { socket: Socket; streamerId?: string }
  >();

  afterInit() {
    this.logger.log('Dashboard WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    const clientId = client.id;
    this.connectedStreamers.set(clientId, { socket: client });
    this.logger.log(`Streamer dashboard connected: ${clientId}`);
  }

  handleDisconnect(client: Socket) {
    const clientId = client.id;
    this.connectedStreamers.delete(clientId);
    this.logger.log(`Streamer dashboard disconnected: ${clientId}`);
  }

  @SubscribeMessage('join-dashboard')
  handleJoinDashboard(client: Socket, payload: { streamerId: string }) {
    const { streamerId } = payload;
    const clientData = this.connectedStreamers.get(client.id);

    if (clientData) {
      clientData.streamerId = streamerId;
      client.join(`streamer:${streamerId}`);
      this.logger.log(`Streamer ${streamerId} joined dashboard`);

      client.emit('dashboard-joined', { streamerId, timestamp: new Date() });
    }
  }

  @SubscribeMessage('update-ai-settings')
  handleUpdateAISettings(
    client: Socket,
    payload: { streamerId: string; settings: AISettings },
  ) {
    const { streamerId, settings } = payload;
    this.logger.log(`AI settings updated for streamer: ${streamerId}`);

    // Broadcast to all streamer's active streams
    this.server
      .to(`streamer:${streamerId}`)
      .emit('ai-settings-updated', { settings });

    client.emit('settings-saved', { timestamp: new Date() });
  }

  @SubscribeMessage('manual-response')
  handleManualResponse(
    client: Socket,
    payload: { messageId: string; response: string; streamId: string },
  ) {
    const { messageId, response, streamId } = payload;
    this.logger.log(`Manual response sent for message: ${messageId}`);

    // Broadcast to the specific stream
    this.server
      .to(`stream:${streamId}`)
      .emit('manual-response', { messageId, response });

    client.emit('response-sent', { messageId, timestamp: new Date() });
  }

  // Method to broadcast dashboard stats to streamer
  broadcastDashboardStats(streamerId: string, stats: DashboardStats) {
    this.server.to(`streamer:${streamerId}`).emit('dashboard-stats', stats);
    this.logger.log(`Broadcasted dashboard stats to streamer: ${streamerId}`);
  }

  // Method to broadcast important questions to streamer
  broadcastImportantQuestions(streamerId: string, questions: any[]) {
    this.server
      .to(`streamer:${streamerId}`)
      .emit('important-questions', { questions });
    this.logger.log(
      `Broadcasted important questions to streamer: ${streamerId}`,
    );
  }

  // Method to broadcast stream alerts to streamer
  broadcastStreamAlert(
    streamerId: string,
    alert: { type: string; message: string; data?: any },
  ) {
    this.server.to(`streamer:${streamerId}`).emit('stream-alert', alert);
    this.logger.log(`Broadcasted stream alert to streamer: ${streamerId}`);
  }

  // Method to send error messages to specific streamer
  sendError(clientId: string, error: { code: string; message: string }) {
    const clientData = this.connectedStreamers.get(clientId);
    if (clientData) {
      clientData.socket.emit('error', error);
    }
  }

  // Method to get connected streamers count
  getConnectedStreamersCount(): number {
    return this.connectedStreamers.size;
  }

  // Method to check if streamer is connected
  isStreamerConnected(streamerId: string): boolean {
    for (const clientData of this.connectedStreamers.values()) {
      if (clientData.streamerId === streamerId) {
        return true;
      }
    }
    return false;
  }
}
