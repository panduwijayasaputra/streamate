import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Streamer } from './streamer.entity';
import { Message } from './message.entity';
import { Question } from './question.entity';

@Entity('streams')
export class Stream {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  streamerId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  platform: string; // 'youtube', 'twitch', etc.

  @Column({ nullable: true })
  platformStreamId: string;

  @Column({ nullable: true })
  platformChannelId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    game?: string;
    category?: string;
    tags?: string[];
    language?: string;
    isLive: boolean;
    viewerCount?: number;
    startedAt?: Date;
    endedAt?: Date;
  };

  @Column({ type: 'jsonb', nullable: true })
  settings: {
    aiEnabled: boolean;
    responseFrequency: number;
    questionAggregation: boolean;
    autoRespond: boolean;
  };

  @Column({ default: 'active' })
  status: 'active' | 'ended' | 'paused';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Streamer, (streamer) => streamer.streams)
  @JoinColumn({ name: 'streamerId' })
  streamer: Streamer;

  @OneToMany(() => Message, (message) => message.stream)
  messages: Message[];

  @OneToMany(() => Question, (question) => question.stream)
  questions: Question[];
}
