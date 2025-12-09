import { prismaClient } from "../utils/database-util"
import { Validation } from "../validations/validation"
import { ScheduleActivityValidation } from "../validations/schedule-activity-validation"
import { CreateScheduleActivityRequest, UpdateScheduleActivityRequest, toScheduleActivityResponse } from "../models/schedule-activity-model"

export class ScheduleActivityService {

    static async create(request: CreateScheduleActivityRequest) {
        const validated = Validation.validate(ScheduleActivityValidation.CREATE, request)

        const activity = await prismaClient.scheduleActivity.create({
            data: {
                schedule_id: validated.schedule_id,
                icon_name: validated.icon_name,
                start_time: new Date(validated.startTime),
                end_time: new Date(validated.endTime),
                description: validated.description,
                isCompleted: false
            }
        });


        return toScheduleActivityResponse(activity)
    }

    static async update(request: UpdateScheduleActivityRequest) {
        const validated = Validation.validate(ScheduleActivityValidation.UPDATE, request)

        const activity = await prismaClient.scheduleActivity.update({
            where: { id: validated.id },
            data: validated
        })

        return toScheduleActivityResponse(activity)
    }

    static async getBySchedule(schedule_id: number) {
        const activities = await prismaClient.scheduleActivity.findMany({
            where: { schedule_id }
        })

        return activities.map(toScheduleActivityResponse)
    }

    static async delete(id: number) {
        await prismaClient.scheduleActivity.delete({
            where: { id }
        })

        return { message: "Schedule Activity deleted" }
    }
}
