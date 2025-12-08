export interface CreateScheduleRequest {
    user_id: number
    date: string // YYYY-MM-DD
}

export interface UpdateScheduleRequest {
    id: number
    date?: string
}

export interface ScheduleResponse {
    id: number
    user_id: number
    date: string
}

export function toScheduleResponse(schedule: any): ScheduleResponse {
    return {
        id: schedule.id,
        user_id: schedule.user_id,
        date: schedule.date,
    }
}
