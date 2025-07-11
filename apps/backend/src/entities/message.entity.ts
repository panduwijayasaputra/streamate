import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Stream } from './stream.entity';
import { Response } from './response.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  streamId: string;

  @Column()
  platformMessageId: string;

  @Column()
  authorId: string;

  @Column()
  authorName: string;

  @Column({ nullable: true })
  authorAvatar: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    isModerator?: boolean;
    isSubscriber?: boolean;
    badges?: string[];
    emotes?: any[];
    timestamp: Date;
  };

  @Column({ default: 'pending' })
  processingStatus: 'pending' | 'processed' | 'ignored' | 'error';

  @Column({ type: 'jsonb', nullable: true })
  analysis: {
    isQuestion: boolean;
    questionType?: 'game-specific' | 'general' | 'technical';
    sentiment?: 'positive' | 'negative' | 'neutral';
    priority?: 'low' | 'medium' | 'high';
    keywords?: string[];
  };

  @Column({ default: false })
  requiresResponse: boolean;

  @Column({ default: false })
  isEscalated: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Stream, (stream) => stream.messages)
  @JoinColumn({ name: 'streamId' })
  stream: Stream;

  @OneToOne(() => Response, (response) => response.message)
  response: Response;
}
