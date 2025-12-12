import { Router } from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { TaskController } from "../controllers/task-controller"

export const taskRoutes = Router()

taskRoutes.post("/", authMiddleware, TaskController.create)
taskRoutes.put("/", authMiddleware, TaskController.update)
taskRoutes.get("/user/:userId", authMiddleware, TaskController.getByUser)
taskRoutes.delete("/:id", authMiddleware, TaskController.delete)
