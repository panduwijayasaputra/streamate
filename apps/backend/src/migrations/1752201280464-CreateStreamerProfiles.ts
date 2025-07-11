import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStreamerProfiles1752201280464 implements MigrationInterface {
    name = 'CreateStreamerProfiles1752201280464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "streamer_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "streamerId" character varying NOT NULL, "streamerName" character varying NOT NULL, "personality" jsonb, "aiPreferences" jsonb, "contextSettings" jsonb, "customPrompts" jsonb, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_46d6e799a99a9acd5b1d90f31bd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "streamer_profiles"`);
    }

}
