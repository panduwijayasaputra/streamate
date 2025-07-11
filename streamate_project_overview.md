# Streamate - AI-Powered Livestream Co-Host

## Project Overview

Streamate is an AI-powered co-host for YouTube livestreaming that helps streamers engage with their audience through an animated character displayed via OBS. The AI processes chat messages and provides contextual responses, allowing streamers to maintain focus on their content while ensuring viewer engagement.

## Goals & Use Cases

### Primary Goals
- **Gaming Focus**: Help gamers answer viewers without losing concentration on high-skill games (FPS, technical games)
- **Crowd Management**: Help non-gamers handle common questions from large audiences
- **Important Question Detection**: Surface frequently asked questions that streamers might miss
- **Viewer Engagement**: Ensure viewers feel noticed and get responses to their questions

### Key Use Cases
1. **Game-Specific Questions**: Answer common gaming questions like "which better Akai or Franco" (Mobile Legends) or "best build for sage?" (Valorant)
2. **Trend Detection**: Display aggregated questions like "Your viewers asking about your next project" (artist streams) or "Your viewers asking about your previous milestone - invite rich brian" (marathon streams)
3. **Real-time Assistance**: Provide immediate responses to common questions while streamer focuses on content
4. **Question Prioritization**: Highlight important or frequently repeated questions

## Technical Stack

### Architecture
- **Monorepo Structure**: Single repository managing both frontend and backend
- **Real-time Communication**: WebSocket connections for instant chat processing
- **AI Integration**: OpenAI for natural language processing and response generation

### Frontend
- **Framework**: NextJS with TypeScript
- **Styling**: TailwindCSS + Shadcn UI components
- **Icons**: Lucide React
- **Real-time**: WebSocket client for live updates

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Validation**: Zod for type-safe data validation
- **AI**: OpenAI API integration
- **Real-time**: WebSocket server
- **Chat Integration**: YouTube Live Chat API

## Core Features

### MVP Features (Phase 1)
1. **Chat Integration**
   - YouTube Live Chat API connection
   - Real-time message ingestion
   - Message filtering and processing

2. **AI Response System**
   - Context-aware response generation
   - Game/stream category detection
   - Common question pattern recognition

3. **OBS Integration**
   - Browser source for animated character
   - Chat bubble display system
   - Customizable character appearance

4. **Streamer Dashboard**
   - AI personality configuration
   - Response settings management
   - Real-time chat monitoring

5. **Question Aggregation**
   - Duplicate question detection
   - Frequency tracking
   - Priority-based notifications

### Advanced Features (Phase 2)
1. **Multi-platform Support** (Twitch, Facebook Gaming)
2. **Advanced Analytics** (engagement metrics, response effectiveness)
3. **Custom Training** (streamer-specific knowledge base)
4. **Voice Integration** (text-to-speech responses)
5. **Moderation Features** (spam detection, content filtering)

## System Architecture

### Data Flow
1. **Chat Ingestion**: Platform APIs → WebSocket Server → Message Queue
2. **AI Processing**: Message Queue → OpenAI API → Response Generation
3. **Response Delivery**: Generated Response → WebSocket → OBS Browser Source
4. **Dashboard Updates**: Real-time metrics → WebSocket → Admin Dashboard

### Database Schema

#### Core Entities
- **Streamers**: User profiles, settings, API keys
- **Streams**: Active streaming sessions, metadata
- **Messages**: Chat messages, processing status
- **Responses**: AI-generated responses, effectiveness metrics
- **Questions**: Detected questions, frequency counts, categories
- **Contexts**: Game/stream contexts, knowledge bases

#### Key Relationships
- Streamer → Streams (1:N)
- Stream → Messages (1:N)
- Message → Response (1:1)
- Stream → Questions (1:N)
- Streamer → Contexts (N:M)

## API Structure

### WebSocket Events
```typescript
// Client → Server
interface ClientEvents {
  'join-stream': { streamId: string }
  'configure-ai': { settings: AISettings }
  'manual-response': { messageId: string, response: string }
}

// Server → Client
interface ServerEvents {
  'new-message': { message: ChatMessage }
  'ai-response': { response: AIResponse }
  'question-trend': { questions: TrendingQuestion[] }
  'stream-stats': { stats: StreamStats }
}
```

### REST API Endpoints
```
GET /api/streamers/:id/streams     # Get streamer's streams
POST /api/streams                  # Create new stream
GET /api/streams/:id/messages      # Get stream messages
POST /api/streams/:id/responses    # Manual response
PUT /api/streamers/:id/settings    # Update AI settings
GET /api/contexts                  # Get available contexts
```

## AI Processing Pipeline

### Message Processing Flow
1. **Ingestion**: Raw chat message received
2. **Filtering**: Remove spam, irrelevant messages
3. **Classification**: Identify questions vs. comments
4. **Context Detection**: Determine game/stream context
5. **Response Generation**: Create appropriate AI response
6. **Delivery**: Send to OBS and dashboard

### Response Types
- **Immediate**: Direct answers to common questions
- **Aggregated**: Summary of repeated questions
- **Escalated**: Important questions requiring streamer attention
- **Contextual**: Game-specific or stream-specific responses

## OBS Integration

### Browser Source Setup
- **URL**: `http://localhost:3000/obs/character/:streamId`
- **Dimensions**: 400x600 (customizable)
- **Features**: 
  - Animated character sprite
  - Chat bubble animations
  - Configurable positioning
  - Transparency support

### Character System
- **Sprite Animation**: CSS/JavaScript animations
- **Response Display**: Animated chat bubbles
- **Customization**: Color schemes, character selection
- **Positioning**: Flexible screen placement

## Development Guidelines

### Code Organization
```
/apps
  /frontend         # NextJS app
  /backend          # NestJS app
/packages
  /shared           # Shared types and utilities
  /ui               # Shared UI components
/tools
  /database         # Migration scripts
  /deployment       # Docker configs
```

### Key Technologies
- **TypeScript**: Strict typing throughout
- **Zod**: Runtime validation
- **TypeORM**: Database ORM with migrations
- **Socket.io**: WebSocket implementation
- **Tailwind**: Utility-first CSS
- **Shadcn/ui**: Pre-built components

### Performance Considerations
- **Message Queuing**: Handle high-volume chat
- **Response Caching**: Cache common responses
- **Rate Limiting**: Prevent API abuse
- **WebSocket Optimization**: Efficient real-time updates

## Deployment Strategy

### Environment Setup
- **Development**: Local PostgreSQL + Redis
- **Staging**: Docker containers
- **Production**: Cloud deployment (AWS/Vercel)

### Configuration Management
- Environment-specific configs
- API key management
- Database connection strings
- OpenAI API limits

## Success Metrics

### Technical Metrics
- Response time < 2 seconds
- 99.9% uptime
- Chat message processing rate
- WebSocket connection stability

### User Metrics
- Viewer engagement increase
- Streamer satisfaction scores
- Question response accuracy
- Feature adoption rates

## Future Enhancements

### Advanced AI Features
- Context learning from stream history
- Personalized response styles
- Multi-language support
- Sentiment analysis

### Integration Expansions
- Streamlabs integration
- Discord bot companion
- Mobile app for streamers
- Third-party plugin system

## Development Phases

### Phase 1: Core MVP (4-6 weeks)
- Basic chat integration
- Simple AI responses
- OBS browser source
- Streamer dashboard

### Phase 2: Enhanced Features (6-8 weeks)
- Advanced AI processing
- Question aggregation
- Analytics dashboard
- Performance optimization

### Phase 3: Platform Expansion (4-6 weeks)
- Multi-platform support
- Advanced customization
- Mobile companion app
- Enterprise features

---

*This document serves as the primary reference for the Streamate project. Keep it updated as features evolve and requirements change.*