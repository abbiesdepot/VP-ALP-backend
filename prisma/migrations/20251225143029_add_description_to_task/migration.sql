/*
  Warnings:

  - You are about to drop the `rewards` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RewardTrigger" AS ENUM ('STREAK', 'TASK_COUNT', 'DAILY_COMPLETION');

-- CreateEnum
CREATE TYPE "RewardStatus" AS ENUM ('LOCKED', 'UNLOCKED');

-- DropForeignKey
ALTER TABLE "rewards" DROP CONSTRAINT "rewards_user_id_fkey";

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "description" TEXT;

-- DropTable
DROP TABLE "rewards";

-- CreateTable
CREATE TABLE "reward_definitions" (
    "id" SERIAL NOT NULL,
    "trigger_type" "RewardTrigger" NOT NULL,
    "threshold" INTEGER NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" VARCHAR(255),
    "asset_url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_rewards" (
    "id" SERIAL NOT NULL,
    "status" "RewardStatus" NOT NULL DEFAULT 'LOCKED',
    "achieved_at" TIMESTAMP(3),
    "user_id" INTEGER NOT NULL,
    "reward_definition_id" INTEGER NOT NULL,

    CONSTRAINT "user_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "user_id" INTEGER NOT NULL,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "last_completion_date" TIMESTAMP(3),
    "task_completed_count" INTEGER NOT NULL DEFAULT 0,
    "last_daily_completion" TIMESTAMP(3),

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reward_definitions_trigger_type_threshold_key" ON "reward_definitions"("trigger_type", "threshold");

-- CreateIndex
CREATE UNIQUE INDEX "user_rewards_user_id_reward_definition_id_key" ON "user_rewards"("user_id", "reward_definition_id");

-- AddForeignKey
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_reward_definition_id_fkey" FOREIGN KEY ("reward_definition_id") REFERENCES "reward_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
