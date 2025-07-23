import {
  StreamPerformance,
  AnalyticsMetric,
  TimeSeriesData,
  ChartData,
  EngagementMetrics,
  ViewerDemographics,
  RevenueAnalytics,
  AIAnalytics,
  TrendDirection,
} from "@/types/analytics";

// Analytics Dummy Data
export const dummyStreamPerformance: StreamPerformance = {
  totalStreamTime: "48h 32m",
  averageViewers: 892,
  peakViewers: 1247,
  totalChatMessages: 2847,
  averageWatchTime: "23 min",
  engagementRate: 87,
  followerGrowth: 156,
  revenueGenerated: 1250.5,
};

export const dummyAnalyticsMetrics: AnalyticsMetric[] = [
  {
    name: "Total Stream Time",
    value: "48h 32m",
    change: "+12%",
    trend: TrendDirection.UP,
    period: "This month",
  },
  {
    name: "Peak Viewers",
    value: "1,247",
    change: "+8%",
    trend: TrendDirection.UP,
    period: "This month",
  },
  {
    name: "Chat Messages",
    value: "2,847",
    change: "+23%",
    trend: TrendDirection.UP,
    period: "This month",
  },
  {
    name: "Engagement Rate",
    value: "87%",
    change: "+5%",
    trend: TrendDirection.UP,
    period: "This month",
  },
];

export const dummyTimeSeriesData: TimeSeriesData[] = [
  { timestamp: new Date("2024-01-01"), value: 800, label: "Jan 1" },
  { timestamp: new Date("2024-01-02"), value: 850, label: "Jan 2" },
  { timestamp: new Date("2024-01-03"), value: 900, label: "Jan 3" },
  { timestamp: new Date("2024-01-04"), value: 950, label: "Jan 4" },
  { timestamp: new Date("2024-01-05"), value: 1000, label: "Jan 5" },
  { timestamp: new Date("2024-01-06"), value: 1100, label: "Jan 6" },
  { timestamp: new Date("2024-01-07"), value: 1200, label: "Jan 7" },
];

export const dummyChartData: ChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Viewers",
      data: [800, 850, 900, 950, 1000, 1100, 1200],
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      borderColor: "rgba(59, 130, 246, 1)",
      fill: true,
    },
    {
      label: "Chat Messages",
      data: [150, 180, 200, 220, 250, 280, 300],
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      borderColor: "rgba(16, 185, 129, 1)",
      fill: true,
    },
  ],
};

export const dummyEngagementMetrics: EngagementMetrics = {
  likes: 1250,
  shares: 89,
  comments: 2847,
  donations: 45,
  subscriptions: 23,
  follows: 156,
  raids: 12,
};

export const dummyViewerDemographics: ViewerDemographics = {
  ageGroups: {
    "13-17": 15,
    "18-24": 45,
    "25-34": 30,
    "35-44": 8,
    "45+": 2,
  },
  topCountries: [
    { country: "Indonesia", viewers: 850, percentage: 68 },
    { country: "Malaysia", viewers: 120, percentage: 10 },
    { country: "Singapore", viewers: 80, percentage: 6 },
    { country: "Philippines", viewers: 60, percentage: 5 },
    { country: "Thailand", viewers: 40, percentage: 3 },
  ],
  topLanguages: [
    { language: "Indonesian", viewers: 900, percentage: 72 },
    { language: "English", viewers: 200, percentage: 16 },
    { language: "Malay", viewers: 80, percentage: 6 },
    { language: "Tagalog", viewers: 40, percentage: 3 },
    { language: "Thai", viewers: 30, percentage: 2 },
  ],
};

export const dummyRevenueAnalytics: RevenueAnalytics = {
  totalRevenue: 1250.5,
  revenueBySource: {
    donations: 800.0,
    subscriptions: 300.0,
    sponsorships: 100.0,
    merchandise: 30.5,
    other: 20.0,
  },
  revenueTrend: [
    { timestamp: new Date("2024-01-01"), value: 100, label: "Jan 1" },
    { timestamp: new Date("2024-01-02"), value: 150, label: "Jan 2" },
    { timestamp: new Date("2024-01-03"), value: 200, label: "Jan 3" },
    { timestamp: new Date("2024-01-04"), value: 180, label: "Jan 4" },
    { timestamp: new Date("2024-01-05"), value: 250, label: "Jan 5" },
    { timestamp: new Date("2024-01-06"), value: 300, label: "Jan 6" },
    { timestamp: new Date("2024-01-07"), value: 350, label: "Jan 7" },
  ],
  topDonors: [
    { username: "VIP_Viewer", amount: 100.0, count: 2 },
    { username: "StreamFan", amount: 75.0, count: 3 },
    { username: "GamerPro123", amount: 50.0, count: 1 },
    { username: "ChatLover", amount: 25.0, count: 2 },
    { username: "NewViewer", amount: 20.0, count: 1 },
  ],
};

export const dummyAIAnalytics: AIAnalytics = {
  totalResponses: 2847,
  averageResponseTime: 2.3,
  responseRate: 75,
  topTopics: [
    { topic: "Gaming", count: 1200, percentage: 42 },
    { topic: "Streamer", count: 800, percentage: 28 },
    { topic: "Community", count: 600, percentage: 21 },
    { topic: "Technical", count: 200, percentage: 7 },
    { topic: "Other", count: 47, percentage: 2 },
  ],
  characterPerformance: [
    {
      characterId: "boomi",
      characterName: "Boomi",
      responses: 2000,
      averageConfidence: 0.92,
      engagementScore: 8.5,
    },
    {
      characterId: "drift",
      characterName: "Drift",
      responses: 847,
      averageConfidence: 0.88,
      engagementScore: 7.8,
    },
  ],
};

// Viewer Growth Dummy Data
export const dummyViewerGrowthData: ChartData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Average Viewers",
      data: [450, 520, 580, 650, 720, 800, 850, 920, 980, 1050, 1120, 1200],
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      borderColor: "rgba(59, 130, 246, 1)",
      fill: true,
    },
    {
      label: "Peak Viewers",
      data: [
        650, 750, 850, 950, 1050, 1150, 1250, 1350, 1450, 1550, 1650, 1750,
      ],
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      borderColor: "rgba(16, 185, 129, 1)",
      fill: true,
    },
  ],
};

// AI Response Activity Dummy Data
export const dummyAIResponseActivityData: ChartData = {
  labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
  datasets: [
    {
      label: "AI Responses",
      data: [25, 15, 35, 85, 120, 95, 45],
      backgroundColor: "rgba(147, 51, 234, 0.2)",
      borderColor: "rgba(147, 51, 234, 1)",
      fill: true,
    },
    {
      label: "Response Rate (%)",
      data: [30, 20, 40, 75, 85, 80, 50],
      backgroundColor: "rgba(236, 72, 153, 0.2)",
      borderColor: "rgba(236, 72, 153, 1)",
      fill: false,
    },
  ],
};

// Weekly Viewer Growth Data
export const dummyWeeklyViewerGrowth: TimeSeriesData[] = [
  { timestamp: new Date("2024-01-01"), value: 450, label: "Week 1" },
  { timestamp: new Date("2024-01-08"), value: 520, label: "Week 2" },
  { timestamp: new Date("2024-01-15"), value: 580, label: "Week 3" },
  { timestamp: new Date("2024-01-22"), value: 650, label: "Week 4" },
  { timestamp: new Date("2024-01-29"), value: 720, label: "Week 5" },
  { timestamp: new Date("2024-02-05"), value: 800, label: "Week 6" },
  { timestamp: new Date("2024-02-12"), value: 850, label: "Week 7" },
  { timestamp: new Date("2024-02-19"), value: 920, label: "Week 8" },
  { timestamp: new Date("2024-02-26"), value: 980, label: "Week 9" },
  { timestamp: new Date("2024-03-05"), value: 1050, label: "Week 10" },
  { timestamp: new Date("2024-03-12"), value: 1120, label: "Week 11" },
  { timestamp: new Date("2024-03-19"), value: 1200, label: "Week 12" },
];

// Daily AI Response Activity Data
export const dummyDailyAIResponseActivity: TimeSeriesData[] = [
  { timestamp: new Date("2024-03-19T00:00:00"), value: 25, label: "00:00" },
  { timestamp: new Date("2024-03-19T04:00:00"), value: 15, label: "04:00" },
  { timestamp: new Date("2024-03-19T08:00:00"), value: 35, label: "08:00" },
  { timestamp: new Date("2024-03-19T12:00:00"), value: 85, label: "12:00" },
  { timestamp: new Date("2024-03-19T16:00:00"), value: 120, label: "16:00" },
  { timestamp: new Date("2024-03-19T20:00:00"), value: 95, label: "20:00" },
  { timestamp: new Date("2024-03-19T24:00:00"), value: 45, label: "24:00" },
];
