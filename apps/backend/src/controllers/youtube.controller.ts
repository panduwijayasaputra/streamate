import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import {
  YouTubeService,
  YouTubeChatMessage,
  YouTubeStreamInfo,
} from '../services/youtube.service';

@Controller('youtube')
export class YouTubeController {
  constructor(private readonly youtubeService: YouTubeService) {}

  @Get('auth/url')
  async getAuthUrl(): Promise<{ authUrl: string }> {
    const authUrl = await this.youtubeService.getAuthUrl();
    return { authUrl };
  }

  @Get('auth/callback')
  async handleAuthCallback(
    @Query('code') code: string,
  ): Promise<{ success: boolean; tokens?: unknown }> {
    try {
      const tokens = await this.youtubeService.handleAuthCallback(code);
      return { success: true, tokens: tokens as unknown };
    } catch {
      return { success: false };
    }
  }

  @Get('streams/:channelId')
  async getLiveStreams(
    @Param('channelId') channelId: string,
  ): Promise<YouTubeStreamInfo[]> {
    return this.youtubeService.getLiveStreams(channelId);
  }

  @Get('stream/:videoId')
  async getStreamDetails(
    @Param('videoId') videoId: string,
  ): Promise<YouTubeStreamInfo | null> {
    return this.youtubeService.getStreamDetails(videoId);
  }

  @Get('stream/:videoId/chat-id')
  async getLiveChatId(
    @Param('videoId') videoId: string,
  ): Promise<{ chatId: string | null }> {
    const chatId = await this.youtubeService.getLiveChatId(videoId);
    return { chatId };
  }

  @Get('chat/:liveChatId/messages')
  async getChatMessages(
    @Param('liveChatId') liveChatId: string,
    @Query('pageToken') pageToken?: string,
  ): Promise<{
    messages: YouTubeChatMessage[];
    nextPageToken?: string;
    pollingIntervalMillis?: number;
  }> {
    return this.youtubeService.getChatMessages(liveChatId, pageToken);
  }

  @Post('chat/:liveChatId/message')
  async sendChatMessage(
    @Param('liveChatId') liveChatId: string,
    @Body() body: { message: string },
  ): Promise<{ success: boolean; messageId?: string }> {
    try {
      const result = await this.youtubeService.insertChatMessage(
        liveChatId,
        body.message,
      );
      return { success: true, messageId: (result as { id: string })?.id };
    } catch {
      return { success: false };
    }
  }

  @Get('channel/:channelId')
  async getChannelInfo(
    @Param('channelId') channelId: string,
  ): Promise<unknown> {
    return this.youtubeService.getChannelInfo(channelId);
  }

  @Get('validate')
  async validateApiKey(): Promise<{ valid: boolean }> {
    const valid = await this.youtubeService.validateApiKey();
    return { valid };
  }
}
