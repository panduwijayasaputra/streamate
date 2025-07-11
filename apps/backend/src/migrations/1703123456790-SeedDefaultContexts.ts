import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDefaultContexts1703123456790 implements MigrationInterface {
  name = 'SeedDefaultContexts1703123456790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert default contexts
    await queryRunner.query(`
      INSERT INTO "contexts" ("id", "name", "description", "type", "metadata", "knowledgeBase", "aiSettings", "isActive", "isDefault", "createdAt", "updatedAt")
      VALUES 
        (
          '550e8400-e29b-41d4-a716-446655440001',
          'General Gaming',
          'Default context for general gaming streams',
          'game',
          '{"tags": ["gaming", "general"], "supportedGames": ["any"]}',
          '{"rules": ["Be helpful and engaging", "Keep responses concise", "Maintain streamer personality"], "topics": ["game mechanics", "strategies", "community interaction"]}',
          '{"personality": "friendly", "responseStyle": "casual", "maxLength": 200}',
          true,
          true,
          now(),
          now()
        ),
        (
          '550e8400-e29b-41d4-a716-446655440002',
          'FPS Games',
          'Context optimized for first-person shooter games',
          'game',
          '{"tags": ["fps", "shooter", "competitive"], "supportedGames": ["valorant", "csgo", "overwatch", "apex"]}',
          '{"rules": ["Focus on tactical advice", "Encourage teamwork", "Keep morale high"], "topics": ["aim training", "positioning", "team coordination", "map knowledge"]}',
          '{"personality": "competitive", "responseStyle": "tactical", "maxLength": 150}',
          true,
          false,
          now(),
          now()
        ),
        (
          '550e8400-e29b-41d4-a716-446655440003',
          'Just Chatting',
          'Context for non-gaming streams and general chat',
          'chat',
          '{"tags": ["chat", "community", "general"], "supportedTopics": ["any"]}',
          '{"rules": ["Be conversational", "Ask follow-up questions", "Engage with community"], "topics": ["daily life", "current events", "community stories", "personal experiences"]}',
          '{"personality": "conversational", "responseStyle": "engaging", "maxLength": 250}',
          true,
          false,
          now(),
          now()
        ),
        (
          '550e8400-e29b-41d4-a716-446655440004',
          'Creative/Art',
          'Context for creative streams like art, music, or design',
          'creative',
          '{"tags": ["creative", "art", "design", "music"], "supportedActivities": ["drawing", "painting", "music", "design"]}',
          '{"rules": ["Be encouraging", "Ask about creative process", "Share constructive feedback"], "topics": ["techniques", "inspiration", "creative process", "art history"]}',
          '{"personality": "encouraging", "responseStyle": "supportive", "maxLength": 200}',
          true,
          false,
          now(),
          now()
        ),
        (
          '550e8400-e29b-41d4-a716-446655440005',
          'Educational',
          'Context for educational and tutorial streams',
          'educational',
          '{"tags": ["education", "tutorial", "learning"], "supportedSubjects": ["any"]}',
          '{"rules": ["Be clear and informative", "Break down complex topics", "Encourage questions"], "topics": ["explanations", "step-by-step guides", "best practices", "common mistakes"]}',
          '{"personality": "instructive", "responseStyle": "educational", "maxLength": 300}',
          true,
          false,
          now(),
          now()
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "contexts" 
      WHERE "id" IN (
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440004',
        '550e8400-e29b-41d4-a716-446655440005'
      )
    `);
  }
}
