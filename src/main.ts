import express from "express"
import { PORT } from "./utils/env-util"
import { errorMiddleware } from "./middlewares/error-middleware"
import { rewardRoutes } from "./routes/reward-routes"
import { userRoutes } from "./routes/user-routes"
import { taskRoutes } from "./routes/task-routes"
import { scheduleRoutes } from "./routes/schedule-routes"

const app = express()

app.use(express.json())

app.use("/users", userRoutes)
app.use("/tasks", taskRoutes)
app.use("/schedules", scheduleRoutes)
app.use("/rewards", rewardRoutes)

// middleware error
app.use(errorMiddleware)

app.listen(PORT || 6000, () => {
    console.log(`Connected to port ${PORT}`)
})
