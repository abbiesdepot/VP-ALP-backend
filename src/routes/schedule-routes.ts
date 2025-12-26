import { Router } from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { ScheduleController } from "../controllers/schedule-controller"

export const scheduleRoutes = Router()

scheduleRoutes.post("/", authMiddleware, ScheduleController.create)
scheduleRoutes.put("/", authMiddleware, ScheduleController.update)
scheduleRoutes.get("/user/:userId", authMiddleware, ScheduleController.getByUser)