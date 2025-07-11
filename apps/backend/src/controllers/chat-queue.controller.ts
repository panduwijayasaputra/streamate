import { Controller, Get, Put, Post, Body } from '@nestjs/common';
import {
  ChatQueueService,
  QueueStats,
  QueueConfig,
} from '../services/chat-queue.service';

@Controller('chat-queue')
export class ChatQueueController {
  constructor(private readonly chatQueueService: ChatQueueService) {}

  @Get('stats')
  getStats(): QueueStats {
    return this.chatQueueService.getStats();
  }

  @Get('config')
  getConfig(): QueueConfig {
    return this.chatQueueService.getConfig();
  }

  @Put('config')
  updateConfig(@Body() newConfig: Partial<QueueConfig>): { success: boolean } {
    try {
      this.chatQueueService.updateConfig(newConfig);
      return { success: true };
    } catch {
      return { success: false };
    }
  }

  @Post('clear')
  clearQueue(): { success: boolean } {
    try {
      this.chatQueueService.clearQueue();
      return { success: true };
    } catch {
      return { success: false };
    }
  }

  @Post('stop')
  stopProcessing(): { success: boolean } {
    try {
      this.chatQueueService.stopProcessing();
      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
