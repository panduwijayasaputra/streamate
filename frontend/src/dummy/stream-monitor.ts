import {
  ChatMessage,
  AIActivityType,
  MessageType,
  StreamQuality,
  StreamStatus,
  YouTubeChannel,
  ChatAlertType,
} from "@/types/stream";
import { AlertSeverity } from "@/types/common";

// Stream Monitor Dummy Data
export const dummyStreamStatus: StreamStatus = {
  isLive: true,
  title: "Gaming Stream - Valorant Ranked",
  category: "Gaming",
  viewerCount: 1250,
  duration: "01:23:45",
  chatEnabled: true,
  streamId: "stream_123",
  quality: StreamQuality.GOOD,
  bitrate: 6000,
  fps: 60,
  resolution: "1920x1080",
};

export const dummyChatMessages: ChatMessage[] = [
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
    message: "Wah, terima kasih! Senang bisa streaming bareng kalian semua! 🔥",
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

export const dummyChannelInfo: YouTubeChannel = {
  id: "UC123456789",
  name: "GamingPro Indonesia",
  avatar: "https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=G",
  subscriberCount: 125000,
  isVerified: true,
};

export const dummyAIResponseStats = {
  totalResponses: 156,
  averageResponseTime: 2.3,
  lastResponseTime: new Date(Date.now() - 5000),
  responseQueue: 0,
  errorCount: 2,
  successRate: 98.7,
};

export const dummyAIActivity = [
  {
    id: "1",
    type: AIActivityType.RESPONSE,
    message: "Terima kasih atas dukungannya!",
    timestamp: new Date(Date.now() - 5000),
    confidence: 0.95,
    character: "Boomi",
  },
  {
    id: "2",
    type: AIActivityType.ERROR,
    message: "Message filtered for inappropriate content",
    timestamp: new Date(Date.now() - 8000),
    confidence: 0.88,
    character: "System",
  },
  {
    id: "3",
    type: AIActivityType.RESPONSE,
    message: "Senang bisa bermain dengan kalian!",
    timestamp: new Date(Date.now() - 12000),
    confidence: 0.92,
    character: "Boomi",
  },
];

export const dummyAlerts = [
  {
    id: "1",
    type: ChatAlertType.SPAM,
    title: "Spam Detected",
    message: "Multiple messages from same user",
    severity: AlertSeverity.MEDIUM,
    timestamp: new Date(Date.now() - 10000),
    isRead: false,
  },
  {
    id: "2",
    type: ChatAlertType.MENTION,
    title: "Mention Alert",
    message: "Someone mentioned you in chat",
    severity: AlertSeverity.LOW,
    timestamp: new Date(Date.now() - 15000),
    isRead: true,
  },
  {
    id: "3",
    type: ChatAlertType.ENGAGEMENT,
    title: "High Engagement",
    message: "Chat activity increased by 50%",
    severity: AlertSeverity.LOW,
    timestamp: new Date(Date.now() - 20000),
    isRead: false,
  },
];
