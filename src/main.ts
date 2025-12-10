import express from "express"
import { PORT } from "./utils/env-util"
import { errorMiddleware } from "./middlewares/error-middleware"
import { rewardRoutes } from "./routes/reward-routes"

const app = express()

app.use(express.json())

// Routes
app.use("/rewards", rewardRoutes)

// Error middleware
app.use(errorMiddleware)

const port = PORT || 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
