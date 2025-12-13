import { Request, Response, NextFunction } from "express"
import { ScheduleActivityService } from "../services/schedule-activity-service"
import {
    CreateScheduleActivityRequest,
    UpdateScheduleActivityRequest,
} from "../models/schedule-activity-model"

export class ScheduleActivityController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateScheduleActivityRequest = req.body
            
            const response = await ScheduleActivityService.create(request)

            res.status(201).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const request: UpdateScheduleActivityRequest = req.body
            const response = await ScheduleActivityService.update(request)

            res.json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async getBySchedule(req: Request, res: Response, next: NextFunction) {
        try {
            const scheduleId = Number(req.params.scheduleId)
            const response = await ScheduleActivityService.getBySchedule(scheduleId)

            res.json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            const response = await ScheduleActivityService.delete(id)

            res.json({ data: response })
        } catch (error) {
            next(error)
        }
    }
}
