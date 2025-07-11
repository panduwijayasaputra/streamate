import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StreamerProfile } from '../entities/streamer-profile.entity';

export interface PersonalityTemplate {
  id: string;
  name: string;
  description: string;
  personality: StreamerProfile['personality'];
  aiPreferences: StreamerProfile['aiPreferences'];
  customPrompts: StreamerProfile['customPrompts'];
  tags: string[];
}

export interface PersonalityAnalysis {
  currentPersonality: {
    tone: string;
    languageStyle: string;
    responseLength: string;
    emojiUsage: string;
    humorLevel: string;
    formalityLevel: string;
  };
  recommendations: {
    suggestedImprovements: string[];
    consistencyScore: number;
    audienceFit: number;
  };
}

@Injectable()
export class AIPersonalityService {
  private readonly logger = new Logger(AIPersonalityService.name);

  constructor(
    @InjectRepository(StreamerProfile)
    private readonly streamerProfileRepository: Repository<StreamerProfile>,
  ) {}

  /**
   * Get available personality templates
   */
  getPersonalityTemplates(): PersonalityTemplate[] {
    return [
      {
        id: 'gaming-enthusiast',
        name: 'Gaming Enthusiast',
        description:
          'Energetic and passionate about gaming, uses gaming slang naturally',
        personality: {
          tone: 'energetic',
          languageStyle: 'mixed',
          responseLength: 'medium',
          emojiUsage: 'moderate',
          humorLevel: 'moderate',
          formalityLevel: 'casual',
        },
        aiPreferences: {
          responseStyle: 'enthusiastic and knowledgeable about gaming',
          commonPhrases: ['mantap', 'keren', 'sick play', 'gg', 'wp'],
          avoidPhrases: ['dong', 'ganteng', 'cantik'],
          favoriteTopics: ['gaming', 'esports', 'competitive gaming'],
          audienceType: 'gaming',
          interactionStyle: 'energetic',
        },
        customPrompts: {
          greeting: 'Yo! Selamat datang di stream gaming! 🎮',
          farewell: 'Thanks for watching! GG everyone! 👋',
          questionResponse: 'Great question! Let me help you with that.',
          commentResponse: 'Thanks for the comment! Appreciate it!',
          systemPrompt:
            'You are an enthusiastic gaming AI assistant. Be passionate about gaming, use gaming terminology naturally, and be supportive of the gaming community.',
        },
        tags: ['gaming', 'energetic', 'competitive'],
      },
      {
        id: 'casual-friendly',
        name: 'Casual & Friendly',
        description: 'Warm and approachable, great for community building',
        personality: {
          tone: 'casual',
          languageStyle: 'mixed',
          responseLength: 'medium',
          emojiUsage: 'minimal',
          humorLevel: 'subtle',
          formalityLevel: 'casual',
        },
        aiPreferences: {
          responseStyle: 'friendly and welcoming',
          commonPhrases: ['halo', 'terima kasih', 'sama-sama', 'oke'],
          avoidPhrases: ['dong', 'ganteng', 'cantik'],
          favoriteTopics: ['community', 'daily life', 'entertainment'],
          audienceType: 'mixed',
          interactionStyle: 'friendly',
        },
        customPrompts: {
          greeting: 'Halo! Selamat datang di stream! 😊',
          farewell: 'Terima kasih sudah mampir! Sampai jumpa! 👋',
          questionResponse: 'Pertanyaan bagus! Mari kita bahas.',
          commentResponse: 'Thanks for sharing! Appreciate it!',
          systemPrompt:
            'You are a friendly AI assistant for Indonesian live streaming. Be warm, welcoming, and genuinely helpful. Use natural Indonesian mixed language.',
        },
        tags: ['friendly', 'community', 'casual'],
      },
      {
        id: 'professional-educator',
        name: 'Professional Educator',
        description:
          'Clear and informative, perfect for tutorial and educational content',
        personality: {
          tone: 'professional',
          languageStyle: 'formal-indonesian',
          responseLength: 'long',
          emojiUsage: 'none',
          humorLevel: 'none',
          formalityLevel: 'semi-formal',
        },
        aiPreferences: {
          responseStyle: 'clear and educational',
          commonPhrases: [
            'berdasarkan',
            'sebagai contoh',
            'dengan demikian',
            'oleh karena itu',
          ],
          avoidPhrases: ['dong', 'ganteng', 'cantik', 'mantap'],
          favoriteTopics: [
            'education',
            'tutorials',
            'learning',
            'explanations',
          ],
          audienceType: 'educational',
          interactionStyle: 'professional',
        },
        customPrompts: {
          greeting: 'Selamat datang di sesi pembelajaran hari ini.',
          farewell: 'Terima kasih telah mengikuti sesi ini. Sampai jumpa!',
          questionResponse: 'Pertanyaan yang sangat baik. Mari saya jelaskan.',
          commentResponse: 'Terima kasih atas komentarnya.',
          systemPrompt:
            'You are a professional educational AI assistant. Provide clear, accurate, and helpful explanations. Use formal Indonesian when appropriate.',
        },
        tags: ['educational', 'professional', 'tutorial'],
      },
      {
        id: 'humorous-entertainer',
        name: 'Humorous Entertainer',
        description:
          'Funny and entertaining, keeps the chat lively and engaging',
        personality: {
          tone: 'humorous',
          languageStyle: 'slang-heavy',
          responseLength: 'medium',
          emojiUsage: 'heavy',
          humorLevel: 'high',
          formalityLevel: 'very-casual',
        },
        aiPreferences: {
          responseStyle: 'entertaining and funny',
          commonPhrases: ['wkwkwk', 'anjir', 'siap', 'gas', 'mantap'],
          avoidPhrases: ['dong', 'ganteng', 'cantik'],
          favoriteTopics: ['entertainment', 'memes', 'funny moments', 'comedy'],
          audienceType: 'entertainment',
          interactionStyle: 'energetic',
        },
        customPrompts: {
          greeting: 'Yo! Selamat datang di stream yang seru! 😂',
          farewell: 'Thanks for the vibes! Sampai jumpa lagi! 👋',
          questionResponse: 'Haha, pertanyaan yang lucu! 😄',
          commentResponse: 'Wkwkwk, comment yang keren! 😂',
          systemPrompt:
            'You are a humorous AI assistant for entertainment streams. Be funny, use memes naturally, and keep the mood light and entertaining.',
        },
        tags: ['humorous', 'entertainment', 'funny'],
      },
      {
        id: 'calm-mindful',
        name: 'Calm & Mindful',
        description: 'Peaceful and thoughtful, great for relaxing streams',
        personality: {
          tone: 'calm',
          languageStyle: 'indonesian',
          responseLength: 'medium',
          emojiUsage: 'minimal',
          humorLevel: 'none',
          formalityLevel: 'casual',
        },
        aiPreferences: {
          responseStyle: 'calm and thoughtful',
          commonPhrases: ['tenang', 'santai', 'baik', 'terima kasih'],
          avoidPhrases: ['dong', 'ganteng', 'cantik', 'wkwkwk'],
          favoriteTopics: [
            'wellness',
            'mindfulness',
            'relaxation',
            'reflection',
          ],
          audienceType: 'mixed',
          interactionStyle: 'casual',
        },
        customPrompts: {
          greeting: 'Selamat datang. Mari kita nikmati waktu bersama.',
          farewell: 'Terima kasih sudah hadir. Sampai jumpa lagi.',
          questionResponse: 'Pertanyaan yang menarik. Mari kita renungkan.',
          commentResponse: 'Terima kasih atas komentarnya.',
          systemPrompt:
            'You are a calm and mindful AI assistant. Be peaceful, thoughtful, and create a relaxing atmosphere.',
        },
        tags: ['calm', 'mindful', 'relaxing'],
      },
    ];
  }

  /**
   * Apply a personality template to a streamer profile
   */
  async applyPersonalityTemplate(
    streamerId: string,
    templateId: string,
  ): Promise<StreamerProfile> {
    try {
      const templates = this.getPersonalityTemplates();
      const template = templates.find((t) => t.id === templateId);

      if (!template) {
        throw new Error(`Personality template '${templateId}' not found`);
      }

      const profile = await this.streamerProfileRepository.findOne({
        where: { streamerId },
      });

      if (!profile) {
        throw new Error(`Streamer profile for ${streamerId} not found`);
      }

      // Update profile with template settings
      profile.personality = template.personality;
      profile.aiPreferences = template.aiPreferences;
      profile.customPrompts = template.customPrompts;

      const updatedProfile = await this.streamerProfileRepository.save(profile);
      this.logger.log(
        `Applied personality template '${template.name}' to streamer ${streamerId}`,
      );

      return updatedProfile;
    } catch (error) {
      this.logger.error(
        `Failed to apply personality template:`,
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  }

  /**
   * Analyze current personality and provide recommendations
   */
  async analyzePersonality(streamerId: string): Promise<PersonalityAnalysis> {
    try {
      const profile = await this.streamerProfileRepository.findOne({
        where: { streamerId },
      });

      if (!profile) {
        throw new Error(`Streamer profile for ${streamerId} not found`);
      }

      const analysis: PersonalityAnalysis = {
        currentPersonality: {
          tone: profile.personality.tone,
          languageStyle: profile.personality.languageStyle,
          responseLength: profile.personality.responseLength,
          emojiUsage: profile.personality.emojiUsage,
          humorLevel: profile.personality.humorLevel,
          formalityLevel: profile.personality.formalityLevel,
        },
        recommendations: {
          suggestedImprovements: this.generateRecommendations(profile),
          consistencyScore: this.calculateConsistencyScore(profile),
          audienceFit: this.calculateAudienceFit(profile),
        },
      };

      return analysis;
    } catch (error) {
      this.logger.error(
        `Failed to analyze personality:`,
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  }

  /**
   * Create a custom personality based on streamer preferences
   */
  async createCustomPersonality(
    streamerId: string,
    preferences: {
      tone: string;
      languageStyle: string;
      responseLength: string;
      emojiUsage: string;
      humorLevel: string;
      formalityLevel: string;
      commonPhrases: string[];
      avoidPhrases: string[];
      favoriteTopics: string[];
    },
  ): Promise<StreamerProfile> {
    try {
      const profile = await this.streamerProfileRepository.findOne({
        where: { streamerId },
      });

      if (!profile) {
        throw new Error(`Streamer profile for ${streamerId} not found`);
      }

      // Update personality settings
      profile.personality = {
        tone: preferences.tone as StreamerProfile['personality']['tone'],
        languageStyle:
          preferences.languageStyle as StreamerProfile['personality']['languageStyle'],
        responseLength:
          preferences.responseLength as StreamerProfile['personality']['responseLength'],
        emojiUsage:
          preferences.emojiUsage as StreamerProfile['personality']['emojiUsage'],
        humorLevel:
          preferences.humorLevel as StreamerProfile['personality']['humorLevel'],
        formalityLevel:
          preferences.formalityLevel as StreamerProfile['personality']['formalityLevel'],
      };

      // Update AI preferences
      profile.aiPreferences = {
        ...profile.aiPreferences,
        commonPhrases: preferences.commonPhrases,
        avoidPhrases: preferences.avoidPhrases,
        favoriteTopics: preferences.favoriteTopics,
      };

      const updatedProfile = await this.streamerProfileRepository.save(profile);
      this.logger.log(`Created custom personality for streamer ${streamerId}`);

      return updatedProfile;
    } catch (error) {
      this.logger.error(
        `Failed to create custom personality:`,
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  }

  /**
   * Test personality with sample messages
   */
  async testPersonality(
    streamerId: string,
    testMessages: string[],
  ): Promise<{
    responses: Array<{
      originalMessage: string;
      generatedResponse: string;
      personalityMatch: number;
    }>;
    averageMatch: number;
  }> {
    try {
      const profile = await this.streamerProfileRepository.findOne({
        where: { streamerId },
      });

      if (!profile) {
        throw new Error(`Streamer profile for ${streamerId} not found`);
      }

      const responses = testMessages.map((message) => {
        const response = this.generateTestResponse(message, profile);
        const personalityMatch = this.calculatePersonalityMatch(
          response,
          profile,
        );

        return {
          originalMessage: message,
          generatedResponse: response,
          personalityMatch,
        };
      });

      const averageMatch =
        responses.reduce((sum, r) => sum + r.personalityMatch, 0) /
        responses.length;

      return {
        responses,
        averageMatch,
      };
    } catch (error) {
      this.logger.error(
        `Failed to test personality:`,
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  }

  /**
   * Generate recommendations based on current personality
   */
  private generateRecommendations(profile: StreamerProfile): string[] {
    const recommendations: string[] = [];

    // Check tone consistency
    if (
      profile.personality.tone === 'energetic' &&
      profile.personality.emojiUsage === 'none'
    ) {
      recommendations.push(
        'Consider using more emojis to match your energetic tone',
      );
    }

    if (
      profile.personality.tone === 'calm' &&
      profile.personality.emojiUsage === 'heavy'
    ) {
      recommendations.push(
        'Consider reducing emoji usage to match your calm tone',
      );
    }

    // Check language style consistency
    if (
      profile.personality.languageStyle === 'formal-indonesian' &&
      profile.personality.formalityLevel === 'very-casual'
    ) {
      recommendations.push(
        'Consider adjusting formality level to match your language style',
      );
    }

    // Check response length appropriateness
    if (
      profile.personality.responseLength === 'long' &&
      profile.personality.tone === 'energetic'
    ) {
      recommendations.push(
        'Consider shorter responses for better engagement with energetic tone',
      );
    }

    // Check humor level appropriateness
    if (
      profile.personality.humorLevel === 'high' &&
      profile.personality.tone === 'professional'
    ) {
      recommendations.push(
        'Consider adjusting humor level to match your professional tone',
      );
    }

    return recommendations;
  }

  /**
   * Calculate consistency score
   */
  private calculateConsistencyScore(profile: StreamerProfile): number {
    let score = 100;

    // Tone and emoji usage consistency
    if (
      profile.personality.tone === 'energetic' &&
      profile.personality.emojiUsage === 'none'
    ) {
      score -= 20;
    }

    if (
      profile.personality.tone === 'calm' &&
      profile.personality.emojiUsage === 'heavy'
    ) {
      score -= 20;
    }

    // Language style and formality consistency
    if (
      profile.personality.languageStyle === 'formal-indonesian' &&
      profile.personality.formalityLevel === 'very-casual'
    ) {
      score -= 15;
    }

    // Response length appropriateness
    if (
      profile.personality.responseLength === 'long' &&
      profile.personality.tone === 'energetic'
    ) {
      score -= 10;
    }

    return Math.max(0, score);
  }

  /**
   * Calculate audience fit score
   */
  private calculateAudienceFit(profile: StreamerProfile): number {
    let score = 100;

    // Gaming audience fit
    if (
      profile.aiPreferences.audienceType === 'gaming' &&
      !profile.aiPreferences.favoriteTopics.includes('gaming')
    ) {
      score -= 20;
    }

    // Educational audience fit
    if (
      profile.aiPreferences.audienceType === 'educational' &&
      profile.personality.tone === 'humorous'
    ) {
      score -= 15;
    }

    // Entertainment audience fit
    if (
      profile.aiPreferences.audienceType === 'entertainment' &&
      profile.personality.tone === 'professional'
    ) {
      score -= 15;
    }

    return Math.max(0, score);
  }

  /**
   * Generate test response for personality testing
   */
  private generateTestResponse(
    message: string,
    profile: StreamerProfile,
  ): string {
    // This is a simplified test response generator
    // In a real implementation, this would use the actual AI service
    const responses = {
      greeting: profile.customPrompts.greeting || 'Halo!',
      question: profile.customPrompts.questionResponse || 'Pertanyaan bagus!',
      comment: profile.customPrompts.commentResponse || 'Thanks!',
      farewell: profile.customPrompts.farewell || 'Sampai jumpa!',
    };

    if (
      message.toLowerCase().includes('halo') ||
      message.toLowerCase().includes('hello')
    ) {
      return responses.greeting;
    } else if (message.includes('?')) {
      return responses.question;
    } else if (
      message.toLowerCase().includes('bye') ||
      message.toLowerCase().includes('sampai')
    ) {
      return responses.farewell;
    } else {
      return responses.comment;
    }
  }

  /**
   * Calculate personality match score
   */
  private calculatePersonalityMatch(
    response: string,
    profile: StreamerProfile,
  ): number {
    let score = 100;

    // Check emoji usage
    const emojiCount = (
      response.match(
        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
      ) || []
    ).length;

    if (profile.personality.emojiUsage === 'none' && emojiCount > 0) {
      score -= 20;
    } else if (profile.personality.emojiUsage === 'heavy' && emojiCount === 0) {
      score -= 20;
    }

    // Check response length
    if (
      profile.personality.responseLength === 'short' &&
      response.length > 100
    ) {
      score -= 15;
    } else if (
      profile.personality.responseLength === 'long' &&
      response.length < 50
    ) {
      score -= 15;
    }

    // Check language style
    if (
      profile.personality.languageStyle === 'english' &&
      typeof response === 'string' &&
      response &&
      response.match(/[a-zA-Z]/g) &&
      response.match(/[a-zA-Z]/g)!.length < response.length * 0.5
    ) {
      score -= 10;
    }

    return Math.max(0, score);
  }
}
