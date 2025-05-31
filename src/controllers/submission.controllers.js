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

export {getAllSubmission}