import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Streamer } from './streamer.entity';

@Entity('contexts')
export class Context {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'game' })
  type: 'game' | 'stream-category' | 'custom';

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    gameName?: string;
    platform?: string;
    genre?: string;
    tags?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    releaseDate?: Date;
  };

  @Column({ type: 'jsonb', nullable: true })
  knowledgeBase: {
    commonQuestions: string[];
    terminology: string[];
    strategies: string[];
    tips: string[];
    resources: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  aiSettings: {
    personality: string;
    responseStyle: string;
    expertiseLevel: 'beginner' | 'intermediate' | 'expert';
    responseTemplates: string[];
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Streamer)
  @JoinTable({
    name: 'streamer_contexts',
    joinColumn: { name: 'contextId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'streamerId', referencedColumnName: 'id' },
  })
  streamers: Streamer[];
}
