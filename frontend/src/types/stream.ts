// Stream Types
import type { AlertSeverity } from "./common";

// Stream Enums
export enum StreamQuality {
  GOOD = "good",
  FAIR = "fair",
  POOR = "poor",
}

export enum ConnectionQuality {
  EXCELLENT = "Excellent",
  GOOD = "Good",
  FAIR = "Fair",
  POOR = "Poor",
}

export enum MessageType {
  NORMAL = "normal",
  SUPERCHAT = "superchat",
  MEMBERSHIP = "membership",
  FILTERED = "filtered",
}

export enum EngagementType {
  FOLLOW = "follow",
  LIKE = "like",
  DONATION = "donation",
  SHARE = "share",
  SUBSCRIPTION = "subscription",
}

// Import ChatEventType from common to avoid duplication
import { ChatEventType } from "./common";

// Re-export ChatEventType for backward compatibility
export { ChatEventType };

export enum AIActivityType {
  RESPONSE = "response",
  ERROR = "error",
  PROCESSING = "processing",
}

export enum AIResponseStatus {
  IDLE = "idle",
  PROCESSING = "processing",
  RESPONDING = "responding",
  ERROR = "error",
}

export enum ChatAlertType {
  SPAM = "spam",
  MENTION = "mention",
  ENGAGEMENT = "engagement",
  TRENDING = "trending",
  WARNING = "warning",
}

export interface AIActivity {
  id: string;
  type: AIActivityType;
  message: string;
  timestamp: Date;
  duration?: number;
}

export interface ChatAlert {
  id: string;
  type: ChatAlertType;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
  isRead: boolean;
  data?: Record<string, unknown>;
}

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

export interface StreamStatus {
  isLive: boolean;
  title: string;
  category: string;
  viewerCount: number;
  duration: string;
  chatEnabled: boolean;
  streamId?: string;
  scheduledStartTime?: Date;
  actualStartTime?: Date;
  quality: StreamQuality;
  bitrate: number;
  fps: number;
  resolution: string;
}

export interface ChatMessage {
  id: string;
  streamId?: string;
  authorId?: string;
  author: string;
  message: string;
  content?: string;
  authorName?: string;
  timestamp: Date;
  isAIResponse?: boolean;
  characterId?: string;
  aiCharacter?: string;
  confidence?: number;
  filtered?: boolean;
  isFiltered?: boolean;
  filterReason?: string;
  messageType?: MessageType;
  authorBadge?: string;
  authorColor?: string;
  isHighlighted?: boolean;
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

export interface StreamHealth {
  connection: ConnectionQuality;
  bitrate: string;
  fps: string;
  audioLevel: number;
  networkQuality: ConnectionQuality;
  cpuUsage: number;
  ramUsage: number;
}

export interface ViewerEngagement {
  type: EngagementType;
  count: number;
  time: string;
}

export interface RecentChat {
  user: string;
  message: string;
  time: string;
  type: ChatEventType;
}

export interface YouTubeChannel {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  avatar?: string;
  subscriberCount: number;
  isVerified?: boolean;
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
