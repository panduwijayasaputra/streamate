import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import {
  ChatFilterService,
  FilteredMessage,
  FilterConfig,
} from '../services/chat-filter.service';
import { YouTubeChatMessage } from '../services/youtube.service';

@Controller('chat-filter')
export class ChatFilterController {
  constructor(private readonly chatFilterService: ChatFilterService) {}

  @Post('test')
  testFilter(@Body() message: YouTubeChatMessage): FilteredMessage {
    return this.chatFilterService.filterMessage(message);
  }

  @Get('config')
  getConfig(): FilterConfig {
    return this.chatFilterService.getConfig();
  }

  @Put('config')
  updateConfig(@Body() newConfig: Partial<FilterConfig>): { success: boolean } {
    try {
      this.chatFilterService.updateConfig(newConfig);
      return { success: true };
    } catch {
      return { success: false };
    }
  }

  @Get('stats')
  getStats(): { totalUsers: number; spamUsers: number } {
    return this.chatFilterService.getStats();
  }

  @Post('reset-user/:userId')
  resetUserHistory(@Param('userId') userId: string): { success: boolean } {
    try {
      this.chatFilterService.resetUserHistory(userId);
      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
