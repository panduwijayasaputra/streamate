import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1703123456789 implements MigrationInterface {
  name = 'CreateInitialSchema1703123456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create streamers table
    await queryRunner.query(`
      CREATE TABLE "streamers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "username" character varying NOT NULL,
        "displayName" character varying,
        "avatarUrl" character varying,
        "aiSettings" jsonb,
        "apiKeys" jsonb,
        "preferences" jsonb,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_streamers_email" UNIQUE ("email"),
        CONSTRAINT "PK_streamers" PRIMARY KEY ("id")
      )
    `);

    // Create contexts table
    await queryRunner.query(`
      CREATE TABLE "contexts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" character varying,
        "type" character varying NOT NULL DEFAULT 'game',
        "metadata" jsonb,
        "knowledgeBase" jsonb,
        "aiSettings" jsonb,
        "isActive" boolean NOT NULL DEFAULT true,
        "isDefault" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contexts" PRIMARY KEY ("id")
      )
    `);

    // Create streamer_contexts junction table
    await queryRunner.query(`
      CREATE TABLE "streamer_contexts" (
        "contextId" uuid NOT NULL,
        "streamerId" uuid NOT NULL,
        CONSTRAINT "PK_streamer_contexts" PRIMARY KEY ("contextId", "streamerId")
      )
    `);

    // Create streams table
    await queryRunner.query(`
      CREATE TABLE "streams" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "streamerId" uuid NOT NULL,
        "title" character varying NOT NULL,
        "description" character varying,
        "platform" character varying NOT NULL,
        "platformStreamId" character varying,
        "platformChannelId" character varying,
        "metadata" jsonb,
        "settings" jsonb,
        "status" character varying NOT NULL DEFAULT 'active',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_streams" PRIMARY KEY ("id")
      )
    `);

    // Create messages table
    await queryRunner.query(`
      CREATE TABLE "messages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "streamId" uuid NOT NULL,
        "platformMessageId" character varying NOT NULL,
        "authorId" character varying NOT NULL,
        "authorName" character varying NOT NULL,
        "authorAvatar" character varying,
        "content" text NOT NULL,
        "metadata" jsonb,
        "processingStatus" character varying NOT NULL DEFAULT 'pending',
        "analysis" jsonb,
        "requiresResponse" boolean NOT NULL DEFAULT false,
        "isEscalated" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_messages" PRIMARY KEY ("id")
      )
    `);

    // Create responses table
    await queryRunner.query(`
      CREATE TABLE "responses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "messageId" uuid NOT NULL,
        "content" text NOT NULL,
        "metadata" jsonb,
        "status" character varying NOT NULL DEFAULT 'generated',
        "feedback" jsonb,
        "effectiveness" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_responses_messageId" UNIQUE ("messageId"),
        CONSTRAINT "PK_responses" PRIMARY KEY ("id")
      )
    `);

    // Create questions table
    await queryRunner.query(`
      CREATE TABLE "questions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "streamId" uuid NOT NULL,
        "content" text NOT NULL,
        "normalizedContent" text,
        "category" character varying NOT NULL DEFAULT 'general',
        "priority" character varying NOT NULL DEFAULT 'low',
        "frequency" integer NOT NULL DEFAULT 1,
        "metadata" jsonb,
        "analysis" jsonb,
        "isAnswered" boolean NOT NULL DEFAULT false,
        "isEscalated" boolean NOT NULL DEFAULT false,
        "aiResponse" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_questions" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "streamer_contexts" 
      ADD CONSTRAINT "FK_streamer_contexts_contextId" 
      FOREIGN KEY ("contextId") REFERENCES "contexts"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "streamer_contexts" 
      ADD CONSTRAINT "FK_streamer_contexts_streamerId" 
      FOREIGN KEY ("streamerId") REFERENCES "streamers"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "streams" 
      ADD CONSTRAINT "FK_streams_streamerId" 
      FOREIGN KEY ("streamerId") REFERENCES "streamers"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "messages" 
      ADD CONSTRAINT "FK_messages_streamId" 
      FOREIGN KEY ("streamId") REFERENCES "streams"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "responses" 
      ADD CONSTRAINT "FK_responses_messageId" 
      FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "questions" 
      ADD CONSTRAINT "FK_questions_streamId" 
      FOREIGN KEY ("streamId") REFERENCES "streams"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Create indexes for better performance
    await queryRunner.query(`
      CREATE INDEX "IDX_streamers_email" ON "streamers" ("email")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_streams_streamerId" ON "streams" ("streamerId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_streams_status" ON "streams" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_messages_streamId" ON "messages" ("streamId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_messages_processingStatus" ON "messages" ("processingStatus")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_messages_createdAt" ON "messages" ("createdAt")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_questions_streamId" ON "questions" ("streamId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_questions_category" ON "questions" ("category")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_questions_priority" ON "questions" ("priority")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_questions_frequency" ON "questions" ("frequency")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_questions_frequency"`);
    await queryRunner.query(`DROP INDEX "IDX_questions_priority"`);
    await queryRunner.query(`DROP INDEX "IDX_questions_category"`);
    await queryRunner.query(`DROP INDEX "IDX_questions_streamId"`);
    await queryRunner.query(`DROP INDEX "IDX_messages_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_messages_processingStatus"`);
    await queryRunner.query(`DROP INDEX "IDX_messages_streamId"`);
    await queryRunner.query(`DROP INDEX "IDX_streams_status"`);
    await queryRunner.query(`DROP INDEX "IDX_streams_streamerId"`);
    await queryRunner.query(`DROP INDEX "IDX_streamers_email"`);

    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_questions_streamId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "responses" DROP CONSTRAINT "FK_responses_messageId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_messages_streamId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "streams" DROP CONSTRAINT "FK_streams_streamerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "streamer_contexts" DROP CONSTRAINT "FK_streamer_contexts_streamerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "streamer_contexts" DROP CONSTRAINT "FK_streamer_contexts_contextId"`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TABLE "responses"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TABLE "streams"`);
    await queryRunner.query(`DROP TABLE "streamer_contexts"`);
    await queryRunner.query(`DROP TABLE "contexts"`);
    await queryRunner.query(`DROP TABLE "streamers"`);
  }
}
