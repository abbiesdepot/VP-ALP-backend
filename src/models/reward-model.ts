export interface RewardView {
    id: number
    title: string
    description?: string | null
    trigger_type: string
    threshold: number
    status: "LOCKED" | "UNLOCKED"
    asset_url?: string | null
    achieved_at?: Date | null
}

export interface RewardGalleryResponse {
    earnedRewards: RewardView[]
    lockedRewards: RewardView[]
}
