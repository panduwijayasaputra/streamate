import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('streamer_profiles')
export class StreamerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  streamerId: string;

  @Column()
  streamerName: string;

  @Column({ type: 'jsonb', nullable: true })
  personality: {
    tone:
      | 'casual'
      | 'formal'
      | 'energetic'
      | 'calm'
      | 'humorous'
      | 'professional';
    languageStyle:
      | 'indonesian'
      | 'english'
      | 'mixed'
      | 'slang-heavy'
      | 'formal-indonesian';
    responseLength: 'short' | 'medium' | 'long';
    emojiUsage: 'none' | 'minimal' | 'moderate' | 'heavy';
    humorLevel: 'none' | 'subtle' | 'moderate' | 'high';
    formalityLevel: 'very-casual' | 'casual' | 'semi-formal' | 'formal';
  };

  @Column({ type: 'jsonb', nullable: true })
  aiPreferences: {
    responseStyle: string;
    commonPhrases: string[];
    avoidPhrases: string[];
    favoriteTopics: string[];
    audienceType: 'gaming' | 'educational' | 'entertainment' | 'mixed';
    interactionStyle: 'friendly' | 'professional' | 'casual' | 'energetic';
  };

  @Column({ type: 'jsonb', nullable: true })
  contextSettings: {
    rememberUserInteractions: boolean;
    useChatHistory: boolean;
    adaptToAudienceMood: boolean;
    respondToQuestions: boolean;
    engageWithComments: boolean;
    maxContextMessages: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  customPrompts: {
    greeting: string;
    farewell: string;
    questionResponse: string;
    commentResponse: string;
    systemPrompt: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
