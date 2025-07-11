export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
}

export interface ApiConfig {
  youtubeApiKey: string;
  openaiApiKey: string;
  jwtSecret: string;
  youtubeClientId: string;
  youtubeClientSecret: string;
  youtubeRedirectUri: string;
  youtubeChatPollInterval: number;
  youtubeMaxChatHistory: number;
  youtubeRateLimitPerMinute: number;
}

export interface Config {
  database: DatabaseConfig;
  app: AppConfig;
  api: ApiConfig;
}

export default (): Config => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'streamate',
  },
  app: {
    port: parseInt(process.env.PORT || '3001', 10) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  api: {
    youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    youtubeClientId: process.env.YOUTUBE_CLIENT_ID || '',
    youtubeClientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
    youtubeRedirectUri:
      process.env.YOUTUBE_REDIRECT_URI ||
      'http://localhost:3000/auth/youtube/callback',
    youtubeChatPollInterval: parseInt(
      process.env.YOUTUBE_CHAT_POLL_INTERVAL || '5000',
    ),
    youtubeMaxChatHistory: parseInt(
      process.env.YOUTUBE_MAX_CHAT_HISTORY || '1000',
    ),
    youtubeRateLimitPerMinute: parseInt(
      process.env.YOUTUBE_RATE_LIMIT_PER_MINUTE || '100',
    ),
  },
});
