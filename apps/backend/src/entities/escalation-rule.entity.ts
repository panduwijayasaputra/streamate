import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EscalationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum EscalationTrigger {
  KEYWORD_MATCH = 'keyword_match',
  PATTERN_MATCH = 'pattern_match',
  FREQUENCY_THRESHOLD = 'frequency_threshold',
  USER_IMPORTANCE = 'user_importance',
  CONTENT_SENTIMENT = 'content_sentiment',
  CUSTOM_RULE = 'custom_rule',
}

@Entity('escalation_rules')
export class EscalationRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  streamerId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: EscalationTrigger,
    default: EscalationTrigger.KEYWORD_MATCH,
  })
  triggerType: EscalationTrigger;

  @Column({
    type: 'enum',
    enum: EscalationPriority,
    default: EscalationPriority.MEDIUM,
  })
  priority: EscalationPriority;

  @Column({ type: 'jsonb', nullable: true })
  triggerConfig: {
    keywords?: string[];
    patterns?: string[];
    frequencyThreshold?: number;
    userImportanceLevel?: string;
    sentimentThreshold?: number;
    customConditions?: Record<string, any>;
  };

  @Column({ type: 'jsonb', nullable: true })
  actionConfig: {
    notifyStreamer: boolean;
    sendToDashboard: boolean;
    createAlert: boolean;
    autoResponse?: string;
    cooldownPeriod?: number; // in seconds
    maxEscalationsPerHour?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  conditions: {
    streamContext?: string[];
    timeOfDay?: {
      start: string;
      end: string;
    };
    userRoles?: string[];
    messageLength?: {
      min: number;
      max: number;
    };
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastTriggered: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
