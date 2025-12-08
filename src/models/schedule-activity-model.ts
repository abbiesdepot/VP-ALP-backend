export interface CreateScheduleActivityRequest {
    schedule_id: number
    icon_name: string
    startTime: string // HH:mm
    endTime: string   // HH:mm
    description?: string
}

export interface UpdateScheduleActivityRequest {
    id: number
    icon_name?: string
    startTime?: string
    endTime?: string
    description?: string
    isCompleted?: boolean
}

export interface ScheduleActivityResponse {
    id: number
    schedule_id: number
    icon_name: string
    startTime: string
    endTime: string
    description: string | null
    isCompleted: boolean
}

export function toScheduleActivityResponse(activity: any): ScheduleActivityResponse {
    return {
        id: activity.id,
        schedule_id: activity.schedule_id,
        icon_name: activity.icon_name,
        startTime: activity.startTime,
        endTime: activity.endTime,
        description: activity.description,
        isCompleted: activity.isCompleted,
    }
}
