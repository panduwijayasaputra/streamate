import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateResponseFeedback1752201865763 implements MigrationInterface {
    name = 'CreateResponseFeedback1752201865763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."response_feedback_feedbacktype_enum" AS ENUM('positive', 'negative', 'neutral')`);
        await queryRunner.query(`CREATE TYPE "public"."response_feedback_feedbackreason_enum" AS ENUM('helpful', 'accurate', 'relevant', 'engaging', 'unhelpful', 'inaccurate', 'irrelevant', 'boring', 'repetitive', 'inappropriate')`);
        await queryRunner.query(`CREATE TABLE "response_feedback" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "responseId" uuid NOT NULL, "streamerId" uuid NOT NULL, "streamId" uuid NOT NULL, "userId" uuid, "feedbackType" "public"."response_feedback_feedbacktype_enum" NOT NULL DEFAULT 'neutral', "feedbackReason" "public"."response_feedback_feedbackreason_enum", "userComment" text, "rating" integer NOT NULL DEFAULT '1', "context" jsonb, "learningData" jsonb, "isProcessed" boolean NOT NULL DEFAULT false, "processedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1b8e3b99afad48f1574fdd8585b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "response_feedback" ADD CONSTRAINT "FK_1a751a4d7b20489419e7551da18" FOREIGN KEY ("responseId") REFERENCES "responses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "response_feedback" DROP CONSTRAINT "FK_1a751a4d7b20489419e7551da18"`);
        await queryRunner.query(`DROP TABLE "response_feedback"`);
        await queryRunner.query(`DROP TYPE "public"."response_feedback_feedbackreason_enum"`);
        await queryRunner.query(`DROP TYPE "public"."response_feedback_feedbacktype_enum"`);
    }

}
