import { registerAs } from '@nestjs/config';

export default registerAs('youtube', () => ({
  apiKey: process.env.YOUTUBE_API_KEY || '',
  clientId: process.env.YOUTUBE_CLIENT_ID || '',
  clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
  redirectUri:
    process.env.YOUTUBE_REDIRECT_URI ||
    'http://localhost:3000/auth/youtube/callback',
  scopes: [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.force-ssl',
  ],
  chatPollInterval: parseInt(process.env.YOUTUBE_CHAT_POLL_INTERVAL || '5000'), // 5 seconds
  maxChatHistory: parseInt(process.env.YOUTUBE_MAX_CHAT_HISTORY || '1000'),
  rateLimitPerMinute: parseInt(
    process.env.YOUTUBE_RATE_LIMIT_PER_MINUTE || '100',
  ),
}));
