import { Request, Response, NextFunction } from "express"
import { TaskService } from "../services/task-service"
import {
    CreateTaskRequest,
    UpdateTaskRequest,
} from "../models/task-model"

export class TaskController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateTaskRequest = req.body
            const response = await TaskService.create(request)

            res.status(201).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const request: UpdateTaskRequest = req.body
            const response = await TaskService.update(request)

            res.json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async getByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.params.userId)
            const response = await TaskService.getByUser(userId)

            res.json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            const response = await TaskService.delete(id)

            res.json({ data: response })
        } catch (error) {
            next(error)
        }
    }
}
