import User from "../models/User.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js"


// login, register, update functionalities 
// req.body -> the data passed in 
// next -> passed on to the next middleware
const register = async (req, res/* , next */) => {
    // pull out name, email, and password and check for empty values
    const { name, email, password } = req.body
    
    if (!name || !email || !password) {
        throw new BadRequestError("please provide all values")
    }

    // User.findOne({ email }) searches for a user in the database based on the provided email
    // userAlreadyExists will hold the user document if a matching user is found
    const userAlreadyExists = await User.findOne({email})
    if (userAlreadyExists) {
        throw new BadRequestError("Email already in use")
    }

    // don't need try/catch after using "express-async-errors" package in server.js
    // try {
        const user = await User.create({ name, email, password })
        const token = user.createJWT()
        // below won't run until await line returns a promise
        // sets the HTTP status code to 201 and sends a JSON response containing the user object.
        res.status(StatusCodes.CREATED).json
            ({ user: {
                    email: user.email, 
                    lastName: user.lastName,
                    location: user.location,
                    name: user.name,
                },
                token,
                location: user.location,
            })
    // } catch (error) {
        // pass the error to the next middleware
        //next(error)
    //}
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError("Please provide all values")
    }
    // ?
    const user = await User.findOne({email}).select("+password")
    if (!user) {
        throw new UnAuthenticatedError("Invalid Credentials")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError("Invalid Credentials")
    }
    const token = user.createJWT()
    // remove password from response b/c don't want to display it
    user.password = undefined
    res.status(StatusCodes.OK).json({ user, token, location: user.location })
}
const updateUser = async (req, res) => {
    const {email, name, lastName, location} = req.body
    if (!email || !name || !lastName || !location) {
        throw new BadRequestError("Please provide all values")
    }
    const user = await User.findOne({_id: req.user.userId})

    user.email = email
    user.name = name
    user.lastName = lastName
    user.location = location

    await user.save()
    // technically not necessarily to create a new token
    // b/c token is generated based on userId, which is not changed when updating user
    const token = user.createJWT()

    res.status(StatusCodes.OK).json({user, token, location: user.location})
}

export { register, login, updateUser }