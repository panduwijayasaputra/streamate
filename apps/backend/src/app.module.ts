import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { YouTubeService } from './services/youtube.service';
import { YouTubeChatService } from './services/youtube-chat.service';
import { ChatFilterService } from './services/chat-filter.service';
import { ChatQueueService } from './services/chat-queue.service';
import { ChatGateway } from './gateways/chat.gateway';
import { MessageStorageService } from './services/message-storage.service';
import { AIResponseService } from './services/ai-response.service';
import { OpenAIService } from './services/openai.service';
import { StreamerProfileService } from './services/streamer-profile.service';
import { ResponseCacheService } from './services/response-cache.service';
import { ResponseFrequencyLimiterService } from './services/response-frequency-limiter.service';
import { ResponseQualityService } from './services/response-quality.service';
import { EscalationService } from './services/escalation.service';
import {
  Streamer,
  Stream,
  Message,
  Response,
  Question,
  Context,
  StreamerProfile,
  ResponseFeedback,
  EscalationRule,
  EscalationEvent,
} from './entities';
import { MessageStorageController } from './controllers/message-storage.controller';
import { ResponseQualityController } from './controllers/response-quality.controller';
import { EscalationController } from './controllers/escalation.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'streamate',
      entities: [
        Streamer,
        Stream,
        Message,
        Response,
        Question,
        Context,
        StreamerProfile,
        ResponseFeedback,
        EscalationRule,
        EscalationEvent,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Streamer,
      Stream,
      Message,
      Response,
      Question,
      Context,
      StreamerProfile,
      ResponseFeedback,
      EscalationRule,
      EscalationEvent,
    ]),
  ],
  controllers: [
    MessageStorageController,
    ResponseQualityController,
    EscalationController,
  ],
  providers: [
    YouTubeService,
    YouTubeChatService,
    ChatFilterService,
    ChatQueueService,
    ChatGateway,
    MessageStorageService,
    AIResponseService,
    OpenAIService,
    StreamerProfileService,
    ResponseCacheService,
    ResponseFrequencyLimiterService,
    ResponseQualityService,
    EscalationService,
  ],
})
export class AppModule {}
