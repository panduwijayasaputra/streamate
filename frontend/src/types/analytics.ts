// Analytics Types

// Analytics Enums
export enum TrendDirection {
  UP = "up",
  DOWN = "down",
  STABLE = "stable",
}

export enum StreamType {
  ALL = "all",
  GAMING = "gaming",
  JUST_CHATTING = "just-chatting",
  CREATIVE = "creative",
  OTHER = "other",
}

export enum AnalyticsMetricType {
  VIEWERS = "viewers",
  CHAT = "chat",
  ENGAGEMENT = "engagement",
  REVENUE = "revenue",
}

export enum GroupByPeriod {
  HOUR = "hour",
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
}

export interface AnalyticsMetric {
  name: string;
  value: string | number;
  change: string;
  trend: TrendDirection;
  period: string;
}

export interface StreamPerformance {
  totalStreamTime: string;
  averageViewers: number;
  peakViewers: number;
  totalChatMessages: number;
  averageWatchTime: string;
  engagementRate: number;
  followerGrowth: number;
  revenueGenerated: number;
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  label: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface AnalyticsFilter {
  dateRange: {
    start: Date;
    end: Date;
  };
  streamType: StreamType;
  metric: AnalyticsMetricType;
  groupBy: GroupByPeriod;
}

export interface EngagementMetrics {
  likes: number;
  shares: number;
  comments: number;
  donations: number;
  subscriptions: number;
  follows: number;
  raids: number;
}

export interface CountryData {
  country: string;
  viewers: number;
  percentage: number;
}

export interface LanguageData {
  language: string;
  viewers: number;
  percentage: number;
}

export interface ViewerDemographics {
  ageGroups: {
    "13-17": number;
    "18-24": number;
    "25-34": number;
    "35-44": number;
    "45+": number;
  };
  topCountries: CountryData[];
  topLanguages: LanguageData[];
}

export interface DonorData {
  username: string;
  amount: number;
  count: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  revenueBySource: {
    donations: number;
    subscriptions: number;
    sponsorships: number;
    merchandise: number;
    other: number;
  };
  revenueTrend: TimeSeriesData[];
  topDonors: DonorData[];
}

export interface TopicData {
  topic: string;
  count: number;
  percentage: number;
}

export interface CharacterPerformance {
  characterId: string;
  characterName: string;
  responses: number;
  averageConfidence: number;
  engagementScore: number;
}

export interface AIAnalytics {
  totalResponses: number;
  averageResponseTime: number;
  responseRate: number;
  topTopics: TopicData[];
  characterPerformance: CharacterPerformance[];
}
