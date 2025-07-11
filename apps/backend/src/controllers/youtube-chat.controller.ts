import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import {
  YouTubeChatService,
  ChatConnection,
  ConnectionStats,
} from '../services/youtube-chat.service';

@Controller('youtube-chat')
export class YouTubeChatController {
  constructor(private readonly youtubeChatService: YouTubeChatService) {}

  @Post('connect/:videoId')
  async startConnection(
    @Param('videoId') videoId: string,
    @Body() body: { channelId: string },
  ): Promise<{ success: boolean; connection?: ChatConnection }> {
    try {
      const connection = await this.youtubeChatService.startChatConnection(
        videoId,
        body.channelId,
      );

      if (connection) {
        return { success: true, connection };
      } else {
        return { success: false };
      }
    } catch {
      return { success: false };
    }
  }

  @Delete('disconnect/:liveChatId')
  stopConnection(@Param('liveChatId') liveChatId: string): {
    success: boolean;
  } {
    try {
      const success = this.youtubeChatService.stopChatConnection(liveChatId);
      return { success };
    } catch {
      return { success: false };
    }
  }

  @Get('connections')
  getActiveConnections(): { connections: ChatConnection[] } {
    const connections = this.youtubeChatService.getActiveConnections();
    return { connections };
  }

  @Get('connection/:liveChatId')
  getConnectionStatus(@Param('liveChatId') liveChatId: string): {
    connection: ChatConnection | null;
  } {
    const connection = this.youtubeChatService.getConnectionStatus(liveChatId);
    return { connection };
  }

  @Get('stats/:liveChatId')
  getConnectionStats(@Param('liveChatId') liveChatId: string): {
    stats: ConnectionStats | null;
  } {
    const stats = this.youtubeChatService.getConnectionStats(liveChatId);
    return { stats };
  }

  @Post('reconnect/:liveChatId')
  async forceReconnect(
    @Param('liveChatId') liveChatId: string,
  ): Promise<{ success: boolean }> {
    try {
      const success = await this.youtubeChatService.forceReconnect(liveChatId);
      return { success };
    } catch {
      return { success: false };
    }
  }

  @Post('message/:liveChatId')
  async sendMessage(
    @Param('liveChatId') liveChatId: string,
    @Body() body: { message: string },
  ): Promise<{ success: boolean }> {
    try {
      const success = await this.youtubeChatService.sendMessage(
        liveChatId,
        body.message,
      );
      return { success };
    } catch {
      return { success: false };
    }
  }
}
