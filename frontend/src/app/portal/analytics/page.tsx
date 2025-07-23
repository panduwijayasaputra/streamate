"use client";

import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  SpeakerWaveIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { analyticsService } from "@/services";
import {
  StreamPerformance,
  AnalyticsMetric,
  TimeSeriesData,
  ChartData,
  EngagementMetrics,
  ViewerDemographics,
  RevenueAnalytics,
  AIAnalytics,
} from "@/types/analytics";
import {
  ViewerGrowthChart,
  AIResponseActivityChart,
} from "@/components/analytics/ChartComponents";
import { PageHeader } from "@/components/shared/PageHeader";

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<{
    performance: StreamPerformance;
    metrics: AnalyticsMetric[];
    timeSeries: TimeSeriesData[];
    chartData: ChartData;
    engagement: EngagementMetrics;
    demographics: ViewerDemographics;
    revenue: RevenueAnalytics;
    ai: AIAnalytics;
  } | null>(null);
  const [viewerGrowthData, setViewerGrowthData] = useState<ChartData | null>(
    null
  );
  const [aiResponseActivityData, setAiResponseActivityData] =
    useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true);

        // Load main analytics data
        const mainResponse = await analyticsService.getAllAnalyticsData();
        if (mainResponse.success && mainResponse.data) {
          setAnalyticsData(mainResponse.data);
        } else {
          setError(mainResponse.error || "Failed to load analytics data");
        }

        // Load viewer growth data
        const viewerGrowthResponse =
          await analyticsService.getViewerGrowthData();
        if (viewerGrowthResponse.success && viewerGrowthResponse.data) {
          setViewerGrowthData(viewerGrowthResponse.data);
        }

        // Load AI response activity data
        const aiResponseResponse =
          await analyticsService.getAIResponseActivityData();
        if (aiResponseResponse.success && aiResponseResponse.data) {
          setAiResponseActivityData(aiResponseResponse.data);
        }
      } catch (err) {
        setError("Failed to load analytics data");
        console.error("Analytics data loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use fallback data if service data is null
  const data = analyticsData || {
    performance: {
      totalStreamTime: "48h 32m",
      averageViewers: 892,
      peakViewers: 1247,
      totalChatMessages: 2847,
      averageWatchTime: "23 min",
      engagementRate: 87,
      followerGrowth: 156,
      revenueGenerated: 1250.5,
    },
    metrics: [
      {
        name: "Total Stream Time",
        value: "48h 32m",
        change: "+12%",
        trend: "up",
        period: "This month",
      },
      {
        name: "Peak Viewers",
        value: "1,247",
        change: "+8%",
        trend: "up",
        period: "This month",
      },
      {
        name: "Chat Messages",
        value: "2,847",
        change: "+23%",
        trend: "up",
        period: "This month",
      },
      {
        name: "Engagement Rate",
        value: "87%",
        change: "+5%",
        trend: "up",
        period: "This month",
      },
    ],
    timeSeries: [],
    chartData: {},
    engagement: {
      likes: 1250,
      shares: 89,
      comments: 2847,
      donations: 45,
      subscriptions: 23,
      follows: 156,
      raids: 12,
    },
    demographics: {
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
    },
    revenue: {
      totalRevenue: 1250.5,
      revenueBySource: {
        donations: 800.0,
        subscriptions: 300.0,
        sponsorships: 100.0,
        merchandise: 30.5,
        other: 20.0,
      },
      revenueTrend: [],
      topDonors: [
        { username: "VIP_Viewer", amount: 100.0, count: 2 },
        { username: "StreamFan", amount: 75.0, count: 3 },
        { username: "GamerPro123", amount: 50.0, count: 1 },
        { username: "ChatLover", amount: 25.0, count: 2 },
        { username: "NewViewer", amount: 20.0, count: 1 },
      ],
    },
    ai: {
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
    },
  };
  return (
    <div className="p-6">
      <PageHeader
        icon={ChartBarIcon}
        title="Stream Analytics"
        description="Track your streaming performance and engagement metrics"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Stream Time
              </p>
              <p className="text-2xl font-bold text-gray-900">48h 32m</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Peak Viewers</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">AI Responses</p>
              <p className="text-2xl font-bold text-gray-900">3,892</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Engagement Rate
              </p>
              <p className="text-2xl font-bold text-gray-900">92%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Viewer Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Viewer Growth
              </h3>
              <p className="text-xs text-gray-500">
                Track viewer growth over time
              </p>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg p-4">
            {viewerGrowthData ? (
              <ViewerGrowthChart data={viewerGrowthData} height="h-full" />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-gray-500">Loading chart data...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Response Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                AI Response Activity
              </h3>
              <p className="text-xs text-gray-500">
                Monitor AI response frequency and patterns
              </p>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg p-4">
            {aiResponseActivityData ? (
              <AIResponseActivityChart
                data={aiResponseActivityData}
                height="h-full"
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-gray-500">Loading chart data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Performing Streams */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Top Performing Streams
                </h3>
                <p className="text-xs text-gray-500">
                  Your best performing streams and metrics
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Gaming Night with Boomi
                    </p>
                    <p className="text-sm text-gray-500">
                      March 15, 2024 • 3h 45m
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">1,247 viewers</p>
                  <p className="text-sm text-green-600">+15% from avg</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Just Chatting with AI
                    </p>
                    <p className="text-sm text-gray-500">
                      March 12, 2024 • 2h 30m
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">892 viewers</p>
                  <p className="text-sm text-green-600">+8% from avg</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Tech Talk Stream
                    </p>
                    <p className="text-sm text-gray-500">
                      March 10, 2024 • 4h 15m
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">756 viewers</p>
                  <p className="text-sm text-gray-600">+2% from avg</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Performance */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  AI Performance
                </h3>
                <p className="text-xs text-gray-500">
                  AI co-host performance metrics
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">87%</p>
                <p className="text-sm text-gray-600">Response Accuracy</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">2.3s</p>
                <p className="text-sm text-gray-600">Avg Response Time</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">94%</p>
                <p className="text-sm text-gray-600">User Satisfaction</p>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">156</p>
                <p className="text-sm text-gray-600">Responses per Hour</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
