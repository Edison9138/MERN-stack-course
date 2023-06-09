import express from "express"

// create a new router object
const router = express.Router()

import rateLimiter from "express-rate-limit"

// We could use the apiLimiter on the whole application, but in our case we only want to use it on register and login
const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 mins,
    max: 10,
    message: "Too many requests from this IP address, please try again after 15 minutes",
})

// These functions handle the logic for user registration, login, and updating user information.
import { register, login, updateUser } from "../controllers/authController.js"

import authenticateUser from "../middleware/auth.js"
import testUser from "../middleware/testUser.js"

// sets up a route that matches the "/register" path with an HTTP POST method.
// When a POST request is made to this route, the register function from the controller will be called to handle the request.
router.route("/register").post(apiLimiter, register)
router.route("/login").post(apiLimiter, login)

// use authenticateUser to restrict the update action
router.route("/updateUser").patch(authenticateUser, testUser, updateUser)

export default router