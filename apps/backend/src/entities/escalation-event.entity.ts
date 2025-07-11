import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EscalationRule } from './escalation-rule.entity';
import { Message } from './message.entity';

export enum EscalationStatus {
  PENDING = 'pending',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  IGNORED = 'ignored',
}

@Entity('escalation_events')
export class EscalationEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ruleId: string;

  @ManyToOne(() => EscalationRule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ruleId' })
  rule: EscalationRule;

  @Column({ type: 'uuid' })
  messageId: string;

  @ManyToOne(() => Message, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'messageId' })
  message: Message;

  @Column()
  streamerId: string;

  @Column()
  streamId: string;

  @Column()
  userId: string;

  @Column()
  userName: string;

  @Column({ type: 'text' })
  messageContent: string;

  @Column({
    type: 'enum',
    enum: EscalationStatus,
    default: EscalationStatus.PENDING,
  })
  status: EscalationStatus;

  @Column({ type: 'jsonb', nullable: true })
  triggerData: {
    matchedKeywords?: string[];
    matchedPatterns?: string[];
    frequencyCount?: number;
    userImportance?: string;
    sentimentScore?: number;
    customData?: Record<string, any>;
  };

  @Column({ type: 'jsonb', nullable: true })
  resolutionData: {
    resolvedBy?: string;
    resolutionNote?: string;
    resolutionTime?: Date;
    actionTaken?: string;
  };

  @Column({ type: 'timestamp', nullable: true })
  acknowledgedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @Column({ type: 'text', nullable: true })
  streamerNote: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
