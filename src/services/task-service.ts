import { prismaClient } from "../utils/database-util"
import { Validation } from "../validations/validation"
import { TaskValidation } from "../validations/task-validation"
import { CreateTaskRequest, UpdateTaskRequest, toTaskResponse } from "../models/task-model"

export class TaskService {

    static async create(request: CreateTaskRequest) {
        const validated = Validation.validate(TaskValidation.CREATE, request)

        const task = await prismaClient.task.create({
        data: {
            title: validated.title,
            deadline: validated.deadline,
            schedule_id: validated.schedule_id,
            is_completed: false,
            }
        });

        return toTaskResponse(task)
    }

    static async update(request: UpdateTaskRequest) {
        const validated = Validation.validate(TaskValidation.UPDATE, request)

        const task = await prismaClient.task.update({
            where: { id: validated.id },
            data: validated
        })

        return toTaskResponse(task)
    }

    static async getByUser(user_id: number) {
        const tasks = await prismaClient.task.findMany({
            where: { schedule: { user_id } }
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
