"use client";
import {
  HomeIcon,
  HeartIcon,
  ClockIcon,
  VideoCameraIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  BellIcon,
  GiftIcon,
  StarIcon,
  UserGroupIcon,
  ChatBubbleLeftIcon,
  CpuChipIcon,
  SparklesIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useEffect } from "react";
import { dashboardService } from "@/services";
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
} from "@/types/dashboard";
import { PageHeader } from "@/components/shared/PageHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default function PortalDashboard() {
  // State for dashboard data
  const [isLive, setIsLive] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    currentStream: CurrentStream;
    aiCoHostStatus: AICoHostStatus;
    lastStream: LastStream;
    streamHealth: StreamHealth;
    recentChat: RecentChat[];
    viewerEngagement: ViewerEngagement[];
    streamAnalytics: StreamAnalytics[];
    recentActivity: RecentActivity[];
    performanceInsights: PerformanceInsight[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getAllDashboardData();

        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setError(response.error || "Failed to load dashboard data");
        }
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Dashboard data loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
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
      </div>
    );
  }

  // Use fallback data if service data is null
  const data = dashboardData || {
    currentStream: {
      title: "Gaming Stream - Valorant Ranked",
      viewerCount: 1250,
      duration: "01:23:45",
      aiResponses: 45,
    },
    aiCoHostStatus: {
      isConfigured: true,
      character: "Boomi",
      personality: "Energetic & Friendly",
      responseRate: 75,
      isReady: true,
    },
    lastStream: {
      title: "Gaming Stream - Valorant Ranked",
      date: "2 days ago",
      duration: "2h 15m",
      viewers: 892,
      aiResponses: 156,
      engagement: 87,
    },
    streamHealth: {
      connection: "Excellent",
      bitrate: "6000 kbps",
      fps: "60",
      audioLevel: 85,
      networkQuality: "Good",
      cpuUsage: 45,
      ramUsage: 62,
    },
    recentChat: [
      {
        user: "GamerPro123",
        message: "Great play! 🔥",
        time: "2s ago",
        type: "message",
      },
      {
        user: "StreamFan",
        message: "Just followed!",
        time: "5s ago",
        type: "follow",
      },
      {
        user: "ValorantLover",
        message: "What rank are you?",
        time: "8s ago",
        type: "message",
      },
      {
        user: "ChatMaster",
        message: "Donated $5",
        time: "12s ago",
        type: "donation",
      },
      {
        user: "NewViewer",
        message: "First time here!",
        time: "15s ago",
        type: "message",
      },
    ],
    viewerEngagement: [
      { type: "follow", count: 12, time: "Last 5 min" },
      { type: "like", count: 89, time: "Last 5 min" },
      { type: "donation", count: 3, time: "Last 5 min" },
      { type: "share", count: 7, time: "Last 5 min" },
    ],
    streamAnalytics: [
      {
        title: "Total Stream Time",
        value: "48h 32m",
        change: "+12%",
        trend: "up",
        icon: ClockIcon,
        description: "This month",
      },
      {
        title: "Average Viewers",
        value: "892",
        change: "+8%",
        trend: "up",
        icon: UserGroupIcon,
        description: "Per stream",
      },
      {
        title: "Peak Viewers",
        value: "1,450",
        change: "+15%",
        trend: "up",
        icon: ChartBarIcon,
        description: "Best stream",
      },
      {
        title: "Chat Messages",
        value: "2,847",
        change: "+23%",
        trend: "up",
        icon: ChatBubbleLeftIcon,
        description: "Total this month",
      },
    ],
    recentActivity: [
      {
        type: "stream",
        title: "Stream ended",
        description: "Gaming Stream - Valorant Ranked",
        time: "2 hours ago",
        icon: VideoCameraIcon,
        status: "completed",
      },
      {
        type: "ai",
        title: "AI Settings updated",
        description: "Response rate changed to 75%",
        time: "1 day ago",
        icon: CpuChipIcon,
        status: "updated",
      },
      {
        type: "performance",
        title: "New peak viewers",
        description: "1,450 viewers reached",
        time: "3 days ago",
        icon: SparklesIcon,
        status: "achievement",
      },
    ],
    performanceInsights: [
      { metric: "Peak Viewers", value: "1,450", change: "+12%", trend: "up" },
      { metric: "Avg Watch Time", value: "23 min", change: "+8%", trend: "up" },
      { metric: "Chat Activity", value: "High", change: "+15%", trend: "up" },
      { metric: "Engagement Rate", value: "92%", change: "+5%", trend: "up" },
    ],
  };

  const getEngagementIcon = (type: string) => {
    switch (type) {
      case "follow":
        return <UserIcon className="w-4 h-4" />;
      case "like":
        return <HeartIcon className="w-4 h-4" />;
      case "donation":
        return <GiftIcon className="w-4 h-4" />;
      case "share":
        return <ArrowTrendingUpIcon className="w-4 h-4" />;
      default:
        return <StarIcon className="w-4 h-4" />;
    }
  };

  const getEngagementColor = (type: string) => {
    switch (type) {
      case "follow":
        return "text-blue-600 bg-blue-100";
      case "like":
        return "text-red-600 bg-red-100";
      case "donation":
        return "text-green-600 bg-green-100";
      case "share":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "stream":
        return <VideoCameraIcon className="w-5 h-5" />;
      case "ai":
        return <CpuChipIcon className="w-5 h-5" />;
      case "performance":
        return <SparklesIcon className="w-5 h-5" />;
      default:
        return <BellIcon className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "stream":
        return "text-blue-600 bg-blue-100";
      case "ai":
        return "text-purple-600 bg-purple-100";
      case "performance":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "updated":
        return "text-blue-600";
      case "achievement":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <PageHeader
        icon={HomeIcon}
        title="Dashboard"
        description={
          isLive
            ? `Currently streaming: ${data.currentStream.title}`
            : "Ready to go live? Start streaming with your AI co-host"
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Stream Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <VideoCameraIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Current Stream
                </h2>
                <p className="text-xs text-gray-500">
                  Live stream statistics and metrics
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Viewers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.currentStream.viewerCount.toLocaleString()}
                </p>
                <div className="flex justify-center items-center mt-1">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+12%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  AI Responses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.currentStream.aiResponses}
                </p>
                <p className="text-xs text-gray-500 mt-1">This stream</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.currentStream.duration}
                </p>
              </div>
            </div>
          </div>

          {/* Stream Analytics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Stream Analytics
                </h2>
                <p className="text-xs text-gray-500">
                  Performance metrics and insights
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {data.streamAnalytics.map((metric, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <metric.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  <div className="flex items-center justify-center mt-1">
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                <ClockIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Recent Activity
                </h2>
                <p className="text-xs text-gray-500">
                  Latest stream events and actions
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {data.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg ${getActivityColor(
                      activity.type
                    )}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium ${getStatusColor(
                      activity.status
                    )}`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Co-Host Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <CpuChipIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  AI Co-Host Status
                </h2>
                <p className="text-xs text-gray-500">
                  AI assistant configuration and status
                </p>
              </div>
            </div>
            {data.aiCoHostStatus.isConfigured ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Character
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {data.aiCoHostStatus.character}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Personality
                  </span>
                  <span className="text-sm text-gray-900">
                    {data.aiCoHostStatus.personality}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Response Rate
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {data.aiCoHostStatus.responseRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Status
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      data.aiCoHostStatus.isConfigured
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {data.aiCoHostStatus.isConfigured ? "Ready" : "Not Ready"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <CpuChipIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-4">
                  AI Co-Host not configured
                </p>
                <Link
                  href="/portal/ai-settings"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Cog6ToothIcon className="w-4 h-4 mr-2" />
                  Configure AI
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <QuickActions isLive={isLive} />

          {/* Stream Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg">
                <SignalIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Stream Health
                </h2>
                <p className="text-xs text-gray-500">
                  Connection and performance metrics
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Connection
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {data.streamHealth.connection}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Bitrate
                </span>
                <span className="text-sm text-gray-900">
                  {data.streamHealth.bitrate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">FPS</span>
                <span className="text-sm text-gray-900">
                  {data.streamHealth.fps}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Audio Level
                </span>
                <span className="text-sm text-gray-900">
                  {data.streamHealth.audioLevel}%
                </span>
              </div>
            </div>
          </div>

          {/* Last Stream */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <VideoCameraIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Last Stream
                </h2>
                <p className="text-xs text-gray-500">
                  Previous stream summary and stats
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {data.lastStream.title}
                </h3>
                <p className="text-sm text-gray-500">{data.lastStream.date}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {data.lastStream.duration}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Viewers</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {data.lastStream.viewers.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    AI Responses
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {data.lastStream.aiResponses}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    Engagement
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {data.lastStream.engagement}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Viewer Engagement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Viewer Engagement
                </h2>
                <p className="text-xs text-gray-500">
                  Audience interaction and reactions
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {data.viewerEngagement.map((engagement, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`p-1 rounded ${getEngagementColor(
                        engagement.type
                      )}`}
                    >
                      {getEngagementIcon(engagement.type)}
                    </div>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {engagement.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {engagement.count}
                    </p>
                    <p className="text-xs text-gray-500">{engagement.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Chat */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                <ChatBubbleLeftIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Recent Chat
                </h2>
                <p className="text-xs text-gray-500">
                  Latest viewer messages and interactions
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {data.recentChat.map((chat, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {chat.user}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.message}
                    </p>
                    <p className="text-xs text-gray-500">{chat.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
