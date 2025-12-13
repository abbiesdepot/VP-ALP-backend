export interface CreateScheduleRequest {
    userId: number;
    date: string; // YYYY-MM-DD
}

export interface UpdateScheduleRequest {
    id: number;
    date?: string;
}

export interface ScheduleResponse {
    id: number;
    userId: number;
    date: Date;
    totalTasks: number;
    completedTasks: number;
    progressPercentage: number;
}

export function toScheduleResponse(schedule: any): ScheduleResponse {
    return {
        id: schedule.id,
        userId: schedule.user_id,
        date: schedule.date,
        totalTasks: schedule.total_tasks || 0,
        completedTasks: schedule.completed_tasks || 0,
        progressPercentage: schedule.progress_percentage || 0
    }
}