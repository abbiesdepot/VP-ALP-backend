export interface CreateScheduleActivityRequest {
    scheduleId: number;
    iconName: string;
    startTime: string;
    endTime: string;
    description?: string;
}

export interface UpdateScheduleActivityRequest {
    id: number;
    iconName?: string;
    startTime?: string;
    endTime?: string;
    description?: string;
    isCompleted?: boolean;
}

export interface ScheduleActivityResponse {
    id: number;
    scheduleId: number;
    iconName: string;
    startTime: string;
    endTime: string;
    description: string | null;
    isCompleted: boolean;
}

export function toScheduleActivityResponse(activity: any): ScheduleActivityResponse {
    return {
        id: activity.id,
        scheduleId: activity.schedule_id,
        iconName: activity.icon_name,
        startTime: activity.start_time ? new Date(activity.start_time).toISOString() : "",
        endTime: activity.end_time ? new Date(activity.end_time).toISOString() : "",
        description: activity.description,
        isCompleted: activity.isCompleted,
    }
}