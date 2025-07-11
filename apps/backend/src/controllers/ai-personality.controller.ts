import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { AIPersonalityService } from '../services/ai-personality.service';

@Controller('ai-personality')
export class AIPersonalityController {
  constructor(private readonly aiPersonalityService: AIPersonalityService) {}

  @Get('templates')
  getPersonalityTemplates() {
    return this.aiPersonalityService.getPersonalityTemplates();
  }

  @Post('streamer/:streamerId/apply-template/:templateId')
  async applyPersonalityTemplate(
    @Param('streamerId') streamerId: string,
    @Param('templateId') templateId: string,
  ) {
    const updatedProfile =
      await this.aiPersonalityService.applyPersonalityTemplate(
        streamerId,
        templateId,
      );
    return {
      message: `Personality template applied successfully`,
      profile: updatedProfile,
    };
  }

  @Get('streamer/:streamerId/analysis')
  async analyzePersonality(@Param('streamerId') streamerId: string) {
    return await this.aiPersonalityService.analyzePersonality(streamerId);
  }

  @Post('streamer/:streamerId/custom')
  async createCustomPersonality(
    @Param('streamerId') streamerId: string,
    @Body()
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
  ) {
    const updatedProfile =
      await this.aiPersonalityService.createCustomPersonality(
        streamerId,
        preferences,
      );
    return {
      message: `Custom personality created successfully`,
      profile: updatedProfile,
    };
  }

  @Post('streamer/:streamerId/test')
  async testPersonality(
    @Param('streamerId') streamerId: string,
    @Body() testData: { messages: string[] },
  ) {
    return await this.aiPersonalityService.testPersonality(
      streamerId,
      testData.messages,
    );
  }

  @Get('streamer/:streamerId/templates/recommended')
  async getRecommendedTemplates(@Param('streamerId') streamerId: string) {
    const analysis =
      await this.aiPersonalityService.analyzePersonality(streamerId);
    const allTemplates = this.aiPersonalityService.getPersonalityTemplates();

    // Score templates based on current personality
    const scoredTemplates = allTemplates.map((template) => {
      let score = 0;

      // Score based on current personality analysis
      if (analysis.currentPersonality.tone === template.personality.tone) {
        score += 20;
      }

      if (
        analysis.currentPersonality.languageStyle ===
        template.personality.languageStyle
      ) {
        score += 15;
      }

      if (
        analysis.currentPersonality.responseLength ===
        template.personality.responseLength
      ) {
        score += 10;
      }

      if (
        analysis.currentPersonality.emojiUsage ===
        template.personality.emojiUsage
      ) {
        score += 10;
      }

      return {
        ...template,
        matchScore: score,
        recommendation:
          score > 30
            ? 'Highly Recommended'
            : score > 20
              ? 'Recommended'
              : score > 10
                ? 'Good Match'
                : 'Consider',
      };
    });

    // Sort by score descending
    scoredTemplates.sort((a, b) => b.matchScore - a.matchScore);

    return {
      currentAnalysis: analysis,
      recommendedTemplates: scoredTemplates.slice(0, 3), // Top 3 recommendations
      allTemplates: scoredTemplates,
    };
  }
}
