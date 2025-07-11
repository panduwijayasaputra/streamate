import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { ChatGateway } from './gateways/chat.gateway';
import { DashboardGateway } from './gateways/dashboard.gateway';
import { JwtAuthModule } from './auth/jwt.module';
import { DatabaseService } from './services/database.service';
import { YouTubeService } from './services/youtube.service';
import { YouTubeController } from './controllers/youtube.controller';
import { YouTubeChatService } from './services/youtube-chat.service';
import { YouTubeChatController } from './controllers/youtube-chat.controller';
import { ChatFilterService } from './services/chat-filter.service';
import { ChatFilterController } from './controllers/chat-filter.controller';
import { ChatQueueService } from './services/chat-queue.service';
import { ChatQueueController } from './controllers/chat-queue.controller';
import { MessageStorageService } from './services/message-storage.service';
import { MessageStorageController } from './controllers/message-storage.controller';
import { OpenAIService } from './services/openai.service';
import { OpenAIController } from './controllers/openai.controller';
import { AIResponseService } from './services/ai-response.service';
import { StreamerProfileController } from './controllers/streamer-profile.controller';
import { Message } from './entities/message.entity';
import { Response } from './entities/response.entity';
import { StreamerProfile } from './entities/streamer-profile.entity';
import configuration from './config/configuration';
import { StreamerProfileService } from './services/streamer-profile.service';
import { ResponseCacheService } from './services/response-cache.service';
import { ResponseCacheController } from './controllers/response-cache.controller';
import { ResponseFrequencyLimiterService } from './services/response-frequency-limiter.service';
import { FrequencyLimiterController } from './controllers/frequency-limiter.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Message, Response, StreamerProfile]),
    JwtAuthModule,
  ],
  controllers: [
    AppController,
    YouTubeController,
    YouTubeChatController,
    ChatFilterController,
    ChatQueueController,
    MessageStorageController,
    OpenAIController,
    StreamerProfileController,
    ResponseCacheController,
    FrequencyLimiterController,
  ],
  providers: [
    ChatGateway,
    DashboardGateway,
    DatabaseService,
    YouTubeService,
    YouTubeChatService,
    ChatFilterService,
    ChatQueueService,
    MessageStorageService,
    OpenAIService,
    AIResponseService,
    StreamerProfileService,
    ResponseCacheService,
    ResponseFrequencyLimiterService,
  ],
})
export class AppModule implements NestModule {
  configure() {
    // Temporarily disabled middleware to debug 500 error
  }
}
