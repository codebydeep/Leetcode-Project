import db from "../libs/db.js";
import { asyncHandler } from "../utils/async-handler.js"
import { ApiResponse } from "../utils/api-response.js"

const getAllSubmission = asyncHandler(async(req, res) => {
    const userId = req.user.id

    const submissions = await db.submission.findMany({
        where: {
            userId: userId
        }
    })

    res.status(200).json(
        new ApiResponse(200, "Submissions fetched Successfully", {submissions}, true)
    )
})


const getSubmissionsForProblem = asyncHandler(async(req, res) => {
    const userId = req.user.id
    const problemId = req.params.problemId

    const submissions = await db.submission.findMany({
        where: {
            userId: userId,
            problemId: problemId,
        }
    })

    res.status(200).json(
        new ApiResponse(200, "Submissions fetched Successfully", {submissions},true)
    )
})


const getAllTheSubmissionsForProblem = asyncHandler(async(req, res) => {
    const problemId = req.params.problemId
    
    const submission = await db.submission.count({
        where: {
            problemId: problemId
        }
    });
     
    res.status(200).json(
        new ApiResponse(200, "All Submissions fetched Successfully", {count: submission},true)
    )
})


export {getAllSubmission, getSubmissionsForProblem, getAllTheSubmissionsForProblem}