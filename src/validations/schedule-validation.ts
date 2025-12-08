import { z, ZodType } from "zod"

export class ScheduleValidation {
    static readonly CREATE: ZodType = z.object({
        userId: z.number(),
        date: z.string().min(1),
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.number(),
        date: z.string().optional(),
    })
}
