import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StreamerProfile } from '../entities/streamer-profile.entity';

export interface PersonalizationContext {
  streamerId: string;
  streamId: string;
  userId?: string;
  messageType: 'question' | 'comment' | 'greeting' | 'farewell';
  chatHistory: Array<{
    authorId: string;
    content: string;
    timestamp: Date;
  }>;
  userInteractionHistory?: Array<{
    messageId: string;
    content: string;
    timestamp: Date;
    aiResponse?: string;
  }>;
}

@Injectable()
export class StreamerProfileService {
  private readonly logger = new Logger(StreamerProfileService.name);

  constructor(
    @InjectRepository(StreamerProfile)
    private readonly streamerProfileRepository: Repository<StreamerProfile>,
  ) {}

  async getStreamerProfile(
    streamerId: string,
  ): Promise<StreamerProfile | null> {
    try {
      const profile = await this.streamerProfileRepository.findOne({
        where: { streamerId, isActive: true },
      });
      return profile;
    } catch (error) {
      this.logger.error(
        `Failed to get streamer profile for ${streamerId}:`,
        error,
      );
      return null;
    }
  }

  async createStreamerProfile(profileData: {
    streamerId: string;
    streamerName: string;
    personality?: StreamerProfile['personality'];
    aiPreferences?: StreamerProfile['aiPreferences'];
    contextSettings?: StreamerProfile['contextSettings'];
    customPrompts?: StreamerProfile['customPrompts'];
  }): Promise<StreamerProfile> {
    try {
      const profile = this.streamerProfileRepository.create({
        ...profileData,
        personality: profileData.personality || this.getDefaultPersonality(),
        aiPreferences:
          profileData.aiPreferences || this.getDefaultAIPreferences(),
        contextSettings:
          profileData.contextSettings || this.getDefaultContextSettings(),
        customPrompts:
          profileData.customPrompts || this.getDefaultCustomPrompts(),
      });

      const savedProfile = await this.streamerProfileRepository.save(profile);
      this.logger.log(
        `Created streamer profile for ${profileData.streamerName}`,
      );
      return savedProfile;
    } catch (error) {
      this.logger.error(`Failed to create streamer profile:`, error);
      throw error;
    }
  }

  async updateStreamerProfile(
    streamerId: string,
    updates: Partial<StreamerProfile>,
  ): Promise<StreamerProfile | null> {
    try {
      const profile = await this.getStreamerProfile(streamerId);
      if (!profile) {
        return null;
      }

      Object.assign(profile, updates);
      const updatedProfile = await this.streamerProfileRepository.save(profile);
      this.logger.log(`Updated streamer profile for ${streamerId}`);
      return updatedProfile;
    } catch (error) {
      this.logger.error(`Failed to update streamer profile:`, error);
      return null;
    }
  }

  async generatePersonalizedSystemPrompt(
    context: PersonalizationContext,
  ): Promise<string> {
    const profile = await this.getStreamerProfile(context.streamerId);

    if (!profile) {
      return this.getDefaultSystemPrompt();
    }

    const { personality, aiPreferences, customPrompts } = profile;

    let prompt = customPrompts?.systemPrompt || this.getDefaultSystemPrompt();

    // Add personality-based instructions
    prompt += `\n\nPersonality: You are ${profile.streamerName}'s AI assistant. `;

    // Tone instructions
    switch (personality.tone) {
      case 'casual':
        prompt += 'Be casual and friendly. ';
        break;
      case 'energetic':
        prompt += 'Be energetic and enthusiastic. ';
        break;
      case 'humorous':
        prompt += 'Be funny and witty when appropriate. ';
        break;
      case 'professional':
        prompt += 'Be professional and informative. ';
        break;
    }

    // Language style instructions
    switch (personality.languageStyle) {
      case 'indonesian':
        prompt += 'Respond primarily in Indonesian. ';
        break;
      case 'english':
        prompt += 'Respond primarily in English. ';
        break;
      case 'mixed':
        prompt +=
          'Respond naturally in Indonesian mixed language (Bahasa Indonesia + English). ';
        break;
      case 'slang-heavy':
        prompt += 'Use Indonesian slang and casual expressions naturally. ';
        break;
    }

    // Response length
    switch (personality.responseLength) {
      case 'short':
        prompt += 'Keep responses brief (under 100 characters). ';
        break;
      case 'medium':
        prompt += 'Keep responses moderate (100-200 characters). ';
        break;
      case 'long':
        prompt += 'Responses can be longer (200+ characters) when needed. ';
        break;
    }

    // Emoji usage
    switch (personality.emojiUsage) {
      case 'none':
        prompt += 'Do not use emojis. ';
        break;
      case 'minimal':
        prompt += 'Use emojis sparingly (1-2 max). ';
        break;
      case 'moderate':
        prompt += 'Use emojis moderately (2-3 max). ';
        break;
      case 'heavy':
        prompt += 'Feel free to use emojis naturally. ';
        break;
    }

    // Avoid phrases
    if (aiPreferences.avoidPhrases && aiPreferences.avoidPhrases.length > 0) {
      prompt += `\nAvoid using these phrases: ${aiPreferences.avoidPhrases.join(', ')}. `;
    }

    // Common phrases
    if (aiPreferences.commonPhrases && aiPreferences.commonPhrases.length > 0) {
      prompt += `\nYou can use these phrases naturally: ${aiPreferences.commonPhrases.join(', ')}. `;
    }

    // Context awareness
    if (context.chatHistory.length > 0) {
      prompt += `\n\nRecent chat context: ${context.chatHistory
        .slice(-3)
        .map((msg) => `${msg.authorId}: ${msg.content}`)
        .join(' | ')}`;
    }

    return prompt;
  }

  private getDefaultPersonality(): StreamerProfile['personality'] {
    return {
      tone: 'casual',
      languageStyle: 'mixed',
      responseLength: 'medium',
      emojiUsage: 'minimal',
      humorLevel: 'subtle',
      formalityLevel: 'casual',
    };
  }

  private getDefaultAIPreferences(): StreamerProfile['aiPreferences'] {
    return {
      responseStyle: 'friendly and helpful',
      commonPhrases: ['mantap', 'keren', 'oke', 'sip'],
      avoidPhrases: ['dong', 'ganteng', 'cantik'],
      favoriteTopics: ['gaming', 'streaming', 'entertainment'],
      audienceType: 'mixed',
      interactionStyle: 'friendly',
    };
  }

  private getDefaultContextSettings(): StreamerProfile['contextSettings'] {
    return {
      rememberUserInteractions: true,
      useChatHistory: true,
      adaptToAudienceMood: true,
      respondToQuestions: true,
      engageWithComments: true,
      maxContextMessages: 10,
    };
  }

  private getDefaultCustomPrompts(): StreamerProfile['customPrompts'] {
    return {
      greeting: 'Halo! Selamat datang di stream!',
      farewell: 'Terima kasih sudah mampir! Sampai jumpa!',
      questionResponse: 'Pertanyaan bagus!',
      commentResponse: 'Thanks for the comment!',
      systemPrompt:
        'You are a helpful AI assistant for Indonesian live streaming.',
    };
  }

  private getDefaultSystemPrompt(): string {
    return 'You are a helpful AI assistant for Indonesian live streaming. Respond naturally in Indonesian mixed language (Bahasa Indonesia + English) like locals do. Be casual, friendly, and authentic. IMPORTANT: Do NOT use repetitive words like "dong", "ganteng", "cantik" etc. Be creative and varied in your responses. Use natural Indonesian expressions without being repetitive. Keep responses under 200 characters and be genuinely helpful.';
  }
}
