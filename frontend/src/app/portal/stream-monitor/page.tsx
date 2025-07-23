"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  VideoCameraIcon,
  PlayIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  EyeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  SignalIcon,
  WifiIcon,
  MagnifyingGlassIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  FlagIcon,
  HeartIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { streamMonitorService } from "@/services";
import {
  ChatMessage,
  StreamStatus,
  YouTubeChannel,
  AIActivity,
  ChatAlert,
  MessageType,
  AIActivityType,
  StreamQuality,
  ChatAlertType,
  AIResponseStatus,
} from "@/types/stream";
import { PageHeader } from "@/components/shared/PageHeader";
import { AlertSeverity } from "@/types/common";

// Chat filter enum
enum ChatFilter {
  ALL = "all",
  AI = "ai",
  USER = "user",
}

export default function StreamMonitorPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [streamStatus, setStreamStatus] = useState<StreamStatus | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [aiResponseStatus, setAiResponseStatus] = useState<AIResponseStatus>(
    AIResponseStatus.IDLE
  );
  const [responseRate, setResponseRate] = useState(70);
  const [aiResponseStats, setAiResponseStats] = useState({
    totalResponses: 0,
    averageResponseTime: 0,
    lastResponseTime: null as Date | null,
    responseQueue: 0,
    errorCount: 0,
    successRate: 100,
  });
  const [aiActivity, setAiActivity] = useState<AIActivity[]>([]);
  const [channelInfo, setChannelInfo] = useState<YouTubeChannel | null>(null);
  const [isCheckingStream, setIsCheckingStream] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat panel states
  const [chatFilter, setChatFilter] = useState<ChatFilter>(ChatFilter.ALL);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatPaused, setIsChatPaused] = useState(false);
  const [showFilteredMessages, setShowFilteredMessages] = useState(false);
  const [chatStats, setChatStats] = useState({
    totalMessages: 0,
    aiResponses: 0,
    filteredMessages: 0,
    superchats: 0,
  });

  // Chat Analysis Alerts
  const [chatAlerts, setChatAlerts] = useState<ChatAlert[]>([]);
  const [alertSettings, setAlertSettings] = useState({
    spamThreshold: 2,
    mentionThreshold: 3,
    engagementThreshold: 5,
    trendingThreshold: 3,
    enableSpamAlerts: true,
    enableMentionAlerts: true,
    enableEngagementAlerts: true,
    enableTrendingAlerts: true,
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Load stream monitor data
  useEffect(() => {
    const loadStreamMonitorData = async () => {
      try {
        setLoading(true);
        const response = await streamMonitorService.getAllStreamMonitorData();

        if (response.success && response.data) {
          setStreamStatus(response.data.streamStatus);
          setChatMessages(response.data.chatMessages);
          setChannelInfo(response.data.channelInfo);
          setAiResponseStats(response.data.aiResponseStats);
          setAiActivity(response.data.aiActivity);
        } else {
          setError(response.error || "Failed to load stream monitor data");
        }
      } catch (err) {
        setError("Failed to load stream monitor data");
        console.error("Stream monitor data loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStreamMonitorData();
  }, []);

  // Simulate stream status updates
  useEffect(() => {
    if (isConnected && streamStatus?.isLive) {
      const interval = setInterval(() => {
        setStreamStatus((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            viewerCount: prev.viewerCount + Math.floor(Math.random() * 10) - 5,
            duration: updateDuration(prev.duration),
          };
        });
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isConnected, streamStatus?.isLive]);

  // Simulate new chat messages and AI responses
  useEffect(() => {
    if (isConnected && streamStatus?.isLive && !isChatPaused) {
      const interval = setInterval(() => {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          author: `User${Math.floor(Math.random() * 1000)}`,
          message: generateRandomMessage(),
          timestamp: new Date(),
          messageType:
            Math.random() > 0.9 ? MessageType.SUPERCHAT : MessageType.NORMAL,
          authorBadge: Math.random() > 0.8 ? "Member" : undefined,
          authorColor: Math.random() > 0.8 ? "#FF6B35" : undefined,
        };

        setChatMessages((prev) => {
          const newMessages = [...prev, newMessage];
          // Keep only last 100 messages for performance
          return newMessages.slice(-100);
        });

        // Update chat stats
        setChatStats((prev) => ({
          ...prev,
          totalMessages: prev.totalMessages + 1,
          superchats:
            prev.superchats +
            (newMessage.messageType === MessageType.SUPERCHAT ? 1 : 0),
        }));

        // Simulate AI response based on response rate
        if (Math.random() * 100 < responseRate) {
          simulateAIResponse(newMessage);
        }
      }, 3000); // New message every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isConnected, streamStatus?.isLive, isChatPaused, responseRate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, autoScroll]);

  // Helper functions
  const generateRandomMessage = () => {
    const messages = [
      "Keren banget streamnya!",
      "Mantap!",
      "Keep it up!",
      "Nice play!",
      "GG!",
      "Streamer favorit!",
      "Kontennya seru!",
      "Terima kasih sudah streaming!",
      "Semangat!",
      "Keren!",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const generateAIResponse = (triggerMessage: string) => {
    const responses = [
      "Terima kasih! Senang bisa streaming bareng kalian! 🔥",
      "Wah, makasih banget! Kalian keren semua! 😄",
      "Haha, iya nih! Seru banget streaming hari ini!",
      "Makasih supportnya! Kalian yang bikin stream ini seru! 💪",
      "Wah, terima kasih! Senang banget bisa interaksi sama kalian!",
      "Iya nih! Kalian yang bikin stream ini hidup! 🎉",
      "Makasih! Kalian semua keren banget!",
      "Haha, iya! Senang bisa streaming bareng kalian! 😊",
      "Terima kasih! Kalian yang bikin stream ini seru!",
      "Wah, makasih! Senang banget bisa streaming hari ini! 🚀",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const simulateAIResponse = useCallback(
    async (triggerMessage: ChatMessage) => {
      const startTime = new Date();

      // Add to activity log
      const activityId = Date.now().toString();
      setAiActivity((prev) => [
        ...prev,
        {
          id: activityId,
          type: AIActivityType.PROCESSING,
          message: `Processing response to "${triggerMessage.message}"`,
          timestamp: startTime,
        },
      ]);

      // Update status to processing
      setAiResponseStatus(AIResponseStatus.PROCESSING);
      setAiResponseStats((prev) => ({
        ...prev,
        responseQueue: prev.responseQueue + 1,
      }));

      try {
        // Simulate processing time (1-3 seconds)
        const processingTime = 1000 + Math.random() * 2000;
        await new Promise((resolve) => setTimeout(resolve, processingTime));

        // Simulate occasional errors
        if (Math.random() > 0.9) {
          throw new Error("AI processing error");
        }

        // Generate AI response
        const aiResponse: ChatMessage = {
          id: Date.now().toString(),
          author: "Boomi",
          message: generateAIResponse(triggerMessage.message),
          timestamp: new Date(),
          isAIResponse: true,
          aiCharacter: "Boomi",
          messageType: MessageType.NORMAL,
        };

        // Add AI response to chat
        setChatMessages((prev) => {
          const newMessages = [...prev, aiResponse];
          return newMessages.slice(-100);
        });

        // Update stats
        const endTime = new Date();
        const responseTime = endTime.getTime() - startTime.getTime();

        setAiResponseStats((prev) => ({
          ...prev,
          totalResponses: prev.totalResponses + 1,
          averageResponseTime:
            (prev.averageResponseTime * prev.totalResponses + responseTime) /
            (prev.totalResponses + 1),
          lastResponseTime: endTime,
          responseQueue: Math.max(0, prev.responseQueue - 1),
          successRate:
            ((prev.totalResponses + 1) /
              (prev.totalResponses + 1 + prev.errorCount)) *
            100,
        }));

        setChatStats((prev) => ({
          ...prev,
          aiResponses: prev.aiResponses + 1,
        }));

        // Update activity log
        setAiActivity((prev) =>
          prev.map((activity) =>
            activity.id === activityId
              ? {
                  ...activity,
                  type: AIActivityType.RESPONSE,
                  duration: responseTime,
                }
              : activity
          )
        );

        // Set status to responding briefly, then back to idle
        setAiResponseStatus(AIResponseStatus.RESPONDING);
        setTimeout(() => setAiResponseStatus(AIResponseStatus.IDLE), 1000);
      } catch (error) {
        // Handle error
        setAiResponseStatus(AIResponseStatus.ERROR);
        setAiResponseStats((prev) => ({
          ...prev,
          errorCount: prev.errorCount + 1,
          responseQueue: Math.max(0, prev.responseQueue - 1),
          successRate:
            (prev.totalResponses /
              (prev.totalResponses + prev.errorCount + 1)) *
            100,
        }));

        // Update activity log
        setAiActivity((prev) =>
          prev.map((activity) =>
            activity.id === activityId
              ? {
                  ...activity,
                  type: AIActivityType.ERROR,
                  message: "Failed to generate response",
                }
              : activity
          )
        );

        // Reset error status after 3 seconds
        setTimeout(() => setAiResponseStatus(AIResponseStatus.IDLE), 3000);
      }
    },
    []
  );

  // Chat Analysis Functions
  const analyzeChatPatterns = useCallback(() => {
    if (chatMessages.length === 0) return;

    const recentMessages = chatMessages.slice(-30); // Analyze last 30 messages for more responsive alerts
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

    // Spam Detection - More sensitive
    const spamMessages = recentMessages.filter(
      (msg) =>
        msg.message.length > 40 ||
        msg.message.match(/(.)\1{3,}/) || // Repeated characters (3+ instead of 4+)
        msg.message.match(/[A-Z]{8,}/) || // All caps (8+ instead of 10+)
        msg.message.match(/[!]{3,}/) || // Multiple exclamation marks
        msg.message.match(/[?]{3,}/) // Multiple question marks
    );

    if (
      spamMessages.length >= alertSettings.spamThreshold &&
      alertSettings.enableSpamAlerts
    ) {
      createAlert(
        ChatAlertType.SPAM,
        "Spam Detected",
        `${spamMessages.length} potential spam messages detected in recent chat`,
        "medium"
      );
    }

    // Mention Detection - More comprehensive
    const mentionMessages = recentMessages.filter(
      (msg) =>
        msg.message.toLowerCase().includes("boomi") ||
        msg.message.toLowerCase().includes("@boomi") ||
        msg.message.toLowerCase().includes("ai") ||
        msg.message.toLowerCase().includes("co-host") ||
        msg.message.toLowerCase().includes("assistant") ||
        msg.message.toLowerCase().includes("robot") ||
        msg.message.toLowerCase().includes("bot")
    );

    if (
      mentionMessages.length >= alertSettings.mentionThreshold &&
      alertSettings.enableMentionAlerts
    ) {
      createAlert(
        ChatAlertType.MENTION,
        "High AI Mentions",
        `${mentionMessages.length} messages mentioning AI co-host in recent chat`,
        "high"
      );
    }

    // Engagement Analysis - More comprehensive
    const engagementMessages = recentMessages.filter(
      (msg) =>
        msg.message.includes("!") ||
        msg.message.includes("?") ||
        msg.message.includes("🔥") ||
        msg.message.includes("❤️") ||
        msg.message.includes("👍") ||
        msg.message.includes("😍") ||
        msg.message.includes("😎") ||
        msg.message.includes("💯") ||
        msg.message.includes("🎉") ||
        msg.message.includes("👏") ||
        msg.message.includes("💪") ||
        msg.message.includes("🚀")
    );

    if (
      engagementMessages.length >= alertSettings.engagementThreshold &&
      alertSettings.enableEngagementAlerts
    ) {
      createAlert(
        ChatAlertType.ENGAGEMENT,
        "High Engagement",
        `${engagementMessages.length} high-engagement messages detected`,
        "low"
      );
    }

    // Trending Topics - More sensitive
    const wordCount: { [key: string]: number } = {};
    recentMessages.forEach((msg) => {
      const words = msg.message.toLowerCase().split(/\s+/);
      words.forEach((word) => {
        // Filter out common words and short words
        if (
          word.length > 2 &&
          ![
            "the",
            "and",
            "or",
            "but",
            "in",
            "on",
            "at",
            "to",
            "for",
            "of",
            "with",
            "by",
            "is",
            "are",
            "was",
            "were",
            "be",
            "been",
            "have",
            "has",
            "had",
            "do",
            "does",
            "did",
            "will",
            "would",
            "could",
            "should",
            "may",
            "might",
            "can",
            "this",
            "that",
            "these",
            "those",
          ].includes(word)
        ) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });
    });

    const trendingWords = Object.entries(wordCount)
      .filter(([word, count]) => count >= alertSettings.trendingThreshold)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    if (trendingWords.length > 0 && alertSettings.enableTrendingAlerts) {
      const trendingList = trendingWords
        .map(([word, count]) => `"${word}" (${count}x)`)
        .join(", ");
      createAlert(
        ChatAlertType.TRENDING,
        "Trending Topics",
        `Trending words: ${trendingList}`,
        "medium"
      );
    }
  }, [chatMessages, alertSettings]);

  // Analyze chat patterns for alerts - Immediate analysis on new messages
  useEffect(() => {
    if (isConnected && streamStatus?.isLive && chatMessages.length > 0) {
      // Analyze immediately when new messages are added
      analyzeChatPatterns();

      // Also run periodic analysis every 10 seconds
      const interval = setInterval(() => {
        analyzeChatPatterns();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isConnected, streamStatus?.isLive, chatMessages, analyzeChatPatterns]);

  // Loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading stream monitor...</p>
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
  const currentStreamStatus = streamStatus || {
    isLive: false,
    title: "",
    category: "",
    viewerCount: 0,
    duration: "00:00:00",
    chatEnabled: false,
    quality: "good",
    bitrate: 0,
    fps: 0,
    resolution: "",
  };

  // Mock data for demonstration
  const mockChatMessages: ChatMessage[] = [
    {
      id: "1",
      author: "User123",
      message: "Streamer keren banget!",
      timestamp: new Date(Date.now() - 30000),
      messageType: MessageType.NORMAL,
      authorBadge: "Member",
      authorColor: "#FF6B35",
    },
    {
      id: "2",
      author: "Boomi",
      message:
        "Wah, terima kasih! Senang bisa streaming bareng kalian semua! 🔥",
      timestamp: new Date(Date.now() - 25000),
      isAIResponse: true,
      aiCharacter: "Boomi",
      messageType: MessageType.NORMAL,
    },
    {
      id: "3",
      author: "ChatLover",
      message: "Kontennya seru nih",
      timestamp: new Date(Date.now() - 20000),
      messageType: MessageType.NORMAL,
    },
    {
      id: "4",
      author: "StreamFan",
      message: "Boomi lucu banget!",
      timestamp: new Date(Date.now() - 15000),
      messageType: MessageType.NORMAL,
    },
    {
      id: "5",
      author: "Boomi",
      message: "Haha, makasih! Aku memang lucu kan? 😄",
      timestamp: new Date(Date.now() - 10000),
      isAIResponse: true,
      aiCharacter: "Boomi",
      messageType: MessageType.NORMAL,
    },
    {
      id: "6",
      author: "VIP_Viewer",
      message: "💎 Super Chat! Keep up the great content!",
      timestamp: new Date(Date.now() - 5000),
      messageType: MessageType.SUPERCHAT,
      authorBadge: "VIP",
      authorColor: "#FFD700",
      isHighlighted: true,
    },
    {
      id: "7",
      author: "SpamUser",
      message: "SPAM SPAM SPAM SPAM SPAM",
      timestamp: new Date(Date.now() - 3000),
      messageType: MessageType.FILTERED,
      isFiltered: true,
    },
  ];

  const mockChannelInfo: YouTubeChannel = {
    id: "UC123456789",
    name: "GamingPro Indonesia",
    avatar: "https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=G",
    subscriberCount: 125000,
    isVerified: true,
  };

  const updateDuration = (currentDuration: string): string => {
    const [hours, minutes, seconds] = currentDuration.split(":").map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds + 1;

    const newHours = Math.floor(totalSeconds / 3600);
    const newMinutes = Math.floor((totalSeconds % 3600) / 60);
    const newSeconds = totalSeconds % 60;

    return `${newHours.toString().padStart(2, "0")}:${newMinutes
      .toString()
      .padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")}`;
  };

  const handleConnectYouTube = async () => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      // Simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful connection
      setIsConnected(true);
      setChannelInfo(mockChannelInfo);

      // Check for active stream
      await checkStreamStatus();
    } catch (error) {
      setConnectionError("Failed to connect to YouTube. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const checkStreamStatus = async () => {
    setIsCheckingStream(true);

    try {
      // Simulate API call to check stream status
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate finding an active stream
      const mockStreamStatus: StreamStatus = {
        isLive: true,
        title: "Gaming Stream - Valorant Ranked",
        category: "Gaming",
        viewerCount: 1250,
        duration: "01:23:45",
        chatEnabled: true,
        streamId: "live_123456789",
        actualStartTime: new Date(Date.now() - 5025000), // 1:23:45 ago
        quality: StreamQuality.GOOD,
        bitrate: 6000,
        fps: 60,
        resolution: "1080p",
      };

      setStreamStatus(mockStreamStatus);
      setChatMessages(mockChatMessages);

      // Initialize chat stats
      setChatStats({
        totalMessages: mockChatMessages.length,
        aiResponses: mockChatMessages.filter((m) => m.isAIResponse).length,
        filteredMessages: mockChatMessages.filter((m) => m.isFiltered).length,
        superchats: mockChatMessages.filter(
          (m) => m.messageType === MessageType.SUPERCHAT
        ).length,
      });
    } catch (error) {
      console.error("Failed to check stream status:", error);
    } finally {
      setIsCheckingStream(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setChannelInfo(null);
    setStreamStatus({
      isLive: false,
      title: "",
      category: "",
      viewerCount: 0,
      duration: "00:00:00",
      chatEnabled: false,
      quality: StreamQuality.GOOD,
      bitrate: 0,
      fps: 0,
      resolution: "",
    });
    setChatMessages([]);
    setConnectionError(null);
    setChatStats({
      totalMessages: 0,
      aiResponses: 0,
      filteredMessages: 0,
      superchats: 0,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSubscriberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case StreamQuality.GOOD:
        return "text-green-600 bg-green-100";
      case StreamQuality.FAIR:
        return "text-yellow-600 bg-yellow-100";
      case StreamQuality.POOR:
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case StreamQuality.GOOD:
        return <SignalIcon className="w-4 h-4" />;
      case StreamQuality.FAIR:
        return <WifiIcon className="w-4 h-4" />;
      case StreamQuality.POOR:
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <SignalIcon className="w-4 h-4" />;
    }
  };

  const getFilteredMessages = () => {
    let filtered = chatMessages;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (msg) =>
          msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (chatFilter === ChatFilter.AI) {
      filtered = filtered.filter((msg) => msg.isAIResponse);
    } else if (chatFilter === ChatFilter.USER) {
      filtered = filtered.filter((msg) => !msg.isAIResponse);
    }
    // If chatFilter is ChatFilter.ALL, show all messages (no filtering)

    // Apply filtered messages toggle
    if (!showFilteredMessages) {
      filtered = filtered.filter((msg) => !msg.isFiltered);
    }

    return filtered;
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setAutoScroll(isAtBottom);
    }
  };

  const clearChat = () => {
    setChatMessages([]);
    setChatStats({
      totalMessages: 0,
      aiResponses: 0,
      filteredMessages: 0,
      superchats: 0,
    });
  };

  const createAlert = (
    type: ChatAlertType,
    title: string,
    message: string,
    severity: "low" | "medium" | "high"
  ) => {
    // Check for duplicate alerts in the last 30 seconds
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    const recentAlerts = chatAlerts.filter(
      (alert) =>
        alert.type === type &&
        alert.title === title &&
        alert.timestamp > thirtySecondsAgo
    );

    if (recentAlerts.length > 0) {
      return; // Don't create duplicate alerts
    }

    const newAlert = {
      id: Date.now().toString(),
      type: type as ChatAlertType,
      title,
      message,
      severity: severity as AlertSeverity,
      timestamp: new Date(),
      isRead: false,
    };

    setChatAlerts((prev) => [newAlert, ...prev.slice(0, 19)]); // Keep last 20 alerts
  };

  const markAlertAsRead = (alertId: string) => {
    setChatAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const clearAllAlerts = () => {
    setChatAlerts([]);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case ChatAlertType.SPAM:
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case ChatAlertType.MENTION:
        return <UserIcon className="w-4 h-4" />;
      case ChatAlertType.ENGAGEMENT:
        return <HeartIcon className="w-4 h-4" />;
      case ChatAlertType.TRENDING:
        return <ArrowPathIcon className="w-4 h-4" />;
      case ChatAlertType.WARNING:
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <InformationCircleIcon className="w-4 h-4" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case AlertSeverity.HIGH:
        return "bg-red-50 border-red-200 text-red-800";
      case AlertSeverity.MEDIUM:
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case AlertSeverity.LOW:
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <PageHeader
        icon={VideoCameraIcon}
        title="Stream Monitor"
        description="Monitor your live stream and manage AI co-host interactions in real-time"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column - Stream Info & Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* YouTube Connection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            {/* Header with improved styling */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                  <PlayIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    YouTube Connection
                  </h2>
                  <p className="text-xs text-gray-500">
                    Connect your channel to start monitoring
                  </p>
                </div>
              </div>
            </div>

            {!isConnected ? (
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Connect your YouTube channel to start monitoring your stream
                </p>

                {/* OAuth Information */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <ShieldCheckIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-blue-900 mb-1">
                        Secure OAuth Connection
                      </h3>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        We use YouTube&apos;s official OAuth 2.0 to securely
                        access your channel data. We only request permission to
                        read your live chat and stream information.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Permissions List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    Required Permissions:
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-3 h-3 text-green-500" />
                      <span>Read live chat messages</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-3 h-3 text-green-500" />
                      <span>Access stream information</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-3 h-3 text-green-500" />
                      <span>View channel statistics</span>
                    </li>
                  </ul>
                </div>

                {connectionError && (
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <div className="flex items-center space-x-2">
                      <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700">
                        {connectionError}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleConnectYouTube}
                  disabled={isConnecting}
                  className="w-full bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isConnecting ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <PlayIcon className="w-4 h-4" />
                      <span>Connect YouTube</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Channel Info */}
                {channelInfo && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={channelInfo.avatar}
                        alt={channelInfo.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {channelInfo.name}
                          </h3>
                          {channelInfo.isVerified && (
                            <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatSubscriberCount(channelInfo.subscriberCount)}{" "}
                          subscribers
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Connection Status
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    Connected
                  </span>
                </div>

                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center space-x-2">
                    <InformationCircleIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      Successfully connected to YouTube
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="w-full bg-gray-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200"
                >
                  Disconnect YouTube
                </button>
              </div>
            )}
          </div>

          {/* Stream Status */}
          {isConnected && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              {/* Header with improved styling */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                    <VideoCameraIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      Stream Status
                    </h2>
                    <p className="text-xs text-gray-500">
                      Live stream information and metrics
                    </p>
                  </div>
                </div>
                <button
                  onClick={checkStreamStatus}
                  disabled={isCheckingStream}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50"
                  title="Refresh stream status"
                >
                  <ArrowPathIcon
                    className={`w-4 h-4 ${
                      isCheckingStream ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Live Status
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      currentStreamStatus.isLive
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {currentStreamStatus.isLive ? (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
                        LIVE
                      </>
                    ) : (
                      "OFFLINE"
                    )}
                  </span>
                </div>

                {currentStreamStatus.isLive ? (
                  <>
                    <div>
                      <p className="text-xs text-gray-500">Title</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {currentStreamStatus.title}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="text-sm font-medium text-gray-900">
                        {currentStreamStatus.category}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Viewers</p>
                        <div className="flex items-center">
                          <EyeIcon className="w-4 h-4 text-gray-400 mr-1" />
                          <p className="text-sm font-medium text-gray-900">
                            {currentStreamStatus.viewerCount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 text-gray-400 mr-1" />
                          <p className="text-sm font-medium text-gray-900">
                            {currentStreamStatus.duration}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stream Quality */}
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Stream Quality
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Quality</p>
                          <div className="flex items-center mt-1">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(
                                currentStreamStatus.quality
                              )}`}
                            >
                              {getQualityIcon(currentStreamStatus.quality)}
                              <span className="ml-1 capitalize">
                                {currentStreamStatus.quality}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Resolution</p>
                          <p className="text-sm font-medium text-gray-900">
                            {currentStreamStatus.resolution}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Bitrate</p>
                          <p className="text-sm font-medium text-gray-900">
                            {currentStreamStatus.bitrate} kbps
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">FPS</p>
                          <p className="text-sm font-medium text-gray-900">
                            {currentStreamStatus.fps}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stream Details */}
                    {currentStreamStatus.streamId && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Stream Details
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-500">Stream ID</p>
                            <p className="text-sm font-mono text-gray-900">
                              {currentStreamStatus.streamId}
                            </p>
                          </div>
                          {currentStreamStatus.actualStartTime && (
                            <div>
                              <p className="text-xs text-gray-500">Started</p>
                              <p className="text-sm text-gray-900">
                                {formatTime(
                                  currentStreamStatus.actualStartTime
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <VideoCameraIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm text-gray-500 mb-2">
                      No active stream found
                    </p>
                    <p className="text-xs text-gray-400">
                      Start streaming on YouTube to see live data here
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Real-time Chat Pattern Detection */}
          {isConnected && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              {/* Header with improved styling */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                    <SignalIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      Real-time Pattern Detection
                    </h2>
                    <p className="text-xs text-gray-500">
                      Live chat analysis and trends
                    </p>
                  </div>
                </div>
              </div>

              {/* Pattern Detection Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">
                      Spam Detected
                    </span>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {
                      chatMessages.filter(
                        (msg) =>
                          msg.message.length > 40 ||
                          msg.message.match(/(.)\1{3,}/) ||
                          msg.message.match(/[A-Z]{8,}/) ||
                          msg.message.match(/[!]{3,}/) ||
                          msg.message.match(/[?]{3,}/)
                      ).length
                    }
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">
                      AI Mentions
                    </span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {
                      chatMessages.filter(
                        (msg) =>
                          msg.message.toLowerCase().includes("boomi") ||
                          msg.message.toLowerCase().includes("@boomi") ||
                          msg.message.toLowerCase().includes("ai") ||
                          msg.message.toLowerCase().includes("co-host") ||
                          msg.message.toLowerCase().includes("assistant") ||
                          msg.message.toLowerCase().includes("robot") ||
                          msg.message.toLowerCase().includes("bot")
                      ).length
                    }
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">
                      High Engagement
                    </span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {
                      chatMessages.filter(
                        (msg) =>
                          msg.message.includes("!") ||
                          msg.message.includes("?") ||
                          msg.message.includes("🔥") ||
                          msg.message.includes("❤️") ||
                          msg.message.includes("👍") ||
                          msg.message.includes("😍") ||
                          msg.message.includes("😎") ||
                          msg.message.includes("💯") ||
                          msg.message.includes("🎉") ||
                          msg.message.includes("👏") ||
                          msg.message.includes("💪") ||
                          msg.message.includes("🚀")
                      ).length
                    }
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">
                      Trending Words
                    </span>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {(() => {
                      const wordCount: { [key: string]: number } = {};
                      chatMessages.slice(-30).forEach((msg) => {
                        const words = msg.message.toLowerCase().split(/\s+/);
                        words.forEach((word) => {
                          if (
                            word.length > 2 &&
                            ![
                              "the",
                              "and",
                              "or",
                              "but",
                              "in",
                              "on",
                              "at",
                              "to",
                              "for",
                              "of",
                              "with",
                              "by",
                              "is",
                              "are",
                              "was",
                              "were",
                              "be",
                              "been",
                              "have",
                              "has",
                              "had",
                              "do",
                              "does",
                              "did",
                              "will",
                              "would",
                              "could",
                              "should",
                              "may",
                              "might",
                              "can",
                              "this",
                              "that",
                              "these",
                              "those",
                            ].includes(word)
                          ) {
                            wordCount[word] = (wordCount[word] || 0) + 1;
                          }
                        });
                      });
                      return Object.entries(wordCount).filter(
                        ([, count]) => count >= 3
                      ).length;
                    })()}
                  </p>
                </div>
              </div>

              {/* Live Pattern Activity */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <WifiIcon className="w-4 h-4 text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Live Activity
                  </h4>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {chatMessages
                    .slice(-10)
                    .reverse()
                    .map((message) => {
                      const isSpam =
                        message.message.length > 40 ||
                        message.message.match(/(.)\1{3,}/) ||
                        message.message.match(/[A-Z]{8,}/) ||
                        message.message.match(/[!]{3,}/) ||
                        message.message.match(/[?]{3,}/);

                      const isAIMention =
                        message.message.toLowerCase().includes("boomi") ||
                        message.message.toLowerCase().includes("@boomi") ||
                        message.message.toLowerCase().includes("ai") ||
                        message.message.toLowerCase().includes("co-host") ||
                        message.message.toLowerCase().includes("assistant") ||
                        message.message.toLowerCase().includes("robot") ||
                        message.message.toLowerCase().includes("bot");

                      const isHighEngagement =
                        message.message.includes("!") ||
                        message.message.includes("?") ||
                        message.message.includes("🔥") ||
                        message.message.includes("❤️") ||
                        message.message.includes("👍") ||
                        message.message.includes("😍") ||
                        message.message.includes("😎") ||
                        message.message.includes("💯") ||
                        message.message.includes("🎉") ||
                        message.message.includes("👏") ||
                        message.message.includes("💪") ||
                        message.message.includes("🚀");

                      if (isSpam || isAIMention || isHighEngagement) {
                        return (
                          <div
                            key={message.id}
                            className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                isSpam
                                  ? "bg-red-500"
                                  : isAIMention
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-700 truncate">
                                <span className="font-medium">
                                  {message.author}:
                                </span>{" "}
                                {message.message}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })
                    .filter(Boolean)}
                </div>
              </div>
            </div>
          )}

          {/* Chat Analysis Alerts */}
          {isConnected && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              {/* Header with improved styling */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <BellIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      Chat Analysis Alerts
                    </h2>
                    <p className="text-xs text-gray-500">
                      Real-time pattern detection
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {chatAlerts.filter((a) => !a.isRead).length > 0 && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span>
                        {chatAlerts.filter((a) => !a.isRead).length} unread
                      </span>
                    </div>
                  )}
                  <button
                    onClick={clearAllAlerts}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Clear all alerts"
                  >
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Alerts List with chat-like styling */}
              <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {chatAlerts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <BellIcon className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      No alerts yet
                    </p>
                    <p className="text-xs text-gray-400">
                      Alerts will appear here when chat patterns are detected
                    </p>
                  </div>
                ) : (
                  chatAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex text-grey-700 items-start space-x-3 p-3 transition-all duration-200 cursor-pointer bg-gray-50 rounded-lg ${
                        !alert.isRead && "bg-white border border-gray-200"
                      }`}
                      onClick={() => markAlertAsRead(alert.id)}
                    >
                      {/* Alert Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          alert.isRead
                            ? "bg-gray-200 text-gray-500"
                            : getAlertColor(alert.severity).includes("red")
                            ? "bg-red-100 text-red-600"
                            : getAlertColor(alert.severity).includes("yellow")
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {getAlertIcon(alert.type)}
                      </div>

                      {/* Alert Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4
                            className={`text-sm font-medium ${
                              alert.isRead ? "text-gray-600" : "text-gray-900"
                            }`}
                          >
                            {alert.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatTime(alert.timestamp)}
                          </span>
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <p
                          className={`text-sm ${
                            alert.isRead ? "text-gray-500" : "text-gray-700"
                          }`}
                        >
                          {alert.message}
                        </p>

                        {/* Severity badge */}
                        <div className="flex items-center mt-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              alert.severity === "high"
                                ? "bg-red-100 text-red-800"
                                : alert.severity === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {alert.severity.charAt(0).toUpperCase() +
                              alert.severity.slice(1)}{" "}
                            Priority
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Alert Settings with improved styling */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Cog6ToothIcon className="w-4 h-4 text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Alert Settings
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Spam Detection</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alertSettings.enableSpamAlerts} // TODO: Replace with actual alert settings
                        onChange={(e) =>
                          setAlertSettings((prev) => ({
                            ...prev,
                            enableSpamAlerts: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">AI Mentions</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alertSettings.enableMentionAlerts} // TODO: Replace with actual alert settings
                        onChange={(e) =>
                          setAlertSettings((prev) => ({
                            ...prev,
                            enableMentionAlerts: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">High Engagement</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alertSettings.enableEngagementAlerts} // TODO: Replace with actual alert settings
                        onChange={(e) =>
                          setAlertSettings((prev) => ({
                            ...prev,
                            enableEngagementAlerts: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Trending Topics</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alertSettings.enableTrendingAlerts} // TODO: Replace with actual alert settings
                        onChange={(e) =>
                          setAlertSettings((prev) => ({
                            ...prev,
                            enableTrendingAlerts: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Response Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            {/* Header with improved styling */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    AI Response Settings
                  </h2>
                  <p className="text-xs text-gray-500">
                    Configure AI co-host behavior
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Rate: {responseRate}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={responseRate}
                  onChange={(e) => setResponseRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  AI Status
                </span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    aiResponseStatus === AIResponseStatus.IDLE
                      ? "bg-gray-100 text-gray-800"
                      : aiResponseStatus === AIResponseStatus.PROCESSING
                      ? "bg-yellow-100 text-yellow-800"
                      : aiResponseStatus === AIResponseStatus.RESPONDING
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {aiResponseStatus === AIResponseStatus.IDLE && (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
                      Idle
                    </>
                  )}
                  {aiResponseStatus === AIResponseStatus.PROCESSING && (
                    <>
                      <ArrowPathIcon className="w-3 h-3 mr-1 animate-spin" />
                      Processing
                    </>
                  )}
                  {aiResponseStatus === AIResponseStatus.RESPONDING && (
                    <>
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Responding
                    </>
                  )}
                  {aiResponseStatus === AIResponseStatus.ERROR && (
                    <>
                      <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                      Error
                    </>
                  )}
                </span>
              </div>

              {/* AI Response Statistics */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <SignalIcon className="w-4 h-4 text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Response Statistics
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">
                      Total Responses
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {aiResponseStats.totalResponses}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Success Rate</p>
                    <p className="text-lg font-bold text-gray-900">
                      {aiResponseStats.successRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">
                      Avg Response Time
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {aiResponseStats.averageResponseTime > 0
                        ? `${(
                            aiResponseStats.averageResponseTime / 1000
                          ).toFixed(1)}s`
                        : "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Queue Length</p>
                    <p className="text-lg font-bold text-gray-900">
                      {aiResponseStats.responseQueue}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Activity Log */}
              {aiActivity.length > 0 && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <ClockIcon className="w-4 h-4 text-gray-500" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Recent Activity
                    </h4>
                  </div>
                  <div className="space-y-3 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {aiActivity.slice(-5).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            activity.type === AIActivityType.RESPONSE
                              ? "bg-green-500"
                              : activity.type === AIActivityType.ERROR
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 truncate">
                            {activity.message}
                          </p>
                        </div>
                        {activity.duration && (
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                            {activity.duration > 0
                              ? `${(activity.duration / 1000).toFixed(1)}s`
                              : ""}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Live Chat */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-220px)] flex flex-col sticky top-24">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Live Chat</h2>
                  <p className="text-xs text-gray-500">
                    Real-time chat monitoring
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{getFilteredMessages().length} messages</span>
                </div>
                <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200">
                  <Cog6ToothIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Controls */}
            {isConnected && (
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search */}
                  <div className="relative flex-1 min-w-0">
                    <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Filter */}
                  <select
                    value={chatFilter}
                    onChange={(e) =>
                      setChatFilter(e.target.value as ChatFilter)
                    }
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={ChatFilter.ALL}>All Messages</option>
                    <option value={ChatFilter.AI}>AI Responses</option>
                    <option value={ChatFilter.USER}>User Messages</option>
                  </select>

                  {/* Pause/Resume */}
                  <button
                    onClick={() => setIsChatPaused(!isChatPaused)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isChatPaused
                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title={isChatPaused ? "Resume chat" : "Pause chat"}
                  >
                    {isChatPaused ? (
                      <SpeakerWaveIcon className="w-4 h-4" />
                    ) : (
                      <SpeakerXMarkIcon className="w-4 h-4" />
                    )}
                  </button>

                  {/* Show Filtered */}
                  <button
                    onClick={() =>
                      setShowFilteredMessages(!showFilteredMessages)
                    }
                    className={`p-1.5 rounded-lg transition-colors ${
                      showFilteredMessages
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title={
                      showFilteredMessages
                        ? "Hide filtered messages"
                        : "Show filtered messages"
                    }
                  >
                    <FlagIcon className="w-4 h-4" />
                  </button>

                  {/* Clear Chat */}
                  <button
                    onClick={clearChat}
                    className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                    title="Clear chat"
                  >
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Chat Stats */}
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Total: {chatStats.totalMessages}</span>
                    <span>AI: {chatStats.aiResponses}</span>
                    <span>Filtered: {chatStats.filteredMessages}</span>
                    <span>Superchats: {chatStats.superchats}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Auto-scroll: {autoScroll ? "On" : "Off"}</span>
                    <span>Paused: {isChatPaused ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {!isConnected ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Connect to YouTube to see live chat
                    </p>
                  </div>
                </div>
              ) : getFilteredMessages().length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchQuery
                        ? "No messages match your search"
                        : "No messages yet"}
                    </p>
                  </div>
                </div>
              ) : (
                getFilteredMessages().map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 p-3 ${
                      message.isAIResponse ? "bg-blue-50 rounded-lg p-3" : ""
                    } ${
                      message.isHighlighted
                        ? "bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                        : ""
                    } ${
                      message.isFiltered
                        ? "bg-red-50 border border-red-200 rounded-lg p-3 opacity-75"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isAIResponse
                          ? "bg-gradient-to-br from-blue-400 to-purple-400"
                          : message.messageType === "superchat"
                          ? "bg-gradient-to-br from-yellow-400 to-orange-400"
                          : "bg-gray-200"
                      }`}
                    >
                      {message.isAIResponse ? (
                        <span className="text-white text-xs font-bold">
                          {message.aiCharacter?.charAt(0)}
                        </span>
                      ) : (
                        <UserIcon className="w-4 h-4 text-gray-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`text-sm font-medium ${
                            message.isAIResponse
                              ? "text-blue-700"
                              : "text-gray-900"
                          }`}
                          style={
                            message.authorColor
                              ? { color: message.authorColor }
                              : {}
                          }
                        >
                          {message.author}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.authorBadge && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {message.authorBadge}
                          </span>
                        )}
                        {message.isAIResponse && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            AI
                          </span>
                        )}
                        {message.messageType === "superchat" && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            💎 Super Chat
                          </span>
                        )}
                        {message.isFiltered && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Filtered
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          message.isAIResponse
                            ? "text-blue-800"
                            : "text-gray-700"
                        }`}
                      >
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
