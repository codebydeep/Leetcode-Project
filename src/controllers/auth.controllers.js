import db from "../libs/db.js"
import { UserRole } from "../generated/prisma/index.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const register = asyncHandler(async(req, res) => {
    const {email, password, name} = req.body

    if(!name || !email || !password){
        throw new ApiError(401, "All the fields are required!")
    }

    const existingUser = await db.user.findUnique({
            where: {
                email
            }
        })

        if(existingUser){
            throw new ApiError(400, "User already exists")
        }

        const hashedToken = await bcrypt.hash(password, 10)

        const newUser = await db.user.create({
            data: {
                email,
                password: hashedToken,
                name,
                role:UserRole.USER
            }
        })

        const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, 
            {
                expiresIn: "7d"
            }
        )

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

       
        res.status(201).json(new ApiResponse(201, "User Created Successfully!", {
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image: newUser.image
            }
        }))
})


// login controller - 
const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        throw new ApiError(400, "All fields are required")
    }

    const user = await db.user.findUnique({
        where: {
            email
        }
    })

    if(!user){
        throw new ApiError(401, "User not found")
    }

    const isMatched = await bcrypt.compare(password, user.password)

    if(!isMatched){
        throw new ApiError(400, "Invalid Password")
    }

    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )

    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json(
        new ApiResponse(201, "User LoggedIn Successfully", {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image
            }
        })
    )
    
})


// logout controller - 
const logout = asyncHandler(async(req, res) => {
    res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
    })

    res.status(200).json(
        new ApiResponse(200, "User LoggedOut Successfully")
    )
            
})


// check controller - 
const check = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, "User Authenticated Successfully",
            {user: req.user}
        )
    )
})

export {register, login, logout, check}