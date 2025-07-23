import { ApiResponse } from "@/types/common";
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
import {
  dummyCurrentStream,
  dummyAICoHostStatus,
  dummyLastStream,
  dummyStreamHealth,
  dummyRecentChat,
  dummyViewerEngagement,
  dummyStreamAnalytics,
  dummyRecentActivity,
  dummyPerformanceInsights,
} from "@/dummy/dashboard";

// Dashboard API Service
export class DashboardService {
  private static instance: DashboardService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
  }

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  // Get current stream status
  async getCurrentStream(): Promise<ApiResponse<CurrentStream>> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/dashboard/current-stream`);
      // return await response.json();

      // Temporary: Return dummy data
      return {
        success: true,
        data: dummyCurrentStream,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch current stream",
      };
    }
  }

  // Get AI co-host status
  async getAICoHostStatus(): Promise<ApiResponse<AICoHostStatus>> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/dashboard/ai-cohost-status`);
      // return await response.json();

      // Temporary: Return dummy data
      return {
        success: true,
        data: dummyAICoHostStatus,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch AI co-host status",
      };
    }
  }

  // Get last stream summary
  async getLastStream(): Promise<ApiResponse<LastStream>> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/dashboard/last-stream`);
      // return await response.json();

      // Temporary: Return dummy data
      return {
        success: true,
        data: dummyLastStream,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch last stream",
      };
    }
  }

  // Get stream health metrics
  async getStreamHealth(): Promise<ApiResponse<StreamHealth>> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/dashboard/stream-health`);
      // return await response.json();

      // Temporary: Return dummy data
      return {
        success: true,
        data: dummyStreamHealth,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch stream health",
      };
    }
  }

  // Get recent chat messages
  async getRecentChat(): Promise<ApiResponse<RecentChat[]>> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/dashboard/recent-chat`);
      // return await response.json();

      // Temporary: Return dummy data
      return {
        success: true,
        data: dummyRecentChat,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch recent chat",
      };
    }
  }

  // Get viewer engagement metrics
  async getViewerEngagement(): Promise<ApiResponse<ViewerEngagement[]>> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/dashboard/viewer-engagement`);
      // return await response.json();

      // Temporary: Return dummy data
      return {
        success: true,
        data: dummyViewerEngagement,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch viewer engagement",
      };
    }
  }

  // Get stream analytics
  async getStreamAnalytics(): Promise<ApiResponse<StreamAnalytics[]>> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/dashboard/stream-analytics`);
      // return await response.json();

      // Temporary: Return dummy data
      return {
        success: true,
        data: dummyStreamAnalytics,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch stream analytics",
      };
    }
  }

  // Get recent activity
  async getRecentActivity(): Promise<ApiResponse<RecentActivity[]>> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/dashboard/recent-activity`);
      // return await response.json();

      // Temporary: Return dummy data
      return {
        success: true,
        data: dummyRecentActivity,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch recent activity",
      };
    }
  }

  // Get performance insights
  async getPerformanceInsights(): Promise<ApiResponse<PerformanceInsight[]>> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/dashboard/performance-insights`);
      // return await response.json();

      // Temporary: Return dummy data
      return {
        success: true,
        data: dummyPerformanceInsights,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch performance insights",
      };
    }
  }

  // Get all dashboard data at once
  async getAllDashboardData(): Promise<
    ApiResponse<{
      currentStream: CurrentStream;
      aiCoHostStatus: AICoHostStatus;
      lastStream: LastStream;
      streamHealth: StreamHealth;
      recentChat: RecentChat[];
      viewerEngagement: ViewerEngagement[];
      streamAnalytics: StreamAnalytics[];
      recentActivity: RecentActivity[];
      performanceInsights: PerformanceInsight[];
    }>
  > {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/dashboard/all`);
      // return await response.json();

      // Temporary: Return dummy data
      return {
        success: true,
        data: {
          currentStream: dummyCurrentStream,
          aiCoHostStatus: dummyAICoHostStatus,
          lastStream: dummyLastStream,
          streamHealth: dummyStreamHealth,
          recentChat: dummyRecentChat,
          viewerEngagement: dummyViewerEngagement,
          streamAnalytics: dummyStreamAnalytics,
          recentActivity: dummyRecentActivity,
          performanceInsights: dummyPerformanceInsights,
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard data",
      };
    }
  }
}

// Export singleton instance
export const dashboardService = DashboardService.getInstance();
