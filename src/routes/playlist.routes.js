import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { createPlaylist } from "../controllers/playlist.controllers.js"

const playlistRoutes = express.Router()
playlistRoutes.post("/create-playlist", authMiddleware, createPlaylist)

export default playlistRoutes