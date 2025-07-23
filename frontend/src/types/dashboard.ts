// Dashboard Types
import { ComponentType, SVGProps } from "react";
import type { StreamHealth, RecentChat, ViewerEngagement } from "./stream";

// Dashboard Enums
export enum ActivityType {
  STREAM = "stream",
  AI = "ai",
  PERFORMANCE = "performance",
  SETTINGS = "settings",
}

export enum ActivityStatus {
  COMPLETED = "completed",
  UPDATED = "updated",
  ACHIEVEMENT = "achievement",
  ERROR = "error",
}

// Import TrendDirection from analytics to avoid duplication
import { TrendDirection } from "./analytics";

// Re-export TrendDirection for backward compatibility
export { TrendDirection };

export interface CurrentStream {
  title: string;
  viewerCount: number;
  duration: string;
  aiResponses: number;
}

export interface AICoHostStatus {
  isConfigured: boolean;
  character: string;
  personality: string;
  responseRate: number;
  isReady: boolean;
}

export interface LastStream {
  title: string;
  date: string;
  duration: string;
  viewers: number;
  aiResponses: number;
  engagement: number;
}

export interface StreamAnalytics {
  title: string;
  value: string;
  change: string;
  trend: TrendDirection;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  description: string;
}

export interface RecentActivity {
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  status: ActivityStatus;
}

export interface PerformanceInsight {
  metric: string;
  value: string;
  change: string;
  trend: TrendDirection;
}

export interface StreamSchedule {
  title: string;
  date: string;
  time: string;
  duration: string;
  category: string;
  isScheduled: boolean;
}

export interface DashboardStats {
  totalStreamTime: string;
  averageViewers: number;
  peakViewers: number;
  totalChatMessages: number;
  totalAIResponses: number;
  engagementRate: number;
}

export interface DashboardState {
  isLive: boolean;
  currentStream: CurrentStream | null;
  aiCoHostStatus: AICoHostStatus;
  lastStream: LastStream | null;
  streamHealth: StreamHealth;
  recentChat: RecentChat[];
  viewerEngagement: ViewerEngagement[];
  streamAnalytics: StreamAnalytics[];
  recentActivity: RecentActivity[];
  performanceInsights: PerformanceInsight[];
  streamSchedule: StreamSchedule[];
}

// Re-export types from stream module
export type { StreamHealth, RecentChat, ViewerEngagement } from "./stream";
