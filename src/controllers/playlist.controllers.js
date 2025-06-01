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


const getAllListDetails = asyncHandler(async(req, res) => {
    const playlists = await db.playlist.findMany({
        where: {
            userId: req.user.id 
        },
        include: {
            problems: {
                include: {
                    problem: true
                }
            }
        }
    })

    res.status(200).json(
        new ApiResponse(200, "Playlists fetched Successfully", playlists, true)
    )
})


const getPlaylistDetails = asyncHandler(async(req, res) => {
    const {playlistId} = req.params

    const playlist = await db.playlist.findUnique({
        where: {
            id: playlistId,
            userId: req.user.id
        },
        include: {
            problems: {
                include: {
                    problem: true
                }
            }
        }
    })

    if(!playlist){
        return res.status(404).json(
            new ApiResponse(404, "Playlist not found", false)
        )
    }

    res.status(200).json(
        new ApiResponse(200, "Playlist fetched Successfully", playlist, true)
    )
})


// error -
const addProblemToPlaylist = asyncHandler(async(req, res) => {
    const {playlistId} = req.params
    const {problemIds} = req.body

    if(!Array.isArray(problemIds) || problemIds.length === 0){
        return res.status(400).json(
            new ApiResponse(400, "Invalid or Missing ProblemsId", false)
        )
    }

    const problemsInPlaylists = await db.problemInPlaylist.createMany({
        data: problemIds.map((problemId) => ({
            problemId,
            playlistId: playlistId,
        }))
    })

    res.status(201).json(
        new ApiResponse(201, "Problem Added to Playlist Successfully", problemsInPlaylists, true)
    )
})


const deletePlaylist = asyncHandler(async(req, res) => {
    const {playlistId} = req.params

    const deletePlaylist = await db.playlist.delete({
        where: {
            id: playlistId
        }
    })

    res.status(200).json(
        new ApiResponse(200, "Playlist deleted Successfully", deletePlaylist, true)
    )
})


// error -
const removeProblemFromPlaylist = asyncHandler(async(req, res) => {
    const {playlistId} = req.params
    const {problemIds} = req.body

    if(!Array.isArray(problemIds) || problemIds.length === 0){
        return res.status(400).json(
            new ApiResponse(400, "Invalid or Missing ProblemsId", false)
        )
    }
    
    const deletedProblem = await db.problemsInPlaylist.deleteMany({
        where: {
            playlistId,
            problemId: {
                in: problemIds
            }
        }
    })
    
    res.status(200).json(
        new ApiResponse(200, "Problem deleted from Playlist Done!", deletedProblem, true)
    )
})


export {createPlaylist, getAllListDetails, getPlaylistDetails, addProblemToPlaylist, deletePlaylist, removeProblemFromPlaylist}