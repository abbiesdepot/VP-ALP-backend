import { Request, Response, NextFunction } from "express"
import { ScheduleService } from "../services/schedule-service"
import {
    CreateScheduleRequest,
    UpdateScheduleRequest,
} from "../models/schedule-model"

export class ScheduleController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateScheduleRequest = req.body
            const response = await ScheduleService.create(request)

            res.status(201).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const request: UpdateScheduleRequest = req.body
            const response = await ScheduleService.update(request)

            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async getByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.params.userId)
            const response = await ScheduleService.getByUser(userId)

            res.json({ data: response })
        } catch (error) {
            next(error)
        }
    }
}
