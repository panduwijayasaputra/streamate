import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface YouTubeChatMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface YouTubeStreamInfo {
  streamId: string;
  channelId: string;
  title: string;
  description?: string;
  isLive: boolean;
  viewerCount?: number;
  startedAt?: Date;
}

@Injectable()
export class YouTubeService {
  private readonly logger = new Logger(YouTubeService.name);
  private oauth2Client: OAuth2Client;
  private youtubeApi: any;
  private rateLimitCounter = 0;
  private lastRateLimitReset = Date.now();

  constructor(private readonly configService: ConfigService) {
    this.initializeYouTubeAPI();
  }

  private initializeYouTubeAPI() {
    const apiKey = this.configService.get<string>('api.youtubeApiKey');
    const clientId = this.configService.get<string>('api.youtubeClientId');
    const clientSecret = this.configService.get<string>(
      'api.youtubeClientSecret',
    );

    if (!apiKey) {
      this.logger.warn('YouTube API key not configured');
      return;
    }

    // Initialize OAuth2 client
    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      this.configService.get<string>('api.youtubeRedirectUri'),
    );

    // Initialize YouTube API
    this.youtubeApi = google.youtube({
      version: 'v3',
      auth: apiKey,
    });

    this.logger.log('YouTube API initialized successfully');
  }

  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.force-ssl',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  async handleAuthCallback(code: string): Promise<any> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      this.logger.log('YouTube authentication successful');
      return tokens;
    } catch (error) {
      this.logger.error('YouTube authentication failed:', error);
      throw error;
    }
  }

  async getLiveStreams(channelId: string): Promise<YouTubeStreamInfo[]> {
    try {
      await this.checkRateLimit();

      const response = await this.youtubeApi.search.list({
        part: 'snippet',
        channelId: channelId,
        type: 'video',
        eventType: 'live',
        maxResults: 50,
      });

      const streams: YouTubeStreamInfo[] = [];

      for (const item of response.data.items || []) {
        const videoId = item.id?.videoId;
        if (videoId) {
          const streamInfo = await this.getStreamDetails(videoId);
          if (streamInfo) {
            streams.push(streamInfo);
          }
        }
      }

      return streams;
    } catch (error) {
      this.logger.error('Failed to get live streams:', error);
      throw error;
    }
  }

  async getStreamDetails(videoId: string): Promise<YouTubeStreamInfo | null> {
    try {
      await this.checkRateLimit();

      const response = await this.youtubeApi.videos.list({
        part: ['snippet', 'liveStreamingDetails', 'statistics'],
        id: [videoId],
      });

      const video = response.data.items?.[0];
      if (!video) return null;

      const liveDetails = video.liveStreamingDetails;
      const isLive = liveDetails?.actualStartTime != null;

      return {
        streamId: videoId,
        channelId: video.snippet?.channelId || '',
        title: video.snippet?.title || '',
        description: video.snippet?.description || undefined,
        isLive,
        viewerCount: liveDetails?.concurrentViewers
          ? parseInt(liveDetails.concurrentViewers)
          : undefined,
        startedAt: liveDetails?.actualStartTime
          ? new Date(liveDetails.actualStartTime)
          : undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to get stream details for ${videoId}:`, error);
      return null;
    }
  }

  async getLiveChatId(videoId: string): Promise<string | null> {
    try {
      await this.checkRateLimit();

      const response = await this.youtubeApi.videos.list({
        part: ['liveStreamingDetails'],
        id: [videoId],
      });

      const video = response.data.items?.[0];
      return video?.liveStreamingDetails?.activeLiveChatId || null;
    } catch (error) {
      this.logger.error(`Failed to get live chat ID for ${videoId}:`, error);
      return null;
    }
  }

  async getChatMessages(
    liveChatId: string,
    pageToken?: string,
  ): Promise<{
    messages: YouTubeChatMessage[];
    nextPageToken?: string;
    pollingIntervalMillis?: number;
  }> {
    try {
      await this.checkRateLimit();

      const response = await this.youtubeApi.liveChatMessages.list({
        part: ['snippet', 'authorDetails'],
        liveChatId: liveChatId,
        maxResults: 200,
        pageToken: pageToken,
      });

      const messages: YouTubeChatMessage[] = [];

      for (const item of response.data.items || []) {
        const message: YouTubeChatMessage = {
          id: item.id || '',
          authorId: item.authorDetails?.channelId || '',
          authorName: item.authorDetails?.displayName || '',
          authorAvatar: item.authorDetails?.profileImageUrl || undefined,
          content: item.snippet?.displayMessage || '',
          timestamp: new Date(item.snippet?.publishedAt || Date.now()),
          metadata: {
            messageType: item.snippet?.type || '',
            userBadges: undefined, // badge property doesn't exist in the type
            isModerator: item.authorDetails?.isChatModerator || false,
            isOwner: item.authorDetails?.isChatOwner || false,
            isSponsor: item.authorDetails?.isChatSponsor || false,
          },
        };

        messages.push(message);
      }

      return {
        messages,
        nextPageToken: response.data.nextPageToken || undefined,
        pollingIntervalMillis: response.data.pollingIntervalMillis || undefined,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get chat messages for ${liveChatId}:`,
        error,
      );
      throw error;
    }
  }

  async insertChatMessage(liveChatId: string, message: string): Promise<any> {
    try {
      await this.checkRateLimit();

      const response = await this.youtubeApi.liveChatMessages.insert({
        part: ['snippet'],
        requestBody: {
          snippet: {
            liveChatId: liveChatId,
            type: 'textMessageEvent',
            textMessageDetails: {
              messageText: message,
            },
          },
        },
      });

      this.logger.log(`Message sent to chat: ${message}`);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to send chat message:', error);
      throw error;
    }
  }

  private async checkRateLimit(): Promise<void> {
    const rateLimit =
      this.configService.get<number>('api.youtubeRateLimitPerMinute') || 100;
    const now = Date.now();

    // Reset counter if a minute has passed
    if (now - this.lastRateLimitReset > 60000) {
      this.rateLimitCounter = 0;
      this.lastRateLimitReset = now;
    }

    // Check if we're at the rate limit
    if (this.rateLimitCounter >= rateLimit) {
      const waitTime = 60000 - (now - this.lastRateLimitReset);
      this.logger.warn(`Rate limit reached, waiting ${waitTime}ms`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      this.rateLimitCounter = 0;
      this.lastRateLimitReset = Date.now();
    }

    this.rateLimitCounter++;
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.youtubeApi.channels.list({
        part: ['snippet'],
        id: ['UC_x5XG1OV2P6uZZ5FSM9Ttw'], // Google Developers channel
        maxResults: 1,
      });
      return true;
    } catch (error) {
      this.logger.error('YouTube API key validation failed:', error);
      return false;
    }
  }

  async getChannelInfo(channelId: string): Promise<any> {
    try {
      await this.checkRateLimit();

      const response = await this.youtubeApi.channels.list({
        part: ['snippet', 'statistics'],
        id: [channelId],
      });

      return response.data.items?.[0] || null;
    } catch (error) {
      this.logger.error(`Failed to get channel info for ${channelId}:`, error);
      throw error;
    }
  }
}
