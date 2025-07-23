// Settings and Configuration Types

// Settings Enums
export enum AutoModLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum ResponseStyle {
  CASUAL = "casual",
  FORMAL = "formal",
  ENTHUSIASTIC = "enthusiastic",
  CALM = "calm",
}

export interface UserSettings {
  userId: string;
  selectedCharacterId: string;
  aiName: string;
  streamerName: string;
  responseRate: number; // 0-100
  filterSettings: FilterSettings;
  overlaySettings: OverlaySettings;
  notificationSettings: NotificationSettings;
  streamSettings: StreamSettings;
  aiSettings: AISettings;
}

export interface FilterSettings {
  enableProfanityFilter: boolean;
  enableGamblingFilter: boolean;
  enableSpamFilter: boolean;
  enableContextFilter: boolean;
  minMessageLength: number;
  maxCapsPercentage: number;
  maxRepetitionCount: number;
  blockedWords: string[];
  allowedLanguages: string[];
  autoModLevel: AutoModLevel;
}

export interface OverlaySettings {
  position:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  size: "small" | "medium" | "large" | "custom";
  customSize?: { width: number; height: number };
  opacity: number;
  showBubble: boolean;
  showCharacter: boolean;
  animationSpeed: "slow" | "normal" | "fast";
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
}

export interface NotificationSettings {
  enableChatAlerts: boolean;
  enableAIResponseAlerts: boolean;
  enableStreamStatusAlerts: boolean;
  enableDonationAlerts: boolean;
  enableFollowerAlerts: boolean;
  soundEnabled: boolean;
  desktopNotifications: boolean;
  emailNotifications: boolean;
  alertVolume: number;
  alertDuration: number;
}

export interface StreamSettings {
  defaultTitle: string;
  defaultCategory: string;
  autoStartAI: boolean;
  autoConnectChat: boolean;
  streamQuality: "720p" | "1080p" | "1440p" | "4K";
  bitrate: number;
  fps: number;
  audioBitrate: number;
  enableChatReplay: boolean;
  enableStreamRecording: boolean;
}

export interface AISettings {
  responseDelay: number; // milliseconds
  maxResponseLength: number;
  enableContextMemory: boolean;
  contextMemorySize: number;
  enableSentimentAnalysis: boolean;
  enableTopicDetection: boolean;
  enableEmotionRecognition: boolean;
  customPrompts: string[];
  bannedTopics: string[];
  preferredTopics: string[];
  responseStyle: ResponseStyle;
  languagePreference: string[];
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  darkMode: boolean;
  customCSS?: string;
}

export interface IntegrationSettings {
  youtubeEnabled: boolean;
  youtubeChannelId?: string;
  twitchEnabled: boolean;
  twitchChannelId?: string;
  discordEnabled: boolean;
  discordWebhookUrl?: string;
  twitterEnabled: boolean;
  twitterApiKey?: string;
  streamlabsEnabled: boolean;
  streamlabsToken?: string;
}

export interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: "daily" | "weekly" | "monthly";
  backupRetention: number; // days
  cloudBackup: boolean;
  cloudProvider?: "google" | "dropbox" | "onedrive";
  lastBackup?: Date;
}
