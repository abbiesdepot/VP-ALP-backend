import { Router } from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { ScheduleController } from "../controllers/schedule-controller"
import { TaskController } from "../controllers/task-controller"
import { ScheduleActivityController } from "../controllers/schedule-activity-controller"

const privateRoute = Router()

privateRoute.use(authMiddleware)

privateRoute.post("/schedule", ScheduleController.create)
privateRoute.put("/schedule", ScheduleController.update)
privateRoute.get("/schedule/user/:userId", ScheduleController.getByUser)

privateRoute.post("/task", TaskController.create)
privateRoute.put("/task", TaskController.update)
privateRoute.get("/task/user/:userId", TaskController.getByUser)
privateRoute.delete("/task/:id", TaskController.delete)

privateRoute.post("/schedule-activity", ScheduleActivityController.create)
privateRoute.put("/schedule-activity/:id", ScheduleActivityController.update)
privateRoute.get("/schedule-activity/schedule/:scheduleId",ScheduleActivityController.getBySchedule)
privateRoute.delete("/schedule-activity/:id", ScheduleActivityController.delete)


export const privateRouter = privateRoute

