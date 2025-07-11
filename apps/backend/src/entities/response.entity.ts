import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Message } from './message.entity';

@Entity('responses')
export class Response {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    aiModel: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    responseTime: number;
    confidence: number;
    cacheHit?: boolean;
    personalizationContext?: {
      streamerId: string;
      streamId: string;
      userId?: string;
      messageType: string;
      chatHistory: Array<{
        authorId: string;
        content: string;
        timestamp: Date;
      }>;
    };
  };

  @Column({ default: 'generated' })
  status: 'generated' | 'sent' | 'failed' | 'cancelled';

  @Column({ type: 'jsonb', nullable: true })
  feedback: {
    streamerRating?: number; // 1-5 rating
    wasHelpful?: boolean;
    wasAccurate?: boolean;
    feedbackNote?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  effectiveness: {
    responseTime: number;
    viewerEngagement?: number;
    followUpQuestions?: number;
    streamerApproval?: boolean;
  };

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Message, (message) => message.response)
  @JoinColumn({ name: 'messageId' })
  message: Message;
}
