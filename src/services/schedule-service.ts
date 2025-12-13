import { prismaClient } from "../utils/database-util"
import { Validation } from "../validations/validation"
import { ScheduleValidation } from "../validations/schedule-validation"
import { CreateScheduleRequest, UpdateScheduleRequest, toScheduleResponse } from "../models/schedule-model"

export class ScheduleService {

    static async create(request: CreateScheduleRequest) {
    const validated = Validation.validate(
        ScheduleValidation.CREATE, 
        request
    );

    const schedule = await prismaClient.schedule.create({
        data: {
            date: validated.date,
            user_id: validated.userId,
            total_tasks: 0,
            completed_tasks: 0,
            progress_percentage: 0
        }
    });

    return toScheduleResponse(schedule);
}


    static async update(request: UpdateScheduleRequest) {
        const validated = Validation.validate(ScheduleValidation.UPDATE, request)

        const schedule = await prismaClient.schedule.update({
            where: { id: validated.id },
            data: validated
        })

        return toScheduleResponse(schedule)
    }

    static async getByUser(user_id: number) {
        const schedules = await prismaClient.schedule.findMany({
            where: { user_id }
        })

        return schedules.map(toScheduleResponse)
    }

    static async delete(id: number) {
        await prismaClient.schedule.delete({
            where: { id }
        })
        return { message: "Schedule deleted" }
    }
}
