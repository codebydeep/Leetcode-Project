import express from "express"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import problemRoutes from "./routes/problem.routes.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/problems", problemRoutes)

export default app