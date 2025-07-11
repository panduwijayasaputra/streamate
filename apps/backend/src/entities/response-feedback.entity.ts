import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Response } from './response.entity';

export enum FeedbackType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
}

export enum FeedbackReason {
  HELPFUL = 'helpful',
  ACCURATE = 'accurate',
  RELEVANT = 'relevant',
  ENGAGING = 'engaging',
  UNHELPFUL = 'unhelpful',
  INACCURATE = 'inaccurate',
  IRRELEVANT = 'irrelevant',
  BORING = 'boring',
  REPETITIVE = 'repetitive',
  INAPPROPRIATE = 'inappropriate',
}

@Entity('response_feedback')
export class ResponseFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  responseId: string;

  @ManyToOne(() => Response, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'responseId' })
  response: Response;

  @Column({ type: 'uuid' })
  streamerId: string;

  @Column({ type: 'uuid' })
  streamId: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({
    type: 'enum',
    enum: FeedbackType,
    default: FeedbackType.NEUTRAL,
  })
  feedbackType: FeedbackType;

  @Column({
    type: 'enum',
    enum: FeedbackReason,
    nullable: true,
  })
  feedbackReason: FeedbackReason;

  @Column({ type: 'text', nullable: true })
  userComment: string;

  @Column({ type: 'int', default: 1 })
  rating: number; // 1-5 scale

  @Column({ type: 'jsonb', nullable: true })
  context: {
    originalMessage: string;
    aiResponse: string;
    chatHistory: string[];
    streamContext: string;
    userInteractions: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  learningData: {
    responsePattern: string;
    userPreference: string;
    improvementSuggestion: string;
    similarResponses: string[];
  };

  @Column({ default: false })
  isProcessed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
