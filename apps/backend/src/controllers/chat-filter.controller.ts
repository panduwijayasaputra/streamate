import { Controller, Post, Body } from '@nestjs/common';
import { ChatFilterService } from '../services/chat-filter.service';

@Controller('chat-filter')
export class ChatFilterController {
  constructor(private readonly chatFilterService: ChatFilterService) {}

  @Post('filter')
  filterMessage(@Body('message') message: string) {
    return this.chatFilterService.filterMessage(message);
  }

  // @Get('config')
  // getConfig(): FilterConfig {
  //   return this.chatFilterService.getConfig();
  // }

  // @Put('config')
  // updateConfig(@Body() newConfig: Partial<FilterConfig>): { success: boolean } {
  //   try {
  //     this.chatFilterService.updateConfig(newConfig);
  //     return { success: true };
  //   } catch {
  //     return { success: false };
  //   }
  // }

  // @Get('stats')
  // getStats(): { totalUsers: number; spamUsers: number } {
  //   return this.chatFilterService.getStats();
  // }

  // @Post('reset-user/:userId')
  // resetUserHistory(@Param('userId') userId: string): { success: boolean } {
  //   try {
  //     this.chatFilterService.resetUserHistory(userId);
  //     return { success: true };
  //   } catch {
  //     return { success: false };
  //   }
  // }
}
