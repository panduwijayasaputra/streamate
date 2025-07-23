import {
  UserSettings,
  FilterSettings,
  OverlaySettings,
  NotificationSettings,
  StreamSettings,
  AISettings,
  ThemeSettings,
  IntegrationSettings,
  BackupSettings,
  AutoModLevel,
  ResponseStyle,
} from "@/types/settings";

// Settings Dummy Data
export const dummyFilterSettings: FilterSettings = {
  enableProfanityFilter: true,
  enableGamblingFilter: true,
  enableSpamFilter: true,
  enableContextFilter: true,
  minMessageLength: 3,
  maxCapsPercentage: 70,
  maxRepetitionCount: 3,
  blockedWords: ["spam", "scam", "inappropriate"],
  allowedLanguages: ["id", "en", "ms"],
  autoModLevel: AutoModLevel.MEDIUM,
};

export const dummyOverlaySettings: OverlaySettings = {
  position: "bottom-right",
  size: "medium",
  opacity: 0.9,
  showBubble: true,
  showCharacter: true,
  animationSpeed: "normal",
  backgroundColor: "#1F2937",
  borderColor: "#3B82F6",
  borderRadius: 12,
};

export const dummyNotificationSettings: NotificationSettings = {
  enableChatAlerts: true,
  enableAIResponseAlerts: true,
  enableStreamStatusAlerts: true,
  enableDonationAlerts: true,
  enableFollowerAlerts: true,
  soundEnabled: true,
  desktopNotifications: true,
  emailNotifications: false,
  alertVolume: 80,
  alertDuration: 5000,
};

export const dummyStreamSettings: StreamSettings = {
  defaultTitle: "Gaming Stream - Valorant Ranked",
  defaultCategory: "Gaming",
  autoStartAI: true,
  autoConnectChat: true,
  streamQuality: "1080p",
  bitrate: 6000,
  fps: 60,
  audioBitrate: 128,
  enableChatReplay: true,
  enableStreamRecording: false,
};

export const dummyAISettings: AISettings = {
  responseDelay: 2000,
  maxResponseLength: 150,
  enableContextMemory: true,
  contextMemorySize: 10,
  enableSentimentAnalysis: true,
  enableTopicDetection: true,
  enableEmotionRecognition: false,
  customPrompts: [
    "Be friendly and energetic",
    "Respond in Indonesian when possible",
    "Keep responses concise",
  ],
  bannedTopics: ["politics", "religion", "controversial"],
  preferredTopics: ["gaming", "community", "entertainment"],
  responseStyle: ResponseStyle.ENTHUSIASTIC,
  languagePreference: ["id", "en"],
};

export const dummyUserSettings: UserSettings = {
  userId: "user_123",
  selectedCharacterId: "boomi",
  aiName: "Boomi",
  streamerName: "GamingPro Indonesia",
  responseRate: 75,
  filterSettings: dummyFilterSettings,
  overlaySettings: dummyOverlaySettings,
  notificationSettings: dummyNotificationSettings,
  streamSettings: dummyStreamSettings,
  aiSettings: dummyAISettings,
};

export const dummyThemeSettings: ThemeSettings = {
  primaryColor: "#3B82F6",
  secondaryColor: "#1F2937",
  backgroundColor: "#FFFFFF",
  textColor: "#1F2937",
  accentColor: "#10B981",
  darkMode: false,
  customCSS: "",
};

export const dummyIntegrationSettings: IntegrationSettings = {
  youtubeEnabled: true,
  youtubeChannelId: "UC123456789",
  twitchEnabled: false,
  twitchChannelId: undefined,
  discordEnabled: true,
  discordWebhookUrl: "https://discord.com/api/webhooks/...",
  twitterEnabled: false,
  twitterApiKey: undefined,
  streamlabsEnabled: true,
  streamlabsToken: "streamlabs_token_123",
};

export const dummyBackupSettings: BackupSettings = {
  autoBackup: true,
  backupFrequency: "daily",
  backupRetention: 30,
  cloudBackup: true,
  cloudProvider: "google",
  lastBackup: new Date(Date.now() - 86400000), // 1 day ago
};
