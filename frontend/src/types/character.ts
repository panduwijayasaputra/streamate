// Character System Types

// Character Enums
export enum VoiceType {
  CHEERFUL = "cheerful",
  CALM = "calm",
  ENERGETIC = "energetic",
  SOPHISTICATED = "sophisticated",
  CUTE = "cute",
}

export enum LanguageStyle {
  FORMAL = "formal",
  CASUAL = "casual",
  SLANG = "slang",
  MIXED = "mixed",
}

export enum ResponseLength {
  SHORT = "short",
  MEDIUM = "medium",
  LONG = "long",
}

export enum EmojiUsage {
  MINIMAL = "minimal",
  MODERATE = "moderate",
  HEAVY = "heavy",
}

export interface Character {
  id: string;
  name: string;
  displayName: string;
  description: string;
  personality: string;
  avatar: string;
  spriteSheet: string;
  voiceType: VoiceType;
  languageStyle: LanguageStyle;
  responseLength: ResponseLength;
  emojiUsage: EmojiUsage;
  topics: string[];
  catchphrases: string[];
  bubbleStyle: BubbleStyle;
  animationStates: AnimationStates;
}

export interface BubbleStyle {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  fontSize: number;
  fontFamily: string;
  padding: number;
  maxWidth: number;
  shadow: boolean;
}

export interface AnimationStates {
  idle: AnimationConfig;
  talking: AnimationConfig;
  excited: AnimationConfig;
  thinking: AnimationConfig;
}

export interface AnimationConfig {
  frameCount: number;
  frameDuration: number;
  loop: boolean;
  spriteRow: number;
}

export interface CharacterSelection {
  selectedCharacterId: string;
  aiName: string;
  streamerName: string;
}

export interface CharacterPreview {
  character: Character;
  isSelected: boolean;
  isPlaying: boolean;
}
