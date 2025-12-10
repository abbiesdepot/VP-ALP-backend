import { Request, Response, NextFunction } from "express"
import { RewardService } from "../services/reward-service"
import { UserRequest } from "../models/user-request-model"

export class RewardController {
    static async getGallery(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            if (!userId) {
                return res.status(401).json({ errors: "Unauthorized" })
            }

            const gallery = await RewardService.getGallery(userId)
            res.status(200).json({ data: gallery })
        } catch (error) {
            next(error)
        }
    }
}
