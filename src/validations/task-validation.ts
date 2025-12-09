import { z, ZodType } from "zod"

export class TaskValidation {
    static readonly CREATE: ZodType = z.object({
        userId: z.number(),
        title: z.string().min(1),
        description: z.string().optional(),
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
    })
}
