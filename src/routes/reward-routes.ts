import { Router } from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { RewardController } from "../controllers/reward-controller"

export const rewardRoutes = Router()

rewardRoutes.get("/gallery", authMiddleware, RewardController.getGallery)
