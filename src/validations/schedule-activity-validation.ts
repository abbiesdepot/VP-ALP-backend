import { z, ZodType } from "zod"

export class ScheduleActivityValidation {
    static readonly CREATE: ZodType = z.object({
        scheduleId: z.number(),
        iconName: z.string().min(1),
        startTime: z.string().min(1),
        endTime: z.string().min(1),
        description: z.string().optional(),
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.number(),
        iconName: z.string().optional(),
        startTime: z.string().datetime().optional(),
        endTime: z.string().datetime().optional(),
        description: z.string().optional(),
        isCompleted: z.boolean().optional(),
    })
}
