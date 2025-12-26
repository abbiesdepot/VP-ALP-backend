import { Response, NextFunction } from "express"
import { TaskService } from "../services/task-service"
import {
    CreateTaskRequest,
    UpdateTaskRequest,
} from "../models/task-model"
import { UserRequest } from "../models/user-request-model"

export class TaskController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateTaskRequest = req.body
            const userId = req.user!.id
            const response = await TaskService.create(request, userId)

            res.status(201).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateTaskRequest = req.body
            const response = await TaskService.update(request)

            res.json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async getByUser(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.params.userId)
            const response = await TaskService.getByUser(userId)

            res.json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            const response = await TaskService.delete(id)

            res.json({ data: response })
        } catch (error) {
            next(error)
        }
    }
}
