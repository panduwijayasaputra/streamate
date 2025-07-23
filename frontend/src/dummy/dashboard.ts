import {
  CurrentStream,
  AICoHostStatus,
  LastStream,
  StreamHealth,
  RecentChat,
  ViewerEngagement,
  StreamAnalytics,
  RecentActivity,
  PerformanceInsight,
  TrendDirection,
  ActivityType,
  ActivityStatus,
} from "@/types/dashboard";
import {
  ChatEventType,
  ConnectionQuality,
  EngagementType,
} from "@/types/stream";
import {
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  ChatBubbleLeftIcon,
  VideoCameraIcon,
  CpuChipIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

// Dashboard Dummy Data
export const dummyCurrentStream: CurrentStream = {
  title: "Gaming Stream - Valorant Ranked",
  viewerCount: 1250,
  duration: "01:23:45",
  aiResponses: 45,
};

export const dummyAICoHostStatus: AICoHostStatus = {
  isConfigured: true,
  character: "Boomi",
  personality: "Energetic & Friendly",
  responseRate: 75,
  isReady: true,
};

export const dummyLastStream: LastStream = {
  title: "Gaming Stream - Valorant Ranked",
  date: "2 days ago",
  duration: "2h 15m",
  viewers: 892,
  aiResponses: 156,
  engagement: 87,
};

export const dummyStreamHealth: StreamHealth = {
  connection: ConnectionQuality.EXCELLENT,
  bitrate: "6000 kbps",
  fps: "60",
  audioLevel: 85,
  networkQuality: ConnectionQuality.GOOD,
  cpuUsage: 45,
  ramUsage: 62,
};

export const dummyRecentChat: RecentChat[] = [
  {
    user: "GamerPro123",
    message: "Great play! 🔥",
    time: "2s ago",
    type: ChatEventType.MESSAGE,
  },
  {
    user: "StreamFan",
    message: "Just followed!",
    time: "5s ago",
    type: ChatEventType.FOLLOW,
  },
  {
    user: "ValorantLover",
    message: "What rank are you?",
    time: "8s ago",
    type: ChatEventType.MESSAGE,
  },
  {
    user: "ChatMaster",
    message: "Donated $5",
    time: "12s ago",
    type: ChatEventType.DONATION,
  },
  {
    user: "NewViewer",
    message: "First time here!",
    time: "15s ago",
    type: ChatEventType.MESSAGE,
  },
];

export const dummyViewerEngagement: ViewerEngagement[] = [
  { type: EngagementType.FOLLOW, count: 12, time: "Last 5 min" },
  { type: EngagementType.LIKE, count: 89, time: "Last 5 min" },
  { type: EngagementType.DONATION, count: 3, time: "Last 5 min" },
  { type: EngagementType.SHARE, count: 7, time: "Last 5 min" },
];

export const dummyStreamAnalytics: StreamAnalytics[] = [
  {
    title: "Total Stream Time",
    value: "48h 32m",
    change: "+12%",
    trend: TrendDirection.UP,
    icon: ClockIcon,
    description: "This month",
  },
  {
    title: "Average Viewers",
    value: "892",
    change: "+8%",
    trend: TrendDirection.UP,
    icon: UserGroupIcon,
    description: "Per stream",
  },
  {
    title: "Peak Viewers",
    value: "1,450",
    change: "+15%",
    trend: TrendDirection.UP,
    icon: ChartBarIcon,
    description: "Best stream",
  },
  {
    title: "Chat Messages",
    value: "2,847",
    change: "+23%",
    trend: TrendDirection.UP,
    icon: ChatBubbleLeftIcon,
    description: "Total this month",
  },
];

export const dummyRecentActivity: RecentActivity[] = [
  {
    type: ActivityType.STREAM,
    title: "Stream ended",
    description: "Gaming Stream - Valorant Ranked",
    time: "2 hours ago",
    icon: VideoCameraIcon,
    status: ActivityStatus.COMPLETED,
  },
  {
    type: ActivityType.AI,
    title: "AI Settings updated",
    description: "Response rate changed to 75%",
    time: "1 day ago",
    icon: CpuChipIcon,
    status: ActivityStatus.UPDATED,
  },
  {
    type: ActivityType.PERFORMANCE,
    title: "New peak viewers",
    description: "1,450 viewers reached",
    time: "3 days ago",
    icon: SparklesIcon,
    status: ActivityStatus.ACHIEVEMENT,
  },
];

export const dummyPerformanceInsights: PerformanceInsight[] = [
  {
    metric: "Peak Viewers",
    value: "1,450",
    change: "+12%",
    trend: TrendDirection.UP,
  },
  {
    metric: "Avg Watch Time",
    value: "23 min",
    change: "+8%",
    trend: TrendDirection.UP,
  },
  {
    metric: "Chat Activity",
    value: "High",
    change: "+15%",
    trend: TrendDirection.UP,
  },
  {
    metric: "Engagement Rate",
    value: "92%",
    change: "+5%",
    trend: TrendDirection.UP,
  },
];
