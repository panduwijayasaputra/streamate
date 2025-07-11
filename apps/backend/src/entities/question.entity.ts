import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Stream } from './stream.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  streamId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  normalizedContent: string; // For duplicate detection

  @Column({ default: 'general' })
  category: 'game-specific' | 'general' | 'technical' | 'personal' | 'other';

  @Column({ default: 'low' })
  priority: 'low' | 'medium' | 'high' | 'urgent';

  @Column({ default: 1 })
  frequency: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    firstAskedAt: Date;
    lastAskedAt: Date;
    askerIds: string[];
    totalAskers: number;
    averageViewerCount: number;
    tags?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  analysis: {
    sentiment: 'positive' | 'negative' | 'neutral';
    complexity: 'simple' | 'moderate' | 'complex';
    urgency: 'low' | 'medium' | 'high';
    keywords: string[];
  };

  @Column({ default: false })
  isAnswered: boolean;

  @Column({ default: false })
  isEscalated: boolean;

  @Column({ type: 'jsonb', nullable: true })
  aiResponse: {
    content?: string;
    confidence?: number;
    wasHelpful?: boolean;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Stream, (stream) => stream.questions)
  @JoinColumn({ name: 'streamId' })
  stream: Stream;
}
