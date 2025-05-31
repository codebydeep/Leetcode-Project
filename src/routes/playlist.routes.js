import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { createPlaylist, getAllListDetails, getPlaylistDetails } from "../controllers/playlist.controllers.js"

const playlistRoutes = express.Router()
playlistRoutes.post("/create-playlist", authMiddleware, createPlaylist)
playlistRoutes.get("/", authMiddleware, getAllListDetails)
playlistRoutes.get("/:playlistId", authMiddleware, getPlaylistDetails)

export default playlistRoutes