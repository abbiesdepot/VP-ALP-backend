import { z, ZodType } from "zod"

export class ScheduleActivityValidation {
    static readonly CREATE: ZodType = z.object({
        scheduleId: z.number(),
        iconId: z.number(),
        startTime: z.string().min(1),
        endTime: z.string().min(1),
        description: z.string().optional(),
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.number(),
        iconId: z.number().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        description: z.string().optional(),
        isCompleted: z.boolean().optional(),
    })
}
