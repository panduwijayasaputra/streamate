# AI Co-Host System - Product Requirements Document

## Introduction/Overview

**Project Name:** AI Co-Host System  
**Target Market:** Indonesian YouTube Streamers  
**Project Type:** MVP Web Application  
**Primary Goal:** Provide AI-powered co-hosting assistance that responds to viewer chat when mentioned, with real-time chat analysis and character-based personality overlay for OBS integration.

## Problem Statement

Indonesian YouTube streamers face significant challenges:

- **Engagement vs Focus**: Can't respond to all chat messages while playing competitive games or creating content
- **Chat Overwhelm**: High-volume chats become impossible to manage effectively
- **Missed Opportunities**: Important questions, milestones, and community moments get overlooked
- **Language Barriers**: Need support for Indonesian, English, and mixed language interactions with local slang

## Goals

1. **Automated Chat Response**: AI responds when mentioned (@ai_name) with character-specific personality
2. **Smart Content Filtering**: Filter inappropriate, spam, and irrelevant messages before AI processing
3. **Real-time Chat Analysis**: Provide live summaries of chat patterns and trending topics
4. **OBS Integration**: Display AI responses through animated character overlay
5. **Cultural Adaptation**: Support Indonesian language, slang, and cultural context
6. **Secure YouTube Integration**: Safe authentication and direct API connection

## User Stories

1. **As a streamer**, I want the AI to respond when viewers mention it by name so that I can focus on my content while maintaining chat engagement.

2. **As a streamer**, I want to select different AI characters with unique personalities so that my stream has variety and matches my content style.

3. **As a streamer**, I want real-time alerts about chat patterns (e.g., "10 viewers asking about game settings") so that I can address trending topics.

4. **As a streamer**, I want the AI to automatically greet new subscribers so that I don't miss important community moments.

5. **As a streamer**, I want the AI to answer questions with relevant context (gaming, music, etc.) so that viewers get helpful responses.

6. **As a streamer**, I want the AI to understand Indonesian slang and mixed language so that it feels natural to my Indonesian audience.

7. **As a streamer**, I want the AI responses to appear as an animated character overlay in OBS so that my stream looks professional and engaging.

## Functional Requirements

### 1. AI Response System

1. The system must detect mentions of the AI character name in chat messages
2. The system must filter messages for inappropriate content, spam, and irrelevance
3. The system must send filtered messages to OpenAI API with character-specific prompts
4. The system must display AI responses through OBS browser source overlay
5. The system must respond to new subscriber greetings automatically
6. The system must answer questions with context-aware responses (gaming, music, etc.)

### 2. Character System

7. The system must provide 10 unique AI character personalities with distinct personalities and response styles
8. The system must allow streamers to switch characters during streams
9. Each character must have unique response styles and personality traits
10. Characters must support animated states (idle, talking, excited, thinking)
11. Characters must have cultural adaptation for Indonesian streamer context

**10 Character Personalities:**

| Character | Personality                      | Call Style   | Language Style   |
| --------- | -------------------------------- | ------------ | ---------------- |
| 🧨 Boomi  | Chaos Puff - Wild, hype          | Boss/Legend  | Explosive mixed  |
| 🌙 Drift  | Dream Wisp - Chill, dreamy       | Kak          | Calm mixed       |
| 🎓 Pip    | Brain Orb - Nerdy, analytical    | Mas/Mbak     | Intellectual     |
| 💀 Snacc  | Skeletal Snake - Edgy trickster  | Bang         | Edgy mixed       |
| 💌 Bloop  | Love Blob - Affectionate         | Kakak/Sayang | Sweet mixed      |
| 🎮 Patch  | Glitch Sprite - Witty, sarcastic | Bro          | Meta humor       |
| 🧊 Frosty | Ice Orb - Cool, collected        | Bang         | Dry humor        |
| 🔥 Spark  | Ember Sprite - Hyper, ADHD       | Boss         | Rapid energy     |
| 🐙 Tako   | Mini Octopus - Goofy, lovable    | Kak          | Wholesome chaos  |
| 🧽 Melo   | Mood Sponge - Empathic           | Kakak        | Emotional mirror |

### 3. Chat Analysis Engine

11. The system must analyze chat patterns in real-time
12. The system must detect trending topics and repeated questions
13. The system must provide text notifications for chat summaries
14. The system must alert when multiple viewers ask similar questions
15. The system must identify viewer sentiment and engagement patterns
16. The system must detect new follower alerts and milestone celebrations
17. The system must provide stream health check alerts from chat feedback
18. The system must suggest discussion topics when chat goes quiet

### 4. YouTube Integration

16. The system must authenticate with YouTube accounts securely
17. The system must connect directly to YouTube Live Chat API
18. The system must monitor active live streams automatically
19. The system must handle YouTube API rate limits gracefully

### 5. Language Support

20. The system must understand and respond in Indonesian language
21. The system must understand and respond in English language
22. The system must handle mixed language conversations
23. The system must recognize Indonesian slang and gaming terminology
24. The system must filter Indonesian profanity and inappropriate content
25. The system must detect and filter gambling-related content (critical for Indonesian streams)

### 6. OBS Integration

24. The system must provide a browser source URL for OBS integration
25. The system must display animated character sprites
26. The system must show speech bubbles with AI responses
27. The system must support real-time WebSocket updates
28. The system must provide customizable overlay positioning and styling
29. The system must optimize performance for streaming (low CPU usage)

## Non-Goals (Out of Scope)

- Twitch platform integration (YouTube only for MVP)
- Mobile app development
- Advanced analytics dashboard
- Custom character creation
- Subscription/monetization features
- Integration with other streaming tools
- Voice synthesis for AI responses
- Advanced moderation tools beyond basic filtering

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

## Design Considerations

### User Interface

- **Dashboard**: Clean, streamer-focused interface with real-time chat monitoring
- **Character Selection**: Visual character previews with personality descriptions
- **Settings Panel**: Easy configuration for AI name, character, and response preferences
- **OBS Overlay**: Minimal, non-intrusive character display with smooth animations

### Character Design

- **Visual Style**: Cute, streamer-friendly animated characters
- **Animation States**: Idle, talking, excited, thinking
- **Personality Types**: Energetic, calm, nerdy, edgy, wholesome
- **Cultural Adaptation**: Characters that resonate with Indonesian streamer culture

### Character Features

- Real-time character switching during streams
- Animated sprites with multiple states (idle, talking, excited)
- Unique personality prompts for OpenAI
- Cultural context awareness for Indonesian streamers

## Technical Considerations

### Tech Stack

- **Frontend**: NextJS (React) with TypeScript
- **Backend**: NestJS (Node.js) with TypeScript
- **Database**: PostgreSQL with TypeORM
- **AI Integration**: OpenAI API (GPT-4 or GPT-3.5-turbo)
- **Real-time**: WebSocket connections with in-memory management
- **Authentication**: Standard email/password registration + Optional YouTube OAuth (for streaming features)
- **External APIs**: YouTube Live Chat API

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

### Performance Requirements

- AI response latency < 2 seconds
- Real-time chat processing for 1000+ messages per minute
- 99.9% uptime during peak streaming hours
- Efficient YouTube API quota usage
- Support for 1000+ concurrent streams
- OBS overlay performance: <5% CPU usage

## Success Metrics

### Primary KPIs

- **Engagement Rate**: Percentage of chat messages that receive AI responses
- **Response Accuracy**: Streamer satisfaction with AI responses (thumbs up/down)
- **Chat Activity**: Increase in messages per minute during AI-active periods
- **Viewer Retention**: Average session duration improvement

### Secondary KPIs

- **Character Usage**: Distribution of character selections
- **Language Distribution**: Indonesian vs English vs mixed language usage
- **System Performance**: Response time, uptime, error rates
- **User Adoption**: Number of active streamers using the system

## Open Questions

1. **Character Personalities**: What specific character types would resonate most with Indonesian streamers?
2. **Response Rate Limits**: How frequently should the AI respond to prevent spam?
3. **Content Filtering**: What specific Indonesian content should be filtered (beyond basic profanity)?
4. **OBS Overlay Positioning**: Where should the character overlay appear by default?
5. **Error Handling**: How should the system behave when YouTube API or OpenAI is unavailable?
6. **Data Privacy**: What chat data should be stored vs. processed in real-time only?

## Technical Specifications

### Error Handling & Edge Cases

**API Failure Management:**

- YouTube API quota exceeded: Retry after 1 hour with user notification
- Token expired: Automatic token refresh
- YouTube server error: Fallback to cached data with 5-minute retry
- OpenAI rate limits: Queue messages with 1-minute delay
- OpenAI timeout: Retry with exponential backoff (3 attempts)

**Stream Interruption Recovery:**

- Automatic reconnection with exponential backoff
- State persistence during disconnections
- Graceful degradation when APIs unavailable
- User notification system for service status

### Real-time Architecture

**WebSocket Configuration:**

- Heartbeat interval: 30 seconds
- Max connections: 1000 per server
- Message queue: 1000 max size with 3 retry attempts
- Rooms pattern: `stream_${userId}` with max 5 clients per room

**Message Processing:**

- In-memory queue with JavaScript arrays
- Priority processing (mentions > general chat)
- Circuit breaker pattern for API protection
- Database-based persistence for reliability

### Content Filtering System

**Indonesian Content Filtering:**

- Profanity filter with Indonesian slang
- Gambling detection (critical for Indonesian streams)
- Spam detection with repetition and caps limits
- Non-context filtering for irrelevant messages

**Gambling Detection:**

- Multi-layered detection system
- Keyword matching, pattern matching, domain detection
- Confidence scoring with 60% threshold
- Auto-ban for gambling promotions

### Cost Optimization

**API Cost Management:**

- Smart caching for YouTube and OpenAI responses
- Batch processing for multiple messages
- Rate limiting to prevent API spam
- Daily budget limits with emergency shutoff

**Optimization Strategies:**

- Pre-filtering reduces 40% of AI calls
- Response reuse reduces 25% of unique AI calls
- Batch processing reduces 15% through efficiency

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

## Implementation Phases

### Phase 1 (Weeks 1-4): Foundation

- Database schema and backend setup
- YouTube API integration
- Basic user authentication
- Simple character system (2-3 characters)

### Phase 2 (Weeks 5-8): Core Features

- Chat processing pipeline
- OpenAI integration with characters
- Basic frontend interface
- Mention detection and filtering
- Basic OBS overlay

### Phase 3 (Weeks 9-12): Integration

- OBS overlay system
- WebSocket real-time updates
- Character animation system
- Real-time chat analysis

### Phase 4 (Weeks 13-16): Polish & Launch

- UI/UX refinement
- Performance optimization
- Indonesian language optimization
- Beta testing with Indonesian streamers

## Risk Assessment

### High Risk

- YouTube API rate limits and quota management
- OpenAI API costs and response quality
- Real-time performance at scale

### Medium Risk

- Indonesian language AI accuracy
- OBS integration compatibility
- Character animation performance

### Low Risk

- Basic web application functionality
- User authentication
- Database performance
