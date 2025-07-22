// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  streamerName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Character System Types
export interface Character {
  id: string;
  name: string;
  displayName: string;
  description: string;
  personality: string;
  avatar: string;
  spriteSheet: string;
  voiceType: "cheerful" | "calm" | "energetic" | "sophisticated" | "cute";
  languageStyle: "formal" | "casual" | "slang" | "mixed";
  responseStyle: "short" | "medium" | "long";
  emojiUsage: "minimal" | "moderate" | "heavy";
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

// Stream and Chat Types
export interface Stream {
  id: string;
  userId: string;
  title: string;
  category: string;
  isLive: boolean;
  viewerCount: number;
  chatId: string;
  youtubeChannelId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  streamId: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
  isAIResponse: boolean;
  characterId?: string;
  confidence: number;
  filtered: boolean;
  filterReason?: string;
}

export interface AIResponse {
  id: string;
  messageId: string;
  characterId: string;
  content: string;
  confidence: number;
  responseTime: number;
  timestamp: Date;
}

// Settings and Configuration Types
export interface UserSettings {
  userId: string;
  selectedCharacterId: string;
  aiName: string;
  streamerName: string;
  responseRate: number; // 0-100
  filterSettings: FilterSettings;
  overlaySettings: OverlaySettings;
  notificationSettings: NotificationSettings;
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
}

export interface NotificationSettings {
  enableChatAlerts: boolean;
  enableAIResponseAlerts: boolean;
  enableStreamStatusAlerts: boolean;
  soundEnabled: boolean;
  desktopNotifications: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// WebSocket Types
export interface WebSocketMessage {
  type:
    | "chat_message"
    | "ai_response"
    | "stream_status"
    | "alert"
    | "heartbeat";
  data: ChatMessage | AIResponse | Stream | ChatAnalysisAlert | null;
  timestamp: Date;
}

export interface ChatAnalysisAlert {
  type: "spam" | "inappropriate" | "gambling" | "context_mismatch";
  message: string;
  severity: "low" | "medium" | "high";
  timestamp: Date;
  messageId: string;
}

// YouTube API Types
export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
}

export interface YouTubeLiveStream {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  viewerCount: number;
  chatId: string;
  isLive: boolean;
  scheduledStartTime?: Date;
  actualStartTime?: Date;
}
