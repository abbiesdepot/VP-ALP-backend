import { z, ZodType } from "zod"

export class TaskValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        deadline: z.string().min(1),
        schedule_id: z.number().optional(),
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        is_completed: z.boolean().optional(),
    })
}
