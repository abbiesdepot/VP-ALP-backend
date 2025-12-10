export interface CreateTaskRequest {
    user_id: number
    title: string
    description?: string
    deadline: string;
    schedule_id: number;
}

export interface UpdateTaskRequest {
    id: number
    title?: string
    description?: string
    is_completed?: boolean
}

export interface TaskResponse {
    id: number
    user_id: number
    title: string
    description: string | null
    is_completed: boolean
}

export function toTaskResponse(task: any): TaskResponse {
    return {
        id: task.id,
        user_id: task.user_id,
        title: task.title,
        description: task.description,
        is_completed: task.is_completed,
    }
}
