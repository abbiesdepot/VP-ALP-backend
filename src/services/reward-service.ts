import { prismaClient } from "../utils/database-util"
import { RewardGalleryResponse, RewardView } from "../models/reward-model"

const REWARD_DEFINITIONS: Array<{
    triggerType: "STREAK" | "TASK_COUNT" | "DAILY_COMPLETION"
    threshold: number
    title: string
    description?: string
}> = [
    { triggerType: "STREAK", threshold: 3, title: "3-Day Streak", description: "Complete schedules for 3 consecutive days." },
    { triggerType: "STREAK", threshold: 7, title: "7-Day Streak", description: "One focused week!" },
    { triggerType: "STREAK", threshold: 14, title: "14-Day Streak", description: "Two weeks of consistency." },
    { triggerType: "STREAK", threshold: 30, title: "30-Day Streak", description: "Month-long champ." },
    { triggerType: "TASK_COUNT", threshold: 5, title: "Task Rookie", description: "Completed 5 tasks." },
    { triggerType: "TASK_COUNT", threshold: 10, title: "Task Explorer", description: "Completed 10 tasks." },
    { triggerType: "TASK_COUNT", threshold: 25, title: "Task Master", description: "Completed 25 tasks." },
    { triggerType: "TASK_COUNT", threshold: 50, title: "Task Legend", description: "Completed 50 tasks." },
    { triggerType: "DAILY_COMPLETION", threshold: 1, title: "Daily Finisher", description: "Finished all scheduled tasks today." },
]

function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    )
}

function isYesterday(day: Date, reference: Date): boolean {
    const yesterday = new Date(reference)
    yesterday.setDate(reference.getDate() - 1)
    return isSameDay(day, yesterday)
}

export class RewardService {
    static async ensureRewardDefinitions() {
        for (const def of REWARD_DEFINITIONS) {
            await prismaClient.rewardDefinition.upsert({
                where: {
                    trigger_type_threshold: {
                        trigger_type: def.triggerType as any,
                        threshold: def.threshold,
                    },
                },
                update: {
                    title: def.title,
                    description: def.description,
                },
                create: {
                    trigger_type: def.triggerType as any,
                    threshold: def.threshold,
                    title: def.title,
                    description: def.description,
                },
            })
        }
    }

    static async ensureUserProgress(userId: number) {
        return prismaClient.userProgress.upsert({
            where: { user_id: userId },
            update: {},
            create: {
                user_id: userId,
                current_streak: 0,
                task_completed_count: 0,
            },
        })
    }

    static async ensureUserRewards(userId: number) {
        await this.ensureRewardDefinitions()
        const definitions = await prismaClient.rewardDefinition.findMany()

        await Promise.all(
            definitions.map((def) =>
                prismaClient.userReward.upsert({
                    where: {
                        user_id_reward_definition_id: {
                            user_id: userId,
                            reward_definition_id: def.id,
                        },
                    },
                    update: {},
                    create: {
                        user_id: userId,
                        reward_definition_id: def.id,
                        status: "LOCKED",
                    },
                })
            )
        )
    }

    static async handleTaskCompleted(userId: number) {
        await this.ensureUserProgress(userId)
        await prismaClient.userProgress.update({
            where: { user_id: userId },
            data: {
                task_completed_count: { increment: 1 },
            },
        })
        await this.ensureUserRewards(userId)
        await this.evaluateAndUnlock(userId)
    }

    static async handleDailyCompletion(userId: number, completionDate: Date | string) {
        const completion = new Date(completionDate)
        const progress = await this.ensureUserProgress(userId)

        const last = progress.last_completion_date
            ? new Date(progress.last_completion_date)
            : undefined

        let nextStreak = 1
        if (last && isSameDay(last, completion)) {
            nextStreak = progress.current_streak || 1
        } else if (last && isYesterday(last, completion)) {
            nextStreak = (progress.current_streak || 0) + 1
        }

        await prismaClient.userProgress.update({
            where: { user_id: userId },
            data: {
                current_streak: nextStreak,
                last_completion_date: completion,
                last_daily_completion: completion,
            },
        })

        await this.ensureUserRewards(userId)
        await this.evaluateAndUnlock(userId)
    }

    static async evaluateAndUnlock(userId: number) {
        await this.ensureRewardDefinitions()
        await this.ensureUserRewards(userId)

        const [definitions, progress, userRewards] = await Promise.all([
            prismaClient.rewardDefinition.findMany(),
            prismaClient.userProgress.findUnique({ where: { user_id: userId } }),
            prismaClient.userReward.findMany({ where: { user_id: userId } }),
        ])

        if (!progress) {
            return
        }

        const now = new Date()
        await Promise.all(
            definitions.map(async (def) => {
                const reward = userRewards.find(
                    (ur) => ur.reward_definition_id === def.id
                )

                const achieved = this.meetsCondition(def, progress, now)
                if (achieved && reward && reward.status === "LOCKED") {
                    await prismaClient.userReward.update({
                        where: {
                            user_id_reward_definition_id: {
                                user_id: userId,
                                reward_definition_id: def.id,
                            },
                        },
                        data: {
                            status: "UNLOCKED",
                            achieved_at: now,
                        },
                    })
                }
            })
        )
    }

    static async getGallery(userId: number): Promise<RewardGalleryResponse> {
        await this.ensureRewardDefinitions()
        await this.ensureUserRewards(userId)

        const rewards = await prismaClient.userReward.findMany({
            where: { user_id: userId },
            include: { reward_definition: true },
            orderBy: { reward_definition: { threshold: "asc" } },
        })

        const views: RewardView[] = rewards.map((item) => ({
            id: item.reward_definition.id,
            title: item.reward_definition.title,
            description: item.reward_definition.description,
            trigger_type: item.reward_definition.trigger_type,
            threshold: item.reward_definition.threshold,
            status: item.status,
            asset_url: item.reward_definition.asset_url,
            achieved_at: item.achieved_at,
        }))

        return {
            earnedRewards: views.filter((v) => v.status === "UNLOCKED"),
            lockedRewards: views.filter((v) => v.status === "LOCKED"),
        }
    }

    private static meetsCondition(
        def: {
            trigger_type: any
            threshold: number
        },
        progress: {
            current_streak: number
            task_completed_count: number
            last_daily_completion: Date | null
        },
        referenceDate: Date
    ): boolean {
        switch (def.trigger_type) {
            case "STREAK":
                return progress.current_streak >= def.threshold
            case "TASK_COUNT":
                return progress.task_completed_count >= def.threshold
            case "DAILY_COMPLETION":
                return !!(
                    progress.last_daily_completion &&
                    isSameDay(new Date(progress.last_daily_completion), referenceDate)
                )
            default:
                return false
        }
    }
}
