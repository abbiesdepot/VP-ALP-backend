import { prismaClient } from "../utils/database-util"
import { Validation } from "../validations/validation"
import { TaskValidation } from "../validations/task-validation"
import { CreateTaskRequest, UpdateTaskRequest, toTaskResponse } from "../models/task-model"
import { RewardService } from "./reward-service"
import { ResponseError } from "../error/response-error"

export class TaskService {

    static async create(request: CreateTaskRequest, userId: number) {
        const validated = Validation.validate(TaskValidation.CREATE, request)

        // ngevalidate schedule ownership kalo schedule_id ada
        if (validated.schedule_id !== undefined && validated.schedule_id !== null) {
            const schedule = await prismaClient.schedule.findUnique({
                where: { id: validated.schedule_id },
            })

            if (!schedule) {
                throw new ResponseError(404, "Schedule not found")
            }

            if (schedule.user_id !== userId) {
                throw new ResponseError(403, "You don't have permission to add tasks to this schedule")
            }
        }

        const data: any = {
            title: validated.title,
            description: validated.description,
            deadline: validated.deadline,
            is_completed: false,
            user_id: userId,
        }

        if (validated.schedule_id !== undefined) {
            data.schedule_id = validated.schedule_id
        }

        const task = await prismaClient.task.create({
            data,
            include: { schedule: true },
        });

        return toTaskResponse(task)
    }

    static async update(request: UpdateTaskRequest) {
        const validated = Validation.validate(TaskValidation.UPDATE, request)

        const existingTask = await prismaClient.task.findUnique({
            where: { id: validated.id },
            include: { schedule: true },
        })

        if (!existingTask) {
            throw new ResponseError(404, "Task not found")
        }

        const becameCompleted =
            validated.is_completed === true && existingTask.is_completed === false

        const taskRaw = await prismaClient.task.update({
            where: { id: validated.id },
            data: {
                title: validated.title,
                description: validated.description,
                is_completed: validated.is_completed,
            },
            include: { schedule: true },
        })

        if (becameCompleted && existingTask.schedule) {
            await RewardService.handleTaskCompleted(existingTask.schedule.user_id)

            const [totalTasks, completedTasks] = await Promise.all([
                prismaClient.task.count({ where: { schedule_id: taskRaw.schedule_id } }),
                prismaClient.task.count({
                    where: { schedule_id: taskRaw.schedule_id, is_completed: true },
                }),
            ])

            if (totalTasks > 0 && totalTasks === completedTasks) {
                await RewardService.handleDailyCompletion(
                    existingTask.schedule.user_id,
                    existingTask.schedule.date
                )
            }
        }

        return toTaskResponse(taskRaw)
    }

    static async getByUser(user_id: number) {
        const tasks = await prismaClient.task.findMany({
            where: {
                OR: [
                    { schedule: { user_id } },
                    { AND: [{ schedule_id: null }, { user_id }] },
                ],
            },
            include: { schedule: true },
            orderBy: { deadline: "asc" },
        })

        return tasks.map(toTaskResponse)
    }

    static async delete(id: number) {
        await prismaClient.task.delete({
            where: { id }
        })

        return { message: "Task deleted" }
    }
}
