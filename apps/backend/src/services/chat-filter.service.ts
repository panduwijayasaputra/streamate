import { Injectable, Logger } from '@nestjs/common';

export interface ChatFilterConfig {
  enabled: boolean;
  maxLength: number;
  inappropriateKeywords: string[];
  spamPatterns: (string | RegExp)[];
  indonesianSlangs: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
}

export interface FilterResult {
  isApproved: boolean;
  filteredContent?: string;
  reason?: string;
  flags: string[];
  isSpam: boolean;
  isRelevant: boolean;
  confidence: number;
  metadata?: {
    isModerator?: boolean;
    isOwner?: boolean;
    isSubscriber?: boolean;
    badges?: string[];
  };
}

@Injectable()
export class ChatFilterService {
  private readonly logger = new Logger(ChatFilterService.name);

  private readonly defaultConfig: ChatFilterConfig = {
    enabled: true,
    maxLength: 500,
    inappropriateKeywords: [
      'kontol',
      'memek',
      'anjing',
      'bangsat',
      'bajingan',
      'jancok',
      'jancuk',
      'asu',
      'babi',
      'tolol',
      'goblok',
      'bodoh',
      'idiot',
      'dungu',
      'bego',
      'otak udang',
    ],
    spamPatterns: [
      /(.)\1{4,}/, // Repeated characters like "aaaaa"
      /(.)\1{2,}(.)\2{2,}/, // Repeated patterns like "aaa bbb"
      /(.){1,3}\s*\1{1,3}\s*\1{1,3}/, // Repeated short words
    ],
    indonesianSlangs: {
      positive: [
        'mantap',
        'keren',
        'bagus',
        'oke',
        'sip',
        'wow',
        'amazing',
        'gokil',
        'kocak',
        'lucu',
        'seru',
        'asik',
        'enak',
        'nyaman',
      ],
      negative: [
        'jelek',
        'buruk',
        'sial',
        'celaka',
        'sialan',
        'brengsek',
        'kampret',
        'bangsat',
        'anjing',
        'babi',
        'tolol',
        'goblok',
      ],
      neutral: [
        'dong',
        'lah',
        'kan',
        'sih',
        'nih',
        'itu',
        'ini',
        'gitu',
        'gini',
        'banget',
        'banget',
        'amit',
        'waduh',
        'aduh',
      ],
    },
  };

  constructor() {}

  filterMessage(
    content: string,
    config?: Partial<ChatFilterConfig>,
  ): FilterResult {
    const filterConfig = { ...this.defaultConfig, ...config };

    if (!filterConfig.enabled) {
      return {
        isApproved: true,
        flags: [],
        isSpam: false,
        isRelevant: true,
        confidence: 1.0,
      };
    }

    const flags: string[] = [];
    let filteredContent = content;

    // Check length
    if (content.length > filterConfig.maxLength) {
      flags.push('too_long');
      filteredContent = content.substring(0, filterConfig.maxLength) + '...';
    }

    // Check for inappropriate keywords
    const lowerContent = content.toLowerCase();
    const foundKeywords = filterConfig.inappropriateKeywords.filter((keyword) =>
      lowerContent.includes(keyword.toLowerCase()),
    );

    if (foundKeywords.length > 0) {
      return {
        isApproved: false,
        reason: `Contains inappropriate keywords: ${foundKeywords.join(', ')}`,
        flags: ['inappropriate_content'],
        isSpam: true,
        isRelevant: false,
        confidence: 0.1,
      };
    }

    // Check for spam patterns
    for (const pattern of filterConfig.spamPatterns) {
      if (
        typeof pattern === 'string'
          ? content.includes(pattern)
          : pattern.test(content)
      ) {
        return {
          isApproved: false,
          reason: 'Detected spam pattern',
          flags: ['spam_pattern'],
          isSpam: true,
          isRelevant: false,
          confidence: 0.2,
        };
      }
    }

    // Check for excessive slang usage
    const slangCount = this.countSlangUsage(
      content,
      filterConfig.indonesianSlangs,
    );
    if (slangCount.excessive) {
      flags.push('excessive_slang');
      this.logger.warn(`Excessive slang usage detected: ${content}`);
    }

    // Check for repetitive content
    if (this.isRepetitive(content)) {
      flags.push('repetitive_content');
      this.logger.warn(`Repetitive content detected: ${content}`);
    }

    return {
      isApproved: true,
      filteredContent,
      flags,
      isSpam: flags.includes('spam_pattern'),
      isRelevant:
        !flags.includes('spam_pattern') &&
        !flags.includes('inappropriate_content'),
      confidence: flags.length === 0 ? 1.0 : 0.8,
    };
  }

  private countSlangUsage(
    content: string,
    slangs: ChatFilterConfig['indonesianSlangs'],
  ): {
    positive: number;
    negative: number;
    neutral: number;
    excessive: boolean;
  } {
    const lowerContent = content.toLowerCase();

    const positive = slangs.positive.filter((slang) =>
      lowerContent.includes(slang.toLowerCase()),
    ).length;

    const negative = slangs.negative.filter((slang) =>
      lowerContent.includes(slang.toLowerCase()),
    ).length;

    const neutral = slangs.neutral.filter((slang) =>
      lowerContent.includes(slang.toLowerCase()),
    ).length;

    const total = positive + negative + neutral;
    const excessive = total > 3; // More than 3 slang words is excessive

    return { positive, negative, neutral, excessive };
  }

  private isRepetitive(content: string): boolean {
    // Check for repeated words
    const words = content.toLowerCase().split(/\s+/);
    const wordCount: { [key: string]: number } = {};

    for (const word of words) {
      if (word.length > 2) {
        // Only count words longer than 2 chars
        wordCount[word] = (wordCount[word] || 0) + 1;
        if (wordCount[word] > 3) {
          // Word repeated more than 3 times
          return true;
        }
      }
    }

    // Check for repeated phrases
    const phrases = content.toLowerCase().split(/[.!?]/);
    const phraseCount: { [key: string]: number } = {};

    for (const phrase of phrases) {
      const trimmed = phrase.trim();
      if (trimmed.length > 5) {
        phraseCount[trimmed] = (phraseCount[trimmed] || 0) + 1;
        if (phraseCount[trimmed] > 2) {
          // Phrase repeated more than 2 times
          return true;
        }
      }
    }

    return false;
  }

  sanitizeMessage(content: string): string {
    // Remove excessive whitespace
    let sanitized = content.replace(/\s+/g, ' ').trim();

    // Remove excessive punctuation
    sanitized = sanitized.replace(/[.!?]{3,}/g, '...');
    sanitized = sanitized.replace(/[,]{2,}/g, ',');

    // Remove excessive emojis (more than 3 consecutive)
    sanitized = sanitized.replace(
      /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]){4,}/gu,
      '...',
    );

    return sanitized;
  }
}
