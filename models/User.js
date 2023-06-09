import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// The schema defines the structure and 
// validation rules for a user object in a MongoDB database
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        minlength: 3,
        maxlength: 20,
        // Removes leading and trailing whitespace
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        // validator for email
        validate: {
            // use library to validate email
            // if not valid, send back an error object that has "code": 11000 which we'll use in the error-handler
            validator: validator.isEmail,
            message: "Please provide a valid email",
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: false, // e.g. use findOne, password will be excluded
    },
    // optional
    lastName: {
        type: String,
        // the sequence of trim matters?
        trim: true,
        maxlength: 20,
        default: "defaultLastName",
    },
    // optional
    location: {
        type: String,
        trim: true,
        maxlength: 20,
        default: "defaultCity",
    },
})

// before we save, we want to hash passwords
// !!!NEVER STORE PASSWORD AS STRINGS IN THE DATABASE!!!
// this is a hook
UserSchema.pre("save", async function() { // will be executed when the save occurs
    if (!this.isModified("password")) return
    const salt = await bcrypt.genSalt(10)
    // generate a salt with a cost factor of 10. 
    // The salt is a random value used in the password hashing process to add uniqueness and complexity to the hashed passwords.
    this.password = await bcrypt.hash(this.password, salt)
})

// Custom instance methods
// generates a JSON Web Token (JWT) for the user
// sign(payload, secret key for signing the token, specifies the lifetime or expiration time of the token)
UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { 
        expiresIn: process.env.JWT_LIFETIME,
    })
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

export default mongoose.model("User", UserSchema)