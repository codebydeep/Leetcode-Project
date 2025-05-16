import jwt from "jsonwebtoken"
import db from "../libs/db.js"
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
        const token = req.cookies.jwt

        if(!token){
            throw new ApiError(404, "UnAuthorized - No token provided!")
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new ApiError(401, "UnAuthorized - Invalid token");
        }
        
        const user = await db.user.findUnique({
            where: {
                id: decoded.id
            },

            select: {
                id: true,
                image: true,
                name: true,
                email: true,
                role: true,
            }
        });

        if(!user){
            throw new ApiError(404, "User not found")
        }

        req.user = user;
        next();

        // throw new ApiError(500, "UnAuthorized - Invalid Token")
    } 
)


const checkAdmin = asyncHandler(async (req, res, next) => {
        const userId = req.user.id
        const user = await db.user.findUnique({
            where:{
                id: userId
            },
            select: {
                role : true
            }
        })

        if(!user || user.role !== "ADMIN"){
            throw new ApiError(403, "Access Denied - Admins Only")
        }

        next();

        res.status(500).json(
            new ApiError(500, "Error Checking Admin role")
        )
})

export {authMiddleware, checkAdmin}