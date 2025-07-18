# Streamate - Product Requirements Document

## Executive Summary

**Project Name:** Streamate  
**Target Market:** Indonesian YouTube Streamers  
**Project Type:** MVP Web Application  
**Primary Goal:** Provide AI-powered co-hosting assistance to help streamers engage with chat while maintaining focus on their content  

## Problem Statement

Indonesian YouTube streamers face challenges:
- **Engagement vs Focus**: Can't respond to all chat messages while playing competitive games or creating content
- **Language Barriers**: Need support for Indonesian, English, and mixed language interactions
- **Chat Overwhelm**: High-volume chats become impossible to manage effectively
- **Missed Opportunities**: Important questions, milestones, and community moments get overlooked

## Solution Overview

An AI-powered co-host system that provides:
1. **Chat Assist**: Intelligent responses when mentioned by name
2. **Stream Intelligence**: Background analysis with smart alerts and insights
3. **OBS Integration**: Real-time animated character overlay
4. **Cultural Adaptation**: Indonesian language and cultural context support

## Core Features

### 1. Chat Assist Engine
**Primary Function:** AI responds when mentioned (@ai_name) with character personality

**Key Features:**
- Mention detection system (@maria, @boomi, etc.)
- Content filtering (inappropriate, spam, very short, non-context)
- OpenAI integration with character-specific prompts
- Multi-language support (Indonesian, English, mixed)
- Indonesian slang recognition ("mantap bro", "gila banget", etc.)

**Response Flow:**
```
Chat Message → Mention Detection → Content Filter → OpenAI Processing → Character Response → OBS Overlay
```

### 2. Stream Intelligence Engine
**Primary Function:** Background analysis providing intelligent alerts

**Features:**
- **Trending Questions**: Alert when 100+ viewers ask similar questions
- **New Follower Alerts**: Welcome messages for new followers
- **Milestone Celebrations**: Viewer count, subscriber milestones
- **Stream Health Check**: Technical issue alerts from chat feedback
- **Question Queue**: Collect and prioritize unanswered questions
- **Topic Suggestions**: Suggest discussion topics when chat goes quiet
- **Content Info**: Quick facts about games/topics being discussed

### 3. Character System
**10 Unique AI Personalities** with different response styles:

| Character | Personality | Call Style | Language Style |
|-----------|-------------|------------|----------------|
| 🧨 Boomi | Chaos Puff - Wild, hype | Boss/Legend | Explosive mixed |
| 🌙 Drift | Dream Wisp - Chill, dreamy | Kak | Calm mixed |
| 🎓 Pip | Brain Orb - Nerdy, analytical | Mas/Mbak | Intellectual |
| 💀 Snacc | Skeletal Snake - Edgy trickster | Bang | Edgy mixed |
| 💌 Bloop | Love Blob - Affectionate | Kakak/Sayang | Sweet mixed |
| 🎮 Patch | Glitch Sprite - Witty, sarcastic | Bro | Meta humor |
| 🧊 Frosty | Ice Orb - Cool, collected | Bang | Dry humor |
| 🔥 Spark | Ember Sprite - Hyper, ADHD | Boss | Rapid energy |
| 🐙 Tako | Mini Octopus - Goofy, lovable | Kak | Wholesome chaos |
| 🧽 Melo | Mood Sponge - Empathic | Kakak | Emotional mirror |

**Character Features:**
- Real-time character switching during streams
- Animated sprites with multiple states (idle, talking, excited)
- Unique personality prompts for OpenAI

### 4. OBS Integration
**Animated Character Overlay:**
- Browser source compatible
- Real-time WebSocket updates
- Character animations (idle, talking, excited states)
- Customizable speech bubbles
- CSS animations + sprite sheets

## Technical Architecture

### Tech Stack
- **Frontend:** NextJS (React)
- **Backend:** NestJS (Node.js)
- **Database:** PostgreSQL with TypeORM
- **AI Integration:** OpenAI API
- **Real-time:** WebSocket connections with in-memory management
- **Authentication:** Standard email/password registration + Optional YouTube OAuth (for streaming features)
- **External APIs:** YouTube Live Chat API

### System Architecture
```
NextJS Frontend ←→ NestJS Backend ←→ PostgreSQL Database
                      ↓
              YouTube Live Chat API
                      ↓
               OpenAI API Processing
                      ↓
    WebSocket (In-Memory) → OBS Overlay
```

### Database Schema
**Core Tables:**
- `users` (id, email, password_hash, youtube_channel_id, youtube_oauth_token, youtube_oauth_refresh_token)
- `streams` (id, user_id, youtube_stream_id, title, category, status, viewer_count, is_monitoring, started_at, ended_at)
- `characters` (id, name, personality_prompt, animation_config)
- `stream_messages` (id, stream_id, content, status, ai_response, character_id, filter_reason, confidence_score)
- `user_settings` (id, user_id, ai_name, streamer_name, selected_character_id, language_preferences)

## User Interface

### Pages Structure
1. **Landing Page**: Product overview, features, demo
2. **Authentication**: Login/Register with email/password
3. **Dashboard**: 
   - Total streams, messages, filtered, AI responses
   - Recent activity feed
   - Stream list management
4. **Stream Monitor**:
   - YouTube OAuth integration check
   - If not connected: YouTube connection prompt
   - If connected: 
     - Fetch current live stream from YouTube API
     - Check database for existing stream record
     - Update existing or create new stream record
     - Ensure only 1 active live stream per user
   - Live chat panel with AI response status
   - Stream info (title, category, viewers, live status)
5. **AI Settings**:
   - Character selection with previews
   - AI name configuration
   - Streamer name setting
   - Bubble appearance customization
6. **Response Settings**:
   - Response rate limits
   - Filter word management
   - Response criteria configuration

### OBS Overlay Interface
- Animated character sprite
- Speech bubble with customizable styling
- Smooth state transitions
- Performance optimized for streaming

## User Flow

### Setup Flow
1. User visits landing page
2. Register/Login (standard email/password registration)
3. Redirect to dashboard after successful registration
4. User explores dashboard features
5. When accessing Stream Monitor:
   - Check if YouTube OAuth is integrated
   - If integrated: Show current live streaming from YouTube API
   - If not integrated: Prompt user to connect YouTube account
6. Configure AI settings (character, name, appearance)
7. Set response preferences
8. Add OBS browser source
9. Start streaming with AI co-host active

### Streaming Flow
1. User starts YouTube live stream
2. User accesses Stream Monitor page
3. System checks for YouTube OAuth integration:
   - If not connected: Show YouTube connection button
   - If connected: Fetch current live stream from YouTube API
4. Stream Database Management:
   - Check database for existing stream with current YouTube stream ID
   - If exists: Update stream status, title, viewer count, category
   - If not exists: Create new stream record in database
   - Ensure only 1 live stream per user (set others to 'ended')
5. System begins monitoring chat via YouTube API
6. Chat messages processed through filters
7. Mentioned messages sent to OpenAI with character context
8. AI responses displayed in OBS overlay
9. Stream Intelligence alerts shown to streamer

## MVP Scope

### Included in MVP
- Core Chat Assist functionality
- Stream Intelligence basic features
- All 10 character personalities
- YouTube Live Chat API integration
- OpenAI response system
- Basic OBS overlay with CSS animations
- User dashboard and settings
- Free tier for all users

### Post-MVP Features
- Advanced analytics and insights
- Custom character creation
- Subscription tiers and monetization
- Advanced animation system (Lottie)
- Mobile app for stream monitoring
- Integration with other streaming platforms

## Success Metrics

### Primary KPIs
- Active streamers using the system weekly
- AI responses generated per stream
- User retention rate (weekly/monthly)
- Average session duration

### Secondary KPIs
- Chat engagement improvement
- Streamer satisfaction scores
- Character usage distribution
- Technical performance metrics

## Technical Requirements

### Performance
- Real-time response latency < 2 seconds
- Support for 1000+ concurrent streams
- 99.9% uptime during peak hours
- Efficient YouTube API quota usage

### Security
- Secure OAuth implementation
- API rate limiting and abuse prevention
- Data encryption at rest and in transit
- GDPR compliance for user data

### Scalability
- Horizontal scaling for increased load
- Database optimization for high-volume chat processing
- CDN for static assets and character sprites
- Caching for frequently accessed data

## Dependencies

### External Services
- **YouTube Live Chat API**: Core functionality dependency
- **OpenAI API**: AI response generation
- **Google OAuth**: User authentication

### Technical Dependencies
- Node.js runtime environment
- PostgreSQL database
- WebSocket support for real-time features
- Modern browser support for OBS integration

## Risk Assessment

### High Risk
- YouTube API rate limits and costs
- OpenAI API costs and rate limits
- Real-time performance at scale

### Medium Risk
- Character animation complexity
- Multi-language AI accuracy
- User adoption in Indonesian market

### Low Risk
- Basic web application functionality
- Database performance
- Authentication implementation

## Development Timeline

### Phase 1 (Weeks 1-4): Foundation
- Database schema and backend setup
- YouTube API integration
- Basic user authentication

### Phase 2 (Weeks 5-8): Core Features
- Chat processing pipeline
- OpenAI integration with characters
- Basic frontend interface

### Phase 3 (Weeks 9-12): Integration
- OBS overlay system
- WebSocket real-time updates
- Character animation system

### Phase 4 (Weeks 13-16): Polish & Launch
- UI/UX refinement
- Performance optimization
- Beta testing and launch preparation

## Technical Implementation Details

### Error Handling & Edge Cases

**API Failure Management:**
```javascript
// YouTube API Error Handling
const handleYouTubeAPIError = async (error, userId) => {
  switch (error.code) {
    case 403: // Quota exceeded
      await notifyUser(userId, "YouTube API quota exceeded. Retrying in 1 hour.");
      scheduleRetry(userId, 3600000); // 1 hour
      break;
    case 401: // Token expired
      await refreshYouTubeToken(userId);
      break;
    case 500: // YouTube server error
      await fallbackToCachedData(userId);
      scheduleRetry(userId, 300000); // 5 minutes
      break;
    default:
      await logError(error, userId);
      await notifyUser(userId, "Temporary connection issue. Reconnecting...");
  }
};

// OpenAI API Error Handling
const handleOpenAIError = async (error, message) => {
  switch (error.type) {
    case 'rate_limit_exceeded':
      await queueMessage(message, { delay: 60000 }); // Queue for 1 minute
      break;
    case 'insufficient_quota':
      await sendFallbackResponse(message, "AI temporarily unavailable");
      break;
    case 'timeout':
      await retryWithBackoff(message, 3); // 3 retry attempts
      break;
    default:
      await logError(error, message);
  }
};
```

**Stream Interruption Recovery:**
- Automatic reconnection with exponential backoff
- State persistence during disconnections
- Graceful degradation when APIs unavailable
- User notification system for service status

### Real-time Architecture Specifications

**WebSocket Connection Management:**
```javascript
// WebSocket Server Configuration
const wsConfig = {
  heartbeatInterval: 30000, // 30 seconds
  maxConnections: 1000, // Reduced for single server
  messageQueue: {
    maxSize: 1000,
    retryAttempts: 3,
    retryDelay: 5000
  },
  rooms: {
    pattern: `stream_${userId}`,
    maxClientsPerRoom: 5 // OBS + Dashboard + Mobile
  }
};

// Simple In-Memory Message Processing
const messageProcessor = {
  queue: [], // Simple array-based queue
  processing: false,
  stages: [
    'intake', // Raw YouTube chat message
    'filter', // Content filtering
    'queue',  // In-memory queue
    'ai',     // OpenAI processing
    'broadcast' // WebSocket broadcast
  ],
  maxThroughput: 50, // messages per second (realistic for single server)
  
  async processQueue() {
    if (this.processing) return;
    this.processing = true;
    
    while (this.queue.length > 0) {
      const message = this.queue.shift();
      await this.processMessage(message);
    }
    
    this.processing = false;
  }
};
```

**High-Volume Chat Processing:**
- In-memory message queuing with JavaScript arrays
- Priority processing (mentions > general chat)
- Circuit breaker pattern for API protection
- Database-based persistence for reliability

### Content Filtering System

**Indonesian Content Filtering:**
```javascript
const indonesianFilter = {
  profanity: [
    'anjing', 'bangsat', 'kontol', 'memek', 'tolol',
    'goblok', 'bodoh', 'bego', 'sialan', 'brengsek'
  ],
  
  // Judi Online (Gambling) Filter - Critical for Indonesian streams
  gambling: {
    keywords: [
      'judi online', 'judol', 'slot online', 'situs judi',
      'casino online', 'poker online', 'togel online',
      'bandar judi', 'agen judi', 'daftar judi',
      'deposit judi', 'bonus judi', 'menang judi',
      'jackpot', 'maxwin', 'scatter', 'freespin',
      'gacor', 'rtp tinggi', 'anti rungkad'
    ],
    patterns: [
      /judi\s*online/gi,
      /slot\s*gacor/gi,
      /bonus\s*\d+\s*ribu/gi,
      /daftar\s*sekarang/gi,
      /link\s*slot/gi,
      /situs\s*terpercaya/gi,
      /deposit\s*\d+/gi,
      /wd\s*lancar/gi, // Withdraw lancar
      /anti\s*banned/gi
    ],
    domains: [
      /\w+slot\w*/gi,
      /\w+casino\w*/gi,
      /\w+poker\w*/gi,
      /\w+bet\w*/gi,
      /\w+judi\w*/gi
    ],
    severity: 'high', // Auto-ban gambling promotions
    action: 'instant_filter'
  },
  
  spam: {
    maxRepetition: 3,
    maxCapsPercentage: 70,
    maxEmojis: 10,
    suspiciousPatterns: [
      /(.)\1{4,}/, // Character repetition
      /[A-Z]{5,}/, // Excessive caps
      /bit\.ly|tinyurl|t\.co/, // Suspicious links
      /wa\.me|whatsapp/gi, // WhatsApp links (often used for gambling)
      /telegram\.me|t\.me/gi // Telegram links
    ]
  },
  
  nonContext: {
    greetings: ['hi', 'hello', 'halo', 'hai'],
    irrelevant: ['first', 'pertamax', 'early'],
    tooShort: { minLength: 5, exceptions: ['gg', 'wp', 'yes', 'no'] }
  }
};

// Advanced Gambling Detection
const gamblingDetection = {
  // Multi-layered detection system
  detectGambling(message) {
    const analysis = {
      keywordMatch: this.checkKeywords(message),
      patternMatch: this.checkPatterns(message),
      domainMatch: this.checkDomains(message),
      contextAnalysis: this.analyzeContext(message),
      confidence: 0
    };
    
    // Calculate confidence score
    if (analysis.keywordMatch) analysis.confidence += 0.4;
    if (analysis.patternMatch) analysis.confidence += 0.3;
    if (analysis.domainMatch) analysis.confidence += 0.5;
    if (analysis.contextAnalysis) analysis.confidence += 0.2;
    
    return {
      isGambling: analysis.confidence >= 0.6,
      confidence: analysis.confidence,
      reason: this.getDetectionReason(analysis)
    };
  },
  
  checkKeywords(message) {
    const lowerMessage = message.toLowerCase();
    return indonesianFilter.gambling.keywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
  },
  
  checkPatterns(message) {
    return indonesianFilter.gambling.patterns.some(pattern => 
      pattern.test(message)
    );
  },
  
  checkDomains(message) {
    return indonesianFilter.gambling.domains.some(domain => 
      domain.test(message)
    );
  }
};

// Enhanced Filtering Logic
const filterMessage = (message) => {
  const analysis = {
    isInappropriate: checkProfanity(message),
    isGambling: gamblingDetection.detectGambling(message),
    isSpam: checkSpamPatterns(message),
    isNonContext: checkRelevance(message),
    isTooShort: message.length < 5 && !isException(message),
    confidence: calculateConfidence(message)
  };
  
  // Priority filtering - gambling gets highest priority
  if (analysis.isGambling.isGambling) {
    return {
      status: 'gambling_filtered',
      confidence: analysis.isGambling.confidence,
      reason: analysis.isGambling.reason,
      action: 'instant_ban' // Strongest action for gambling
    };
  }
  
  if (analysis.isInappropriate) {
    return { status: 'inappropriate', action: 'filter' };
  }
  
  if (analysis.isSpam) {
    return { status: 'spam', action: 'filter' };
  }
  
  if (analysis.isNonContext) {
    return { status: 'non_context', action: 'ignore' };
  }
  
  if (analysis.isTooShort) {
    return { status: 'very_short', action: 'ignore' };
  }
  
  return { status: 'valid', action: 'process' };
};
```

### Cost Optimization & API Management

**API Cost Structure:**
```javascript
const apiCosts = {
  openai: {
    model: "gpt-4o-mini", // Recommended for MVP
    inputTokens: 0.150, // per 1M tokens
    outputTokens: 0.600, // per 1M tokens
    averageResponseCost: 0.0001, // ~$0.0001 per response
    alternatives: {
      "gpt-3.5-turbo": 0.000035, // 65% cheaper
      "claude-haiku": 0.000025   // 75% cheaper
    }
  },
  youtube: {
    freeQuota: 10000, // units per day
    costPerAdditionalUnit: 0.000025, // $0.25 per 10,000 units
    chatRequestCost: 5, // units per request
    freeRequests: 2000 // per day
  }
};
```

**Smart Caching Implementation:**
```javascript
const cacheStrategy = {
  streamInfo: {
    duration: 300000, // 5 minutes
    reduction: 0.8 // 80% API call reduction
  },
  chatMessages: {
    duration: 60000, // 1 minute
    batchSize: 50, // Process in batches
    reduction: 0.6 // 60% API call reduction
  },
  aiResponses: {
    duration: 3600000, // 1 hour
    similarityThreshold: 0.85, // Reuse similar responses
    reduction: 0.3 // 30% OpenAI cost reduction
  }
};

// Cache implementation
const apiCache = {
  youtube: new Map(),
  openai: new Map(),
  
  getCachedYouTubeData(key) {
    const cached = this.youtube.get(key);
    if (cached && Date.now() - cached.timestamp < 300000) {
      return cached.data;
    }
    return null;
  },
  
  setCachedYouTubeData(key, data) {
    this.youtube.set(key, {
      data,
      timestamp: Date.now()
    });
  }
};
```

**Rate Limiting for Cost Control:**
```javascript
const rateLimiting = {
  aiResponses: {
    maxPerMinute: 10, // Prevent API spam
    maxPerUserPerHour: 20, // Individual user limits
    cooldownPeriod: 5000 // 5 seconds between responses
  },
  youtubeAPI: {
    requestsPerSecond: 2, // Respect API limits
    batchRequests: true, // Combine multiple requests
    priorityQueue: ['live_chat', 'stream_info', 'channel_info']
  },
  costSafeguards: {
    dailyBudgetLimit: 100, // USD per day
    emergencyShutoff: 150, // Auto-disable at this cost
    alertThresholds: [50, 80, 95] // Percentage alerts
  }
};
```

**Cost Optimization Strategies:**
```javascript
const optimizations = {
  messageFiltering: {
    preFilter: true, // Filter before sending to OpenAI
    spamDetection: 0.9, // 90% accuracy reduces unnecessary calls
    duplicateDetection: true, // Avoid processing duplicate messages
    costReduction: 0.4 // 40% reduction in AI calls
  },
  
  responseReuse: {
    similarQuestionDetection: true,
    cachePopularResponses: true,
    templateResponses: true, // For common greetings
    costReduction: 0.25 // 25% reduction in unique AI calls
  },
  
  batchProcessing: {
    enabled: true,
    batchSize: 10, // Process multiple messages together
    maxWaitTime: 2000, // 2 seconds max delay
    costReduction: 0.15 // 15% reduction through batching
  }
};
```

**Real-time Cost Monitoring:**
```javascript
const costMonitoring = {
  tracking: {
    openaiCalls: 0,
    youtubeCalls: 0,
    dailyCost: 0,
    monthlyCost: 0
  },
  
  alerts: {
    warning: { threshold: 0.8, action: "notify_admin" },
    critical: { threshold: 0.95, action: "rate_limit_users" },
    emergency: { threshold: 1.0, action: "pause_ai_responses" }
  },
  
  async trackCost(service, cost) {
    this.tracking[`${service}Cost`] += cost;
    this.tracking.dailyCost += cost;
    
    const budgetUsage = this.tracking.dailyCost / this.dailyBudget;
    
    if (budgetUsage >= this.alerts.emergency.threshold) {
      await this.emergencyShutoff();
    } else if (budgetUsage >= this.alerts.critical.threshold) {
      await this.implementRateLimiting();
    }
  }
};
```

**API Quota Management:**
```javascript
const quotaManager = {
  youtube: {
    dailyLimit: 10000,
    requestsPerSecond: 5,
    costPerRequest: 1,
    priority: ['live_chat', 'stream_info', 'channel_info'],
    // Simple in-memory cache
    cache: new Map(),
    cacheExpiry: 300000 // 5 minutes
  },
  openai: {
    tokensPerMinute: 40000,
    requestsPerMinute: 3000,
    costPerToken: 0.0015,
    optimization: {
      batchRequests: true,
      // In-memory response cache
      responseCache: new Map(),
      cacheExpiry: 300000, // 5 minutes
      maxTokens: 150 // Response limit
    }
  }
};

// Simple caching implementation
const cache = {
  data: new Map(),
  
  set(key, value, ttl = 300000) {
    this.data.set(key, {
      value,
      expires: Date.now() + ttl
    });
  },
  
  get(key) {
    const item = this.data.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.data.delete(key);
      return null;
    }
    
    return item.value;
  },
  
  clear() {
    this.data.clear();
  }
};
```

**Database Performance:**
```sql
-- Essential Database Indexes
CREATE INDEX idx_streams_user_status ON streams(user_id, status);
CREATE INDEX idx_messages_stream_created ON stream_messages(stream_id, created_at);
CREATE INDEX idx_messages_status ON stream_messages(status);
CREATE INDEX idx_users_youtube_channel ON users(youtube_channel_id);

-- Partitioning Strategy
CREATE TABLE stream_messages_2025_01 PARTITION OF stream_messages
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

## User Experience Specifications

### Onboarding & Tutorial System

**First-Time User Flow:**
```javascript
const onboardingSteps = [
  {
    step: 1,
    title: "Welcome to Streamate",
    description: "Let's set up your AI co-host",
    action: "character_selection",
    estimatedTime: "2 minutes"
  },
  {
    step: 2,
    title: "Connect YouTube",
    description: "Link your YouTube channel",
    action: "youtube_oauth",
    estimatedTime: "1 minute"
  },
  {
    step: 3,
    title: "OBS Setup",
    description: "Add browser source to OBS",
    action: "obs_tutorial",
    estimatedTime: "3 minutes",
    resources: ["video_guide", "step_by_step", "troubleshooting"]
  },
  {
    step: 4,
    title: "Test Your Setup",
    description: "Try your first AI interaction",
    action: "test_mode",
    estimatedTime: "2 minutes"
  }
];
```

**OBS Integration Tutorial:**
```javascript
const obsSetupGuide = {
  requirements: {
    obsVersion: "28.0+",
    browserSourcePlugin: "required",
    resolution: "1920x1080 recommended"
  },
  steps: [
    "Add Browser Source to OBS",
    "Copy Streamate overlay URL",
    "Set width: 400px, height: 300px",
    "Position in desired location",
    "Test with sample message"
  ],
  troubleshooting: {
    "Overlay not showing": "Check URL and refresh browser source",
    "Animation lag": "Reduce OBS canvas resolution",
    "Character not responding": "Verify WebSocket connection"
  }
};
```

### Settings & Customization

**Advanced User Settings:**
```javascript
const userSettings = {
  character: {
    id: "boomi",
    customization: {
      responseStyle: "energetic", // calm, energetic, balanced
      culturalContext: "indonesian_gaming", // indonesian_music, mixed, etc.
      formalityLevel: "casual" // formal, casual, mixed
    }
  },
  filters: {
    profanity: { enabled: true, strictness: "medium" },
    spam: { enabled: true, threshold: 0.7 },
    languages: ["indonesian", "english"],
    customWords: ["banned_word_1", "banned_word_2"]
  },
  responses: {
    maxLength: 150,
    includeEmojis: true,
    mentionStreamer: true,
    responseDelay: 2000 // milliseconds
  },
  overlay: {
    position: { x: 50, y: 50 },
    size: { width: 300, height: 200 },
    theme: "dark", // dark, light, custom
    animations: true,
    bubble: {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      borderRadius: 15,
      padding: 10
    }
  }
};
```

## Business Logic & Analytics

## Monetization Strategy & Pricing Tiers

### Cost Analysis by User Segment

**Cost Scenarios (with optimization):**
```javascript
const userScenarios = {
  smallStreamer: {
    avgViewers: 50,
    streamHours: 4,
    dailyMessages: 800,
    aiMentions: 80,
    monthlyCost: 0.20, // Optimized with caching
    revenueTarget: 4.99 // 25x cost multiplier
  },
  
  mediumStreamer: {
    avgViewers: 200,
    streamHours: 6,
    dailyMessages: 3600,
    aiMentions: 360,
    monthlyCost: 0.85, // Optimized
    revenueTarget: 9.99 // 12x cost multiplier
  },
  
  largeStreamer: {
    avgViewers: 1000,
    streamHours: 8,
    dailyMessages: 16000,
    aiMentions: 1600,
    monthlyCost: 8.50, // Heavily optimized (was $40)
    revenueTarget: 29.99 // 3.5x cost multiplier
  }
};
```

### Subscription Tiers

**Free Tier (Freemium Model):**
```javascript
const freeTier = {
  price: "$0/month",
  features: {
    aiResponses: 100, // per month
    characters: 3, // Basic characters only
    streamMonitoring: true,
    basicAnalytics: true,
    obsIntegration: true,
    support: "community"
  },
  limitations: {
    dailyLimit: 5, // AI responses per day
    basicFiltering: true,
    standardAnimations: true,
    watermark: "Powered by Streamate"
  },
  monthlyCost: 0.35, // Average cost to serve
  targetUsers: "New streamers, testing"
};
```

**Starter Tier:**
```javascript
const starterTier = {
  price: "$4.99/month",
  features: {
    aiResponses: 1000, // per month
    characters: 6, // Most characters available
    streamMonitoring: true,
    basicAnalytics: true,
    obsIntegration: true,
    customization: "basic",
    support: "email"
  },
  benefits: {
    noWatermark: true,
    priorityProcessing: false,
    advancedFiltering: true,
    customBubbleStyles: true
  },
  monthlyCost: 0.50, // Cost to serve
  profit: 4.49, // 90% margin
  targetUsers: "Small to medium streamers (50-200 viewers)"
};
```

**Pro Tier:**
```javascript
const proTier = {
  price: "$14.99/month",
  features: {
    aiResponses: 5000, // per month
    characters: 10, // All characters
    streamMonitoring: true,
    advancedAnalytics: true,
    obsIntegration: true,
    customization: "advanced",
    support: "priority_email"
  },
  benefits: {
    priorityProcessing: true,
    customCharacterPrompts: true,
    advancedFiltering: true,
    exportAnalytics: true,
    apiAccess: "basic",
    multipleStreams: 3 // Can monitor 3 streams
  },
  monthlyCost: 2.50, // Cost to serve
  profit: 12.49, // 83% margin
  targetUsers: "Medium to large streamers (200-1000 viewers)"
};
```

**Creator Tier:**
```javascript
const creatorTier = {
  price: "$39.99/month",
  features: {
    aiResponses: 20000, // per month
    characters: 10, // All characters + custom
    streamMonitoring: true,
    premiumAnalytics: true,
    obsIntegration: true,
    customization: "unlimited",
    support: "priority_chat"
  },
  benefits: {
    customCharacterCreation: true,
    advancedAPIAccess: true,
    whitelabelOption: true,
    dedicatedSupport: true,
    multipleStreams: "unlimited",
    teamCollaboration: true,
    advancedIntegrations: true
  },
  monthlyCost: 8.00, // Cost to serve
  profit: 31.99, // 80% margin
  targetUsers: "Large streamers, agencies (1000+ viewers)"
};
```

### Usage-Based Add-ons

**Overage Pricing:**
```javascript
const overagePricing = {
  aiResponses: {
    cost: "$0.01 per 100 responses", // Above plan limit
    bundled: "$5 for 1000 responses", // Bulk pricing
    notification: "75% of limit reached"
  },
  
  premiumFeatures: {
    customCharacter: "$9.99 one-time", // Per custom character
    prioritySupport: "$4.99/month", // Add-on to any tier
    advancedAnalytics: "$2.99/month", // For Starter tier
    apiAccess: "$9.99/month" // For Pro tier and below
  }
};
```

### Revenue Projections

**Year 1 Projections:**
```javascript
const revenueProjections = {
  month1: {
    freeUsers: 100,
    starterUsers: 10,
    proUsers: 2,
    creatorUsers: 0,
    revenue: 79.96,
    costs: 40.00,
    profit: 39.96
  },
  
  month6: {
    freeUsers: 800,
    starterUsers: 150,
    proUsers: 40,
    creatorUsers: 8,
    revenue: 1668.32,
    costs: 420.00,
    profit: 1248.32
  },
  
  month12: {
    freeUsers: 2000,
    starterUsers: 400,
    proUsers: 120,
    creatorUsers: 25,
    revenue: 5798.15,
    costs: 1200.00,
    profit: 4598.15
  }
};
```

### Pricing Strategy Rationale

**Value-Based Pricing:**
```javascript
const valueProposition = {
  timesSaved: "2-3 hours per stream", // Manual chat management
  engagementIncrease: "40-60%", // Based on chat interaction
  viewerRetention: "25% improvement", // Longer session duration
  monetizationBoost: "15-30%", // Better engagement = more donations
  
  competitorAnalysis: {
    streamlabs: "$19.99/month", // General streaming tools
    streamElements: "$25/month", // Chat management
    nightbot: "$9.99/month", // Basic chat bot
    ourAdvantage: "AI-powered, Indonesian market, character-based"
  }
};
```

**Freemium Conversion Strategy:**
- **7-day Pro trial** for new users
- **Usage notifications** at 75% of limits
- **Upgrade prompts** during high-engagement streams
- **Feature comparisons** in dashboard
- **Success stories** from paid users

**Regional Pricing (Indonesian Market):**
```javascript
const regionalPricing = {
  indonesia: {
    starter: "IDR 75,000", // ~$4.99 USD
    pro: "IDR 225,000", // ~$14.99 USD
    creator: "IDR 599,000", // ~$39.99 USD
    paymentMethods: ["Bank Transfer", "GoPay", "OVO", "DANA"]
  }
};
```

**Streamer Analytics Dashboard:**
```javascript
const analyticsMetrics = {
  engagement: {
    chatResponseRate: "percentage of chat messages that received AI responses",
    viewerRetention: "average session duration improvement",
    chatActivity: "messages per minute before/after AI",
    participationRate: "unique chatters interacting with AI"
  },
  ai_performance: {
    responseAccuracy: "thumbs up/down from streamer",
    responseTime: "average time from mention to response",
    characterPopularity: "usage stats per character",
    languageDistribution: "Indonesian vs English vs Mixed responses"
  },
  stream_insights: {
    peakViewerCorrelation: "AI activity vs viewer spikes",
    trendingTopics: "most discussed topics identified",
    followerGrowth: "new followers during AI-active streams",
    chatSentiment: "positive/neutral/negative message ratio"
  }
};
```

**Comparative Analysis:**
```javascript
const comparativeMetrics = {
  beforeAfter: {
    averageSessionDuration: { before: 45, after: 67, improvement: "49%" },
    chatEngagement: { before: 2.3, after: 4.1, improvement: "78%" },
    newFollowers: { before: 5, after: 12, improvement: "140%" }
  },
  characterPerformance: {
    boomi: { engagement: 8.2, satisfaction: 4.3 },
    drift: { engagement: 6.1, satisfaction: 4.7 },
    pip: { engagement: 7.8, satisfaction: 4.5 }
  }
};
```

### Admin & Moderation System

**System Monitoring Dashboard:**
```javascript
const adminDashboard = {
  systemHealth: {
    apiStatus: { youtube: "healthy", openai: "degraded" },
    activeStreams: 1247,
    messagesPerSecond: 45,
    errorRate: 0.02,
    responseLatency: 1.8 // seconds
  },
  userMetrics: {
    totalUsers: 5430,
    activeStreamers: 1247,
    newRegistrations: 67, // today
    retentionRate: 0.73 // 30-day
  },
  contentModeration: {
    flaggedMessages: 23,
    falsePositives: 2,
    escalations: 1,
    aiAccuracy: 0.94
  }
};
```

**Content Moderation Tools:**
- Real-time message flagging system (including gambling detection)
- Manual review queue for edge cases
- Community reporting mechanism
- Automated ban/timeout integration with gambling auto-ban
- Appeal process for filtered messages
- Gambling promotion detection with 95%+ accuracy

## Security & Compliance

### Data Privacy & GDPR Compliance

**Data Retention Policy:**
```javascript
const dataRetention = {
  chatMessages: {
    retentionPeriod: 90, // days
    anonymization: 30, // days
    deletion: "automatic",
    exceptions: ["flagged_content", "reported_messages"]
  },
  userSettings: {
    retentionPeriod: "indefinite",
    deletionOnRequest: true,
    exportFormat: "JSON",
    processingTime: 30 // days
  },
  analytics: {
    aggregated: "indefinite",
    individual: 365, // days
    anonymized: true
  }
};
```

**GDPR Rights Implementation:**
- Right to access: User data export API
- Right to rectification: Profile editing interface
- Right to erasure: Account deletion with data purging
- Right to portability: Data export in standard format
- Right to object: Opt-out mechanisms for processing

### API Security & Rate Limiting

**Security Implementation:**
```javascript
const securityConfig = {
  authentication: {
    jwtExpiry: 3600, // 1 hour
    refreshTokenExpiry: 604800, // 7 days
    passwordRequirements: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  },
  rateLimiting: {
    global: { requests: 1000, window: 3600 }, // per hour
    perUser: { requests: 100, window: 300 }, // per 5 minutes
    perEndpoint: {
      "/api/chat/process": { requests: 60, window: 60 },
      "/api/stream/connect": { requests: 10, window: 300 }
    }
  },
  abuse_prevention: {
    maxFailedLogins: 5,
    lockoutDuration: 900, // 15 minutes
    suspiciousActivityAlert: true,
    ipBlacklisting: true
  }
};
```

## Integration Specifications

### OBS Browser Source Requirements

**Technical Specifications:**
```javascript
const obsRequirements = {
  browserSource: {
    url: "https://streamate.com/overlay/{userId}/{streamId}",
    width: 400,
    height: 300,
    fps: 30,
    cssCustomizations: true,
    refreshBrowserWhenSceneBecomesActive: false,
    shutdownSourceWhenNotVisible: true
  },
  supportedFormats: {
    animations: ["CSS3", "WebGL", "Canvas2D"],
    images: ["PNG", "WebP", "SVG"],
    fonts: ["Woff2", "TTF"],
    maxFileSize: "2MB per asset"
  },
  performance: {
    maxMemoryUsage: "100MB",
    cpuUsageTarget: "<5%",
    networkBandwidth: "<100KB/s"
  }
};
```

**Character Asset Specifications:**
```javascript
const characterAssets = {
  spriteSheets: {
    format: "PNG with transparency",
    resolution: "2048x512 (16 frames of 128x128)",
    states: ["idle", "talking", "excited", "thinking"],
    framerate: 12, // fps
    compression: "optimized for web"
  },
  animations: {
    idle: { duration: 2000, loop: true },
    talking: { duration: 500, loop: true },
    excited: { duration: 1500, loop: false },
    transitions: { duration: 300, easing: "ease-in-out" }
  }
};
```

### WebSocket Protocol Specification

**Message Types:**
```javascript
const websocketMessages = {
  // Client to Server
  client: {
    connect: { type: "connect", userId: "string", streamId: "string" },
    heartbeat: { type: "heartbeat", timestamp: "number" },
    settings_update: { type: "settings_update", settings: "object" }
  },
  // Server to Client
  server: {
    ai_response: {
      type: "ai_response",
      character: "string",
      message: "string",
      animation: "string",
      duration: "number"
    },
    stream_alert: {
      type: "stream_alert",
      alertType: "follower|milestone|health",
      data: "object"
    },
    system_status: {
      type: "system_status",
      status: "connected|disconnected|error",
      message: "string"
    }
  }
};
```

## Deployment & Infrastructure

### Development vs Production Environment

**Environment Configuration:**
```javascript
const environments = {
  development: {
    database: "postgresql://localhost:5432/streamate_dev",
    cache: "in-memory", // No Redis needed
    youtube_api: "sandbox",
    openai_api: "development_key",
    websocket: "ws://localhost:3001",
    logging: "verbose"
  },
  production: {
    database: process.env.DATABASE_URL,
    cache: "in-memory", // Simple Map-based caching
    youtube_api: "production",
    openai_api: process.env.OPENAI_API_KEY,
    websocket: "wss://api.streamate.com",
    logging: "error_only",
    monitoring: {
      sentry: true,
      datadog: true,
      healthChecks: "/health"
    }
  }
};
```

### Monitoring & Logging

**System Monitoring:**
```javascript
const monitoring = {
  metrics: {
    application: ["response_time", "error_rate", "throughput"],
    infrastructure: ["cpu_usage", "memory_usage", "disk_io"],
    business: ["active_users", "api_costs", "conversion_rate"]
  },
  alerts: {
    critical: ["service_down", "database_connection_lost"],
    warning: ["high_error_rate", "api_quota_80_percent"],
    info: ["deployment_complete", "scheduled_maintenance"]
  },
  logging: {
    levels: ["error", "warn", "info", "debug"],
    retention: 90, // days
    structured: true,
    anonymized: true
  }
};
```

This comprehensive technical specification ensures Streamate is production-ready with robust error handling, security, and scalability built-in from day one.