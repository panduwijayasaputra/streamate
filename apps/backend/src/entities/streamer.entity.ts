import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Stream } from './stream.entity';

@Entity('streamers')
export class Streamer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  aiSettings: {
    personality: string;
    responseStyle: string;
    knowledgeAreas: string[];
    responseSensitivity: number;
    autoRespond: boolean;
    responseFrequency: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  apiKeys: {
    youtubeApiKey?: string;
    openaiApiKey?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  preferences: {
    theme: string;
    notifications: boolean;
    defaultStreamSettings: any;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Stream, (stream) => stream.streamer)
  streams: Stream[];
}
