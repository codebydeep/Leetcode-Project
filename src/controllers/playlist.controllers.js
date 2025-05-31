import db from "../libs/db.js"
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";

const createPlaylist = asyncHandler(async(req, res) => {
    const {name, description} = req.body

    const userId = req.user.id

    // Check for Existing Playlist -
    const existingPlaylist = await db.playlist.findFirst({
        where: {
            name: name,
            userId: userId,
        }
    })

    if(existingPlaylist){
        return res.status(400).json(
            new ApiResponse(404, "Playlist already Exists", null, false)
        )
    }

    const playlist = await db.playlist.create({
        data: {
            name,
            description,
            userId
        }
    });

    res.status(200).json(
        new ApiResponse(200, "Playlist created Successfully", playlist, true)
    )
})



export {createPlaylist}