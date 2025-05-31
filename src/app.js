import express from "express"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import problemRoutes from "./routes/problem.routes.js"
import executionRoutes from "./routes/executeCode.routes.js"
import submissionRoutes from "./routes/submission.routes.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/problems", problemRoutes)
app.use("/api/v1/execute-code", executionRoutes)
app.use("/api/v1/submission", submissionRoutes)

export default app